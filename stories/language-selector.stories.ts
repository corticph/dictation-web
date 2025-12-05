import { action } from "@storybook/addon-actions";
import { html, type TemplateResult } from "lit";

import "../src/components/language-selector.js";
import "../src/contexts/dictation-context.js";

export default {
  component: "language-selector",
  title: "LanguageSelector",
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

type StoryArgs = Record<string, never>;

export const DefaultValues: Story<StoryArgs> = () => {
  return html`
    <dictation-context-provider ?noWrapper=${true}>
      <language-selector
        @languages-changed=${action("languages-changed")}
        @error=${action("error")}
      ></language-selector>
    </dictation-context-provider>
  `;
};

export const WithCustomLanguages: Story<StoryArgs> = () => {
  return html`
    <dictation-context-provider
      .languages=${["en", "es", "fr", "de", "it"]}
      ?noWrapper=${true}
    >
      <language-selector
        @languages-changed=${action("languages-changed")}
        @error=${action("error")}
      ></language-selector>
    </dictation-context-provider>
  `;
};

export const WithLanguagesAttribute: Story<StoryArgs> = () => {
  return html`
    <dictation-context-provider languages="en,da,es,fr" ?noWrapper=${true}>
      <language-selector
        @languages-changed=${action("languages-changed")}
        @error=${action("error")}
      ></language-selector>
    </dictation-context-provider>
  `;
};

export const Disabled: Story<StoryArgs> = () => {
  return html`
    <dictation-context-provider ?noWrapper=${true}>
      <language-selector
        disabled
        @languages-changed=${action("languages-changed")}
        @error=${action("error")}
      ></language-selector>
    </dictation-context-provider>
  `;
};
