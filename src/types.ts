export type RecordingState =
  | "initializing"
  | "recording"
  | "stopping"
  | "stopped";

export type ConfigurableSettings = "device" | "language";

export type ProxyOptions = {
  url: string;
  protocols?: string[];
  queryParameters?: Record<string, string>;
};
