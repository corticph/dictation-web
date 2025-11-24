import { action } from "@storybook/addon-actions";
import { html, type TemplateResult } from "lit";
import "../src/components/language-selector.js";
import "../src/contexts/region-context.js";

export default {
  argTypes: {
    languagesSupported: {
      control: "object",
      description: "Array of available language codes",
    },
    onLanguageChanged: {
      action: "language-changed",
      description: "Fired when the selected language changes",
    },
    onLanguagesSupportedChanged: {
      action: "languages-supported-changed",
      description: "Fired when the list of supported languages changes",
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
  languagesSupported?: string[];
}

const LanguageSelectorTemplate: Story<LanguageSelectorArgTypes> = ({
  region,
  selectedLanguage,
  languagesSupported,
}: LanguageSelectorArgTypes) => {
  if (languagesSupported) {
    return html`
      <region-context-provider region=${region}>
        <div style="padding: 20px; max-width: 300px;">
          <language-selector
            selectedLanguage=${selectedLanguage}
            .languagesSupported=${languagesSupported}
            @languages-supported-changed=${action("languages-supported-changed")}
            @language-changed=${action("language-changed")}
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
          @languages-supported-changed=${action("languages-supported-changed")}
          @language-changed=${action("language-changed")}
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
  languagesSupported: ["en", "es", "fr", "de"],
  region: "eu",
  selectedLanguage: "es",
};
