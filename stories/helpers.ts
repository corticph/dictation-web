import {
  LANGUAGES_SUPPORTED_EU,
  LANGUAGES_SUPPORTED_US,
} from "../src/constants";

export function disableControls(controls: string[]) {
  const argTypes: Record<string, unknown> = {};
  controls.forEach((control) => {
    argTypes[control] = { control: false, table: { disable: true } };
  });
  return argTypes;
}

export const mockDevices: MediaDeviceInfo[] = [
  {
    deviceId: "device1",
    groupId: "group1",
    kind: "audioinput",
    label: "Custom Microphone 1",
    toJSON: () => ({}),
  },
  {
    deviceId: "device2",
    groupId: "group1",
    kind: "audioinput",
    label: "Custom Microphone 2",
    toJSON: () => ({}),
  },
  {
    deviceId: "device3",
    groupId: "group1",
    kind: "audioinput",
    label: "Custom Microphone 3",
    toJSON: () => ({}),
  },
];

export const languages = Array.from(
  new Set([...LANGUAGES_SUPPORTED_EU, ...LANGUAGES_SUPPORTED_US]),
);
