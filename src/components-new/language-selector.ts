import { consume } from "@lit/context";
import { type CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { regionContext } from "../contexts/region-context.js";
import DefaultThemeStyles from "../styles/default-theme.js";
import SelectStyles from "../styles/select.js";
import { languagesChangedEvent } from "../utils/events.js";
import { getLanguagesByRegion } from "../utils/languages.js";

@customElement("language-selector")
export class LanguageSelector extends LitElement {
  @property({ type: String })
  selectedLanguage?: string;

  @property({ type: Array })
  languages?: string[];

  @property({ type: Boolean })
  disabled: boolean = false;

  @consume({ context: regionContext, subscribe: true })
  @property({ attribute: false, type: String })
  _region?: string;

  /**
   * Internal cache of loaded languages to check if languages were auto-loaded or provided via property
   * @private
   */
  private _loadedLanguages: string[] = [];

  private _languagesAutoLoaded(): boolean {
    return this._loadedLanguages === this.languages;
  }

  static styles: CSSResultGroup = [DefaultThemeStyles, SelectStyles];

  async connectedCallback(): Promise<void> {
    super.connectedCallback();

    if (this.languages) {
      return;
    }

    await this._loadLanguages();
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("_region") && this._languagesAutoLoaded()) {
      this._loadLanguages();
    }
  }

  private async _loadLanguages(): Promise<void> {
    const { languages, defaultLanguage } = getLanguagesByRegion(this._region);
    this.languages = languages;
    this._loadedLanguages = languages;

    if (!this.selectedLanguage && defaultLanguage) {
      this.selectedLanguage = defaultLanguage;
    }

    await this.updateComplete;
    this.dispatchEvent(
      languagesChangedEvent(this.languages || [], this.selectedLanguage),
    );
  }

  private async _handleSelectLanguage(e: Event): Promise<void> {
    const language = (e.target as HTMLSelectElement).value;

    this.selectedLanguage = language;
    await this.updateComplete;
    this.dispatchEvent(
      languagesChangedEvent(this.languages || [], this.selectedLanguage),
    );
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
          ?disabled=${this.disabled || !this.languages || this.languages.length === 0}
        >
          ${this.languages?.map(
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
