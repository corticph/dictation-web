import { consume } from "@lit/context";
import {
  type CSSResultGroup,
  html,
  LitElement,
  type PropertyValues,
} from "lit";
import { customElement, property } from "lit/decorators.js";
import { regionContext } from "../contexts/region-context.js";
import DefaultThemeStyles from "../styles/default-theme.js";
import SelectStyles from "../styles/select.js";
import {
  languageChangedEvent,
  languagesSupportedChangedEvent,
} from "../utils/events.js";
import {
  checkIfDefaultLanguagesList,
  DEFAULT_LANGUAGES_BY_REGION,
} from "../utils/languages.js";

@customElement("language-selector")
export class LanguageSelector extends LitElement {
  @property({ type: String })
  selectedLanguage?: string;

  @property({ type: Array })
  languagesSupported?: string[];

  @consume({ context: regionContext, subscribe: true })
  @property({ attribute: false, type: String })
  _region?: string;

  private _defaultLanguagesList = true;

  static styles: CSSResultGroup = [DefaultThemeStyles, SelectStyles];

  async update(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("languagesSupported")) {
      this._defaultLanguagesList = checkIfDefaultLanguagesList(
        this.languagesSupported,
      );
    }

    if (changedProperties.has("_region") && this._defaultLanguagesList) {
      const region = this._region || "default";
      const newLanguagesSupported = DEFAULT_LANGUAGES_BY_REGION[region];

      this.languagesSupported = newLanguagesSupported;
      await this.updateComplete;
      this.dispatchEvent(languagesSupportedChangedEvent(newLanguagesSupported));
    }

    super.update(changedProperties);
  }

  private async _handleSelectLanguage(e: Event) {
    const language = (e.target as HTMLSelectElement).value;

    this.selectedLanguage = language;
    await this.updateComplete;
    this.dispatchEvent(languageChangedEvent(language));
  }

  render() {
    return html`
      <div>
        <label id="language-select-label" for="language-select">
          Dictation Language
        </label>
        <select
          id="language-select"
          aria-labelledby="language-select-label"
          @change=${this._handleSelectLanguage}
          ?disabled=${this.languagesSupported?.length === 0}
        >
          ${this.languagesSupported?.map(
            (language) => html`
              <option value=${language} ?selected=${this.selectedLanguage === language}>
                ${language}
              </option>
            `,
          )}
        </select>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "language-selector": LanguageSelector;
  }
}
