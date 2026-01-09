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
    languagesSupported: languages,
    pushToTalkKeybinding: "Space",
    settingsEnabled: ["device", "language"],
    toggleToTalkKeybinding: "`",
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
    languagesSupported: LanguageSelectorStoryMeta.argTypes.languages,
    pushToTalkKeybinding: {
      control: "text",
      description:
        "Push-to-talk keyboard shortcut (keydown starts, keyup stops). Single key only (e.g., 'Space', 'k', 'KeyK')",
    },
    settingsEnabled: SettingsMeunStoryMeta.argTypes.settingsEnabled,
    toggleToTalkKeybinding: {
      control: "text",
      description:
        "Toggle-to-talk keyboard shortcut (press toggles). Single key only (e.g., '`', 'k', 'KeyK', 'Backquote')",
    },
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
    pushToTalkKeybinding,
    toggleToTalkKeybinding,
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
        pushToTalkKeybinding=${pushToTalkKeybinding}
        toggleToTalkKeybinding=${toggleToTalkKeybinding}
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

export const Default = {
  args: {
    pushToTalkKeybinding: "`",
    settingsEnabled: ["device", "language", "keybinding"],
    toggleToTalkKeybinding: "Space",
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

export const WithKeybindings = {
  args: {
    accessToken: "dummy_token",
    languagesSupported: languages,
    pushToTalkKeybinding: "Space",
    settingsEnabled: ["device", "language", "keybinding"],
    toggleToTalkKeybinding: "k",
  },
  argTypes: disableControls(["settingsEnabled"]),
};
