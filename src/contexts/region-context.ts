import { createContext, provide } from "@lit/context";
import { type CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import ComponentStyles from "../styles/ComponentStyles.js";
import ThemeStyles from "../styles/theme.js";

export const regionContext = createContext<string | undefined>("region");

@customElement("region-context-provider")
export class RegionContext extends LitElement {
  @provide({ context: regionContext })
  @property({ type: String })
  region?: string;

  @property({ type: Boolean })
  noWrapper: boolean = false;

  static styles: CSSResultGroup = [ThemeStyles, ComponentStyles];

  render() {
    if (this.noWrapper) {
      return html`<slot></slot>`;
    }

    return html`<div class="wrapper"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "region-context-provider": RegionContext;
  }
}
