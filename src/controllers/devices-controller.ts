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
  #autoLoadedDevices: boolean = false;
  #loadingDevices: boolean = false;
  #deviceChangeHandler?: () => void;
  #initialized: boolean = false;

  constructor(host: DevicesControllerHost) {
    this.host = host;
    host.addController(this);
  }

  initialize(): void {
    this.#initialized = true;
    if (this.host.devices === undefined) {
      this.#loadDevices();
      this.#setupDeviceChangeListener();
    }
  }

  hostDisconnected(): void {
    this.#removeDeviceChangeListener();
  }

  hostUpdate(): void {
    // Only react to updates after initialization
    if (!this.#initialized) {
      return;
    }

    // When devices are accessed but not present, load them
    if (this.host.devices === undefined) {
      this.#loadDevices();
    }
  }

  #setupDeviceChangeListener(): void {
    if (this.#deviceChangeHandler) {
      return;
    }

    this.#deviceChangeHandler = () => {
      if (this.#autoLoadedDevices) {
        this.#loadDevices();
      }
    };

    navigator.mediaDevices.addEventListener(
      "devicechange",
      this.#deviceChangeHandler,
    );
  }

  #removeDeviceChangeListener(): void {
    if (!this.#deviceChangeHandler) {
      return;
    }

    navigator.mediaDevices.removeEventListener(
      "devicechange",
      this.#deviceChangeHandler,
    );
    this.#deviceChangeHandler = undefined;
  }

  async #loadDevices(): Promise<void> {
    if (this.#loadingDevices) {
      return;
    }

    this.#loadingDevices = true;

    try {
      const { devices, defaultDevice } = await getAudioDevices();

      this.#autoLoadedDevices = true;
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
      this.#loadingDevices = false;
    }
  }

  /**
   * Clear the auto-loaded flag (when devices are set externally)
   */
  clearAutoLoadedFlag(): void {
    this.#autoLoadedDevices = false;
  }
}
