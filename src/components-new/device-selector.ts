import { consume } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  devicesContext,
  selectedDeviceContext,
} from "../contexts/dictation-context.js";
import SelectStyles from "../styles/select.js";
import { getAudioDevices } from "../utils/devices.js";
import { errorEvent, recordingDevicesChangedEvent } from "../utils/events.js";

@customElement("device-selector")
export class DeviceSelector extends LitElement {
  @consume({ context: devicesContext, subscribe: true })
  @state()
  private _devices?: MediaDeviceInfo[];

  @consume({ context: selectedDeviceContext, subscribe: true })
  @state()
  private _selectedDevice?: MediaDeviceInfo;

  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * Internal cache of loaded devices to check if devices were auto-loaded or provided via property
   * @private
   */
  private _loadedDevices: MediaDeviceInfo[] = [];

  private _devicesAutoLoaded(): boolean {
    return this._loadedDevices === this._devices;
  }

  static styles = SelectStyles;

  async connectedCallback(): Promise<void> {
    super.connectedCallback();

    if (this._devices) {
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
    try {
      const { devices, defaultDevice } = await getAudioDevices();
      this._loadedDevices = devices;

      this.dispatchEvent(
        recordingDevicesChangedEvent(
          devices,
          this._selectedDevice ?? defaultDevice,
        ),
      );
    } catch (error) {
      this.dispatchEvent(errorEvent(error));
    }
  }

  private _handleDeviceChange = async () => {
    if (this._devicesAutoLoaded()) {
      await this._loadDevices();
    }
  };

  private _handleSelectDevice(e: Event): void {
    const deviceId = (e.target as HTMLSelectElement).value;
    const device = this._devices?.find((d) => d.deviceId === deviceId);

    if (!device) {
      return;
    }

    this.dispatchEvent(
      recordingDevicesChangedEvent(this._devices || [], device),
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
          ?disabled=${this.disabled || !this._devices || this._devices.length === 0}
        >
          ${this._devices?.map(
            (device) => html`
              <option
                value=${device.deviceId}
                ?selected=${this._selectedDevice?.deviceId === device.deviceId}
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
