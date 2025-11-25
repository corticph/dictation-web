import {
  LANGUAGES_SUPPORTED_EU,
  LANGUAGES_SUPPORTED_US,
} from "../constants.js";

export const DEFAULT_LANGUAGES_BY_REGION: Record<string, string[]> = {
  default: LANGUAGES_SUPPORTED_EU,
  eu: LANGUAGES_SUPPORTED_EU,
  us: LANGUAGES_SUPPORTED_US,
};

export function checkIfDefaultLanguagesList(languages: string[] = []): boolean {
  return Object.values(DEFAULT_LANGUAGES_BY_REGION).some(
    (languageList) => languageList === languages,
  );
}

export function getLanguagesByRegion(
  region?: string,
): { languages: string[]; defaultLanguage: string | undefined } {
  const languages = DEFAULT_LANGUAGES_BY_REGION[region || "default"];
  const defaultLanguage = languages?.[0];

  return { languages, defaultLanguage };
}

