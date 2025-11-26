import { type CSSResultGroup, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import ButtonStyles from "../styles/buttons.js";
import CalloutStyles from "../styles/callout.js";
import DefaultThemeStyles from "../styles/default-theme.js";
import SettingsMenuStyles from "../styles/settings-menu.js";
import type { ConfigurableSettings } from "../types.js";

import "./device-selector.js";
import "./language-selector.js";
import "../icons/icons.js";

@customElement("settings-menu")
export class SettingsMenu extends LitElement {
  @property({ type: Object })
  selectedDevice?: MediaDeviceInfo;

  @property({ type: String })
  selectedLanguage?: string;

  @property({ type: Boolean })
  disabled: boolean = false;

  @property({ type: Array })
  settingsEnabled: ConfigurableSettings[] = ["device", "language"];

  @property({ type: Array })
  devices?: MediaDeviceInfo[];

  @property({ type: Array })
  languages?: string[];

  static styles: CSSResultGroup = [
    DefaultThemeStyles,
    SettingsMenuStyles,
    ButtonStyles,
    CalloutStyles,
  ];

  render() {
    if (this.settingsEnabled?.length === 0) {
      return nothing;
    }

    const showDeviceSelector = this.settingsEnabled.includes("device");
    const showLanguageSelector = this.settingsEnabled.includes("language");

    return html`
      <div class="mic-selector">
        <button id="settings-popover-button" popovertarget="settings-popover">
          <icon-settings></icon-settings>
        </button>
        <div id="settings-popover" popover>
          <div class="settings-wrapper">
            ${
              this.disabled
                ? html`
                  <div class="callout warn">
                    Recording is in progress. Stop recording to change settings.
                  </div>
                `
                : nothing
            }
            ${
              showDeviceSelector
                ? html`<device-selector
                  .selectedDevice=${this.selectedDevice}
                  .devices=${this.devices}
                  ?disabled=${this.disabled}
                ></device-selector>`
                : nothing
            }
            ${
              showLanguageSelector
                ? html`<language-selector
                  .selectedLanguage=${this.selectedLanguage}
                  .languages=${this.languages}
                  ?disabled=${this.disabled}
                ></language-selector>`
                : nothing
            }
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "settings-menu": SettingsMenu;
  }
}
