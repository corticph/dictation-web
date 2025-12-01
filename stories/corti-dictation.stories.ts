import { action } from "@storybook/addon-actions";
import { html, type TemplateResult } from "lit";

import "../src/components-new/corti-dictation.js";
import { CortiAuth } from "@corti/sdk";

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

const auth = new CortiAuth({
  environment: "us",
  tenantName: "base",
});

const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJpd1A4Q2cyZ1N2eUFBQmgtekVCaWRmZmZLTGYwN3JGNkhDZEVzQkhnLUpJIn0.eyJleHAiOjE3NjQ2MDUxNjksImlhdCI6MTc2NDYwNDg2OSwianRpIjoiNDBiNmFlY2UtMTkxYS00OGEwLWJlNDItNzQ3MGExNWEzMDdmIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLnVzLmNvcnRpLmFwcC9yZWFsbXMvYmFzZSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJhMmE5ZjMwMy1mM2I1LTQwZGMtOGNlOS01ZmIyOTgzZTZiY2MiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJ0ZXN0LTNkYjhhMy1mZXJuLXRlc3QtdXMiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidXNlcl9jaGF0OndyaXRlIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLWJhc2UiLCJoaXN0b3J5OnJlYWQiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwiY2xpZW50SG9zdCI6IjE1Mi4xMTUuMTM4LjIiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC10ZXN0LTNkYjhhMy1mZXJuLXRlc3QtdXMiLCJjb3J0aSI6eyJzdHJpcGVfY3VzdG9tZXJfaWQiOiJjdXNfU3hTbFlXRWo3c0hwQ1ciLCJjb25zb2xlX3Byb2plY3RfaWQiOiJ0ZXN0LTNkYjhhMyIsIm9wZW5tZXRlcl9jdXN0b21lcl9pZCI6IjAxSzNWTUJLV0tERUJONVk4WFpQUEJDUzlFIiwiY29uc29sZV9wcm9qZWN0X3V1aWQiOiJlOTc4Zjg1Yi0yMzZhLTRiNjYtYjk0OS0zNjVjOTJkM2M4OTEifSwiY2xpZW50QWRkcmVzcyI6IjE1Mi4xMTUuMTM4LjIiLCJjbGllbnRfaWQiOiJ0ZXN0LTNkYjhhMy1mZXJuLXRlc3QtdXMifQ.Hm_7X4xjldi5Qp-hilaPhGYnMq0ZCnIEvlQW_yuvpkwUU-dAPaj3jjmXGk_Te82PH4vhrOvOUAiBzVK4ismb4ASPz1ywUl81gq3L4sdJxh5Zv78hpUGW-h2fY7VVXF8QKbnnGH9WBTWA7CYPo_CJhjdJCECwcw8bZcZuUFRNUtcNF5iqqB4hJ0IRiN71gE2cLODPxEfPB8Ah9lvZLioz8OgrCPCX6cRUe241lpEdyIs8JTdTUtIG0tBJiX7I73PZgCPOnjlwXPNBTcUbqnOisiwMYPcCSQD1yTq-7iuaPgCWggrDS1o0pWSZvaTTZgQtxHplKOoW4bVxxOYt5uKLkQ";

export const DefaultValues: Story<StoryArgs> = ({ region }: StoryArgs) => {
  return html`
    <corti-dictation
      .accessToken=${token}
      .region=${region}
      @toggle-recording=${action("toggle-recording")}
      @languages-changed=${action("languages-changed")}
      @recording-devices-changed=${action("recording-devices-changed")}
      @stream-closed=${action("stream-closed")}
      @usage=${action("usage")}
      @transcript=${action("transcript")}
      @command=${action("command")}
      @ready=${action("ready")}
      @audio-level-changed=${action("audio-level-changed")}
      @recording-state-changed=${action("recording-state-changed")}
      @error=${action("error")}
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
      @error=${action("error")}
      @stream-closed=${action("stream-closed")}
      @usage=${action("usage")}
      @transcript=${action("transcript")}
      @command=${action("command")}
      @ready=${action("ready")}
      @audio-level-changed=${action("audio-level-changed")}
      @recording-state-changed=${action("recording-state-changed")}
    ></corti-dictation>
  `;
};
USRegion.args = {
  region: "us",
};

export const OnlyLanguageSettings: Story<StoryArgs> = ({
  region,
}: StoryArgs) => {
  return html`
    <corti-dictation
      .region=${region}
      settingsEnabled="language"
      @toggle-recording=${action("toggle-recording")}
      @languages-changed=${action("languages-changed")}
      @recording-devices-changed=${action("recording-devices-changed")}
      @error=${action("error")}
      @stream-closed=${action("stream-closed")}
      @usage=${action("usage")}
      @transcript=${action("transcript")}
      @command=${action("command")}
      @ready=${action("ready")}
      @audio-level-changed=${action("audio-level-changed")}
      @recording-state-changed=${action("recording-state-changed")}
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
      @error=${action("error")}
      @stream-closed=${action("stream-closed")}
      @usage=${action("usage")}
      @transcript=${action("transcript")}
      @command=${action("command")}
      @ready=${action("ready")}
      @audio-level-changed=${action("audio-level-changed")}
      @recording-state-changed=${action("recording-state-changed")}
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
      @error=${action("error")}
      @stream-closed=${action("stream-closed")}
      @usage=${action("usage")}
      @transcript=${action("transcript")}
      @command=${action("command")}
      @ready=${action("ready")}
      @audio-level-changed=${action("audio-level-changed")}
      @recording-state-changed=${action("recording-state-changed")}
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
      @error=${action("error")}
      @stream-closed=${action("stream-closed")}
      @usage=${action("usage")}
      @transcript=${action("transcript")}
      @command=${action("command")}
      @ready=${action("ready")}
      @audio-level-changed=${action("audio-level-changed")}
      @recording-state-changed=${action("recording-state-changed")}
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
      @error=${action("error")}
      @stream-closed=${action("stream-closed")}
      @usage=${action("usage")}
      @transcript=${action("transcript")}
      @command=${action("command")}
      @ready=${action("ready")}
      @audio-level-changed=${action("audio-level-changed")}
      @recording-state-changed=${action("recording-state-changed")}
    ></corti-dictation>
  `;
};
