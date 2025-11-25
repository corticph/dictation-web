import { createContext, provide } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

export const regionContext = createContext<string | undefined>("region");

@customElement("region-context-provider")
export class RegionContext extends LitElement {
  @provide({ context: regionContext })
  @property({ type: String })
  region?: string;

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "region-context-provider": RegionContext;
  }
}
