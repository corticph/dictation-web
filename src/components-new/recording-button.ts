import { type CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import ButtonStyles from "../styles/buttons.js";
import RecordingButtonStyles from "../styles/recording-button.js";
import type { RecordingState } from "../types.js";

import "./audio-visualiser.js";
import "../icons/icons.js";

@customElement("recording-button")
export class RecordingButton extends LitElement {
  @property({ type: String })
  recordingState: RecordingState = "stopped";

  @property({ type: Number })
  audioLevel: number = 0;

  @property({ type: Boolean })
  preventFocus: boolean = true;

  static styles: CSSResultGroup = [RecordingButtonStyles, ButtonStyles];

  private _handleClick(): void {
    this.dispatchEvent(
      new CustomEvent("toggle-recording", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _handleMouseDown(event: MouseEvent): void {
    // Prevent button from taking focus on mouse click
    // This keeps focus on the textarea or other elements
    if (this.preventFocus) {
      event.preventDefault();
    }
  }

  render() {
    const isLoading =
      this.recordingState === "initializing" ||
      this.recordingState === "stopping";
    const isRecording = this.recordingState === "recording";

    return html`
      <button
        @click=${this._handleClick}
        @mousedown=${this._handleMouseDown}
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
          .level=${this.audioLevel}
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
