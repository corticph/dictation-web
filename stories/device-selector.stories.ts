import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import { action } from "storybook/actions";
import type { DictationDeviceSelector } from "../src/components/device-selector.js";

import "../src/components/device-selector.js";
import "../src/contexts/dictation-context.js";
import type { DictationRoot } from "../src/contexts/dictation-context.js";
import { disableControls, mockDevices } from "./helpers.js";

export type DeviceSelectorStory = DictationDeviceSelector &
  Pick<DictationRoot, "devices"> & { selectedDevice?: string };

const meta = {
  args: {
    disabled: false,
  },
  argTypes: {
    devices: {
      control: "object",
      description:
        "List of available audio input devices. If not provided, devices will be auto-loaded.",
    },
    disabled: {
      control: "boolean",
      description: "Whether the device selector is disabled",
    },
  },
  component: "dictation-device-selector",
  render: ({ devices, disabled, selectedDevice }) => {
    const devicesValue = devices ?? nothing;
    const selectedDeviceValue = selectedDevice
      ? mockDevices.find((device) => device.deviceId === selectedDevice)
      : nothing;

    return html`
      <dictation-root .devices=${devicesValue} .selectedDevice=${selectedDeviceValue} ?noWrapper=${true}>
        <dictation-device-selector
          ?disabled=${disabled}
          @recording-devices-changed=${action("recording-devices-changed")}
          @ready=${action("ready")}
          @error=${action("error")}
        />
      </dictation-root>
    `;
  },
  title: "DeviceSelector",
} satisfies Meta<DeviceSelectorStory>;
export default meta;

export const Default = {} as StoryObj<DeviceSelectorStory>;

export const Disabled = {
  args: {
    disabled: true,
  },
  argTypes: disableControls(["disabled"]),
} as StoryObj<DeviceSelectorStory>;

export const WithCustomDevices = {
  args: {
    devices: mockDevices,
    disabled: false,
  },
  argTypes: {
    selectedDevice: {
      control: "select",
      description: "The currently selected audio input device.",
      options: mockDevices.map((device) => device.deviceId),
    },
    ...disableControls(["devices"]),
  },
} as StoryObj<DeviceSelectorStory>;
