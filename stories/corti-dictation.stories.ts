import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import { action } from "storybook/actions";

import "../src/components/audio-visualiser.js";
import type { CortiDictation } from "../src/components/corti-dictation.js";

import DeviceSelectorStoryMeta from "./device-selector.stories.js";
import LanguageSelectorStoryMeta from "./language-selector.stories.js";
import SettingsMeunStoryMeta from "./settings-menu.stories.js";

import "../src/components/corti-dictation.js";
import { disableControls, languages, mockDevices } from "./helpers.js";

type CortiDictationStory = Omit<CortiDictation, "selectedDevice"> & {
  selectedDevice?: string;
};

const meta = {
  args: {
    accessToken: "dummy_token",
    allowButtonFocus: false,
    keybinding: "`",
    languagesSupported: languages,
    mode: "toggle-to-talk",
    settingsEnabled: ["device", "language"],
  },
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
    keybinding: {
      control: "text",
      description:
        "Keyboard shortcut for starting/stopping recording (single key only, e.g., 'k', '`', 'KeyK', 'Backquote')",
    },
    languagesSupported: LanguageSelectorStoryMeta.argTypes.languages,
    mode: {
      control: "select",
      description: "Dictation mode: toggle-to-talk or push-to-talk",
      options: ["toggle-to-talk", "push-to-talk"],
    },
    settingsEnabled: SettingsMeunStoryMeta.argTypes.settingsEnabled,
  },
  component: "corti-dictation",
  parameters: {
    docs: {
      codePanel: true,
    },
  },
  render: ({
    accessToken,
    settingsEnabled,
    languagesSupported,
    allowButtonFocus,
    devices,
    selectedDevice,
    mode,
    keybinding,
  }) => {
    const selectedDeviceValue = selectedDevice
      ? mockDevices.find((device) => device.deviceId === selectedDevice)
      : nothing;

    return html`
      <corti-dictation
        .accessToken=${accessToken}
        settingsEnabled=${settingsEnabled}
        languagesSupported=${languagesSupported}
        ?allowButtonFocus=${allowButtonFocus}
        .devices=${devices}
        .selectedDevice=${selectedDeviceValue}
        mode=${mode}
        keybinding=${keybinding}
        @mode-changed=${action("mode-changed")}
        @keybinding-changed=${action("keybinding-changed")}
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
      />
    `;
  },
  title: "CortiDictation",
} satisfies Meta<CortiDictationStory>;

export default meta;

export const Default = {} as StoryObj<CortiDictationStory>;

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

export const WithModeAndKeybinding = {
  args: {
    accessToken: "dummy_token",
    keybinding: "k",
    languagesSupported: languages,
    mode: "toggle-to-talk",
    settingsEnabled: ["device", "language", "mode", "keybinding"],
  },
  argTypes: disableControls(["settingsEnabled"]),
};

export const PushToTalkMode = {
  args: {
    accessToken: "dummy_token",
    keybinding: "`",
    languagesSupported: languages,
    mode: "push-to-talk",
    settingsEnabled: ["device", "language", "mode", "keybinding"],
  },
  argTypes: disableControls(["settingsEnabled", "mode"]),
};
