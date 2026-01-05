import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { action } from "storybook/actions";
import type { DictationModeSelector } from "../src/components/mode-selector.js";

import "../src/components/mode-selector.js";
import "../src/contexts/dictation-context.js";
import type { DictationRoot } from "../src/contexts/dictation-context.js";
import { disableControls } from "./helpers.js";

export type ModeSelectorStory = DictationModeSelector &
  Pick<DictationRoot, "mode">;

const meta = {
  args: {
    disabled: false,
    mode: "toggle-to-talk",
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Whether the mode selector is disabled",
    },
    mode: {
      control: "select",
      description: "Dictation mode: toggle-to-talk or push-to-talk",
      options: ["toggle-to-talk", "push-to-talk"],
    },
  },
  component: "dictation-mode-selector",
  render: ({ mode, disabled }) => {
    return html`
      <dictation-root
        ?noWrapper=${true}
        mode=${mode}
        @mode-changed=${action("mode-changed")}
        @error=${action("error")}
      >
        <dictation-mode-selector ?disabled=${disabled} />
      </dictation-root>
    `;
  },
  title: "ModeSelector",
} satisfies Meta<ModeSelectorStory>;

export default meta;

export const Default = {} as StoryObj<ModeSelectorStory>;

export const Disabled = {
  args: {
    disabled: true,
  },
  argTypes: disableControls(["disabled"]),
} as StoryObj<ModeSelectorStory>;

export const ToggleToTalk = {
  args: {
    mode: "toggle-to-talk",
  },
  argTypes: disableControls(["mode"]),
} as StoryObj<ModeSelectorStory>;

export const PushToTalk = {
  args: {
    mode: "push-to-talk",
  },
  argTypes: disableControls(["mode"]),
} as StoryObj<ModeSelectorStory>;
