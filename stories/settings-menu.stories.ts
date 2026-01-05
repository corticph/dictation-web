import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import { action } from "storybook/actions";
import type { DictationSettingsMenu } from "../src/components/settings-menu.js";

import "../src/components/settings-menu.js";
import "../src/contexts/dictation-context.js";
import type { DictationRoot } from "../src/contexts/dictation-context.js";
import DeviceSelectorStoryMeta, {
  type DeviceSelectorStory,
  WithCustomDevices as WithCustomDevicesDeviceSelectorStory,
} from "./device-selector.stories.js";
import { disableControls, languages, mockDevices } from "./helpers.js";
import LangaugeSelectorStoryMeta, {
  type LanguageSelectorStory,
} from "./language-selector.stories.js";

type SettingsMenuStory = DictationSettingsMenu &
  LanguageSelectorStory &
  DeviceSelectorStory &
  Pick<DictationRoot, "recordingState" | "mode" | "keybinding">;

const meta = {
  args: {
    disabled: false,
    keybinding: "`",
    languages,
    mode: "toggle-to-talk",
    recordingState: "stopped",
    settingsEnabled: ["device", "language"],
  },
  argTypes: {
    ...DeviceSelectorStoryMeta.argTypes,
    ...LangaugeSelectorStoryMeta.argTypes,
    ...{
      disabled: {
        control: false,
        table: { disable: true },
      },
      keybinding: {
        control: "text",
        description:
          "Keyboard shortcut for starting/stopping recording (single key only, e.g., 'k', '`', 'KeyK', 'Backquote')",
      },
      mode: {
        control: "select",
        description: "Dictation mode: toggle-to-talk or push-to-talk",
        options: ["toggle-to-talk", "push-to-talk"],
      },
      recordingState: {
        control: false,
        table: { disable: true },
      },
    },
    settingsEnabled: {
      control: "check",
      description: "Which settings to enable in the settings menu",
      options: ["device", "language", "mode", "keybinding"],
    },
  },
  component: "dictation-settings-menu",
  render: ({
    devices,
    languages,
    selectedDevice,
    settingsEnabled,
    recordingState,
    mode,
    keybinding,
  }) => {
    const selectedDeviceValue = selectedDevice
      ? mockDevices.find((device) => device.deviceId === selectedDevice)
      : nothing;

    return html`
      <dictation-root
        .devices=${devices}
        .selectedDevice=${selectedDeviceValue}
        languages=${languages}
        .recordingState=${recordingState}
        mode=${mode}
        keybinding=${keybinding}
      >
        <dictation-settings-menu
          settingsEnabled=${settingsEnabled}
          @mode-changed=${action("mode-changed")}
          @keybinding-changed=${action("keybinding-changed")}
          @languages-changed=${action("languages-changed")}
          @recording-devices-changed=${action("recording-devices-changed")}
          @ready=${action("ready")}
          @error=${action("error")}
        />
      </dictation-root>
  `;
  },
  title: "SettingsMenu",
} satisfies Meta<SettingsMenuStory>;

export default meta;

export const Default = {} as StoryObj<SettingsMenuStory>;

export const Recording = {
  args: {
    recordingState: "recording",
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
  },
  argTypes: disableControls(["languages"]),
} as StoryObj<SettingsMenuStory>;

export const WithCustomDevices = {
  args: {
    devices: mockDevices,
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

export const WithModeAndKeybinding = {
  args: {
    keybinding: "k",
    mode: "toggle-to-talk",
    settingsEnabled: ["device", "language", "mode", "keybinding"],
  },
  argTypes: disableControls(["settingsEnabled"]),
} as StoryObj<SettingsMenuStory>;

export const OnlyModeSelector = {
  args: {
    settingsEnabled: ["mode"],
  },
  argTypes: disableControls(["settingsEnabled", "devices", "languages"]),
} as StoryObj<SettingsMenuStory>;

export const OnlyKeybindingSelector = {
  args: {
    settingsEnabled: ["keybinding"],
  },
  argTypes: disableControls(["settingsEnabled", "devices", "languages"]),
} as StoryObj<SettingsMenuStory>;
