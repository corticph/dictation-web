import { type Corti, CortiClient } from "@corti/sdk";
import type { ReactiveController, ReactiveControllerHost } from "lit";
import { DEFAULT_DICTATION_CONFIG } from "../constants.js";
import {
  commandEvent,
  errorEvent,
  streamClosedEvent,
  transcriptEvent,
  usageEvent,
} from "../utils/events.js";
import { getErrorMessage } from "../utils.js";

type TranscribeSocket = Awaited<
  ReturnType<CortiClient["transcribe"]["connect"]>
>;

interface DictationControllerHost extends ReactiveControllerHost {
  _accessToken?: string;
  dispatchEvent(event: Event): boolean;
}

export class DictationController implements ReactiveController {
  host: DictationControllerHost;

  private _cortiClient: CortiClient | null = null;
  private _webSocket: TranscribeSocket | null = null;
  private _mediaRecorder: MediaRecorder | null = null;
  private _closeTimeout?: number;

  constructor(host: DictationControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostDisconnected(): void {
    this.cleanup();
  }

  async connect(
    mediaRecorder: MediaRecorder | null,
    dictationConfig: Corti.TranscribeConfig = DEFAULT_DICTATION_CONFIG,
  ): Promise<void> {
    if (!this.host._accessToken) {
      return;
    }

    if (!mediaRecorder) {
      throw new Error("MediaRecorder is required to connect");
    }

    this._mediaRecorder = mediaRecorder;
    this._cortiClient =
      this._cortiClient ||
      new CortiClient({
        auth: {
          refreshAccessToken: () => ({
            accessToken: this.host._accessToken || "",
          }),
        },
      });

    // Should resolve only when configuration is accepted
    this._webSocket = await this._cortiClient.transcribe.connect({
      configuration: dictationConfig,
    });

    this.setupWebSocketHandlers();
    this.setupMediaRecorder();
  }

  private setupWebSocketHandlers(): void {
    if (!this._webSocket) {
      return;
    }

    this._webSocket.on("message", (message) => {
      switch (message.type) {
        case "CONFIG_ACCEPTED":
          this._mediaRecorder?.start(250);
          break;
        case "transcript":
          this.host.dispatchEvent(transcriptEvent(message));
          break;
        case "command":
          this.host.dispatchEvent(commandEvent(message));
          break;
        case "usage":
          this.host.dispatchEvent(usageEvent(message));
          break;
        default:
          break;
      }
    });

    this._webSocket.on("error", (event) => {
      this.host.dispatchEvent(errorEvent(getErrorMessage(event)));
    });

    this._webSocket.on("close", (event) => {
      this.host.dispatchEvent(streamClosedEvent(event));
    });
  }

  private setupMediaRecorder(): void {
    if (!this._mediaRecorder) {
      return;
    }

    this._mediaRecorder.ondataavailable = (event) => {
      if (this._webSocket?.readyState === WebSocket.OPEN) {
        this._webSocket.sendAudio(event.data);
      }
    };
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      this._mediaRecorder?.stop();

      if (this._webSocket?.readyState === WebSocket.OPEN) {
        this._webSocket.sendEnd({ type: "end" });
      }

      this._closeTimeout = window.setTimeout(() => {
        if (this._webSocket?.readyState === WebSocket.OPEN) {
          this._webSocket.close();
        }
      }, 10000);

      this._webSocket?.on("close", () => {
        resolve();

        if (this._closeTimeout) {
          clearTimeout(this._closeTimeout);
          this._closeTimeout = undefined;
        }
      });
    });
  }

  cleanup(): void {
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
      this._closeTimeout = undefined;
    }

    if (this._webSocket?.readyState === WebSocket.OPEN) {
      this._webSocket.close();
    }

    this._webSocket = null;
    this._mediaRecorder = null;
  }

  get isConnected(): boolean {
    return this._webSocket?.readyState === WebSocket.OPEN;
  }
}
