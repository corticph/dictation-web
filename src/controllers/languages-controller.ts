import type { Corti } from "@corti/sdk";
import type { ReactiveController, ReactiveControllerHost } from "lit";
import {
  type LanguagesChangedEventDetail,
  languagesChangedEvent,
} from "../utils/events.js";
import { getLanguagesByRegion } from "../utils/languages.js";

interface LanguagesControllerHost extends ReactiveControllerHost {
  region?: string;
  languages?: Corti.TranscribeSupportedLanguage[];
  dictationConfig?: Corti.TranscribeConfig;
  dispatchEvent(event: CustomEvent<LanguagesChangedEventDetail>): boolean;
  requestUpdate(): void;
  _languages?: Corti.TranscribeSupportedLanguage[];
}

/**
 * Controller that manages automatic language loading based on region.
 * Loads languages when they're not present and handles region changes.
 * Reacts to updates and automatically loads languages when needed.
 */
export class LanguagesController implements ReactiveController {
  host: LanguagesControllerHost;
  private _autoLoadedLanguages: boolean = false;
  private _loadingLanguages: boolean = false;
  private _previousRegion?: string;

  constructor(host: LanguagesControllerHost) {
    this.host = host;
    host.addController(this);
  }

  initialize(): void {
    if (this.host.languages === undefined) {
      this._loadLanguages();
    }
  }

  hostUpdate(): void {
    // When region changes, reload languages if they were auto-loaded
    if (
      (this._previousRegion !== this.host.region &&
        this._autoLoadedLanguages) ||
      this.host.languages === undefined
    ) {
      this._loadLanguages();
    }

    this._previousRegion = this.host.region;
  }

  private async _loadLanguages(): Promise<void> {
    if (this._loadingLanguages) {
      return;
    }

    this._loadingLanguages = true;

    try {
      const { languages, defaultLanguage } = getLanguagesByRegion(
        this.host.region,
      );

      this._autoLoadedLanguages = true;
      this.host._languages = languages;

      const previousLanguage = this.host.dictationConfig?.primaryLanguage;
      const selectedLanguage =
        (previousLanguage && languages.includes(previousLanguage))
          ? previousLanguage
          : defaultLanguage;

      this.host.dictationConfig = {
        ...this.host.dictationConfig,
        primaryLanguage: selectedLanguage || "en",
      };

      this.host.requestUpdate();
      this.host.dispatchEvent(
        languagesChangedEvent(languages, selectedLanguage),
      );
    } finally {
      this._loadingLanguages = false;
    }
  }

  /**
   * Clear the auto-loaded flag (when languages are set externally)
   */
  clearAutoLoadedFlag(): void {
    this._autoLoadedLanguages = false;
  }
}
