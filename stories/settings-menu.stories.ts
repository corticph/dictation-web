import { action } from "@storybook/addon-actions";
import { html, type TemplateResult } from "lit";

import "../src/components/settings-menu.js";
import "../src/contexts/dictation-context.js";

export default {
  component: "settings-menu",
  title: "SettingsMenu",
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

type StoryArgs = Record<string, never>;

export const DefaultValues: Story<StoryArgs> = () => {
  return html`
    <dictation-context-provider>
      <settings-menu
        @languages-changed=${action("languages-changed")}
        @recording-devices-changed=${action("recording-devices-changed")}
        @ready=${action("ready")}
        @error=${action("error")}
      ></settings-menu>
    </dictation-context-provider>
  `;
};

export const DisabledSettings: Story<StoryArgs> = () => {
  return html`
    <dictation-context-provider recordingState="recording">
      <settings-menu
        @languages-changed=${action("languages-changed")}
        @recording-devices-changed=${action("recording-devices-changed")}
        @ready=${action("ready")}
        @error=${action("error")}
      ></settings-menu>
    </dictation-context-provider>
  `;
};

export const OnlyDeviceSelector: Story<StoryArgs> = () => {
  return html`
    <dictation-context-provider>
      <settings-menu
        settingsEnabled="device"
        @languages-changed=${action("languages-changed")}
        @recording-devices-changed=${action("recording-devices-changed")}
        @ready=${action("ready")}
        @error=${action("error")}
      ></settings-menu>
    </dictation-context-provider>
  `;
};

export const OnlyLanguageSelector: Story<StoryArgs> = () => {
  return html`
    <dictation-context-provider>
      <settings-menu
        .settingsEnabled=${["language"]}
        @languages-changed=${action("languages-changed")}
        @recording-devices-changed=${action("recording-devices-changed")}
        @ready=${action("ready")}
        @error=${action("error")}
      ></settings-menu>
    </dictation-context-provider>
  `;
};

export const NoSettings: Story<StoryArgs> = () => {
  return html`
    <dictation-context-provider>
      <settings-menu
        .settingsEnabled=${[]}
        @languages-changed=${action("languages-changed")}
        @recording-devices-changed=${action("recording-devices-changed")}
        @ready=${action("ready")}
        @error=${action("error")}
      ></settings-menu>
    </dictation-context-provider>
  `;
};

export const WithCustomLanguages: Story<StoryArgs> = () => {
  return html`
    <dictation-context-provider .languages=${["en", "es", "fr", "de", "it"]}>
      <settings-menu
        settingsEnabled="language"
        @languages-changed=${action("languages-changed")}
        @recording-devices-changed=${action("recording-devices-changed")}
        @ready=${action("ready")}
        @error=${action("error")}
      ></settings-menu>
    </dictation-context-provider>
  `;
};

export const WithLanguagesAttribute: Story<StoryArgs> = () => {
  return html`
    <dictation-context-provider languages="en,da,es,fr">
      <settings-menu
        settingsEnabled="language"
        @languages-changed=${action("languages-changed")}
        @recording-devices-changed=${action("recording-devices-changed")}
        @ready=${action("ready")}
        @error=${action("error")}
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
        @ready=${action("ready")}
        @error=${action("error")}
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
    <dictation-context-provider languages="en,fr,de" .devices=${customDevices}>
      <settings-menu
        settingsEnabled="device,language"
        @languages-changed=${action("languages-changed")}
        @recording-devices-changed=${action("recording-devices-changed")}
        @ready=${action("ready")}
        @error=${action("error")}
      ></settings-menu>
    </dictation-context-provider>
  `;
};
