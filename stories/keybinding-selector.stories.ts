import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { action } from "storybook/actions";
import type { DictationKeybindingSelector } from "../src/components/keybinding-selector.js";

import "../src/components/keybinding-selector.js";
import "../src/contexts/dictation-context.js";
import type { DictationRoot } from "../src/contexts/dictation-context.js";
import { disableControls } from "./helpers.js";

export type KeybindingSelectorStory = DictationKeybindingSelector &
  Pick<DictationRoot, "keybinding">;

const meta = {
  args: {
    disabled: false,
    keybinding: "`",
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Whether the keybinding selector is disabled",
    },
    keybinding: {
      control: "text",
      description:
        "Keyboard shortcut for starting/stopping recording. Single key only (e.g., 'k', '`', 'KeyK', 'Backquote'). Supports both key names and key codes.",
    },
  },
  component: "dictation-keybinding-selector",
  render: ({ keybinding, disabled }) => {
    return html`
      <dictation-root
        ?noWrapper=${true}
        keybinding=${keybinding}
        @keybinding-changed=${action("keybinding-changed")}
        @error=${action("error")}
      >
        <dictation-keybinding-selector ?disabled=${disabled} />
      </dictation-root>
    `;
  },
  title: "KeybindingSelector",
} satisfies Meta<KeybindingSelectorStory>;

export default meta;

export const Default = {} as StoryObj<KeybindingSelectorStory>;

export const Disabled = {
  args: {
    disabled: true,
  },
  argTypes: disableControls(["disabled"]),
} as StoryObj<KeybindingSelectorStory>;

export const WithKeyName = {
  args: {
    keybinding: "k",
  },
  argTypes: disableControls(["keybinding"]),
} as StoryObj<KeybindingSelectorStory>;

export const WithKeyCode = {
  args: {
    keybinding: "KeyK",
  },
  argTypes: disableControls(["keybinding"]),
} as StoryObj<KeybindingSelectorStory>;

export const WithMetaKey = {
  args: {
    keybinding: "meta",
  },
  argTypes: disableControls(["keybinding"]),
} as StoryObj<KeybindingSelectorStory>;

export const WithSpace = {
  args: {
    keybinding: "Space",
  },
  argTypes: disableControls(["keybinding"]),
} as StoryObj<KeybindingSelectorStory>;
