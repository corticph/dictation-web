import { action } from "storybook/actions";
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

export function eventAction<TDetail = unknown>(name: string) {
  const log = action(name);

  return (event: Event) => {
    const customEvent = event as CustomEvent<TDetail>;

    log({
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      composed: event.composed,
      defaultPrevented: event.defaultPrevented,
      detail: customEvent.detail,
      eventPhase: event.eventPhase,
      isTrusted: event.isTrusted,
      timeStamp: event.timeStamp,
      type: event.type,
    });
  };
}
