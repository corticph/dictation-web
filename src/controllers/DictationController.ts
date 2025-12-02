import { type Corti, CortiClient } from "@corti/sdk";
import type { ReactiveController, ReactiveControllerHost } from "lit";
import { DEFAULT_DICTATION_CONFIG } from "../constants.js";

type TranscribeSocket = Awaited<
  ReturnType<CortiClient["transcribe"]["connect"]>
>;

interface DictationControllerHost extends ReactiveControllerHost {
  _accessToken?: string;
  _authConfig?: Corti.BearerOptions;
  _region?: string;
  _tenantName?: string;
}

export type TranscribeMessage =
  | Corti.TranscribeConfigStatusMessage
  | Corti.TranscribeUsageMessage
  | Corti.TranscribeEndedMessage
  | Corti.TranscribeErrorMessage
  | Corti.TranscribeTranscriptMessage
  | Corti.TranscribeCommandMessage
  | Corti.TranscribeFlushedMessage;

interface WebSocketCallbacks {
  onMessage?: (message: TranscribeMessage) => void;
  onError?: (error: Error) => void;
  onClose?: (event: unknown) => void;
  onNetworkActivity?: (direction: "sent" | "received", data: unknown) => void;
}

export class DictationController implements ReactiveController {
  host: DictationControllerHost;

  private _cortiClient: CortiClient | null = null;
  private _webSocket: TranscribeSocket | null = null;
  private _closeTimeout?: number;
  private _onNetworkActivity?: WebSocketCallbacks["onNetworkActivity"];

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
    callbacks: WebSocketCallbacks = {},
  ): Promise<void> {
    if (!this.host._authConfig && !this.host._accessToken) {
      throw new Error(
        "Auth configuration or access token is required to connect",
      );
    }

    if (!mediaRecorder) {
      throw new Error("MediaRecorder is required to connect");
    }

    if (this._webSocket?.readyState === WebSocket.OPEN) {
      throw new Error("Already connected. Disconnect before reconnecting.");
    }

    // Use authConfig if available, otherwise create one from accessToken
    const auth: Corti.BearerOptions = this.host._authConfig || {
      accessToken: this.host._accessToken || "",
      refreshAccessToken: () => ({
        accessToken: this.host._accessToken || "",
      }),
    };

    this._cortiClient = new CortiClient({
      auth,
      environment: this.host._region,
      tenantName: this.host._tenantName,
    });

    this._webSocket = await this._cortiClient.transcribe.connect({
      configuration: dictationConfig,
    });
    this._onNetworkActivity = callbacks.onNetworkActivity;
    this.setupMediaRecorder(mediaRecorder);
    this.setupWebSocketHandlers(callbacks);
  }

  private setupWebSocketHandlers(callbacks: WebSocketCallbacks): void {
    if (!this._webSocket) {
      throw new Error("WebSocket not initialized");
    }

    this._webSocket.on("message", (message) => {
      this._onNetworkActivity?.("received", message);

      if (callbacks.onMessage) {
        callbacks.onMessage(message);
      }
    });

    this._webSocket.on("error", (event) => {
      if (callbacks.onError) {
        callbacks.onError(event);
      }
    });

    this._webSocket.on("close", (event) => {
      if (callbacks.onClose) {
        callbacks.onClose(event);
      }
    });
  }

  private setupMediaRecorder(mediaRecorder: MediaRecorder): void {
    mediaRecorder.ondataavailable = (event) => {
      this._webSocket?.sendAudio(event.data);
      this._onNetworkActivity?.("sent", {
        size: event.data.size,
        type: "audio",
      });
    };
  }

  async disconnect(onClose?: (event: unknown) => void): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (!this._webSocket || this._webSocket.readyState !== WebSocket.OPEN) {
        resolve();
        return;
      }

      this._webSocket.on("close", (event) => {
        if (this._closeTimeout) {
          clearTimeout(this._closeTimeout);
          this._closeTimeout = undefined;
        }

        if (onClose) {
          onClose(event);
        }

        resolve();
      });

      this._webSocket.sendEnd({ type: "end" });
      this._onNetworkActivity?.("sent", { type: "end" });

      this._closeTimeout = window.setTimeout(() => {
        // Reject the promise before closing the web socket, so the promise rejects before close event fires
        reject(new Error("WebSocket close timeout"));

        if (this._webSocket?.readyState === WebSocket.OPEN) {
          this._webSocket.close();
        }
      }, 10000);
    });

    this.cleanup();
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
  }
}
