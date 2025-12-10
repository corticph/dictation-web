import { consume } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  devicesContext,
  selectedDeviceContext,
} from "../contexts/dictation-context.js";
import SelectStyles from "../styles/select.js";
import { recordingDevicesChangedEvent } from "../utils/events.js";

@customElement("dictation-device-selector")
export class DictationDeviceSelector extends LitElement {
  @consume({ context: devicesContext, subscribe: true })
  @state()
  private _devices?: MediaDeviceInfo[];

  @consume({ context: selectedDeviceContext, subscribe: true })
  @state()
  private _selectedDevice?: MediaDeviceInfo;

  @property({ type: Boolean })
  disabled: boolean = false;

  static styles = SelectStyles;

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
    "dictation-device-selector": DictationDeviceSelector;
  }
}
