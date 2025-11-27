import { consume } from "@lit/context";
import { type CSSResultGroup, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  accessTokenContext,
  recordingStateContext,
  selectedDeviceContext,
} from "../contexts/dictation-context.js";
import { DictationController } from "../controllers/DictationController.js";
import { MediaController } from "../controllers/MediaController.js";
import ButtonStyles from "../styles/buttons.js";
import RecordingButtonStyles from "../styles/recording-button.js";
import type { RecordingState } from "../types.js";
import { recordingStateChangedEvent } from "../utils/events.js";

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

  private async _handleStart(): Promise<void> {
    this.dispatchEvent(recordingStateChangedEvent("initializing"));

    await this._mediaController.initialize();

    await this._dictationController.connect(
      this._mediaController.mediaRecorder,
    );
    this._mediaController.startAudioLevelMonitoring();

    this.dispatchEvent(recordingStateChangedEvent("recording"));
  }

  private async _handleStop(): Promise<void> {
    this.dispatchEvent(recordingStateChangedEvent("stopping"));

    this._mediaController.stopAudioLevelMonitoring();
    await this._dictationController.disconnect();
    await this._mediaController.cleanup();

    this.dispatchEvent(recordingStateChangedEvent("stopped"));
  }

  private _handleClick(): void {
    if (this._recordingState === "stopped") {
      this._handleStart();
    } else if (this._recordingState === "recording") {
      this._handleStop();
    }
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
