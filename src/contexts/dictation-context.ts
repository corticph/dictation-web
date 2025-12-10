import type { Corti } from "@corti/sdk";
import { createContext, provide } from "@lit/context";
import { type CSSResultGroup, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import ComponentStyles from "../styles/ComponentStyles.js";
import type { ProxyOptions, RecordingState } from "../types.js";
import { getInitialToken } from "../utils/auth.js";
import { commaSeparatedConverter } from "../utils/converters.js";
import { errorEvent } from "../utils/events.js";
import { decodeToken } from "../utils/token.js";

export const regionContext = createContext<string | undefined>(
  Symbol("region"),
);
export const tenantNameContext = createContext<string | undefined>(
  Symbol("tenantName"),
);
export const languagesContext = createContext<
  Corti.TranscribeSupportedLanguage[] | undefined
>(Symbol("languages"));
export const devicesContext = createContext<MediaDeviceInfo[] | undefined>(
  Symbol("devices"),
);
export const selectedDeviceContext = createContext<MediaDeviceInfo | undefined>(
  Symbol("selectedDevice"),
);
export const recordingStateContext = createContext<RecordingState>(
  Symbol("recordingState"),
);
export const accessTokenContext = createContext<string | undefined>(
  Symbol("accessToken"),
);
export const dictationConfigContext = createContext<
  Corti.TranscribeConfig | undefined
>(Symbol("dictationConfig"));
export const authConfigContext = createContext<Corti.BearerOptions | undefined>(
  Symbol("authConfig"),
);
export const socketUrlContext = createContext<string | undefined>(
  Symbol("socketUrl"),
);
export const socketProxyContext = createContext<ProxyOptions | undefined>(
  Symbol("socketProxy"),
);
export const debugDisplayAudioContext = createContext<boolean | undefined>(
  Symbol("debugDisplayAudio"),
);

@customElement("dictation-context-provider")
export class DictationContext extends LitElement {
  // ─────────────────────────────────────────────────────────────────────────────
  // Context state
  // ─────────────────────────────────────────────────────────────────────────────

  @provide({ context: regionContext })
  @state()
  region?: string;

  @provide({ context: tenantNameContext })
  @state()
  tenantName?: string;

  @provide({ context: recordingStateContext })
  @state()
  recordingState: RecordingState = "stopped";

  // ─────────────────────────────────────────────────────────────────────────────
  // Properties
  // ─────────────────────────────────────────────────────────────────────────────

  @provide({ context: accessTokenContext })
  @state()
  private _accessToken?: string;

  @property({ type: String })
  set accessToken(token: string | undefined) {
    this.setAccessToken(token);
  }

  get accessToken(): string | undefined {
    return this._accessToken;
  }

  @provide({ context: authConfigContext })
  @state()
  private _authConfig?: Corti.BearerOptions;

  @property({ attribute: false, type: Object })
  set authConfig(config: Corti.BearerOptions | undefined) {
    this.setAuthConfig(config);
  }

  get authConfig(): Corti.BearerOptions | undefined {
    return this._authConfig;
  }

  @provide({ context: socketUrlContext })
  @property({ type: String })
  socketUrl?: string;

  @provide({ context: socketProxyContext })
  @property({ attribute: false, type: Object })
  socketProxy?: ProxyOptions;

  @provide({ context: dictationConfigContext })
  @property({ attribute: false, type: Object })
  dictationConfig?: Corti.TranscribeConfig;

  @provide({ context: languagesContext })
  @property({
    converter: commaSeparatedConverter,
    type: Array,
  })
  languages?: Corti.TranscribeSupportedLanguage[];

  @provide({ context: devicesContext })
  @property({ attribute: false, type: Array })
  devices?: MediaDeviceInfo[];

  @provide({ context: selectedDeviceContext })
  @property({ attribute: false, type: Object })
  selectedDevice?: MediaDeviceInfo;

  @provide({ context: debugDisplayAudioContext })
  @property({ attribute: "debug-display-audio", type: Boolean })
  debug_displayAudio?: boolean;

  @property({ type: Boolean })
  noWrapper: boolean = false;

  // ─────────────────────────────────────────────────────────────────────────────
  // Static
  // ─────────────────────────────────────────────────────────────────────────────

  static styles: CSSResultGroup = [ComponentStyles];

  // ─────────────────────────────────────────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────────────────────────────────────────

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

  // ─────────────────────────────────────────────────────────────────────────────
  // Public methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Sets the access token and parses region/tenant from it.
   * @returns ServerConfig with environment, tenant, and accessToken
   * @deprecated Use 'accessToken' property instead.
   */
  public setAccessToken(token: string | undefined) {
    this._accessToken = token;
    this.region = undefined;
    this.tenantName = undefined;

    if (!token) {
      return { accessToken: token, environment: undefined, tenant: undefined };
    }

    try {
      const decoded = decodeToken(token);

      this.region = decoded?.environment;
      this.tenantName = decoded?.tenant;

      return {
        accessToken: token,
        environment: decoded?.environment,
        tenant: decoded?.tenant,
      };
    } catch (error) {
      this.dispatchEvent(errorEvent(error));
    }

    return { accessToken: token, environment: undefined, tenant: undefined };
  }

  /**
   * Sets the auth config and parses region/tenant from the initial token.
   * @returns Promise with ServerConfig containing environment, tenant, and accessToken
   * @deprecated Use 'authConfig' property instead.
   */
  public async setAuthConfig(config?: Corti.BearerOptions) {
    this._authConfig = config;

    if (!config) {
      return {
        accessToken: undefined,
        environment: undefined,
        tenant: undefined,
      };
    }

    try {
      const { accessToken } = await getInitialToken(config);

      return this.setAccessToken(accessToken);
    } catch (error) {
      this.dispatchEvent(errorEvent(error));
    }

    return {
      accessToken: undefined,
      environment: undefined,
      tenant: undefined,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Private event handlers
  // ─────────────────────────────────────────────────────────────────────────────

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

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

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
