import { html, type TemplateResult } from "lit";

import "../src/components-new/audio-visualiser.js";

export default {
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
  component: "audio-visualiser",
  title: "AudioVisualiser",
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface AudioVisualiserArgTypes {
  level?: number;
  active?: boolean;
}

const AudioVisualiserTemplate: Story<AudioVisualiserArgTypes> = ({
  level = 0,
  active = true,
}: AudioVisualiserArgTypes) => {
  if (!active) {
    return html`
    <div style="height: 100px;">
      <audio-visualiser level=${level}></audio-visualiser>
    </div>
  `;
  }

  return html`
    <div style="height: 100px;">
      <audio-visualiser level=${level} active></audio-visualiser>
    </div>
  `;
};

export const Default = AudioVisualiserTemplate.bind({});
Default.args = {
  active: true,
  level: 0.5,
};

export const Inactive = AudioVisualiserTemplate.bind({});
Inactive.args = {
  active: false,
  level: 0.5,
};

export const Low = AudioVisualiserTemplate.bind({});
Low.args = {
  active: true,
  level: 0.2,
};

export const Medium = AudioVisualiserTemplate.bind({});
Medium.args = {
  active: true,
  level: 0.5,
};

export const High = AudioVisualiserTemplate.bind({});
High.args = {
  active: true,
  level: 0.8,
};

export const Full = AudioVisualiserTemplate.bind({});
Full.args = {
  active: true,
  level: 1.0,
};

export const Silent = AudioVisualiserTemplate.bind({});
Silent.args = {
  active: true,
  level: 0,
};
