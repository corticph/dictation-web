import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

import "../src/components/audio-visualiser.js";

import type { DictationAudioVisualiser } from "../src/components/audio-visualiser.js";
import { disableControls } from "./helpers.js";

const meta = {
  args: {
    active: true,
    level: 0.5,
  },
  argTypes: {
    active: {
      control: "boolean",
      description: "Whether the visualiser is active",
    },
    level: {
      control: { max: 1, min: 0, step: 0.01, type: "range" },
      description: "Audio level from 0 to 1",
    },
  },
  component: "dictation-audio-visualiser",
  render: ({ level = 0, active = true }: DictationAudioVisualiserArgTypes) => {
    return html`
    <div style="height: 100px;">
      <dictation-audio-visualiser level=${level} ?active=${active}/>
    </div>
  `;
  },
  title: "DictationAudioVisualiser",
} satisfies Meta<DictationAudioVisualiser>;

export default meta;

interface DictationAudioVisualiserArgTypes {
  level?: number;
  active?: boolean;
}

export const Default = {} as StoryObj<DictationAudioVisualiser>;

export const Inactive = {
  args: {
    active: false,
  },
  argTypes: disableControls(["active"]),
} as StoryObj<DictationAudioVisualiser>;

export const Low = {
  args: {
    level: 0.2,
  },
  argTypes: disableControls(["active"]),
} as StoryObj<DictationAudioVisualiser>;

export const Medium = {
  args: {
    level: 0.5,
  },
  argTypes: disableControls(["active"]),
} as StoryObj<DictationAudioVisualiser>;

export const High = {
  args: {
    level: 0.8,
  },
  argTypes: disableControls(["active"]),
} as StoryObj<DictationAudioVisualiser>;

export const Full = {
  args: {
    level: 1,
  },
  argTypes: disableControls(["active"]),
} as StoryObj<DictationAudioVisualiser>;

export const Silent = {
  args: {
    level: 0,
  },
  argTypes: disableControls(["active"]),
} as StoryObj<DictationAudioVisualiser>;
