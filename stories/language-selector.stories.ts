import { action } from "@storybook/addon-actions";
import { html, type TemplateResult } from "lit";
import "../src/components/language-selector.js";
import "../src/contexts/region-context.js";

export default {
  argTypes: {
    languages: {
      control: "object",
      description: "Array of available language codes",
    },
    onLanguagesChanged: {
      action: "languages-changed",
      description:
        "Fired when the selected language or available languages change",
    },
    region: {
      control: "select",
      description: "Region for default language list",
      options: [undefined, "eu", "us"],
      table: {
        category: "Context Provider",
      },
    },
    selectedLanguage: {
      control: "text",
      description: "Currently selected language code",
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

interface LanguageSelectorArgTypes {
  region?: string;
  selectedLanguage?: string;
  languages?: string[];
}

const LanguageSelectorTemplate: Story<LanguageSelectorArgTypes> = ({
  region,
  selectedLanguage,
  languages,
}: LanguageSelectorArgTypes) => {
  if (languages) {
    return html`
      <region-context-provider region=${region}>
        <div style="padding: 20px; max-width: 300px;">
          <language-selector
            selectedLanguage=${selectedLanguage}
            .languages=${languages}
            @languages-changed=${action("languages-changed")}
          ></language-selector>
        </div>
      </region-context-provider>
    `;
  }

  return html`
    <region-context-provider region=${region}>
      <div style="padding: 20px; max-width: 300px;">
        <language-selector
          selectedLanguage=${selectedLanguage}
          @languages-changed=${action("languages-changed")}
        ></language-selector>
      </div>
    </region-context-provider>
  `;
};

export const Default = LanguageSelectorTemplate.bind({});
Default.args = {
  selectedLanguage: "",
};

export const WithSelectedLanguage = LanguageSelectorTemplate.bind({});
WithSelectedLanguage.args = {
  region: "eu",
  selectedLanguage: "en",
};

export const USRegion = LanguageSelectorTemplate.bind({});
USRegion.args = {
  region: "us",
  selectedLanguage: "en",
};

export const CustomLanguages = LanguageSelectorTemplate.bind({});
CustomLanguages.args = {
  languages: ["en", "es", "fr", "de"],
  region: "eu",
  selectedLanguage: "es",
};
