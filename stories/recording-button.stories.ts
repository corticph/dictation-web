import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { RecordingButton } from "../src/components/recording-button.js";

import "../src/components/recording-button.js";
import "../src/contexts/dictation-context.js";
import type { DictationContext } from "../src/contexts/dictation-context.js";
import { disableControls } from "./helpers.js";

export type RecordingButtonStory = RecordingButton &
  Pick<DictationContext, "recordingState">;

const meta = {
  argTypes: {
    preventFocus: {
      control: "boolean",
      description: "Prevent button from taking focus on click",
    },
    recordingState: {
      control: "select",
      description: "The current recording state",
      options: ["stopped", "initializing", "recording", "stopping"],
    },
  },
  component: "recording-button",
  render: ({ preventFocus, recordingState }) => {
    return html`
    <dictation-context-provider ?noWrapper=${true} .recordingState=${recordingState}>
      <recording-button
        ?preventFocus=${preventFocus}
        @recording-state-changed=${action("recording-state-changed")}
        @network-activity=${action("network-activity")}
        @error=${action("error")}
      ></recording-button>
    </dictation-context-provider>
  `;
  },
  title: "RecordingButton",
} satisfies Meta<RecordingButtonStory>;

export default meta;

export const Default = {
  args: {
    preventFocus: true,
  },
} as StoryObj<RecordingButtonStory>;

export const Stopped = {
  args: {
    preventFocus: true,
    recordingState: "stopped",
  },
  argTypes: disableControls(["recordingState"]),
} as StoryObj<RecordingButtonStory>;

export const Initializing = {
  args: {
    preventFocus: true,
    recordingState: "initializing",
  },
  argTypes: disableControls(["recordingState"]),
} as StoryObj<RecordingButtonStory>;

export const Recording = {
  args: {
    preventFocus: true,
    recordingState: "recording",
  },
  argTypes: disableControls(["recordingState"]),
} as StoryObj<RecordingButtonStory>;

export const Stopping = {
  args: {
    preventFocus: true,
    recordingState: "stopping",
  },
  argTypes: disableControls(["recordingState"]),
} as StoryObj<RecordingButtonStory>;

export const PreventFocusDisabled = {
  args: {
    preventFocus: false,
  },
} as StoryObj<RecordingButtonStory>;
