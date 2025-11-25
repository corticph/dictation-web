import { action } from "@storybook/addon-actions";
import { html, type TemplateResult } from "lit";

import "../src/components/recording-button.js";

export default {
  argTypes: {
    audioLevel: {
      control: { max: 1, min: 0, step: 0.1, type: "range" },
      description: "Audio level from 0 to 1",
    },
    onToggleRecording: {
      action: "toggle-recording",
      description: "Fired when the button is clicked",
    },
    preventFocus: {
      control: "boolean",
      description: "Prevent button from taking focus on click",
    },
    recordingState: {
      control: "select",
      description: "Current recording state",
      options: ["stopped", "initializing", "recording", "stopping"],
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

interface RecordingButtonArgTypes {
  recordingState?: "stopped" | "initializing" | "recording" | "stopping";
  audioLevel?: number;
  preventFocus?: boolean;
}

const RecordingButtonTemplate: Story<RecordingButtonArgTypes> = ({
  recordingState,
  audioLevel,
  preventFocus,
}: RecordingButtonArgTypes) => {
  return html`
    <recording-button
      .recordingState=${recordingState}
      .audioLevel=${audioLevel}
      ?preventFocus=${preventFocus}
      @toggle-recording=${action("toggle-recording")}
    ></recording-button>
  `;
};

export const Stopped = RecordingButtonTemplate.bind({});
Stopped.args = {
  audioLevel: 0,
  preventFocus: true,
  recordingState: "stopped",
};

export const Recording = RecordingButtonTemplate.bind({});
Recording.args = {
  audioLevel: 0.6,
  preventFocus: true,
  recordingState: "recording",
};

export const RecordingLowAudio = RecordingButtonTemplate.bind({});
RecordingLowAudio.args = {
  audioLevel: 0.2,
  preventFocus: true,
  recordingState: "recording",
};

export const RecordingHighAudio = RecordingButtonTemplate.bind({});
RecordingHighAudio.args = {
  audioLevel: 0.9,
  preventFocus: true,
  recordingState: "recording",
};

export const Initializing = RecordingButtonTemplate.bind({});
Initializing.args = {
  audioLevel: 0,
  preventFocus: true,
  recordingState: "initializing",
};

export const Stopping = RecordingButtonTemplate.bind({});
Stopping.args = {
  audioLevel: 0.4,
  preventFocus: true,
  recordingState: "stopping",
};

export const PreventFocusDisabled = RecordingButtonTemplate.bind({});
PreventFocusDisabled.args = {
  audioLevel: 0,
  preventFocus: false,
  recordingState: "stopped",
};

