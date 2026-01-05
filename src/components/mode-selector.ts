import { consume } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { modeContext } from "../contexts/dictation-context.js";
import ModeSelectorStyles from "../styles/mode-selector.js";
import type { DictationMode } from "../types.js";
import { modeChangedEvent } from "../utils/events.js";

@customElement("dictation-mode-selector")
export class DictationModeSelector extends LitElement {
  @consume({ context: modeContext, subscribe: true })
  @state()
  _mode: DictationMode = "toggle-to-talk";

  @property({ type: Boolean })
  disabled: boolean = false;

  static styles = ModeSelectorStyles;

  #handleModeChange(mode: DictationMode): void {
    this.dispatchEvent(modeChangedEvent(mode));
  }

  render() {
    return html`
      <div>
        <label>Dictation Mode</label>
        <div class="mode-selector-tabs">
          <button
            class=${classMap({
              active: this._mode === "toggle-to-talk",
              "mode-selector-tab": true,
            })}
            @click=${() => this.#handleModeChange("toggle-to-talk")}
            ?disabled=${this.disabled}
          >
            Toggle-to-talk
          </button>
          <button
            class=${classMap({
              active: this._mode === "hold-to-talk",
              "mode-selector-tab": true,
            })}
            @click=${() => this.#handleModeChange("hold-to-talk")}
            ?disabled=${this.disabled}
          >
            Hold-to-talk
          </button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-mode-selector": DictationModeSelector;
  }
}
