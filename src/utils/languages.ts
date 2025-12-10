import type { Corti } from "@corti/sdk";
import {
  LANGUAGES_SUPPORTED_EU,
  LANGUAGES_SUPPORTED_US,
} from "../constants.js";

export const DEFAULT_LANGUAGES_BY_REGION: Record<
  string,
  Corti.TranscribeSupportedLanguage[]
> = {
  default: LANGUAGES_SUPPORTED_EU,
  eu: LANGUAGES_SUPPORTED_EU,
  us: LANGUAGES_SUPPORTED_US,
};

export function getLanguageName(languageCode: string): string {
  try {
    const userLocale = navigator.language || "en";
    const displayNames = new Intl.DisplayNames([userLocale], {
      type: "language",
    });
    const languageName = displayNames.of(languageCode);

    return languageName || languageCode;
  } catch {
    return languageCode;
  }
}

export function checkIfDefaultLanguagesList(
  languages: Corti.TranscribeSupportedLanguage[] = [],
): boolean {
  return Object.values(DEFAULT_LANGUAGES_BY_REGION).some(
    (languageList) => languageList === languages,
  );
}

export function getLanguagesByRegion(region?: string): {
  languages: Corti.TranscribeSupportedLanguage[];
  defaultLanguage: string | undefined;
} {
  const languages =
    DEFAULT_LANGUAGES_BY_REGION[region || "default"] ||
    DEFAULT_LANGUAGES_BY_REGION["default"];
  const defaultLanguage = languages?.[0];

  return { defaultLanguage, languages };
}
