import type { Corti } from "@corti/sdk";
import { consume } from "@lit/context";
import {
  type CSSResultGroup,
  html,
  LitElement,
  type PropertyValues,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AUDIO_CHUNK_INTERVAL_MS } from "../constants.js";
import {
  accessTokenContext,
  authConfigContext,
  debugDisplayAudioContext,
  dictationConfigContext,
  pushToTalkKeybindingContext,
  recordingStateContext,
  regionContext,
  selectedDeviceContext,
  socketProxyContext,
  socketUrlContext,
  tenantNameContext,
  toggleToTalkKeybindingContext,
} from "../contexts/dictation-context.js";
import {
  DictationController,
  type TranscribeMessage,
} from "../controllers/dictation-controller.js";
import { KeybindingController } from "../controllers/keybinding-controller.js";
import { MediaController } from "../controllers/media-controller.js";
import ButtonStyles from "../styles/buttons.js";
import RecordingButtonStyles from "../styles/recording-button.js";
import type { ProxyOptions, RecordingState } from "../types.js";
import {
  audioLevelChangedEvent,
  commandEvent,
  errorEvent,
  networkActivityEvent,
  recordingStateChangedEvent,
  streamClosedEvent,
  transcriptEvent,
  usageEvent,
} from "../utils/events.js";

import "./audio-visualiser.js";
import "../icons/icons.js";

@customElement("dictation-recording-button")
export class DictationRecordingButton extends LitElement {
  @consume({ context: recordingStateContext, subscribe: true })
  @state()
  _recordingState: RecordingState = "stopped";

  @consume({ context: selectedDeviceContext, subscribe: true })
  @state()
  _selectedDevice?: MediaDeviceInfo;

  @consume({ context: accessTokenContext, subscribe: true })
  @state()
  _accessToken?: string;

  @consume({ context: authConfigContext, subscribe: true })
  @state()
  _authConfig?: Corti.BearerOptions;

  @consume({ context: regionContext, subscribe: true })
  @state()
  _region?: string;

  @consume({ context: tenantNameContext, subscribe: true })
  @state()
  _tenantName?: string;

  @consume({ context: dictationConfigContext, subscribe: true })
  @state()
  _dictationConfig?: Corti.TranscribeConfig;

  @consume({ context: socketUrlContext, subscribe: true })
  @state()
  _socketUrl?: string;

  @consume({ context: socketProxyContext, subscribe: true })
  @state()
  _socketProxy?: ProxyOptions;

  @consume({ context: debugDisplayAudioContext, subscribe: true })
  @state()
  _debug_displayAudio?: boolean;

  @consume({ context: pushToTalkKeybindingContext, subscribe: true })
  @state()
  _pushToTalkKeybinding?: string | null;

  @consume({ context: toggleToTalkKeybindingContext, subscribe: true })
  @state()
  _toggleToTalkKeybinding?: string | null;

  @property({ type: Boolean })
  allowButtonFocus: boolean = false;

  #mediaController = new MediaController(this);
  #dictationController = new DictationController(this);
  #keybindingController = new KeybindingController(this);
  #closeConnectionOnInit = false;

  static styles: CSSResultGroup = [RecordingButtonStyles, ButtonStyles];

  protected update(changedProperties: PropertyValues) {
    if (
      changedProperties.has("_recordingState") &&
      this._recordingState === "recording" &&
      this.#closeConnectionOnInit
    ) {
      this.#closeConnectionOnInit = false;
      this.#handleStop();
    }

    super.update(changedProperties);
  }

  #handleClick(event: MouseEvent): void {
    if (!this.allowButtonFocus) {
      event.preventDefault();
    }

