import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { range } from "lit/directives/range.js";
import DefaultThemeStyles from "../styles/default-theme.js";

const SEGMENT_COUNT = 5;

@customElement("audio-visualiser")
export class AudioVisualiser extends LitElement {
  @property({ type: Number })
  level = 0; // expects a value from 0 to 1

  @property({ type: Boolean })
  active = false;

  static styles = [
    DefaultThemeStyles,
    css`
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
      background-color: var(--action-accent-text-color);
      transition: background-color 0.25s;
      border-radius: 1px;
      opacity: 0.5;
    }

    .segment.active {
      opacity: 1;
    }
  `,
  ];

  render() {
    // Each segment represents 20%. Using Math.round to fill segments.
    const activeSegments = Math.round(this.level * SEGMENT_COUNT);
    const segments = map(
      range(SEGMENT_COUNT),
      (i) =>
        html`<div class=${classMap({
          active: i < activeSegments,
          segment: true,
        })}></div>`,
    );

    return html`
      <div class=${classMap({
        active: this.active,
        container: true,
      })}>
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
