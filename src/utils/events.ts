import type { RecordingState } from "../types.js";

export type LanguagesChangedEventDetail = {
  languages: string[];
  selectedLanguage: string | undefined;
};

export type RecordingDevicesChangedEventDetail = {
  devices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo | undefined;
};

export type RecordingStateChangedEventDetail = {
  state: RecordingState;
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

export function transcriptEvent(detail: unknown): CustomEvent {
  return new CustomEvent("transcript", {
    bubbles: true,
    composed: true,
    detail,
  });
}

export function commandEvent(detail: unknown): CustomEvent {
  return new CustomEvent("command", {
    bubbles: true,
    composed: true,
    detail,
  });
}

export function usageEvent(detail: unknown): CustomEvent {
  return new CustomEvent("usage", {
    bubbles: true,
    composed: true,
    detail,
  });
}

export function errorEvent(error: unknown): CustomEvent {
  const detail = error instanceof Error ? error.message : String(error);

  return new CustomEvent("error", {
    bubbles: false,
    composed: true,
    detail,
  });
}

export function streamClosedEvent(detail: unknown): CustomEvent {
  return new CustomEvent("stream-closed", {
    bubbles: true,
    composed: true,
    detail,
  });
}
