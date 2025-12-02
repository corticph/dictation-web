import { action } from "@storybook/addon-actions";
import { html, type TemplateResult } from "lit";

import "../src/components/settings-menu.js";
import "../src/contexts/dictation-context.js";

export default {
  argTypes: {
    region: {
      control: "select",
      description: "Region for loading language list",
      options: [undefined, "eu", "us"],
    },
  },
  component: "settings-menu",
  title: "SettingsMenu",
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface StoryArgs {
  region?: string;
}

export const DefaultValues: Story<StoryArgs> = ({ region }: StoryArgs) => {
  return html`
    <dictation-context-provider .region=${region}>
        <settings-menu
          @languages-changed=${action("languages-changed")}
          @recording-devices-changed=${action("recording-devices-changed")}
        ></settings-menu>
      </dictation-context-provider>
  `;
};
DefaultValues.args = {
  region: "eu",
};

export const DisabledSettings: Story<StoryArgs> = ({ region }: StoryArgs) => {
  return html`
    <dictation-context-provider .region=${region} recordingState="recording">
        <settings-menu
          @languages-changed=${action("languages-changed")}
          @recording-devices-changed=${action("recording-devices-changed")}
        ></settings-menu>
      </dictation-context-provider>
  `;
};
DisabledSettings.args = {
  region: "eu",
};

export const OnlyDeviceSelector: Story<StoryArgs> = () => {
  return html`
    <dictation-context-provider>
      <settings-menu
        settingsEnabled="device"
        @languages-changed=${action("languages-changed")}
        @recording-devices-changed=${action("recording-devices-changed")}
      ></settings-menu>
    </dictation-context-provider>
  `;
};

export const OnlyLanguageSelector: Story<StoryArgs> = ({
  region,
}: StoryArgs) => {
  return html`
    <dictation-context-provider .region=${region}>
      <settings-menu
        .settingsEnabled=${["language"]}
        @languages-changed=${action("languages-changed")}
        @recording-devices-changed=${action("recording-devices-changed")}
      ></settings-menu>
    </dictation-context-provider>
  `;
};
OnlyLanguageSelector.args = {
  region: "eu",
};

export const NoSettings: Story<StoryArgs> = ({ region }: StoryArgs) => {
  return html`
    <dictation-context-provider .region=${region}>
      <settings-menu
        .settingsEnabled=${[]}
        @languages-changed=${action("languages-changed")}
        @recording-devices-changed=${action("recording-devices-changed")}
      ></settings-menu>
    </dictation-context-provider>
  `;
};
NoSettings.args = {
  region: "eu",
};

export const WithCustomLanguages: Story<StoryArgs> = () => {
  return html`
    <dictation-context-provider
      .languages=${["en", "es", "fr", "de", "it"]}
      selectedLanguage="es"
    >
      <settings-menu
        settingsEnabled="language"
        @languages-changed=${action("languages-changed")}
        @recording-devices-changed=${action("recording-devices-changed")}
      ></settings-menu>
    </dictation-context-provider>
  `;
};

export const WithLanguagesAttribute: Story<StoryArgs> = () => {
  return html`
    <dictation-context-provider
      languages="en,da,es,fr"
      selectedLanguage="da"
    >
      <settings-menu
        settingsEnabled="language"
        @languages-changed=${action("languages-changed")}
        @recording-devices-changed=${action("recording-devices-changed")}
      ></settings-menu>
    </dictation-context-provider>
  `;
};

export const WithCustomDevices: Story<StoryArgs> = () => {
  const customDevices: MediaDeviceInfo[] = [
    {
      deviceId: "device1",
      groupId: "group1",
      kind: "audioinput",
      label: "Built-in Microphone",
      toJSON: () => ({}),
    },
    {
      deviceId: "device2",
      groupId: "group2",
      kind: "audioinput",
      label: "External USB Microphone",
      toJSON: () => ({}),
    },
  ];

  return html`
    <dictation-context-provider .devices=${customDevices}>
      <settings-menu
        settingsEnabled="device"
        @languages-changed=${action("languages-changed")}
        @recording-devices-changed=${action("recording-devices-changed")}
      ></settings-menu>
    </dictation-context-provider>
  `;
};

export const BothWithCustomOptions: Story<StoryArgs> = () => {
  const customDevices: MediaDeviceInfo[] = [
    {
      deviceId: "device1",
      groupId: "group1",
      kind: "audioinput",
      label: "Headset Microphone",
      toJSON: () => ({}),
    },
    {
      deviceId: "device2",
      groupId: "group2",
      kind: "audioinput",
      label: "Desk Microphone",
      toJSON: () => ({}),
    },
  ];

  return html`
    <dictation-context-provider
      languages="en,fr,de"
      selectedLanguage="fr"
      .devices=${customDevices}
    >
      <settings-menu
        settingsEnabled="device,language"
        @languages-changed=${action("languages-changed")}
        @recording-devices-changed=${action("recording-devices-changed")}
      ></settings-menu>
    </dictation-context-provider>
  `;
};
