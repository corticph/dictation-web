import type { Corti } from "@corti/sdk";

// corti-dictation.ts
import { html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { RecorderManager } from "./RecorderManager.js";
import "./components/settings-menu.js";
import "./components/audio-visualiser.js";
import "./icons/icons.js";
import {
  DEFAULT_DICTATION_CONFIG,
  LANGUAGES_SUPPORTED_EU,
} from "./constants.js";
import ButtonStyles from "./styles/buttons.js";
import ComponentStyles from "./styles/ComponentStyles.js";
import CalloutStyles from "./styles/callout.js";
import ThemeStyles from "./styles/theme.js";
import type {
  ConfigurableSettings,
  RecordingState,
  ServerConfig,
} from "./types.js";
import { decodeToken } from "./utils.js";

export class CortiDictation extends LitElement {
  static styles = [ButtonStyles, ThemeStyles, ComponentStyles, CalloutStyles];

  @property({ type: Object })
  dictationConfig: Corti.TranscribeConfig = DEFAULT_DICTATION_CONFIG;

  @property({ type: Array })
  languagesSupported: Corti.TranscribeSupportedLanguage[] =
    LANGUAGES_SUPPORTED_EU;

  @property({ type: Boolean })
  debug_displayAudio: boolean = false;

  @property({ type: Array })
  settingsEnabled: ConfigurableSettings[] = ["device", "language"];

  @property({ type: Boolean })
  preventButtonFocus: boolean = true;

  @state()
  private _serverConfig: ServerConfig | undefined;

  @state()
  private _audioLevel: number = 0;

  @state()
  private _recordingState: RecordingState = "stopped";

  @state()
  private _selectedDevice: MediaDeviceInfo | undefined;

  @state()
  private _devices: MediaDeviceInfo[] = [];

  private recorderManager = new RecorderManager();

  async connectedCallback() {
    super.connectedCallback();
    const devices = await this.recorderManager.initialize();
    if (devices.selectedDevice) {
      this._selectedDevice = this.recorderManager.selectedDevice;
      this._devices = this.recorderManager.devices;
      this.dispatchEvent(new CustomEvent("ready"));
    }

    // Map event names to any extra handling logic
    const eventHandlers: Record<string, (e: CustomEvent) => void> = {
      "audio-level-changed": (e) => {
        this._audioLevel = e.detail.audioLevel;
        this.requestUpdate();
      },
      "devices-changed": () => {
        this._devices = [...this.recorderManager.devices];
        this.requestUpdate();
      },
      "recording-state-changed": (e) => {
        this._recordingState = e.detail.state;
      },
    };

    const eventsToRelay = [
      "recording-state-changed",
      "recording-devices-changed",
      "audio-level-changed",
      "error",
      "transcript",
      "command",
      "ready",
      "usage",
      "stream-closed",
    ];

    eventsToRelay.forEach((eventName) => {
      this.recorderManager.addEventListener(eventName, (e: Event) => {
        const customEvent = e as CustomEvent;
        // Perform any additional handling if defined
        if (eventHandlers[eventName]) {
          eventHandlers[eventName](customEvent);
        }
        // Re-dispatch the event from the component
        this.dispatchEvent(
          new CustomEvent(eventName, {
            bubbles: eventName !== "error",
            composed: true,
            detail: customEvent.detail,
          }),
        );
      });
    });
  }

  public startRecording() {
    if (!this._serverConfig) return;
    this.recorderManager.startRecording({
      debug_displayAudio: this.debug_displayAudio,
      dictationConfig: this.dictationConfig,
      serverConfig: this._serverConfig!,
    });
  }

  public stopRecording() {
    this.recorderManager.stopRecording();
  }

  public toggleRecording() {
    if (this._recordingState === "recording") {
      this.stopRecording();
    } else if (this._recordingState === "stopped") {
      this.startRecording();
    }
  }

  /**
   * Sets the access token and returns the server configuration.
   *
   * NOTE: We decode the token here only for backward compatibility in return values.
   * The SDK now handles token parsing internally, so this return value should be
   * reduced in the future to only include necessary fields.
   */
  public setAccessToken(token: string) {
    try {
      const decoded = decodeToken(token);
      this._serverConfig = decoded;
      return decoded;
    } catch (e) {
      throw new Error("Invalid token");
    }
  }

  /**
   * Sets the authentication configuration and returns the server configuration.
   *
   * NOTE: We decode tokens here only for backward compatibility in return values.
   * The SDK now handles token parsing internally, so this return value should be
   * reduced in the future to only include necessary fields.
   */
  public async setAuthConfig(
    config: Corti.BearerOptions,
  ): Promise<ServerConfig> {
    try {
      const initialToken =
        "accessToken" in config
          ? {
              accessToken: config.accessToken,
              refreshToken: config.refreshToken,
            }
          : await config.refreshAccessToken();

      if (
        !initialToken?.accessToken ||
        typeof initialToken.accessToken !== "string"
      ) {
        throw new Error("Access token is required and must be a string");
      }

      // Decode tokens only for return value compatibility
      // The SDK handles its own token parsing internally
      const decoded = decodeToken(initialToken.accessToken);

      if (!decoded) {
        throw new Error("Invalid token format");
      }

      this._serverConfig = {
        accessToken: initialToken.accessToken,
        environment: decoded.environment,
        refreshAccessToken: async (refreshToken?: string) => {
          try {
            if (!config.refreshAccessToken) {
              return {
                accessToken: this._serverConfig?.accessToken || "no_token",
                expiresIn: Infinity,
                refreshToken,
              };
            }

            const response = await config.refreshAccessToken(refreshToken);

            if (this._serverConfig) {
              this._serverConfig.accessToken = response.accessToken;
              this._serverConfig.refreshToken = response.refreshToken;
            }

            return response;
          } catch (e) {
            throw new Error("Error when refreshing access token");
          }
        },
        refreshToken: config.refreshToken,
        tenant: decoded.tenant,
      };

      return this._serverConfig;
    } catch (e) {
      throw new Error("Invalid config");
    }
  }

  public get selectedDevice(): MediaDeviceInfo | null {
    return this.recorderManager.selectedDevice || null;
  }

  public get recordingState(): RecordingState {
    return this._recordingState;
  }

  public get devices(): MediaDeviceInfo[] {
    return this._devices;
  }

  public async setRecordingDevice(device: MediaDeviceInfo) {
    this.recorderManager.selectedDevice = device;
    this._selectedDevice = device;
    if (!this._serverConfig) return;
    if (this._recordingState === "recording") {
      await this.recorderManager.stopRecording();
      await this.recorderManager.startRecording({
        dictationConfig: this.dictationConfig,
        serverConfig: this._serverConfig,
      });
    }
  }

  public setPrimaryLanguage(language: string) {
    if (LANGUAGES_SUPPORTED_EU.includes(language)) {
      this.dictationConfig = {
        ...this.dictationConfig,
        primaryLanguage: language,
      };

      // If recording is in progress, restart to apply the language change
      if (this._serverConfig && this._recordingState === "recording") {
        this.recorderManager.stopRecording();
        this.recorderManager.startRecording({
          debug_displayAudio: this.debug_displayAudio,
          dictationConfig: this.dictationConfig,
          serverConfig: this._serverConfig,
        });
      }
    }
  }

  _onButtonMouseDown(event: MouseEvent) {
    // Prevent button from taking focus on mouse click
    // This keeps focus on the textarea
    if (this.preventButtonFocus) {
      event.preventDefault();
    }
  }

  // Handle device change events if needed
  async _onRecordingDevicesChanged(event: Event) {
    const customEvent = event as CustomEvent;
    this.setRecordingDevice(customEvent.detail.selectedDevice);
  }

  // Handle language change events
  _onLanguageChanged(event: Event) {
    const customEvent = event as CustomEvent;
    const language = customEvent.detail.language;
    if (language) {
      this.setPrimaryLanguage(language);
    }
  }

  render() {
    if (!this._serverConfig) {
      return html` <div style="display: none"></div> `;
    }

    const isLoading =
      this._recordingState === "initializing" ||
      this._recordingState === "stopping";
    const isRecording = this._recordingState === "recording";
    return html`
      <div class="wrapper">
        <button
          @click=${this.toggleRecording}
          @mousedown=${this._onButtonMouseDown}
          class=${isRecording ? "red" : "accent"}
        >
          ${
            isLoading
              ? html` <icon-loading-spinner></icon-loading-spinner>`
              : isRecording
                ? html` <icon-recording></icon-recording>`
                : html` <icon-mic-on></icon-mic-on>`
          }
          <audio-visualiser
            .level=${this._audioLevel}
            .active=${isRecording}
          ></audio-visualiser>
        </button>

        ${
          this.settingsEnabled.length > 0
            ? html`
        <settings-menu
          .selectedDevice=${this._selectedDevice}
          .selectedLanguage=${this.dictationConfig.primaryLanguage}
          ?settingsDisabled=${this._recordingState !== "stopped"}
          @recording-devices-changed=${this._onRecordingDevicesChanged}
          @language-changed=${this._onLanguageChanged}
          .settingsEnabled=${this.settingsEnabled}
        ></settings-menu>
        `
            : ""
        }
      </div>
    `;
  }
}

export default CortiDictation;
