import { action } from "@storybook/addon-actions";
import { html, type TemplateResult } from "lit";
import "../src/components/device-selector.js";

export default {
  argTypes: {
    devices: {
      description: "Array of available devices (auto-loaded if not provided)",
      table: {
        type: { summary: "MediaDeviceInfo[]" },
      },
    },
    onRecordingDevicesChanged: {
      action: "recording-devices-changed",
      description: "Fired when the selected device or available devices change",
    },
    selectedDevice: {
      description: "Currently selected device",
      table: {
        type: { summary: "MediaDeviceInfo" },
      },
    },
  },
  component: "device-selector",
  title: "DeviceSelector",
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface DeviceSelectorArgTypes {
  devices?: MediaDeviceInfo[];
  selectedDevice?: MediaDeviceInfo;
}

const DeviceSelectorTemplate: Story<DeviceSelectorArgTypes> = ({
  devices,
}: DeviceSelectorArgTypes) => {
  if (devices) {
    return html`
      <div style="padding: 20px; max-width: 300px;">
        <device-selector
          .devices=${devices}
          @recording-devices-changed=${action("recording-devices-changed")}
        ></device-selector>
      </div>
    `;
  }

  return html`
    <div style="padding: 20px; max-width: 300px;">
      <device-selector
        @recording-devices-changed=${action("recording-devices-changed")}
      ></device-selector>
    </div>
  `;
};

export const Default = DeviceSelectorTemplate.bind({});
Default.args = {};

export const CustomDevices = DeviceSelectorTemplate.bind({});
CustomDevices.args = {
  devices: [
    {
      deviceId: "device1",
      groupId: "group1",
      kind: "audioinput",
      label: "Custom Microphone 1",
    },
    {
      deviceId: "device2",
      groupId: "group1",
      kind: "audioinput",
      label: "Custom Microphone 2",
    },
  ] as MediaDeviceInfo[],
};
