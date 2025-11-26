import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { map } from "lit/directives/map.js";
import { range } from "lit/directives/range.js";
import AudioVisualiserStyles from "../styles/audio-visualiser.js";
import DefaultThemeStyles from "../styles/default-theme.js";

const SEGMENT_COUNT = 5;

@customElement("audio-visualiser")
export class AudioVisualiser extends LitElement {
  @property({ type: Number })
  level: number = 0; // expects a value from 0 to 1

  @property({ type: Boolean })
  active: boolean = false;

  static styles = [DefaultThemeStyles, AudioVisualiserStyles];

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
