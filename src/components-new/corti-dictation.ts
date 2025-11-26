import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { ConfigurableSettings, RecordingState } from "../types.js";

import "../contexts/dictation-context.js";
import "./recording-button.js";
import "./settings-menu.js";

@customElement("corti-dictation")
export class CortiDictation extends LitElement {
  @property({ type: String })
  recordingState: RecordingState = "stopped";

  @property({ type: Number })
  audioLevel: number = 0;

  @property({ type: String })
  region?: string;

  @property({ type: String })
  selectedLanguage?: string;

  @property({ type: Array })
  languages?: string[];

  @property({ type: Object })
  selectedDevice?: MediaDeviceInfo;

  @property({ type: Array })
  devices?: MediaDeviceInfo[];

  @property({ type: Array })
  settingsEnabled: ConfigurableSettings[] = ["device", "language"];

  render() {
    const isRecording = this.recordingState === "recording";

    return html`
      <dictation-context-provider
        .region=${this.region}
        .languages=${this.languages}
        .selectedLanguage=${this.selectedLanguage}
        .selectedDevice=${this.selectedDevice}
      >
        <recording-button
          .recordingState=${this.recordingState}
          .audioLevel=${this.audioLevel}
        ></recording-button>
        <settings-menu
          .devices=${this.devices}
          .settingsEnabled=${this.settingsEnabled}
          ?disabled=${isRecording}
        ></settings-menu>
      </dictation-context-provider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "corti-dictation": CortiDictation;
  }
}
