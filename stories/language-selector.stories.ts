import { action } from "@storybook/addon-actions";
import { html, type TemplateResult } from "lit";

import "../src/components-new/language-selector.js";
import "../src/contexts/dictation-context.js";

export default {
  argTypes: {
    region: {
      control: "select",
      description: "Region for loading language list",
      options: [undefined, "eu", "us"],
    },
  },
  component: "language-selector",
  title: "LanguageSelector",
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface StoryArgs {
  region?: string;
}

export const DefaultValues: Story<StoryArgs> = ({ region }: StoryArgs) => {
  return html`
    <dictation-context-provider .region=${region} ?noWrapper=${true}>
      <language-selector
        @languages-changed=${action("languages-changed")}
      ></language-selector>
    </dictation-context-provider>
  `;
};
DefaultValues.args = {
  region: "eu",
};

export const WithSelectedLanguage: Story<StoryArgs> = ({
  region,
}: StoryArgs) => {
  return html`
    <dictation-context-provider
      .region=${region}
      .selectedLanguage=${"da"}
      ?noWrapper=${true}
    >
      <language-selector
        @languages-changed=${action("languages-changed")}
      ></language-selector>
    </dictation-context-provider>
  `;
};
WithSelectedLanguage.args = {
  region: "eu",
};

export const WithCustomLanguages: Story<StoryArgs> = ({
  region,
}: StoryArgs) => {
  return html`
    <dictation-context-provider
      .region=${region}
      .languages=${["en", "es", "fr", "de", "it"]}
      ?noWrapper=${true}
    >
      <language-selector
        @languages-changed=${action("languages-changed")}
      ></language-selector>
    </dictation-context-provider>
  `;
};
WithCustomLanguages.args = {
  region: "eu",
};

export const WithLanguagesAttribute: Story<StoryArgs> = () => {
  return html`
    <dictation-context-provider languages="en,da,es,fr" ?noWrapper=${true}>
      <language-selector
        @languages-changed=${action("languages-changed")}
      ></language-selector>
    </dictation-context-provider>
  `;
};
