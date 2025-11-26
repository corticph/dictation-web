import { action } from "@storybook/addon-actions";
import { html, type TemplateResult } from "lit";

import "../src/components-new/settings-menu.js";
import "../src/contexts/region-context.js";

export default {
  argTypes: {
    devices: {
      control: "object",
      description: "Array of available recording devices",
    },
    disabled: {
      control: "boolean",
      description: "Whether the settings should be disabled",
    },
    languages: {
      control: "object",
      description: "Array of available language codes",
    },
    onLanguagesChanged: {
      action: "languages-changed",
      description:
        "Fired when the selected language or available languages change",
    },
    onRecordingDevicesChanged: {
      action: "recording-devices-changed",
      description: "Fired when the selected device or available devices change",
    },
    region: {
      control: "select",
      description: "Region for default language list",
      options: [undefined, "eu", "us"],
      table: {
        category: "Context Provider",
      },
    },
    selectedDevice: {
      control: "object",
      description: "Currently selected recording device",
    },
    selectedLanguage: {
      control: "text",
      description: "Currently selected language code",
    },
    settingsEnabled: {
      control: "object",
      description: "Array of settings to enable (device, language)",
    },
  },
  component: "settings-menu-new",
  title: "SettingsMenuNew",
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface SettingsMenuNewArgTypes {
  region?: string;
  selectedLanguage?: string;
  languages?: string[];
  selectedDevice?: MediaDeviceInfo;
  devices?: MediaDeviceInfo[];
  disabled?: boolean;
  settingsEnabled?: string[];
}

const SettingsMenuNewTemplate: Story<SettingsMenuNewArgTypes> = ({
  region,
  selectedLanguage,
  languages,
  selectedDevice,
  devices,
  disabled,
  settingsEnabled,
}: SettingsMenuNewArgTypes) => {
  if (!settingsEnabled) {
    return html`
      <region-context-provider region=${region}>
        <settings-menu
          .selectedLanguage=${selectedLanguage}
          .languages=${languages}
          .selectedDevice=${selectedDevice}
          .devices=${devices}
          ?disabled=${disabled}
          @languages-changed=${action("languages-changed")}
          @recording-devices-changed=${action("recording-devices-changed")}
        ></settings-menu>
      </region-context-provider>
  `;
  }

  return html`
      <region-context-provider region=${region}>
        <settings-menu
          .selectedLanguage=${selectedLanguage}
          .languages=${languages}
          .selectedDevice=${selectedDevice}
          .devices=${devices}
          ?disabled=${disabled}
          .settingsEnabled=${settingsEnabled}
          @languages-changed=${action("languages-changed")}
          @recording-devices-changed=${action("recording-devices-changed")}
        ></settings-menu>
      </region-context-provider>
  `;
};

export const Default = SettingsMenuNewTemplate.bind({});
Default.args = {
  disabled: false,
  selectedLanguage: "en",
};

export const DisabledSettings = SettingsMenuNewTemplate.bind({});
DisabledSettings.args = {
  disabled: true,
  selectedLanguage: "en",
  settingsEnabled: ["device", "language"],
};

export const OnlyDeviceSelector = SettingsMenuNewTemplate.bind({});
OnlyDeviceSelector.args = {
  disabled: false,
  settingsEnabled: ["device"],
};

export const OnlyLanguageSelector = SettingsMenuNewTemplate.bind({});
OnlyLanguageSelector.args = {
  disabled: false,
  selectedLanguage: "en",
  settingsEnabled: ["language"],
};

export const USRegion = SettingsMenuNewTemplate.bind({});
USRegion.args = {
  disabled: false,
  region: "us",
  selectedLanguage: "en",
  settingsEnabled: ["device", "language"],
};

export const NoSettings = SettingsMenuNewTemplate.bind({});
NoSettings.args = {
  disabled: false,
  selectedLanguage: "en",
  settingsEnabled: [],
};

export const CustomLanguages = SettingsMenuNewTemplate.bind({});
CustomLanguages.args = {
  disabled: false,
  languages: ["en", "es", "fr", "de", "it"],
  selectedLanguage: "es",
  settingsEnabled: ["language"],
};

export const WithCustomDevices = SettingsMenuNewTemplate.bind({});
WithCustomDevices.args = {
  devices: [
    {
      deviceId: "device1",
      groupId: "group1",
      kind: "audioinput",
      label: "Built-in Microphone",
    } as MediaDeviceInfo,
    {
      deviceId: "device2",
      groupId: "group2",
      kind: "audioinput",
      label: "External USB Microphone",
    } as MediaDeviceInfo,
  ],
  disabled: false,
  settingsEnabled: ["device"],
};

export const BothWithCustomOptions = SettingsMenuNewTemplate.bind({});
BothWithCustomOptions.args = {
  devices: [
    {
      deviceId: "device1",
      groupId: "group1",
      kind: "audioinput",
      label: "Headset Microphone",
    } as MediaDeviceInfo,
    {
      deviceId: "device2",
      groupId: "group2",
      kind: "audioinput",
      label: "Desk Microphone",
    } as MediaDeviceInfo,
  ],
  disabled: false,
  languages: ["en", "fr", "de"],
  selectedLanguage: "fr",
  settingsEnabled: ["device", "language"],
};
