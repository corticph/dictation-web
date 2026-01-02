import { consume } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { keybindingContext } from "../contexts/dictation-context.js";
import KeybindingSelectorStyles from "../styles/keybinding-selector.js";
import { keybindingChangedEvent } from "../utils/events.js";
import {
  getPressedKeyFromEvent,
  pressedKeysToKeybinding,
} from "../utils/keybinding.js";

@customElement("dictation-keybinding-selector")
export class DictationKeybindingSelector extends LitElement {
  @consume({ context: keybindingContext, subscribe: true })
  @state()
  _keybinding?: string | null;

  @property({ type: Boolean })
  disabled: boolean = false;

  @state()
  _isCapturingKeybinding: boolean = false;

  #pressedKeys: Set<string> = new Set();

  static styles = KeybindingSelectorStyles;

  #handleKeybindingInputFocus(): void {
    this._isCapturingKeybinding = true;
    this.#pressedKeys.clear();
  }

  #handleKeybindingInputBlur(): void {
    console.log("Blur keybinding input");
    this._isCapturingKeybinding = false;
    this.#pressedKeys.clear();
  }

  #handleKeybindingKeyDown(event: KeyboardEvent): void {
    if (!this._isCapturingKeybinding) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const pressedKey = getPressedKeyFromEvent(event);
    this.#pressedKeys.add(pressedKey);

    this.#commitKeybinding();
  }

  #handleKeybindingKeyUp(event: KeyboardEvent): void {
    console.log("Keybinding keyup event", event);

    if (!this._isCapturingKeybinding) {
      return;
    }

    const pressedKey = getPressedKeyFromEvent(event);
    this.#pressedKeys.delete(pressedKey);
  }

  #commitKeybinding(): void {
    if (this.#pressedKeys.size > 0) {
      const keybinding = pressedKeysToKeybinding(this.#pressedKeys);
      this.dispatchEvent(keybindingChangedEvent(keybinding));
    }
  }

  render() {
    return html`
      <div>
        <label>Keybinding</label>
        <div class="keybinding-selector-wrapper">
          <div class="keybinding-key">${this._keybinding}</div>
          <input
            type="text"
            class="keybinding-selector-input"
            .value=""
            placeholder="Click and press a key..."
            readonly
            @focusin=${this.#handleKeybindingInputFocus}
            @focusout=${this.#handleKeybindingInputBlur}
            @keydown=${this.#handleKeybindingKeyDown}
            @keyup=${this.#handleKeybindingKeyUp}
            ?disabled=${this.disabled}
          />
        </div>
        <p class="keybinding-help">
          Press ${this._keybinding} to start/stop recording
        </p>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-keybinding-selector": DictationKeybindingSelector;
  }
}
