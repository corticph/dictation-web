export type RecordingState =
  | "initializing"
  | "recording"
  | "stopping"
  | "stopped";

export type Keybinding = string;

export type ConfigurableSettings = "device" | "language" | "keybinding";

export type ProxyOptions = {
  url: string;
  protocols?: string[];
  queryParameters?: Record<string, string>;
};
