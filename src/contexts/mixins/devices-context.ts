import { type ContextEvent, createContext, provide } from "@lit/context";
import type { LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { DevicesController } from "../../controllers/devices-controller.js";
import type { Constructor } from "./types.js";

export const devicesContext = createContext<MediaDeviceInfo[] | undefined>(
  Symbol("devices"),
);

export const selectedDeviceContext = createContext<MediaDeviceInfo | undefined>(
  Symbol("selectedDevice"),
);

export declare class DevicesContextInterface {
  _devices?: MediaDeviceInfo[];
  devices?: MediaDeviceInfo[];
  selectedDevice?: MediaDeviceInfo;
}

export function DevicesContextMixin<T extends Constructor<LitElement>>(
  superclass: T,
): Constructor<DevicesContextInterface> & T {
  class DevicesContextMixinClass extends superclass {
    #devicesController = new DevicesController(this);

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

    constructor(...args: any[]) {
      super(...args);

      this.addEventListener("recording-devices-changed", (e: Event) => {
        const event = e as CustomEvent;

        this.selectedDevice = event.detail.selectedDevice;
      });
      this.addEventListener("context-request", (ev: ContextEvent<any>) => {
        if (ev.context === devicesContext) {
          this.#devicesController.initialize();
        }
      });
    }
  }

  return DevicesContextMixinClass as Constructor<DevicesContextInterface> & T;
}
