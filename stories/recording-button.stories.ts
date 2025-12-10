import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { action } from "storybook/actions";
import type { DictationRecordingButton } from "../src/components/recording-button.js";

import "../src/components/recording-button.js";
import "../src/contexts/dictation-context.js";
import type { DictationRoot } from "../src/contexts/dictation-context.js";
import { disableControls } from "./helpers.js";

export type RecordingButtonStory = DictationRecordingButton &
  Pick<DictationRoot, "recordingState">;

const meta = {
  args: {
    allowButtonFocus: false,
    recordingState: "stopped",
  },
  argTypes: {
    allowButtonFocus: {
      control: "boolean",
      description: "Allow button to take focus on click",
    },
    recordingState: {
      control: "select",
      description: "The current recording state",
      options: ["stopped", "initializing", "recording", "stopping"],
    },
  },
  component: "dictation-recording-button",
  render: ({ allowButtonFocus, recordingState }) => {
    return html`
    <dictation-root ?noWrapper=${true} .recordingState=${recordingState}>
      <dictation-recording-button
        ?allowButtonFocus=${allowButtonFocus}
        @recording-state-changed=${action("recording-state-changed")}
        @network-activity=${action("network-activity")}
        @error=${action("error")}
      />
    </dictation-root>
  `;
  },
  title: "RecordingButton",
} satisfies Meta<RecordingButtonStory>;

export default meta;

export const Default = {} as StoryObj<RecordingButtonStory>;

export const Stopped = {
  argTypes: disableControls(["recordingState"]),
} as StoryObj<RecordingButtonStory>;

export const Initializing = {
  args: {
    allowButtonFocus: false,
    recordingState: "initializing",
  },
  argTypes: disableControls(["recordingState"]),
} as StoryObj<RecordingButtonStory>;

export const Recording = {
  args: {
    allowButtonFocus: false,
    recordingState: "recording",
  },
  argTypes: disableControls(["recordingState"]),
} as StoryObj<RecordingButtonStory>;

export const Stopping = {
  args: {
    allowButtonFocus: false,
    recordingState: "stopping",
  },
  argTypes: disableControls(["recordingState"]),
} as StoryObj<RecordingButtonStory>;

export const AllowButtonFocusEnabled = {
  args: {
    allowButtonFocus: true,
  },
  argTypes: disableControls(["allowButtonFocus"]),
} as StoryObj<RecordingButtonStory>;
