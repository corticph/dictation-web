import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { action } from "storybook/actions";
import type { SettingsMenu } from "../src/components/settings-menu.js";

import "../src/components/settings-menu.js";
import "../src/contexts/dictation-context.js";
import type { DictationContext } from "../src/contexts/dictation-context.js";
import DeviceSelectorStoryMeta, {
  type DeviceSelectorStory,
  WithCustomDevices as WithCustomDevicesDeviceSelectorStory,
} from "./device-selector.stories.js";
import { disableControls, mockDevices } from "./helpers.js";
import LangaugeSelectorStoryMeta, {
  type LanguageSelectorStory,
} from "./language-selector.stories.js";

type SettingsMenuStory = SettingsMenu &
  LanguageSelectorStory &
  DeviceSelectorStory &
  Pick<DictationContext, "recordingState">;

const meta = {
  argTypes: {
    ...DeviceSelectorStoryMeta.argTypes,
    ...LangaugeSelectorStoryMeta.argTypes,
    ...{
      disabled: {
        control: false,
        table: { disable: true },
      },
      recordingState: {
        control: false,
        table: { disable: true },
      },
    },
    settingsEnabled: {
      control: "check",
      description: "Which settings to enable in the settings menu",
      options: ["device", "language"],
    },
  },
  component: "settings-menu",
  render: ({
    devices,
    languages,
    selectedDevice,
    settingsEnabled,
    recordingState,
  }) => {
    const devicesValue = devices ?? nothing;
    const selectedDeviceValue = selectedDevice
      ? mockDevices.find((device) => device.deviceId === selectedDevice)
      : nothing;

    const languagesValue = languages?.length ? languages.join(",") : nothing;
    const settingsEnabledValue =
      settingsEnabled === undefined ? nothing : settingsEnabled.join(",");

    return html`
      <dictation-context-provider
        .devices=${devicesValue}
        .selectedDevice=${selectedDeviceValue}
        languages=${languagesValue}
        .recordingState=${recordingState}>
        <settings-menu
          settingsEnabled=${settingsEnabledValue}
          @languages-changed=${action("languages-changed")}
          @recording-devices-changed=${action("recording-devices-changed")}
          @ready=${action("ready")}
          @error=${action("error")}
        ></settings-menu>
      </dictation-context-provider>
  `;
  },
  title: "SettingsMenu",
} satisfies Meta<SettingsMenuStory>;

export default meta;

export const Default = {
  args: {
    disabled: false,
    recordingState: "stopped",
    settingsEnabled: ["device", "language"],
  },
} as StoryObj<SettingsMenuStory>;

export const Recording = {
  args: {
    recordingState: "recording",
    settingsEnabled: ["device", "language"],
  },
} as StoryObj<SettingsMenuStory>;

export const OnlyDeviceSelector = {
  args: {
    settingsEnabled: ["device"],
  },
  argTypes: disableControls(["settingsEnabled", "languages"]),
} as StoryObj<SettingsMenuStory>;

export const OnlyLanguageSelector = {
  args: {
    settingsEnabled: ["language"],
  },
  argTypes: disableControls(["settingsEnabled", "devices"]),
} as StoryObj<SettingsMenuStory>;

export const NoSettings = {
  args: {
    settingsEnabled: [],
  },
  argTypes: disableControls(["settingsEnabled", "devices", "languages"]),
} as StoryObj<SettingsMenuStory>;

export const WithCustomLanguages = {
  args: {
    languages: ["en", "es", "fr", "de", "it"],
    settingsEnabled: ["language", "device"],
  },
  argTypes: disableControls(["languages"]),
} as StoryObj<SettingsMenuStory>;

export const WithCustomDevices = {
  args: {
    devices: mockDevices,
    settingsEnabled: ["device", "language"],
  },
  argTypes: WithCustomDevicesDeviceSelectorStory.argTypes,
} as StoryObj<SettingsMenuStory>;

export const BothWithCustomOptions = {
  args: {
    ...WithCustomLanguages.args,
    ...WithCustomDevices.args,
  },
  argTypes: {
    ...WithCustomLanguages.argTypes,
    ...WithCustomDevices.argTypes,
  },
} as StoryObj<SettingsMenuStory>;
