import { consume } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  pushToTalkKeybindingContext,
  toggleToTalkKeybindingContext,
} from "../contexts/dictation-context.js";
import KeybindingSelectorStyles from "../styles/keybinding-selector.js";

import "./keybinding-input.js";

@customElement("dictation-keybinding-selector")
export class DictationKeybindingSelector extends LitElement {
  @consume({ context: pushToTalkKeybindingContext, subscribe: true })
  @state()
  _pushToTalkKeybinding?: string | null;

  @consume({ context: toggleToTalkKeybindingContext, subscribe: true })
  @state()
  _toggleToTalkKeybinding?: string | null;

  @property({ type: Boolean })
  disabled: boolean = false;

  static styles = KeybindingSelectorStyles;

  render() {
    return html`
      <div class="settings-group">
        <dictation-keybinding-input
          keybindingType="toggle-to-talk"
          ?disabled=${this.disabled}
        ></dictation-keybinding-input>
        <dictation-keybinding-input
          keybindingType="push-to-talk"
          ?disabled=${this.disabled}
        ></dictation-keybinding-input>
        ${
          (this._toggleToTalkKeybinding || this._pushToTalkKeybinding) &&
          html`<p class="keybinding-help">
            ${html`Press ${[this._toggleToTalkKeybinding, this._pushToTalkKeybinding].join(" or ")} to start/stop recording`}
          </p>`
        }
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-keybinding-selector": DictationKeybindingSelector;
  }
}
