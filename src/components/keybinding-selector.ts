import { consume } from "@lit/context";
import { html, LitElement, nothing } from "lit";
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

  #handleKeybindingKeyDown(event: KeyboardEvent): void {
    if (!this._isCapturingKeybinding) return;

    event.preventDefault();
    event.stopPropagation();

    const modifiers: string[] = [];
    if (event.metaKey) modifiers.push("meta");
    if (event.ctrlKey) modifiers.push("ctrl");
    if (event.altKey) modifiers.push("alt");
    if (event.shiftKey) modifiers.push("shift");

    const key = event.key;
    let keybinding: string;

    if (modifiers.length > 0) {
      keybinding = `${modifiers.join("+")}+${key}`;
    } else {
      keybinding = key;
    }

    this._isCapturingKeybinding = false;
    this.dispatchEvent(keybindingChangedEvent(keybinding));
  }

  #handleKeybindingClear(): void {
    this.dispatchEvent(keybindingChangedEvent(null));
  }

  #formatKeybinding(keybinding: string | null | undefined): string {
    if (!keybinding) return "";
    const parts = keybinding.split("+");
    if (parts.length === 1) return parts[0];
    const modifiers = parts.slice(0, -1);
    const key = parts[parts.length - 1];
    const formattedModifiers = modifiers.map((m) => {
      switch (m.toLowerCase()) {
        case "meta":
          return navigator.platform.toLowerCase().includes("mac")
            ? "Cmd"
            : "Meta";
        case "ctrl":
          return "Ctrl";
        case "alt":
          return "Alt";
        case "shift":
          return "Shift";
        default:
          return m;
      }
    });
    return `${formattedModifiers.join(" + ")} + ${key}`;
  }

  #formatKeybindingDisplay(keybinding: string | null | undefined): string {
    if (!keybinding) return "";
    const parts = keybinding.split("+");
    const key = parts[parts.length - 1];
    return key;
  }

  render() {
    return html`
      <div>
        <label>Keybinding</label>
        <div
          class="keybinding-selector-input"
          @focusin=${this.#handleKeybindingInputFocus}
          @keydown=${this.#handleKeybindingKeyDown}
          tabindex="0"
        >
          ${
            this._keybinding
              ? html`
                <div class="keybinding-key">${this.#formatKeybindingDisplay(
                  this._keybinding,
                )}</div>
                <div class="keybinding-display">${this.#formatKeybinding(
                  this._keybinding,
                )}</div>
              `
              : html`
                <div class="keybinding-key">${"`"}</div>
                <div class="keybinding-placeholder">
                  Click and press a key...
                </div>
              `
          }
        </div>
        <p class="keybinding-help">
          ${
            this._keybinding
              ? `Press ${this.#formatKeybinding(this._keybinding)} to start/stop recording`
              : "Press ` to start/stop recording"
          }
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
