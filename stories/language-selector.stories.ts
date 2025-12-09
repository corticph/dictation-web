import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { LanguageSelector } from "../src/components/language-selector.js";

import "../src/components/language-selector.js";
import "../src/contexts/dictation-context.js";
import {
  LANGUAGES_SUPPORTED_EU,
  LANGUAGES_SUPPORTED_US,
} from "../src/constants.js";
import type { DictationContext } from "../src/contexts/dictation-context.js";

const languages = Array.from(
  new Set([...LANGUAGES_SUPPORTED_EU, ...LANGUAGES_SUPPORTED_US]),
);

export type LanguageSelectorStory = LanguageSelector &
  Pick<DictationContext, "languages">;

const meta = {
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

  render: ({ languages }) => {
    const languagesValue = languages?.length ? languages.join(",") : nothing;
    return html`
      <dictation-context-provider languages="${languagesValue}" ?noWrapper=${true}>
        <language-selector
          @languages-changed=${action("languages-changed")}
          @error=${action("error")}
        />
      </dictation-context-provider>
    `;
  },
  title: "LanguageSelector",
} satisfies Meta<LanguageSelectorStory>;

export default meta;

// interface Story<T> {
//   (args: T): TemplateResult;
//   args?: Partial<T>;
//   argTypes?: Record<string, unknown>;
// }

export const Default = {
  args: {
    disabled: false,
  },
} as StoryObj<LanguageSelectorStory>;

export const WithCustomLanguages = {
  args: {
    languages: ["en", "es", "fr", "de", "it"],
  },
} as StoryObj<LanguageSelectorStory>;

export const Disabled = {
  args: {
    disabled: true,
  },
} as StoryObj<LanguageSelectorStory>;
