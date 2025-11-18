import { html, TemplateResult } from 'lit';
import '../src/components/audio-visualiser.js';

export default {
  title: 'AudioVisualiser',
  component: 'audio-visualiser',
  argTypes: {
    level: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Audio level from 0 to 1',
    },
    active: {
      control: 'boolean',
      description: 'Whether the visualiser is active',
    },
  },
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
}

export const Default = AudioVisualiserTemplate.bind({});
Default.args = {
  level: 0.5,
  active: true,
};

export const Inactive = AudioVisualiserTemplate.bind({});
Inactive.args = {
  level: 0.5,
  active: false,
};

export const Low = AudioVisualiserTemplate.bind({});
Low.args = {
  level: 0.2,
  active: true,
};

export const Medium = AudioVisualiserTemplate.bind({});
Medium.args = {
  level: 0.5,
  active: true,
};

export const High = AudioVisualiserTemplate.bind({});
High.args = {
  level: 0.8,
  active: true,
};

export const Full = AudioVisualiserTemplate.bind({});
Full.args = {
  level: 1.0,
  active: true,
};

export const Silent = AudioVisualiserTemplate.bind({});
Silent.args = {
  level: 0,
  active: true,
};

