import type { Corti } from "@corti/sdk";
import { type ContextEvent, createContext, provide } from "@lit/context";
import type { LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { LanguagesController } from "../../controllers/languages-controller.js";
import { commaSeparatedConverter } from "../../utils/converters.js";
import type { LanguagesChangedEventDetail } from "../../utils/events.js";
import { getPreferredDefaultLanguage } from "../../utils/languages.js";
import type { Constructor } from "./types.js";

export const languagesContext = createContext<
  Corti.TranscribeSupportedLanguage[] | undefined
>(Symbol("languages"));
export const selectedLanguageContext = createContext<
  Corti.TranscribeSupportedLanguage | undefined
>(Symbol("selectedLanguage"));

export declare class LanguagesContextInterface {
  _languages?: Corti.TranscribeSupportedLanguage[];
  _selectedLanguage?: Corti.TranscribeSupportedLanguage;
  languages?: Corti.TranscribeSupportedLanguage[];
}

export function LanguagesContextMixin<T extends Constructor<LitElement>>(
  superclass: T,
): Constructor<LanguagesContextInterface> & T {
  class LanguagesContextMixinClass extends superclass {
    #languagesController = new LanguagesController(this);

    @provide({ context: languagesContext })
    @state()
    _languages?: Corti.TranscribeSupportedLanguage[];

    @provide({ context: selectedLanguageContext })
    @state()
    _selectedLanguage?: Corti.TranscribeSupportedLanguage;

    @property({
      converter: commaSeparatedConverter,
      type: Array,
    })
    set languages(value: Corti.TranscribeSupportedLanguage[] | undefined) {
      this._languages = value;

      // Clear auto-loaded flag when languages are set via property
      if (value !== undefined) {
        this.#languagesController.clearAutoLoadedFlag();
      }

      if (value === undefined) {
        return;
      }

      if (value.length === 0) {
        this._selectedLanguage = undefined;
        return;
      }

      if (
        this._selectedLanguage === undefined ||
        !value.includes(this._selectedLanguage)
      ) {
        this._selectedLanguage = getPreferredDefaultLanguage(value);
      }
    }

    get languages(): Corti.TranscribeSupportedLanguage[] | undefined {
      return this._languages;
    }

    constructor(...args: any[]) {
      super(...args);

      this.addEventListener("context-request", (e: Event) => {
        const ev = e as ContextEvent<typeof languagesContext>;

        if (ev.context === languagesContext) {
          this.#languagesController.initialize();
        }
      });

      this.addEventListener("languages-changed", (e: Event) => {
        const event = e as CustomEvent<LanguagesChangedEventDetail>;
        const selectedLanguage = event.detail.selectedLanguage as
          | Corti.TranscribeSupportedLanguage
          | undefined;

        this._selectedLanguage =
          selectedLanguage ??
          getPreferredDefaultLanguage(event.detail.languages);
      });
    }
  }

  return LanguagesContextMixinClass as Constructor<LanguagesContextInterface> &
    T;
}
