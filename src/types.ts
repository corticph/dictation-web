import type { StreamAmbientMessage } from "./controllers/ambient-controller.js";
import type { TranscribeMessage } from "./controllers/dictation-controller.js";

export type RecordingSocketInboundMessage =
  | TranscribeMessage
  | StreamAmbientMessage;

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
