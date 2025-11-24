/**
 * Custom event creators for component communication
 */

export type LanguageChangedEventDetail = {
  language: string;
};

export type LanguagesSupportedChangedEventDetail = {
  languagesSupported: string[];
};

export function languageChangedEvent(
  language: string,
): CustomEvent<LanguageChangedEventDetail> {
  return new CustomEvent("language-changed", {
    bubbles: true,
    composed: true,
    detail: { language },
  });
}

export function languagesSupportedChangedEvent(
  languagesSupported: string[],
): CustomEvent<LanguagesSupportedChangedEventDetail> {
  return new CustomEvent("languages-supported-changed", {
    bubbles: true,
    composed: true,
    detail: { languagesSupported },
  });
}
