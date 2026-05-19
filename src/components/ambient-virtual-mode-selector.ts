import { consume } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { virtualModeContext } from "../contexts/ambient-context.js";
import AmbientVirtualModeSelectorStyles from "../styles/ambient-virtual-mode-selector.js";
import { virtualModeChangedEvent } from "../utils/events.js";

import "../icons/icons.js";

@customElement("ambient-virtual-mode-selector")
export class AmbientVirtualModeSelector extends LitElement {
  @consume({ context: virtualModeContext, subscribe: true })
  @state()
  _virtualMode: boolean = false;

  @property({ type: Boolean })
  disabled: boolean = false;

  static styles = AmbientVirtualModeSelectorStyles;

  #handleToggle = (e: Event): void => {
    const checked = (e.target as HTMLInputElement).checked;
    this.dispatchEvent(virtualModeChangedEvent(checked));
  };

  render() {
    return html`
      <div class="virtual-mode-row">
        <div class="virtual-mode-content">
          <div class="virtual-mode-header">
            <icon-headset></icon-headset>
            <span class="virtual-mode-title">Virtual mode</span>
          </div>
          <span class="virtual-mode-description">
            Share audio from another window or tab
          </span>
        </div>
        <input
          id="virtual-mode-toggle"
          class="switch"
          type="checkbox"
          role="switch"
          aria-label="Enable virtual mode"
          .checked=${this._virtualMode}
          ?disabled=${this.disabled}
          @change=${this.#handleToggle}
        />
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-virtual-mode-selector": AmbientVirtualModeSelector;
  }
}
