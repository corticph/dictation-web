import { action } from "@storybook/addon-actions";
import { html, type TemplateResult } from "lit";

import "../src/components-new/corti-dictation.js";

export default {
  argTypes: {
    audioLevel: {
      control: { max: 1, min: 0, step: 0.01, type: "range" },
      description: "Audio level from 0 to 1",
    },
    languages: {
      control: "object",
      description: "Custom array of available language codes",
    },
    onDeviceChanged: {
      action: "device-changed",
      description: "Fired when device selection changes",
    },
    onLanguagesChanged: {
      action: "languages-changed",
      description: "Fired when language selection changes",
    },
    onToggleRecording: {
      action: "toggle-recording",
      description: "Fired when recording button is clicked",
    },
    recordingState: {
      control: "select",
      description: "Current recording state",
      options: ["stopped", "initializing", "recording", "stopping"],
    },
    region: {
      control: "select",
      description: "Region for default language list",
      options: [undefined, "eu", "us"],
    },
    selectedLanguage: {
      control: "text",
      description: "Currently selected language code",
    },
    settingsEnabled: {
      control: "object",
      description: "Array of enabled settings (device, language)",
      defaultValue: ["device", "language"],
    },
  },
  component: "corti-dictation",
  title: "CortiDictation",
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface CortiDictationArgTypes {
  recordingState?: "stopped" | "initializing" | "recording" | "stopping";
  audioLevel?: number;
  region?: string;
  selectedLanguage?: string;
  languages?: string[];
  settingsEnabled?: ("device" | "language")[];
}

const CortiDictationTemplate: Story<CortiDictationArgTypes> = ({
  recordingState = "stopped",
  audioLevel = 0,
  region,
  selectedLanguage,
  languages,
  settingsEnabled = ["device", "language"],
}: CortiDictationArgTypes) => {
  return html`
    <div style="padding: 20px;">
      <corti-dictation
        .recordingState=${recordingState}
        .audioLevel=${audioLevel}
        .region=${region}
        .selectedLanguage=${selectedLanguage}
        .languages=${languages}
        .settingsEnabled=${settingsEnabled}
        @toggle-recording=${action("toggle-recording")}
        @languages-changed=${action("languages-changed")}
        @device-changed=${action("device-changed")}
      ></corti-dictation>
    </div>
  `;
};

export const Default = CortiDictationTemplate.bind({});
Default.args = {
  audioLevel: 0,
  recordingState: "stopped",
  settingsEnabled: ["device", "language"],
};

export const Recording = CortiDictationTemplate.bind({});
Recording.args = {
  audioLevel: 0.5,
  recordingState: "recording",
  settingsEnabled: ["device", "language"],
};

export const Initializing = CortiDictationTemplate.bind({});
Initializing.args = {
  audioLevel: 0,
  recordingState: "initializing",
  settingsEnabled: ["device", "language"],
};

export const WithRegion = CortiDictationTemplate.bind({});
WithRegion.args = {
  recordingState: "stopped",
  region: "us",
  selectedLanguage: "en",
  settingsEnabled: ["device", "language"],
};

export const OnlyLanguageSettings = CortiDictationTemplate.bind({});
OnlyLanguageSettings.args = {
  recordingState: "stopped",
  settingsEnabled: ["language"],
};

export const OnlyDeviceSettings = CortiDictationTemplate.bind({});
OnlyDeviceSettings.args = {
  recordingState: "stopped",
  settingsEnabled: ["device"],
};

export const NoSettings = CortiDictationTemplate.bind({});
NoSettings.args = {
  recordingState: "stopped",
  settingsEnabled: [],
};
