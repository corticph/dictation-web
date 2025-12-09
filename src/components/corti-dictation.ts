import type { Corti } from "@corti/sdk";
import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { createRef, type Ref, ref } from "lit/directives/ref.js";
import { DEFAULT_DICTATION_CONFIG } from "../constants.js";
import type { DictationContext } from "../contexts/dictation-context.js";
import type {
  ConfigurableSettings,
  ProxyOptions,
  RecordingState,
} from "../types.js";
import { commaSeparatedConverter } from "../utils/converters.js";
import type { RecordingButton } from "./recording-button.js";

import "../contexts/dictation-context.js";
import "./recording-button.js";
import "./settings-menu.js";

@customElement("corti-dictation")
export class CortiDictation extends LitElement {
  static styles = css`
    .hidden {
      display: none;
    }
  `;
  // ─────────────────────────────────────────────────────────────────────────────
  // Private refs
  // ─────────────────────────────────────────────────────────────────────────────

  private recordingButtonRef: Ref<RecordingButton> = createRef();
  private contextProviderRef: Ref<DictationContext> = createRef();

  // ─────────────────────────────────────────────────────────────────────────────
  // Properties
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Latest access token
   */
  @property({ type: String })
  accessToken?: string;

  /**
   * Authentication configuration with optional refresh mechanism.
   */
  @property({ attribute: false, type: Object })
  authConfig?: Corti.BearerOptions;

  /**
   * WebSocket URL for proxy connection. When provided, uses CortiWebSocketProxyClient instead of CortiClient.
   */
  @property({ type: String })
  socketUrl?: string;

  /**
   * Socket proxy configuration object. When provided, uses CortiWebSocketProxyClient instead of CortiClient.
   */
  @property({ attribute: false, type: Object })
  socketProxy?: ProxyOptions;

  /**
   * List of all language codes available for use with the Web Component.
   *  Default list depends on the accessToken
   */
  @property({
    converter: commaSeparatedConverter,
    type: Array,
  })
  set languagesSupported(value:
    | Corti.TranscribeSupportedLanguage[]
    | undefined) {
    this._languagesSupported = value;
  }

  get languagesSupported(): Corti.TranscribeSupportedLanguage[] {
    return (
      this.contextProviderRef.value?.languages || this._languagesSupported || []
    );
  }

  @state()
  private _languagesSupported?: string[];

  /**
   * Which settings should be available in the UI.
   *  If an empty array is passed, the settings will be disabled entirely.
   *  Options are language and devices
   */
  @property({
    converter: commaSeparatedConverter,
    type: Array,
  })
  settingsEnabled: ConfigurableSettings[] = ["device", "language"];

  /**
   * When false (default), allows the start/stop button from taking focus when clicked,
   *  disabling textareas or other input elements to maintain focus.
   *  Set to "true" to allow the button to receive focus on click.
   */
  @property({ type: Boolean })
  allowButtonFocus: boolean = false;

  /**
   * Overrides any device selection and instead uses getDisplayMedia to stream system audio.
   * Should only be used for debugging.
   */
  @property({ attribute: "debug-display-audio", type: Boolean })
  debug_displayAudio: boolean = false;

  /**
   * Configuration settings for dictation
   */
  @property({ attribute: false, type: Object })
  set dictationConfig(value: Corti.TranscribeConfig) {
    this._dictationConfig = value;
  }

  get dictationConfig(): Corti.TranscribeConfig {
    return (
      this.contextProviderRef.value?.dictationConfig || this._dictationConfig
    );
  }

  @state()
  private _dictationConfig: Corti.TranscribeConfig = DEFAULT_DICTATION_CONFIG;

  /**
   * List of available recording devices
   */
  @property({ attribute: false, type: Array })
  set devices(value: MediaDeviceInfo[] | undefined) {
    this._devices = value;
  }

  get devices(): MediaDeviceInfo[] {
    return this.contextProviderRef.value?.devices || this._devices || [];
  }

  @state()
  private _devices?: MediaDeviceInfo[];

  /**
   * The selected device used for recording (MediaDeviceInfo).
   */
  @property({ attribute: false, type: Object })
  set selectedDevice(value: MediaDeviceInfo | undefined) {
    this._selectedDevice = value;
  }

  get selectedDevice(): MediaDeviceInfo | undefined {
    return (
      this.contextProviderRef.value?.selectedDevice || this._selectedDevice
    );
  }

  @state()
  private _selectedDevice?: MediaDeviceInfo;

  /**
   * Current state of recording (stopped, recording, initializing and stopping, ).
   */
  get recordingState(): RecordingState {
    return this.contextProviderRef.value?.recordingState || "stopped";
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Public methods
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Set the latest access token.
   * @returns ServerConfig with environment, tenant, and accessToken
   * @deprecated Use 'accessToken' property instead.
   */
  public setAccessToken(token: string) {
    this.accessToken = token;

    return (
      this.contextProviderRef.value?.setAccessToken(token) ?? {
        accessToken: token,
        environment: undefined,
        tenant: undefined,
      }
    );
  }

  /**
   * Set the auth configuration for OAuth flows.
   * @returns Promise with ServerConfig containing environment, tenant, and accessToken
   * @deprecated Use 'authConfig' property instead.
   */
  public async setAuthConfig(config: Corti.BearerOptions) {
    this.authConfig = config;

    return (
      this.contextProviderRef.value?.setAuthConfig(config) ?? {
        accessToken: undefined,
        environment: undefined,
        tenant: undefined,
      }
    );
  }

  /**
   * Starts a recording.
   */
  public startRecording(): void {
    this.recordingButtonRef.value?.startRecording();
  }

  /**
   * Stops a recording.
   */
  public stopRecording(): void {
    this.recordingButtonRef.value?.stopRecording();
  }

  /**
   * Starts or stops recording. Convenience layer on top of the start/stop methods.
   */
  public toggleRecording(): void {
    this.recordingButtonRef.value?.toggleRecording();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  render() {
    const isHidden =
      !this.accessToken &&
      !this.authConfig &&
      !this.socketUrl &&
      !this.socketProxy;

    return html`
      <dictation-context-provider
        ${ref(this.contextProviderRef)}
        class=${classMap({ hidden: isHidden })}
        .accessToken=${this.accessToken}
        .authConfig=${this.authConfig}
        .socketUrl=${this.socketUrl}
        .socketProxy=${this.socketProxy}
        .dictationConfig=${this._dictationConfig}
        .languages=${this._languagesSupported}
        .devices=${this._devices}
        .selectedDevice=${this._selectedDevice}
        .debug_displayAudio=${this.debug_displayAudio}
      >
        <recording-button
          ${ref(this.recordingButtonRef)}
          .preventFocus=${!this.allowButtonFocus}
        ></recording-button>
        <settings-menu .settingsEnabled=${this.settingsEnabled}></settings-menu>
      </dictation-context-provider>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "corti-dictation": CortiDictation;
  }
}
