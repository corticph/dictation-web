import type { Corti } from "@corti/sdk";
import { type ContextEvent, createContext, provide } from "@lit/context";
import { type CSSResultGroup, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { DevicesController } from "../controllers/devices-controller.js";
import { LanguagesController } from "../controllers/languages-controller.js";
import ComponentStyles from "../styles/component-styles.js";
import type { DictationMode, ProxyOptions, RecordingState } from "../types.js";
import { getInitialToken } from "../utils/auth.js";
import { commaSeparatedConverter } from "../utils/converters.js";
import {
  errorEvent,
  type KeybindingChangedEventDetail,
  keybindingChangedEvent,
  modeChangedEvent,
} from "../utils/events.js";
import { normalizeKeybinding } from "../utils/keybinding.js";
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
export const modeContext = createContext<DictationMode>(Symbol("mode"));
export const keybindingContext = createContext<string | null | undefined>(
  Symbol("keybinding"),
);

@customElement("dictation-root")
export class DictationRoot extends LitElement {
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
  _accessToken?: string;

  @property({ type: String })
  set accessToken(token: string | undefined) {
    this.setAccessToken(token);
  }

  get accessToken(): string | undefined {
    return this._accessToken;
  }

  @provide({ context: authConfigContext })
  @state()
  _authConfig?: Corti.BearerOptions;

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

  #languagesController = new LanguagesController(this);
  #devicesController = new DevicesController(this);

  @provide({ context: languagesContext })
  @state()
  _languages?: Corti.TranscribeSupportedLanguage[];

  @property({
    converter: commaSeparatedConverter,
    type: Array,
  })
  set languages(value: Corti.TranscribeSupportedLanguage[] | undefined) {
    this._languages = value;

    // Clear auto-loaded flag when languages are set via property
    if (value !== undefined) {
      this.#languagesController.clearAutoLoadedFlag();
    }
  }

  get languages(): Corti.TranscribeSupportedLanguage[] | undefined {
    return this._languages;
  }

  @provide({ context: devicesContext })
  @state()
  _devices?: MediaDeviceInfo[];

  @property({ attribute: false, type: Array })
  set devices(value: MediaDeviceInfo[] | undefined) {
    this._devices = value;

    // Clear auto-loaded flag when devices are set via property
    if (value !== undefined) {
      this.#devicesController.clearAutoLoadedFlag();
    }
  }

  get devices(): MediaDeviceInfo[] | undefined {
    return this._devices;
  }

  @provide({ context: selectedDeviceContext })
  @property({ attribute: false, type: Object })
  selectedDevice?: MediaDeviceInfo;

  @provide({ context: debugDisplayAudioContext })
  @property({ attribute: "debug-display-audio", type: Boolean })
  debug_displayAudio?: boolean;

  @provide({ context: modeContext })
  @property({ type: String })
  mode: DictationMode = "toggle-to-talk";

  @provide({ context: keybindingContext })
  @property({ type: String })
  keybinding?: string | null;

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
    this.addEventListener("languages-changed", this.#handleLanguageChanged);
    this.addEventListener(
      "recording-devices-changed",
      this.#handleDeviceChanged,
    );
    this.addEventListener(
      "recording-state-changed",
      this.#handleRecordingStateChanged,
    );
    this.addEventListener("context-request", this.#handleContextRequest);
    this.addEventListener("mode-changed", this.#handleModeChanged);
    this.addEventListener("keybinding-changed", this.#handleKeybindingChanged);
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

  #handleLanguageChanged = (e: Event) => {
    const event = e as CustomEvent;

    this.dictationConfig = {
      ...this.dictationConfig,
      primaryLanguage: event.detail.selectedLanguage,
    };
  };

  #handleDeviceChanged = (e: Event) => {
    const event = e as CustomEvent;

    this.selectedDevice = event.detail.selectedDevice;
  };

  #handleRecordingStateChanged = (e: Event) => {
    const event = e as CustomEvent;

    this.recordingState = event.detail.state;
  };

  #handleContextRequest = (e: ContextEvent<any>) => {
    if (e.context === languagesContext) {
      this.#languagesController.initialize();
    } else if (e.context === devicesContext) {
      this.#devicesController.initialize();
    } else if (
      e.context === keybindingContext &&
      e.contextTarget.tagName.toLowerCase() === "dictation-keybinding-selector"
    ) {
      // Initialize keybinding to default "`" when setting first mounts
      if (this.keybinding === undefined) {
        this.keybinding = "`";
        this.dispatchEvent(keybindingChangedEvent("`", "Backquote"));
      }
    }
  };

  #handleModeChanged = (e: Event) => {
    const event = e as CustomEvent;

    this.mode = event.detail.mode;
  };

  #handleKeybindingChanged = (e: Event) => {
    const event = e as CustomEvent<KeybindingChangedEventDetail>;

    const normalizedKeybinding = normalizeKeybinding(event.detail.key);
    this.keybinding = normalizedKeybinding;
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
    "dictation-root": DictationRoot;
  }
}
