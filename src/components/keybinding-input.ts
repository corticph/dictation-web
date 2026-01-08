import { consume } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  pushToTalkKeybindingContext,
  toggleToTalkKeybindingContext,
} from "../contexts/dictation-context.js";
import KeybindingSelectorStyles from "../styles/keybinding-selector.js";
import { keybindingChangedEvent } from "../utils/events.js";

@customElement("dictation-keybinding-input")
export class DictationKeybindingInput extends LitElement {
  @property({ type: String })
  keybindingType: "push-to-talk" | "toggle-to-talk" = "toggle-to-talk";

  @consume({ context: pushToTalkKeybindingContext, subscribe: true })
  @state()
  _pushToTalkKeybinding?: string | null;

  @consume({ context: toggleToTalkKeybindingContext, subscribe: true })
  @state()
  _toggleToTalkKeybinding?: string | null;

  @property({ type: Boolean })
  disabled: boolean = false;

  @state()
  _isCapturingKeybinding: boolean = false;

  static styles = KeybindingSelectorStyles;

  #handleKeybindingInputFocus(): void {
    this._isCapturingKeybinding = true;
  }

  #handleKeybindingInputBlur(): void {
    this._isCapturingKeybinding = false;
  }

  #handleKeybindingKeyDown(event: KeyboardEvent): void {
    if (!this._isCapturingKeybinding) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.dispatchEvent(
      keybindingChangedEvent(event.key, event.code, this.keybindingType),
    );
  }

  render() {
    const keybinding =
      this.keybindingType === "push-to-talk"
        ? this._pushToTalkKeybinding
        : this._toggleToTalkKeybinding;
    const label =
      this.keybindingType === "push-to-talk"
        ? "Push-to-Talk keybinding"
        : "Toggle-to-Talk keybinding";

    return html`
      <div>
        <label>${label}</label>
        <div class="keybinding-selector-wrapper">
          ${keybinding && html`<div class="keybinding-key">${keybinding}</div>`}
          <input
            type="text"
            class="keybinding-selector-input"
            .value=""
            placeholder="Click and press a key..."
            readonly
            @focusin=${this.#handleKeybindingInputFocus}
            @focusout=${this.#handleKeybindingInputBlur}
            @keydown=${this.#handleKeybindingKeyDown}
            ?disabled=${this.disabled}
          />
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-keybinding-input": DictationKeybindingInput;
  }
}
