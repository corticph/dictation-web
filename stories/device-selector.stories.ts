import { action } from "@storybook/addon-actions";
import { html, type TemplateResult } from "lit";
import "../src/components/device-selector.js";
import "../src/contexts/dictation-context.js";

export default {
  component: "device-selector",
  title: "DeviceSelector",
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

type StoryArgs = {};

export const DefaultValues: Story<StoryArgs> = () => {
  return html`
    <dictation-context-provider ?noWrapper=${true}>
        <device-selector
          @recording-devices-changed=${action("recording-devices-changed")}
        @error=${action("error")}
        ></device-selector>
    </dictation-context-provider>
    `;
};

export const WithSelectedDevice: Story<StoryArgs> = () => {
  const mockDevice: MediaDeviceInfo = {
    deviceId: "mock-device-1",
    groupId: "group1",
    kind: "audioinput",
    label: "Mock Microphone",
    toJSON: () => ({}),
  };

  return html`
    <dictation-context-provider
      .selectedDevice=${mockDevice}
      ?noWrapper=${true}
    >
      <device-selector
        @recording-devices-changed=${action("recording-devices-changed")}
        @error=${action("error")}
      ></device-selector>
    </dictation-context-provider>
  `;
};

export const WithCustomDevices: Story<StoryArgs> = () => {
  const customDevices: MediaDeviceInfo[] = [
    {
      deviceId: "device1",
      groupId: "group1",
      kind: "audioinput",
      label: "Custom Microphone 1",
      toJSON: () => ({}),
    },
    {
      deviceId: "device2",
      groupId: "group1",
      kind: "audioinput",
      label: "Custom Microphone 2",
      toJSON: () => ({}),
    },
    {
      deviceId: "device3",
      groupId: "group1",
      kind: "audioinput",
      label: "Custom Microphone 3",
      toJSON: () => ({}),
    },
  ];

  return html`
    <dictation-context-provider .devices=${customDevices} ?noWrapper=${true}>
      <device-selector
        @recording-devices-changed=${action("recording-devices-changed")}
        @error=${action("error")}
      ></device-selector>
    </dictation-context-provider>
  `;
};
