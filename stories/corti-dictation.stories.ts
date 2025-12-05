import { action } from "@storybook/addon-actions";
import { html, type TemplateResult } from "lit";

import "../src/components/corti-dictation.js";

export default {
  argTypes: {
    accessToken: {
      control: "text",
      description: "Access token for authentication (required to render)",
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
}

export const DefaultValues: Story<StoryArgs> = ({ accessToken }: StoryArgs) => {
  return html`
    <corti-dictation
      .accessToken=${accessToken}
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
