import { action } from "@storybook/addon-actions";
import { html, type TemplateResult } from "lit";

import "../src/components/recording-button.js";
import "../src/contexts/dictation-context.js";

export default {
  argTypes: {
    preventFocus: {
      control: "boolean",
      description: "Prevent button from taking focus on click",
    },
  },
  component: "recording-button",
  title: "RecordingButton",
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface StoryArgs {
  preventFocus?: boolean;
}

export const Stopped: Story<StoryArgs> = ({ preventFocus }: StoryArgs) => {
  return html`
    <dictation-context-provider ?noWrapper=${true}>
      <recording-button
        ?preventFocus=${preventFocus}
        @recording-state-changed=${action("recording-state-changed")}
        @network-activity=${action("network-activity")}
        @error=${action("error")}
      ></recording-button>
    </dictation-context-provider>
  `;
};
Stopped.args = {
  preventFocus: true,
};

export const Recording: Story<StoryArgs> = ({ preventFocus }: StoryArgs) => {
  return html`
    <dictation-context-provider ?noWrapper=${true} recordingState="recording">
      <recording-button
        ?preventFocus=${preventFocus}
        @recording-state-changed=${action("recording-state-changed")}
        @network-activity=${action("network-activity")}
        @error=${action("error")}
      ></recording-button>
    </dictation-context-provider>
  `;
};
Recording.args = {
  preventFocus: true,
};

export const Initializing: Story<StoryArgs> = ({ preventFocus }: StoryArgs) => {
  return html`
    <dictation-context-provider ?noWrapper=${true} recordingState="initializing">
      <recording-button
        ?preventFocus=${preventFocus}
        @recording-state-changed=${action("recording-state-changed")}
        @network-activity=${action("network-activity")}
        @error=${action("error")}
      ></recording-button>
    </dictation-context-provider>
  `;
};
Initializing.args = {
  preventFocus: true,
};

export const Stopping: Story<StoryArgs> = ({ preventFocus }: StoryArgs) => {
  return html`
    <dictation-context-provider ?noWrapper=${true} recordingState="stopping">
      <recording-button
        ?preventFocus=${preventFocus}
        @recording-state-changed=${action("recording-state-changed")}
        @network-activity=${action("network-activity")}
        @error=${action("error")}
      ></recording-button>
    </dictation-context-provider>
  `;
};
Stopping.args = {
  preventFocus: true,
};

export const PreventFocusDisabled: Story<StoryArgs> = ({
  preventFocus,
}: StoryArgs) => {
  return html`
    <dictation-context-provider ?noWrapper=${true}>
      <recording-button
        ?preventFocus=${preventFocus}
        @recording-state-changed=${action("recording-state-changed")}
        @network-activity=${action("network-activity")}
        @error=${action("error")}
      ></recording-button>
    </dictation-context-provider>
  `;
};
PreventFocusDisabled.args = {
  preventFocus: false,
};
