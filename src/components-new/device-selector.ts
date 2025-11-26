import { type CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import DefaultThemeStyles from "../styles/default-theme.js";
import SelectStyles from "../styles/select.js";
import { getAudioDevices } from "../utils/devices.js";
import { recordingDevicesChangedEvent } from "../utils/events.js";

@customElement("device-selector")
export class DeviceSelector extends LitElement {
  @property({ type: Object })
  selectedDevice?: MediaDeviceInfo;

  @property({ type: Array })
  devices?: MediaDeviceInfo[];

  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * Internal cache of loaded devices to check if devices were auto-loaded or provided via property
   * @private
   */
  private _loadedDevices: MediaDeviceInfo[] = [];

  private _devicesAutoLoaded(): boolean {
    return this._loadedDevices === this.devices;
  }

  static styles: CSSResultGroup = [DefaultThemeStyles, SelectStyles];

  async connectedCallback(): Promise<void> {
    super.connectedCallback();

    if (this.devices) {
      return;
    }

    await this._loadDevices();

    navigator.mediaDevices.addEventListener(
      "devicechange",
      this._handleDeviceChange,
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    navigator.mediaDevices.removeEventListener(
      "devicechange",
      this._handleDeviceChange,
    );
  }

  private async _loadDevices(): Promise<void> {
    const { devices, defaultDevice } = await getAudioDevices();
    this.devices = devices;
    this._loadedDevices = devices;

    if (!this.selectedDevice && defaultDevice) {
      this.selectedDevice = defaultDevice;
    }

    await this.updateComplete;
    this.dispatchEvent(
      recordingDevicesChangedEvent(this.devices || [], this.selectedDevice),
    );
  }

  private _handleDeviceChange = async () => {
    if (this._devicesAutoLoaded()) {
      await this._loadDevices();
    }
  };

  private async _handleSelectDevice(e: Event): Promise<void> {
    const deviceId = (e.target as HTMLSelectElement).value;
    this.selectedDevice = this.devices?.find((d) => d.deviceId === deviceId);

    await this.updateComplete;
    this.dispatchEvent(
      recordingDevicesChangedEvent(this.devices || [], this.selectedDevice),
    );
  }

  render() {
    return html`
      <div>
        <label id="device-select-label" for="device-select">
          Recording Device
        </label>
        <select
          id="device-select"
          aria-labelledby="device-select-label"
          @change=${this._handleSelectDevice}
          ?disabled=${this.disabled || !this.devices || this.devices.length === 0}
        >
          ${this.devices?.map(
            (device) => html`
              <option
                value=${device.deviceId}
                ?selected=${this.selectedDevice?.deviceId === device.deviceId}
              >
                ${device.label || "Unknown Device"}
              </option>
            `,
          )}
        </select>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "device-selector": DeviceSelector;
  }
}
