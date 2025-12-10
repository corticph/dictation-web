import type { ReactiveController, ReactiveControllerHost } from "lit";
import { getAudioDevices } from "../utils/devices.js";
import {
  errorEvent,
  readyEvent,
  recordingDevicesChangedEvent,
} from "../utils/events.js";

interface DevicesControllerHost extends ReactiveControllerHost {
  devices?: MediaDeviceInfo[];
  selectedDevice?: MediaDeviceInfo;
  dispatchEvent(event: CustomEvent): boolean;
  requestUpdate(): void;
  _devices?: MediaDeviceInfo[];
}

/**
 * Controller that manages automatic device loading.
 * Loads devices when they're not present and handles device changes.
 * Reacts to updates and automatically loads devices when needed.
 */
export class DevicesController implements ReactiveController {
  host: DevicesControllerHost;
  private _autoLoadedDevices: boolean = false;
  private _loadingDevices: boolean = false;
  private _deviceChangeHandler?: () => void;
  private _initialized: boolean = false;

  constructor(host: DevicesControllerHost) {
    this.host = host;
    host.addController(this);
  }

  initialize(): void {
    this._initialized = true;
    if (this.host.devices === undefined) {
      this._loadDevices();
      this._setupDeviceChangeListener();
    }
  }

  hostDisconnected(): void {
    this._removeDeviceChangeListener();
  }

  hostUpdate(): void {
    // Only react to updates after initialization
    if (!this._initialized) {
      return;
    }

    // When devices are accessed but not present, load them
    if (this.host.devices === undefined) {
      this._loadDevices();
    }
  }

  private _setupDeviceChangeListener(): void {
    if (this._deviceChangeHandler) {
      return;
    }

    this._deviceChangeHandler = () => {
      if (this._autoLoadedDevices) {
        this._loadDevices();
      }
    };

    navigator.mediaDevices.addEventListener(
      "devicechange",
      this._deviceChangeHandler,
    );
  }

  private _removeDeviceChangeListener(): void {
    if (!this._deviceChangeHandler) {
      return;
    }

    navigator.mediaDevices.removeEventListener(
      "devicechange",
      this._deviceChangeHandler,
    );
    this._deviceChangeHandler = undefined;
  }

  private async _loadDevices(): Promise<void> {
    if (this._loadingDevices) {
      return;
    }

    this._loadingDevices = true;

    try {
      const { devices, defaultDevice } = await getAudioDevices();

      this._autoLoadedDevices = true;
      this.host._devices = devices;

      // Use selected device if it still exists, otherwise fall back to default
      const previousDevice = this.host.selectedDevice;
      const selectedDevice =
        (previousDevice &&
          devices.find((d) => d.deviceId === previousDevice.deviceId)) ??
        defaultDevice;

      this.host.selectedDevice = selectedDevice;

      this.host.requestUpdate();
      this.host.dispatchEvent(
        recordingDevicesChangedEvent(devices, selectedDevice),
      );
      this.host.dispatchEvent(readyEvent());
    } catch (error) {
      this.host.dispatchEvent(errorEvent(error));
    } finally {
      this._loadingDevices = false;
    }
  }

  /**
   * Clear the auto-loaded flag (when devices are set externally)
   */
  clearAutoLoadedFlag(): void {
    this._autoLoadedDevices = false;
  }
}
