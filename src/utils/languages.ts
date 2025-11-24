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

