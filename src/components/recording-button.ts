import type { Corti } from "@corti/sdk";
import { consume } from "@lit/context";
import { type CSSResultGroup, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  accessTokenContext,
  authConfigContext,
  dictationConfigContext,
  recordingStateContext,
  regionContext,
  selectedDeviceContext,
  tenantNameContext,
} from "../contexts/dictation-context.js";
import {
  DictationController,
  type TranscribeMessage,
} from "../controllers/DictationController.js";
import { MediaController } from "../controllers/MediaController.js";
import ButtonStyles from "../styles/buttons.js";
import RecordingButtonStyles from "../styles/recording-button.js";
import type { RecordingState } from "../types.js";
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

@customElement("recording-button")
export class RecordingButton extends LitElement {
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

  @property({ type: Boolean })
  preventFocus: boolean = false;

  private _mediaController = new MediaController(this);
  private _dictationController = new DictationController(this);

  static styles: CSSResultGroup = [RecordingButtonStyles, ButtonStyles];

  private _handleMouseDown(event: MouseEvent): void {
    if (this.preventFocus) {
      event.preventDefault();
    }
  }

  private _handleWebSocketMessage = (message: TranscribeMessage): void => {
    if (message.type === "CONFIG_ACCEPTED") {
      this._mediaController.mediaRecorder?.start(250);
      this._mediaController.startAudioLevelMonitoring((level) => {
        this.dispatchEvent(audioLevelChangedEvent(level));
      });

      this.dispatchEvent(recordingStateChangedEvent("recording"));
    }

    switch (message.type) {
      case "transcript":
        this.dispatchEvent(transcriptEvent(message));
        break;
      case "command":
        this.dispatchEvent(commandEvent(message));
        break;
      case "usage":
        this.dispatchEvent(usageEvent(message));
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
          this.dispatchEvent(errorEvent("Microphone access was lost."));
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
            ? html`<icon-loading-spinner></icon-loading-spinner>`
            : isRecording
              ? html`<icon-recording></icon-recording>`
              : html`<icon-mic-on></icon-mic-on>`
        }
        <audio-visualiser
          .level=${this._mediaController.audioLevel}
          ?active=${isRecording}
        ></audio-visualiser>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "recording-button": RecordingButton;
  }
}