    this.toggleRecording();
  }

  #handleWebSocketMessage = (message: TranscribeMessage): void => {
    switch (message.type) {
      case "CONFIG_ACCEPTED":
        this.#mediaController.mediaRecorder?.start(AUDIO_CHUNK_INTERVAL_MS);
        this.#mediaController.startAudioLevelMonitoring((level) => {
          this.dispatchEvent(audioLevelChangedEvent(level));
        });
        this.dispatchEvent(recordingStateChangedEvent("recording"));
        break;
      case "CONFIG_DENIED":
        this.dispatchEvent(
          errorEvent(`Config denied: ${message.reason ?? "Unknown reason"}`),
        );
        this.#handleStop();
        break;
      case "CONFIG_TIMEOUT":
        this.dispatchEvent(errorEvent("Config timeout"));
        this.#handleStop();
        break;
      case "transcript":
        this.dispatchEvent(transcriptEvent(message));
        break;
      case "command":
        this.dispatchEvent(commandEvent(message));
        break;
      case "usage":
        this.dispatchEvent(usageEvent(message));
        break;
      case "error":
        this.dispatchEvent(errorEvent(message.error));
        this.#handleStop();
        break;
    }
  };

  #handleWebSocketError = (error: Error): void => {
    this.dispatchEvent(errorEvent("Socket error: " + error.message));
    this.#handleStop();
  };

  #handleWebSocketClose = (event: unknown): void => {
    this.dispatchEvent(streamClosedEvent(event));
  };

  async #handleStart(): Promise<void> {
    this.dispatchEvent(recordingStateChangedEvent("initializing"));

    try {
      await this.#mediaController.initialize(() => {
        if (this._recordingState === "recording") {
          this.dispatchEvent(errorEvent("Recording device access was lost."));
          this.#handleStop();
        }
      });

      const isNewConnection = await this.#dictationController.connect(
        this.#mediaController.mediaRecorder,
        this._dictationConfig,
        {
          onClose: this.#handleWebSocketClose,
          onError: this.#handleWebSocketError,
          onMessage: this.#handleWebSocketMessage,
          onNetworkActivity: (direction, data) => {
            this.dispatchEvent(networkActivityEvent(direction, data));
          },
        },
      );

      // configuration has been accepted before
      if (!isNewConnection) {
        this.#mediaController.mediaRecorder?.start(AUDIO_CHUNK_INTERVAL_MS);
        this.#mediaController.startAudioLevelMonitoring((level) => {
          this.dispatchEvent(audioLevelChangedEvent(level));
        });
        this.dispatchEvent(recordingStateChangedEvent("recording"));
      }
    } catch (error) {
      this.dispatchEvent(errorEvent(error));
      await this.#handleStop();
    }
  }

  async #handleStop(): Promise<void> {
    this.dispatchEvent(recordingStateChangedEvent("stopping"));

    try {
      this.#mediaController.stopAudioLevelMonitoring();
      await this.#mediaController.stopRecording();

      await this.#dictationController.disconnect(this.#handleWebSocketClose);
      await this.#mediaController.cleanup();
    } catch (error) {
      this.dispatchEvent(errorEvent(error));
    }

    this.dispatchEvent(recordingStateChangedEvent("stopped"));
  }

  public startRecording(): void {
    if (this._recordingState !== "stopped") {
      return;
    }

    this.#handleStart();
  }

  public stopRecording(): void {
    if (
      this._recordingState === "stopped" ||
      this._recordingState === "stopping"
    ) {
      return;
    }

    if (this._recordingState === "initializing") {
      this.#closeConnectionOnInit = true;
      return;
    }

    this.#handleStop();
  }

  public toggleRecording(): void {
    if (this._recordingState === "stopped") {
      this.startRecording();
    } else if (this._recordingState === "recording") {
      this.stopRecording();
    }
  }

  render() {
    const isLoading =
      this._recordingState === "initializing" ||
      this._recordingState === "stopping";
    const isRecording = this._recordingState === "recording";

    return html`
      <button
        @click=${this.#handleClick}
        ?disabled=${isLoading}
        class=${isRecording ? "red" : "accent"}
        aria-label=${isRecording ? "Stop recording" : "Start recording"}
        aria-pressed=${isRecording}
      >
        ${
          isLoading
            ? html`<icon-loading-spinner />`
            : isRecording
              ? html`<icon-recording />`
              : html`<icon-mic-on />`
        }
        <dictation-audio-visualiser
          .level=${this.#mediaController.audioLevel}
          ?active=${isRecording}
        />
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-recording-button": DictationRecordingButton;
  }
}
