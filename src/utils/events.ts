import type { Corti } from "@corti/sdk";
import type { RecordingState } from "../types.js";

export type LanguagesChangedEventDetail = {
  languages: string[];
  selectedLanguage: string | undefined;
};

export type LanguageChangedEventDetail = {
  language: string;
};

export type RecordingDevicesChangedEventDetail = {
  devices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo | undefined;
};

export type RecordingStateChangedEventDetail = {
  state: RecordingState;
};

export type AudioLevelChangedEventDetail = {
  audioLevel: number;
};

export type TranscriptEventDetail = Corti.TranscribeTranscriptMessage;
export type CommandEventDetail = Corti.TranscribeCommandMessage;
export type UsageEventDetail = Corti.TranscribeUsageMessage;

export type ErrorEventDetail = {
  message: string;
};

export function languagesChangedEvent(
  languages: string[],
  selectedLanguage: string | undefined,
): CustomEvent<LanguagesChangedEventDetail> {
  return new CustomEvent("languages-changed", {
    bubbles: true,
    composed: true,
    detail: { languages, selectedLanguage },
  });
}

/**
 * @deprecated Use languagesChangedEvent instead. This event is kept for backward compatibility.
 */
export function languageChangedEvent(
  language: string,
): CustomEvent<LanguageChangedEventDetail> {
  return new CustomEvent("language-changed", {
    bubbles: true,
    composed: true,
    detail: { language },
  });
}

export function recordingDevicesChangedEvent(
  devices: MediaDeviceInfo[],
  selectedDevice: MediaDeviceInfo | undefined,
): CustomEvent<RecordingDevicesChangedEventDetail> {
  return new CustomEvent("recording-devices-changed", {
    bubbles: true,
    composed: true,
    detail: { devices, selectedDevice },
  });
}

export function recordingStateChangedEvent(
  state: RecordingState,
): CustomEvent<RecordingStateChangedEventDetail> {
  return new CustomEvent("recording-state-changed", {
    bubbles: true,
    composed: true,
    detail: { state },
  });
}

export function transcriptEvent(
  detail: TranscriptEventDetail,
): CustomEvent<TranscriptEventDetail> {
  return new CustomEvent("transcript", {
    bubbles: true,
    composed: true,
    detail,
  });
}

export function commandEvent(
  detail: CommandEventDetail,
): CustomEvent<CommandEventDetail> {
  return new CustomEvent("command", {
    bubbles: true,
    composed: true,
    detail,
  });
}

export function usageEvent(
  detail: UsageEventDetail,
): CustomEvent<UsageEventDetail> {
  return new CustomEvent("usage", {
    bubbles: true,
    composed: true,
    detail,
  });
}

export function errorEvent(error: unknown): CustomEvent<ErrorEventDetail> {
  const message =
    error instanceof Error && error.message ? error.message : String(error);

  return new CustomEvent("error", {
    bubbles: false,
    composed: true,
    detail: { message },
  });
}

export function streamClosedEvent(detail: unknown): CustomEvent {
  return new CustomEvent("stream-closed", {
    bubbles: true,
    composed: true,
    detail,
  });
}

export function readyEvent(): CustomEvent {
  return new CustomEvent("ready", {
    bubbles: true,
    composed: true,
  });
}

export function audioLevelChangedEvent(
  audioLevel: number,
): CustomEvent<AudioLevelChangedEventDetail> {
  return new CustomEvent("audio-level-changed", {
    bubbles: true,
    composed: true,
    detail: { audioLevel },
  });
}

export type NetworkActivityEventDetail = {
  direction: "sent" | "received";
  data: unknown;
};

export function networkActivityEvent(
  direction: "sent" | "received",
  data: unknown,
): CustomEvent<NetworkActivityEventDetail> {
  return new CustomEvent("network-activity", {
    bubbles: true,
    composed: true,
    detail: { data, direction },
  });
}
