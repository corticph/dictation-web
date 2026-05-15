import type { Corti } from "@corti/sdk";
import { consume } from "@lit/context";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  languagesContext,
  selectedLanguageContext,
} from "../contexts/mixins/languages-context.js";
import SelectStyles from "../styles/select.js";
import {
  languageChangedEvent,
  languagesChangedEvent,
} from "../utils/events.js";
import { getLanguageName } from "../utils/languages.js";

@customElement("dictation-language-selector")
export class DictationLanguageSelector extends LitElement {
  @consume({ context: languagesContext, subscribe: true })
  @state()
  _languages?: Corti.TranscribeSupportedLanguage[];

  @consume({ context: selectedLanguageContext, subscribe: true })
  @state()
  _selectedLanguage?: Corti.TranscribeSupportedLanguage;

  @property({ type: Boolean })
  disabled: boolean = false;

  static styles = SelectStyles;

  #handleSelectLanguage(e: Event): void {
    const language = (e.target as HTMLSelectElement).value;

    this.dispatchEvent(languagesChangedEvent(this._languages || [], language));

    // Dispatch backward compatible event
    this.dispatchEvent(languageChangedEvent(language));
  }

  render() {
    return html`
      <div>
        <label id="language-select-label" for="language-select">
          Spoken language
        </label>
        <select
          id="language-select"
          aria-labelledby="language-select-label"
          @change=${this.#handleSelectLanguage}
          .value=${this._selectedLanguage ?? ""}
          ?disabled=${this.disabled || !this._languages || this._languages.length === 0}
        >
          ${this._languages?.map(
            (language) => html`
              <option
                value=${language}
                ?selected=${this._selectedLanguage === language}
              >
                ${getLanguageName(language)}
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
    "dictation-language-selector": DictationLanguageSelector;
  }
}
