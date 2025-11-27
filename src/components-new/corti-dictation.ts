import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { ConfigurableSettings } from "../types.js";
import { commaSeparatedConverter } from "../utils/converters.js";

import "../contexts/dictation-context.js";
import "./recording-button.js";
import "./settings-menu.js";

@customElement("corti-dictation")
export class CortiDictation extends LitElement {
  @property({ type: String })
  region?: string;

  @property({ type: String })
  accessToken?: string;

  @property({
    converter: commaSeparatedConverter,
    type: Array,
  })
  languages?: string[];

  @property({ type: String })
  selectedLanguage?: string;

  @property({ attribute: false, type: Array })
  devices?: MediaDeviceInfo[];

  @property({ attribute: false, type: Object })
  selectedDevice?: MediaDeviceInfo;

  @property({
    converter: commaSeparatedConverter,
    type: Array,
  })
  settingsEnabled: ConfigurableSettings[] = ["device", "language"];

  render() {
    return html`
      <dictation-context-provider
        .region=${this.region}
        .accessToken=${this.accessToken}
        .languages=${this.languages}
        .selectedLanguage=${this.selectedLanguage}
        .devices=${this.devices}
        .selectedDevice=${this.selectedDevice}
      >
        <recording-button></recording-button>
        <settings-menu .settingsEnabled=${this.settingsEnabled}></settings-menu>
      </dictation-context-provider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "corti-dictation": CortiDictation;
  }
}
