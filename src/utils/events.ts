/**
 * Custom event creators for component communication
 */

export type LanguagesChangedEventDetail = {
  languages: string[];
  selectedLanguage: string | undefined;
};

export type RecordingDevicesChangedEventDetail = {
  devices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo | undefined;
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
