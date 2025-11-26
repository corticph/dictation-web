import { type CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import ComponentStyles from "../styles/ComponentStyles.js";
import DefaultThemeStyles from "../styles/default-theme.js";
import type { ConfigurableSettings, RecordingState } from "../types.js";

import "../contexts/region-context.js";
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

  static styles: CSSResultGroup = [DefaultThemeStyles, ComponentStyles];

  render() {
    const isRecording = this.recordingState === "recording";

    return html`
      <region-context-provider .region=${this.region}>
        <recording-button
          .recordingState=${this.recordingState}
          .audioLevel=${this.audioLevel}
        ></recording-button>
        <settings-menu
          .selectedLanguage=${this.selectedLanguage}
          .languages=${this.languages}
          .selectedDevice=${this.selectedDevice}
          .devices=${this.devices}
          .settingsEnabled=${this.settingsEnabled}
          ?disabled=${isRecording}
        ></settings-menu>
      </region-context-provider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "corti-dictation": CortiDictation;
  }
}
