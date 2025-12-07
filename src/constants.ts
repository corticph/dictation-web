import type { Corti } from "@corti/sdk";

export const LANGUAGES_SUPPORTED_EU: Corti.TranscribeSupportedLanguage[] = [
  "da",
  "de",
  "de-CH",
  "en",
  "en-GB",
  "es",
  "fr",
  "hu",
  "it",
  "nl",
  "no",
  "pt",
  "sv",
  "gsw-CH",
].sort();
export const LANGUAGES_SUPPORTED_US: Corti.TranscribeSupportedLanguage[] = [
  "da",
  "de",
  "de-CH",
  "en",
  "en-GB",
  "es",
  "fr",
  "hu",
  "it",
  "nl",
  "no",
  "pt",
  "sv",
].sort();
export const DEFAULT_DICTATION_CONFIG: Corti.TranscribeConfig = {
  automaticPunctuation: false,
  primaryLanguage: "en",
  spokenPunctuation: true,
};
