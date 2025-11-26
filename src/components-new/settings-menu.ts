import { consume } from "@lit/context";
import { type CSSResultGroup, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { recordingStateContext } from "../contexts/dictation-context.js";
import ButtonStyles from "../styles/buttons.js";
import CalloutStyles from "../styles/callout.js";
import SettingsMenuStyles from "../styles/settings-menu.js";
import type { ConfigurableSettings, RecordingState } from "../types.js";
import { commaSeparatedConverter } from "../utils/converters.js";

import "./device-selector.js";
import "./language-selector.js";
import "../icons/icons.js";

@customElement("settings-menu")
export class SettingsMenu extends LitElement {
  @consume({ context: recordingStateContext, subscribe: true })
  @state()
  _recordingState: RecordingState = "stopped";

  @property({
    type: Array,
    converter: commaSeparatedConverter,
  })
  settingsEnabled: ConfigurableSettings[] = ["device", "language"];

  static styles: CSSResultGroup = [
    SettingsMenuStyles,
    ButtonStyles,
    CalloutStyles,
  ];

  render() {
    if (this.settingsEnabled?.length === 0) {
      return nothing;
    }

    const isRecording = this._recordingState === "recording";
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
              isRecording
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
                  ?disabled=${isRecording}
                ></device-selector>`
                : nothing
            }
            ${
              showLanguageSelector
                ? html`<language-selector
                  ?disabled=${isRecording}
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
