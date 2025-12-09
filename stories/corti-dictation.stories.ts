import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import { action } from "storybook/actions";

import "../src/components/audio-visualiser.js";
import type { CortiDictation } from "../src/components/corti-dictation.js";
import {
  LANGUAGES_SUPPORTED_EU,
  LANGUAGES_SUPPORTED_US,
} from "../src/constants.js";
import DeviceSelectorStoryMeta from "./device-selector.stories.js";
import LanguageSelectorStoryMeta from "./language-selector.stories.js";
import SettingsMeunStoryMeta from "./settings-menu.stories.js";

import "../src/components/corti-dictation.js";
import { disableControls, mockDevices } from "./helpers.js";

type CortiDictationStory = Omit<CortiDictation, "selectedDevice"> & {
  selectedDevice?: string;
};

const languages = Array.from(
  new Set([...LANGUAGES_SUPPORTED_EU, ...LANGUAGES_SUPPORTED_US]),
);

const meta = {
  argTypes: {
    accessToken: {
      control: "text",
      description: "Access token for authentication (required to render)",
    },
    allowButtonFocus: {
      control: "boolean",
      description:
        "Whether the recording button inside the corti-dictation component can take focus on click",
    },
    devices: DeviceSelectorStoryMeta.argTypes.devices,
    languagesSupported: LanguageSelectorStoryMeta.argTypes.languages,
    settingsEnabled: SettingsMeunStoryMeta.argTypes.settingsEnabled,
  },
  component: "corti-dictation",
  render: ({
    accessToken,
    settingsEnabled,
    languagesSupported,
    allowButtonFocus,
    devices,
    selectedDevice,
  }) => {
    const settingsEnabledValue =
      settingsEnabled === undefined ? nothing : settingsEnabled;
    const languagesSupportedValue =
      languagesSupported === undefined ? nothing : languagesSupported;
    const devicesValue = devices ?? nothing;
    const selectedDeviceValue = selectedDevice
      ? mockDevices.find((device) => device.deviceId === selectedDevice)
      : nothing;

    return html`
      <corti-dictation
        .accessToken=${accessToken}
        settingsEnabled=${settingsEnabledValue}
        languagesSupported=${languagesSupportedValue}
        allowButtonFocus=${allowButtonFocus}
        .devices=${devicesValue}
        .selectedDevice=${selectedDeviceValue}
        @languages-changed=${action("languages-changed")}
        @recording-devices-changed=${action("recording-devices-changed")}
        @stream-closed=${action("stream-closed")}
        @usage=${action("usage")}
        @transcript=${action("transcript")}
        @command=${action("command")}
        @ready=${action("ready")}
        @audio-level-changed=${action("audio-level-changed")}
        @recording-state-changed=${action("recording-state-changed")}
        @network-activity=${action("network-activity")}
        @error=${action("error")}
      ></corti-dictation>
    `;
  },
  title: "CortiDictation",
} satisfies Meta<CortiDictationStory>;

export default meta;

export const Default = {
  args: {
    accessToken: "dummy_token",
    allowButtonFocus: false,
    languagesSupported: languages,
    settingsEnabled: ["device", "language"],
  },
} as StoryObj<CortiDictationStory>;

export const OnlyLanguageSettings = {
  args: {
    accessToken: "dummy_token",
    languagesSupported: languages,
    settingsEnabled: ["language"],
  },
  argTypes: disableControls(["settingsEnabled", "devices"]),
};

export const OnlyDeviceSettings = {
  args: {
    accessToken: "dummy_token",
    settingsEnabled: ["device"],
  },
  argTypes: disableControls(["settingsEnabled", "languagesSupported"]),
};

export const NoSettings = {
  args: {
    accessToken: "dummy_token",
    settingsEnabled: [],
  },
  argTypes: disableControls([
    "settingsEnabled",
    "devices",
    "languagesSupported",
  ]),
};

export const WithCustomLanguages = {
  args: {
    accessToken: "dummy_token",
    languagesSupported: ["en", "es", "fr", "de"],
    settingsEnabled: ["language", "device"],
  },
  argTypes: disableControls(["languagesSupported", "settingsEnabled"]),
};
export const WithCustomDevices = {
  args: {
    accessToken: "dummy_token",
    devices: mockDevices,
    languagesSupported: languages,
    settingsEnabled: ["language", "device"],
  },
  argTypes: {
    selectedDevice: {
      control: "select",
      description: "The currently selected audio input device.",
      options: mockDevices.map((device) => device.deviceId),
    },
    ...disableControls(["devices", "settingsEnabled"]),
  },
};
