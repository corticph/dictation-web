import type { Corti } from "@corti/sdk";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createRef, type Ref, ref } from "lit/directives/ref.js";
import { DEFAULT_DICTATION_CONFIG } from "../constants.js";
import type { DictationContext } from "../contexts/dictation-context.js";
import type { ConfigurableSettings, RecordingState } from "../types.js";
import { commaSeparatedConverter } from "../utils/converters.js";
import type { RecordingButton } from "./recording-button.js";

import "../contexts/dictation-context.js";
import "./recording-button.js";
import "./settings-menu.js";

@customElement("corti-dictation")
export class CortiDictation extends LitElement {
  @property({ type: String })
  region?: string;

  @property({ type: String })
  tenantName?: string;

  @property({ type: String })
  accessToken?: string;

  @property({
    converter: commaSeparatedConverter,
    type: Array,
  })
  languages?: string[];

  /**
   * @deprecated Use `languages` instead
   */
  @property({
    converter: commaSeparatedConverter,
    type: Array,
  })
  set languagesSupported(value: string[] | undefined) {
    this.languages = value;
  }

  get languagesSupported(): string[] | undefined {
    return this.languages;
  }

  @state()
  private _dictationConfig: Corti.TranscribeConfig = DEFAULT_DICTATION_CONFIG;

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
  private _devices?: MediaDeviceInfo[];

  @state()
  private _selectedDevice?: MediaDeviceInfo;

  @property({ attribute: false, type: Array })
  set devices(value: MediaDeviceInfo[] | undefined) {
    this._devices = value;
  }

  get devices(): MediaDeviceInfo[] {
    return this.contextProviderRef.value?.devices || this._devices || [];
  }

  @property({ attribute: false, type: Object })
  set selectedDevice(value: MediaDeviceInfo | undefined) {
    this._selectedDevice = value;
  }

  get selectedDevice(): MediaDeviceInfo | null {
    return (
      this.contextProviderRef.value?.selectedDevice ||
      this._selectedDevice ||
      null
    );
  }

  @property({
    converter: commaSeparatedConverter,
    type: Array,
  })
  settingsEnabled: ConfigurableSettings[] = ["device", "language"];

  @property({ type: Boolean })
  allowButtonFocus: boolean = false;

  private recordingButtonRef: Ref<RecordingButton> = createRef();
  private contextProviderRef: Ref<DictationContext> = createRef();

  public setAccessToken(token: string) {
    this.accessToken = token;

    return {
      accessToken: token,
      environment: this.contextProviderRef.value?.effectiveRegion,
      tenant: this.contextProviderRef.value?.effectiveTenantName,
    };
  }

  @property({ attribute: false, type: Object })
  authConfig?: Corti.BearerOptions;

  public async setAuthConfig(config: Corti.BearerOptions) {
    this.authConfig = config;
    await this.updateComplete;

    return {
      accessToken: this.contextProviderRef.value?.accessToken,
      environment: this.contextProviderRef.value?.effectiveRegion,
      tenant: this.contextProviderRef.value?.effectiveTenantName,
    };
  }

  public startRecording(): void {
    this.recordingButtonRef.value?.startRecording();
  }

  public stopRecording(): void {
    this.recordingButtonRef.value?.stopRecording();
  }

  public toggleRecording(): void {
    this.recordingButtonRef.value?.toggleRecording();
  }

  get recordingState(): RecordingState {
    return this.contextProviderRef.value?.recordingState || "stopped";
  }

  render() {
    return html`
      <dictation-context-provider
        ${ref(this.contextProviderRef)}
        .region=${this.region}
        .tenantName=${this.tenantName}
        .accessToken=${this.accessToken}
        .authConfig=${this.authConfig}
        .dictationConfig=${this._dictationConfig}
        .languages=${this.languages}
        .devices=${this._devices}
        .selectedDevice=${this._selectedDevice}
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
