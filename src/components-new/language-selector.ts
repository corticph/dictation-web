import type { Corti } from "@corti/sdk";
import { consume } from "@lit/context";
import { html, LitElement, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  dictationConfigContext,
  languagesContext,
  regionContext,
} from "../contexts/dictation-context.js";
import SelectStyles from "../styles/select.js";
import { languagesChangedEvent } from "../utils/events.js";
import { getLanguageName, getLanguagesByRegion } from "../utils/languages.js";

@customElement("language-selector")
export class LanguageSelector extends LitElement {
  @consume({ context: languagesContext, subscribe: true })
  @state()
  private _languages?: string[];

  @consume({ context: dictationConfigContext, subscribe: true })
  @state()
  private _dictationConfig?: Corti.TranscribeConfig;

  @property({ type: Boolean })
  disabled: boolean = false;

  @consume({ context: regionContext, subscribe: true })
  @state()
  _region?: string;

  /**
   * Internal cache of loaded languages to check if languages were auto-loaded or provided via property
   * @private
   */
  private _loadedLanguages: string[] = [];

  private _languagesAutoLoaded(): boolean {
    return this._loadedLanguages === this._languages;
  }

  static styles = SelectStyles;

  async connectedCallback(): Promise<void> {
    super.connectedCallback();

    if (this._languages) {
      return;
    }

    await this._loadLanguages();
  }

  updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has("_region") && this._languagesAutoLoaded()) {
      this._loadLanguages();
    }
  }

  private async _loadLanguages(): Promise<void> {
    const { languages, defaultLanguage } = getLanguagesByRegion(this._region);
    this._loadedLanguages = languages;

    this.dispatchEvent(
      languagesChangedEvent(
        languages,
        this._dictationConfig?.primaryLanguage ?? defaultLanguage,
      ),
    );
  }

  private _handleSelectLanguage(e: Event): void {
    const language = (e.target as HTMLSelectElement).value;

    this.dispatchEvent(languagesChangedEvent(this._languages || [], language));
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
          ?disabled=${this.disabled || !this._languages || this._languages.length === 0}
        >
          ${this._languages?.map(
            (language) => html`
              <option
                value=${language}
                ?selected=${this._dictationConfig?.primaryLanguage === language}
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
    "language-selector": LanguageSelector;
  }
}
