import type { Corti } from "@corti/sdk";
import { consume } from "@lit/context";
import { type CSSResultGroup, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AUDIO_CHUNK_INTERVAL_MS } from "../constants.js";
import {
  accessTokenContext,
  authConfigContext,
  debugDisplayAudioContext,
  dictationConfigContext,
  recordingStateContext,
  regionContext,
  selectedDeviceContext,
  socketProxyContext,
  socketUrlContext,
  tenantNameContext,
} from "../contexts/dictation-context.js";
import {
  DictationController,
  type TranscribeMessage,
} from "../controllers/dictation-controller.js";
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
  private _recordingState: RecordingState = "stopped";

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

  @property({ type: Boolean })
  allowButtonFocus: boolean = false;

  private _mediaController = new MediaController(this);
  private _dictationController = new DictationController(this);

  static styles: CSSResultGroup = [RecordingButtonStyles, ButtonStyles];

  private _handleMouseDown(event: MouseEvent): void {
    if (!this.allowButtonFocus) {
      event.preventDefault();
    }
  }

  private _handleWebSocketMessage = (message: TranscribeMessage): void => {
    switch (message.type) {
      case "CONFIG_ACCEPTED":
        this._mediaController.mediaRecorder?.start(AUDIO_CHUNK_INTERVAL_MS);
        this._mediaController.startAudioLevelMonitoring((level) => {
          this.dispatchEvent(audioLevelChangedEvent(level));
        });
        this.dispatchEvent(recordingStateChangedEvent("recording"));
        break;
      case "CONFIG_DENIED":
        this.dispatchEvent(
          errorEvent(`Config denied: ${message.reason ?? "Unknown reason"}`),
        );
        this._handleStop();
        break;
      case "CONFIG_TIMEOUT":
        this.dispatchEvent(errorEvent("Config timeout"));
        this._handleStop();
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
        this._handleStop();
        break;
    }
  };

  private _handleWebSocketError = (error: Error): void => {
    this.dispatchEvent(errorEvent("Socket error: " + error.message));
    this._handleStop();
  };

  private _handleWebSocketClose = (event: unknown): void => {
    this.dispatchEvent(streamClosedEvent(event));
  };

  private async _handleStart(): Promise<void> {
    this.dispatchEvent(recordingStateChangedEvent("initializing"));

    try {
      await this._mediaController.initialize(() => {
        if (this._recordingState === "recording") {
          this.dispatchEvent(errorEvent("Recording device access was lost."));
          this._handleStop();
        }
      });

      await this._dictationController.connect(
        this._mediaController.mediaRecorder,
        this._dictationConfig,
        {
          onClose: this._handleWebSocketClose,
          onError: this._handleWebSocketError,
          onMessage: this._handleWebSocketMessage,
          onNetworkActivity: (direction, data) => {
            this.dispatchEvent(networkActivityEvent(direction, data));
          },
        },
      );
    } catch (error) {
      this.dispatchEvent(errorEvent(error));
      await this._handleStop();
    }
  }

  private async _handleStop(): Promise<void> {
    this.dispatchEvent(recordingStateChangedEvent("stopping"));

    try {
      this._mediaController.stopAudioLevelMonitoring();
      await this._mediaController.stopRecording();

      await this._dictationController.disconnect(this._handleWebSocketClose);
      await this._mediaController.cleanup();
    } catch (error) {
      this.dispatchEvent(errorEvent(error));
    }

    this.dispatchEvent(recordingStateChangedEvent("stopped"));
  }

  private _handleClick(): void {
    if (this._recordingState === "stopped") {
      this._handleStart();
    } else if (this._recordingState === "recording") {
      this._handleStop();
    }
  }

  public startRecording(): void {
    if (this._recordingState !== "stopped") {
      return;
    }

    this._handleStart();
  }

  public stopRecording(): void {
    if (this._recordingState !== "recording") {
      return;
    }

    this._handleStop();
  }

  public toggleRecording(): void {
    this._handleClick();
  }

  render() {
    const isLoading =
      this._recordingState === "initializing" ||
      this._recordingState === "stopping";
    const isRecording = this._recordingState === "recording";

    return html`
      <button
        @mousedown=${this._handleMouseDown}
        @click=${this._handleClick}
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
          .level=${this._mediaController.audioLevel}
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
