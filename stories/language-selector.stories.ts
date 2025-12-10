import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html, nothing } from "lit";
import { action } from "storybook/actions";
import type { LanguageSelector } from "../src/components/language-selector.js";

import "../src/components/language-selector.js";
import "../src/contexts/dictation-context.js";

import type { DictationContext } from "../src/contexts/dictation-context.js";
import { languages } from "./helpers.js";

export type LanguageSelectorStory = LanguageSelector &
  Pick<DictationContext, "languages">;

const meta = {
  args: {
    disabled: false,
    languages,
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Whether the language selector is disabled",
    },
    languages: {
      control: "inline-check",
      options: languages,
    },
  },
  component: "language-selector",

  render: ({ languages, disabled }) => {
    return html`
      <dictation-context-provider languages="${languages}" ?noWrapper=${true}>
        <language-selector
          ?disabled=${disabled}
          @languages-changed=${action("languages-changed")}
          @error=${action("error")}
        />
      </dictation-context-provider>
    `;
  },
  title: "LanguageSelector",
} satisfies Meta<LanguageSelectorStory>;

export default meta;

export const Default = {} as StoryObj<LanguageSelectorStory>;

export const Disabled = {
  args: {
    disabled: true,
  },
} as StoryObj<LanguageSelectorStory>;

export const WithCustomLanguages = {
  args: {
    languages: ["en", "es", "fr", "de", "it"],
  },
} as StoryObj<LanguageSelectorStory>;
