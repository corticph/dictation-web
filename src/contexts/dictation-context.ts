import type { Corti } from "@corti/sdk";
import { createContext, provide } from "@lit/context";
import { type CSSResultGroup, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import ComponentStyles from "../styles/component-styles.js";
import DefaultThemeStyles from "../styles/default-theme.js";
import type { RecordingState } from "../types.js";
import { getInitialToken } from "../utils/auth.js";
import { commaSeparatedConverter } from "../utils/converters.js";
import { errorEvent } from "../utils/events.js";
import { decodeToken } from "../utils/token.js";

export const regionContext = createContext<string | undefined>("region");
export const tenantNameContext = createContext<string | undefined>(
  "tenantName",
);
export const languagesContext = createContext<string[] | undefined>(
  "languages",
);
export const devicesContext = createContext<MediaDeviceInfo[] | undefined>(
  "devices",
);
export const selectedDeviceContext = createContext<MediaDeviceInfo | undefined>(
  "selectedDevice",
);
export const recordingStateContext =
  createContext<RecordingState>("recordingState");
export const accessTokenContext = createContext<string | undefined>(
  "accessToken",
);
export const dictationConfigContext = createContext<
  Corti.TranscribeConfig | undefined
>("dictationConfig");
export const authConfigContext = createContext<Corti.BearerOptions | undefined>(
  "authConfig",
);

@customElement("dictation-context-provider")
export class DictationContext extends LitElement {
  @property({ type: String })
  region?: string;

  @property({ type: String })
  tenantName?: string;

  private _accessToken?: string;
  private _authConfig?: Corti.BearerOptions;

  @state()
  private _decodedToken?: {
    environment?: string;
    tenant?: string;
  };

  @property({ type: String })
  set accessToken(token: string | undefined) {
    this._accessToken = token;
    this._decodedToken = undefined;

    if (!token || (this.region && this.tenantName)) {
      return;
    }

    try {
      this._decodedToken = decodeToken(token);
    } catch (error) {
      this.dispatchEvent(errorEvent(error));
    }
  }

  get accessToken(): string | undefined {
    return this._accessToken;
  }

  @property({ attribute: false, type: Object })
  set authConfig(config: Corti.BearerOptions | undefined) {
    this._authConfig = config;

    if (config) {
      this._processAuthConfig(config);
    }
  }

  get authConfig(): Corti.BearerOptions | undefined {
    return this._authConfig;
  }

  @provide({ context: authConfigContext })
  get effectiveAuthConfig(): Corti.BearerOptions | undefined {
    // If explicit authConfig is provided, use it
    if (this._authConfig) {
      return this._authConfig;
    }

    // Otherwise, create authConfig from accessToken
    if (this._accessToken) {
      return {
        accessToken: this._accessToken,
        refreshAccessToken: () => ({
          accessToken: this._accessToken || "",
        }),
      };
    }

    return undefined;
  }

  private async _processAuthConfig(config: Corti.BearerOptions): Promise<void> {
    try {
      const { accessToken } = await getInitialToken(config);
      this.accessToken = accessToken;
    } catch (error) {
      this.dispatchEvent(errorEvent(error));
    }
  }

  @provide({ context: regionContext })
  get effectiveRegion(): string | undefined {
    return this.region || this._decodedToken?.environment;
  }

  @provide({ context: tenantNameContext })
  get effectiveTenantName(): string | undefined {
    return this.tenantName || this._decodedToken?.tenant;
  }

  @provide({ context: accessTokenContext })
  get effectiveAccessToken(): string | undefined {
    return this.accessToken;
  }

  @provide({ context: dictationConfigContext })
  @property({ attribute: false, type: Object })
  dictationConfig?: Corti.TranscribeConfig;

  @provide({ context: languagesContext })
  @property({
    converter: commaSeparatedConverter,
    type: Array,
  })
  languages?: string[];

  @provide({ context: devicesContext })
  @property({ attribute: false, type: Array })
  devices?: MediaDeviceInfo[];

  @provide({ context: selectedDeviceContext })
  @property({ attribute: false, type: Object })
  selectedDevice?: MediaDeviceInfo;

  @provide({ context: recordingStateContext })
  @state()
  recordingState: RecordingState = "stopped";

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
    this.addEventListener(
      "recording-state-changed",
      this._handleRecordingStateChanged,
    );
  }

  private _handleLanguageChanged = (e: Event) => {
    const event = e as CustomEvent;

    this.languages = event.detail.languages;
    this.dictationConfig = {
      ...this.dictationConfig,
      primaryLanguage: event.detail.selectedLanguage,
    };
  };

  private _handleDeviceChanged = (e: Event) => {
    const event = e as CustomEvent;

    this.devices = event.detail.devices;
    this.selectedDevice = event.detail.selectedDevice;
  };

  private _handleRecordingStateChanged = (e: Event) => {
    const event = e as CustomEvent;

    this.recordingState = event.detail.state;
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
