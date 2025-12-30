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
import "./keybinding-selector.js";
import "./language-selector.js";
import "./mode-selector.js";
import "../icons/icons.js";

@customElement("dictation-settings-menu")
export class DictationSettingsMenu extends LitElement {
  @consume({ context: recordingStateContext, subscribe: true })
  @state()
  _recordingState: RecordingState = "stopped";

  @property({
    converter: commaSeparatedConverter,
    type: Array,
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
    const showModeSelector = this.settingsEnabled.includes("mode");
    const showKeybinding = this.settingsEnabled.includes("keybinding");

    return html`
      <div class="mic-selector">
        <button id="settings-popover-button" popovertarget="settings-popover">
          <icon-settings />
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
                ? html`<dictation-device-selector
                  ?disabled=${isRecording}
                />`
                : nothing
            }
            ${
              showLanguageSelector
                ? html`<dictation-language-selector
                  ?disabled=${isRecording}
                />`
                : nothing
            }
            ${
              showModeSelector || showKeybinding
                ? html`
                  <div class="settings-group">
                    ${
                      showModeSelector
                        ? html`<dictation-mode-selector
                            ?disabled=${isRecording}
                          />`
                        : nothing
                    }
                    ${
                      showKeybinding
                        ? html`<dictation-keybinding-selector
                            ?disabled=${isRecording}
                          />`
                        : nothing
                    }
                  </div>
                `
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
    "dictation-settings-menu": DictationSettingsMenu;
  }
}
