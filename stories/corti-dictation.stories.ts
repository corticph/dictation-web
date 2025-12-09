import { action } from "@storybook/addon-actions";
import { html, nothing, type TemplateResult } from "lit";
import {
  LANGUAGES_SUPPORTED_EU,
  LANGUAGES_SUPPORTED_US,
} from "../src/constants.js";

import "../src/components/corti-dictation.js";
import type { ConfigurableSettings } from "../src/types.js";
import type { Corti } from "@corti/sdk";

const languages = Array.from(
  new Set([...LANGUAGES_SUPPORTED_EU, ...LANGUAGES_SUPPORTED_US]),
);

export default {
  argTypes: {
    accessToken: {
      control: "text",
      description: "Access token for authentication (required to render)",
    },
    settingsEnabled: {
      control: "check",
      description: "Which settings to enable in the settings menu",
      options: ["device", "language"],
    },
    languagesSupported: {
      control: "multi-select",
      options: languages,
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
  accessToken?: string;
  settingsEnabled?: ConfigurableSettings[];
  languagesSupported?: Corti.TranscribeSupportedLanguage[];
}

export const DefaultValues: Story<StoryArgs> = ({
  accessToken,
  settingsEnabled,
  languagesSupported,
}: StoryArgs) => {
  const settingsEnabledValue =
    settingsEnabled === undefined ? nothing : settingsEnabled;
  const languagesSupportedValue =
    languagesSupported === undefined ? nothing : languagesSupported;
  return html`
    <corti-dictation
      .accessToken=${accessToken}
      settingsEnabled=${settingsEnabledValue}
      languagesSupported=${languagesSupportedValue}
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
};

DefaultValues.args = {
  accessToken: "dummy_token",
  languagesSupported: [],
  settingsEnabled: ["device", "language"],
};

export const OnlyLanguageSettings: Story<StoryArgs> = ({
  accessToken,
}: StoryArgs) => {
  return html`
    <corti-dictation
      .accessToken=${accessToken}
      settingsEnabled="language"
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
};

export const OnlyDeviceSettings: Story<StoryArgs> = ({
  accessToken,
}: StoryArgs) => {
  return html`
    <corti-dictation
      .accessToken=${accessToken}
      .settingsEnabled=${["device"]}
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
};

export const NoSettings: Story<StoryArgs> = ({ accessToken }: StoryArgs) => {
  return html`
    <corti-dictation
      .accessToken=${accessToken}
      .settingsEnabled=${[]}
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
};

export const WithCustomLanguages: Story<StoryArgs> = ({
  accessToken,
}: StoryArgs) => {
  return html`
    <corti-dictation
      .accessToken=${accessToken}
      .languagesSupported=${["en", "es", "fr", "de"]}
      settingsEnabled="language"
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
};

export const WithLanguagesAttribute: Story<StoryArgs> = ({
  accessToken,
}: StoryArgs) => {
  return html`
    <corti-dictation
      .accessToken=${accessToken}
      languagesSupported="en,da,es,fr"
      settingsEnabled="language"
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
};
