export type RecordingState =
  | "initializing"
  | "recording"
  | "stopping"
  | "stopped";

export type DictationMode = "toggle-to-talk" | "hold-to-talk";

export type Keybinding = string;

export type ConfigurableSettings =
  | "device"
  | "language"
  | "mode"
  | "keybinding";

export type ProxyOptions = {
  url: string;
  protocols?: string[];
  queryParameters?: Record<string, string>;
};
