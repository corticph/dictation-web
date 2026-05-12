import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import { action } from "storybook/actions";

import "../src/components/audio-visualiser.js";
import type { CortiAmbient } from "../src/components/corti-ambient.js";

import DeviceSelectorStoryMeta from "./device-selector.stories.js";
import LanguageSelectorStoryMeta from "./language-selector.stories.js";
import SettingsMeunStoryMeta from "./settings-menu.stories.js";

import "../src/components/corti-ambient.js";
import { disableControls, languages, mockDevices } from "./helpers.js";

type CortiAmbientStory = Omit<CortiAmbient, "selectedDevice"> & {
  selectedDevice?: string;
};

const meta = {
  args: {
    accessToken: "dummy_token",
    allowButtonFocus: false,
    interactionId: "9254ec9b-70e6-45d1-bacb-63d6cce19e86",
    languagesSupported: languages,
    pushToTalkKeybinding: "Space",
    settingsEnabled: ["device", "language", "keybinding"],
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
        "Whether the recording button inside corti-ambient can take focus on click",
    },
    devices: DeviceSelectorStoryMeta.argTypes.devices,
    interactionId: {
      control: "text",
      description:
        "Stream interaction id passed to Corti stream.connect for this session",
    },
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
  component: "corti-ambient",
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
    interactionId,
  }) => {
    const selectedDeviceValue = selectedDevice
      ? mockDevices.find((device) => device.deviceId === selectedDevice)
      : nothing;

    const interaction = interactionId?.trim() || undefined;

    return html`
      <corti-ambient
        .accessToken=${accessToken}
        .interactionId=${interaction}
        settingsEnabled=${settingsEnabled}
        languagesSupported=${languagesSupported}
        ?allowButtonFocus=${allowButtonFocus}
        .devices=${devices}
        .selectedDevice=${selectedDeviceValue}
        pushToTalkKeybinding=${pushToTalkKeybinding}
        toggleToTalkKeybinding=${toggleToTalkKeybinding}
        @command=${action("command")}
        @delta-usage=${action("delta-usage")}
        @error=${action("error")}
        @facts=${action("facts")}
        @keybinding-changed=${action("keybinding-changed")}
        @languages-changed=${action("languages-changed")}
        @network-activity=${action("network-activity")}
        @ready=${action("ready")}
        @recording-devices-changed=${action("recording-devices-changed")}
        @recording-state-changed=${action("recording-state-changed")}
        @stream-closed=${action("stream-closed")}
        @transcript=${action("transcript")}
        @usage=${action("usage")}
        @audio-level-changed=${action("audio-level-changed")}
      />
    `;
  },
  title: "CortiAmbient",
} satisfies Meta<CortiAmbientStory>;

export default meta;

export const Default = {} satisfies StoryObj<CortiAmbientStory>;

export const NoSettings = {
  args: {
    accessToken: "dummy_token",
    interactionId: "9254ec9b-70e6-45d1-bacb-63d6cce19e86",
    settingsEnabled: [],
  },
  argTypes: disableControls([
    "settingsEnabled",
    "devices",
    "languagesSupported",
  ]),
} satisfies StoryObj<CortiAmbientStory>;
