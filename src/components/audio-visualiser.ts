import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

const SEGMENT_COUNT = 5;

@customElement("audio-visualiser")
export class AudioVisualiser extends LitElement {
  @property({ type: Number }) level = 0; // expects a value from 0 to 1

  @property({ type: Boolean }) active = false;

  static styles = css`
    :host {
      height: 100%;
    }

    .container {
      display: flex;
      width: 8px;
      flex-direction: column-reverse; /* Bottom-up stacking */
      height: 100%;
      gap: 1px;
      opacity: 0.5;

      &.active {
        opacity: 1;
      }
    }

    .segment {
      flex: 1;
      background-color: var(--action-accent-text-color, #fff);
      transition: background-color 0.25s;
      border-radius: 1px;
      opacity: 0.5;
    }

    .segment.active {
      opacity: 1;
    }
  `;

  render() {
    // Each segment represents 20%. Using Math.round to fill segments.
    const activeSegments = Math.round(this.level * SEGMENT_COUNT);
    const segments = Array.from({ length: SEGMENT_COUNT }, (_, i) => {
      return html`<div class="segment ${i < activeSegments ? "active" : ""}"></div>`;
    });

    return html`
      <div class="container ${this.active ? "active" : ""}">
        ${segments}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "audio-visualiser": AudioVisualiser;
  }
}
