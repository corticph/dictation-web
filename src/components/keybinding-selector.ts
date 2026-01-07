import { consume } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { keybindingContext } from "../contexts/dictation-context.js";
import KeybindingSelectorStyles from "../styles/keybinding-selector.js";
import { keybindingChangedEvent } from "../utils/events.js";

@customElement("dictation-keybinding-selector")
export class DictationKeybindingSelector extends LitElement {
  @consume({ context: keybindingContext, subscribe: true })
  @state()
  _keybinding?: string | null;

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

    this.dispatchEvent(keybindingChangedEvent(event.key, event.code));
  }

  render() {
    return html`
      <div>
        <label>Keybinding</label>
        <div class="keybinding-selector-wrapper">
          ${this._keybinding && html`<div class="keybinding-key">${this._keybinding}</div>`}
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
        ${
          this._keybinding &&
          html`<p class="keybinding-help">
            Press ${this._keybinding} to start/stop recording
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
