import { action } from "@storybook/addon-actions";
import { html, type TemplateResult } from "lit";

import "../src/components-new/corti-dictation.js";

export default {
  argTypes: {
    region: {
      control: "select",
      description: "Region for default language list",
      options: [undefined, "eu", "us"],
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

interface StoryArgs {
  region?: string;
}

export const DefaultValues: Story<StoryArgs> = ({ region }: StoryArgs) => {
  return html`
    <corti-dictation
      .region=${region}
      @toggle-recording=${action("toggle-recording")}
      @languages-changed=${action("languages-changed")}
      @recording-devices-changed=${action("recording-devices-changed")}
    ></corti-dictation>
  `;
};
DefaultValues.args = {
  region: "eu",
};


export const USRegion: Story<StoryArgs> = ({ region }: StoryArgs) => {
  return html`
    <corti-dictation
      .region=${region}
      @toggle-recording=${action("toggle-recording")}
      @languages-changed=${action("languages-changed")}
      @recording-devices-changed=${action("recording-devices-changed")}
    ></corti-dictation>
  `;
};
USRegion.args = {
  region: "us",
};

export const OnlyLanguageSettings: Story<StoryArgs> = ({ region }: StoryArgs) => {
  return html`
    <corti-dictation
      .region=${region}
      settingsEnabled="language"
      @toggle-recording=${action("toggle-recording")}
      @languages-changed=${action("languages-changed")}
      @recording-devices-changed=${action("recording-devices-changed")}
    ></corti-dictation>
  `;
};
OnlyLanguageSettings.args = {
  region: "eu",
};

export const OnlyDeviceSettings: Story<StoryArgs> = () => {
  return html`
    <corti-dictation
      .settingsEnabled=${["device"]}
      @toggle-recording=${action("toggle-recording")}
      @languages-changed=${action("languages-changed")}
      @recording-devices-changed=${action("recording-devices-changed")}
    ></corti-dictation>
  `;
};

export const NoSettings: Story<StoryArgs> = ({ region }: StoryArgs) => {
  return html`
    <corti-dictation
      .region=${region}
      .settingsEnabled=${[]}
      @toggle-recording=${action("toggle-recording")}
      @languages-changed=${action("languages-changed")}
      @recording-devices-changed=${action("recording-devices-changed")}
    ></corti-dictation>
  `;
};
NoSettings.args = {
  region: "eu",
};

export const WithCustomLanguages: Story<StoryArgs> = () => {
  return html`
    <corti-dictation
      .languages=${["en", "es", "fr", "de"]}
      selectedLanguage="es"
      settingsEnabled="language"
      @toggle-recording=${action("toggle-recording")}
      @languages-changed=${action("languages-changed")}
      @recording-devices-changed=${action("recording-devices-changed")}
    ></corti-dictation>
  `;
};

export const WithLanguagesAttribute: Story<StoryArgs> = () => {
  return html`
    <corti-dictation
      languages="en,da,es,fr"
      selectedLanguage="da"
      settingsEnabled="language"
      @toggle-recording=${action("toggle-recording")}
      @languages-changed=${action("languages-changed")}
      @recording-devices-changed=${action("recording-devices-changed")}
    ></corti-dictation>
  `;
};
