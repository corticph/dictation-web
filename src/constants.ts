import type { Corti } from "@corti/sdk";

export const LANGUAGES_SUPPORTED_EU: Corti.TranscribeSupportedLanguage[] = [
  "en",
  "en-GB",
  "da",
  "de",
  "fr",
  "sv",
  "nl",
  "no",
].sort();
export const LANGUAGES_SUPPORTED_US: Corti.TranscribeSupportedLanguage[] = [
  "en",
].sort();
export const DEFAULT_DICTATION_CONFIG: Corti.TranscribeConfig = {
  automaticPunctuation: true,
  primaryLanguage: "en",
  spokenPunctuation: true,
};
