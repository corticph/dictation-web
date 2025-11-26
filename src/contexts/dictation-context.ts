import { createContext, provide } from "@lit/context";
import { type CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import ComponentStyles from "../styles/ComponentStyles.js";
import DefaultThemeStyles from "../styles/default-theme.js";
import { commaSeparatedConverter } from "../utils/converters.js";

export const regionContext = createContext<string | undefined>("region");
export const languagesContext = createContext<string[] | undefined>(
  "languages",
);
export const selectedLanguageContext = createContext<string | undefined>(
  "selectedLanguage",
);
export const devicesContext = createContext<MediaDeviceInfo[] | undefined>(
  "devices",
);
export const selectedDeviceContext = createContext<MediaDeviceInfo | undefined>(
  "selectedDevice",
);

@customElement("dictation-context-provider")
export class DictationContext extends LitElement {
  @provide({ context: regionContext })
  @property({ type: String })
  region?: string;

  @provide({ context: languagesContext })
  @property({
    type: Array,
    converter: commaSeparatedConverter,
  })
  languages?: string[];

  @provide({ context: selectedLanguageContext })
  @property({ type: String })
  selectedLanguage?: string;

  @provide({ context: devicesContext })
  @property({ attribute: false, type: Array })
  devices?: MediaDeviceInfo[];

  @provide({ context: selectedDeviceContext })
  @property({ attribute: false, type: Object })
  selectedDevice?: MediaDeviceInfo;

  @property({ type: Boolean })
  noWrapper: boolean = false;

  static styles: CSSResultGroup = [DefaultThemeStyles, ComponentStyles];

  constructor() {
    super();
    this.addEventListener("languages-changed", this._handleLanguageChanged);
    this.addEventListener(
      "recording-devices-changed",
      this._handleDeviceChanged,
    );
  }

  private _handleLanguageChanged = (e: Event) => {
    const event = e as CustomEvent;

    this.languages = event.detail.languages;
    this.selectedLanguage = event.detail.selectedLanguage;
  };

  private _handleDeviceChanged = (e: Event) => {
    const event = e as CustomEvent;

    this.devices = event.detail.devices;
    this.selectedDevice = event.detail.selectedDevice;
  };

  render() {
    if (this.noWrapper) {
      return html`<slot></slot>`;
    }

    return html`<div class="wrapper">
      <slot></slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-context-provider": DictationContext;
  }
}
