import { type Corti, CortiClient, CortiWebSocketProxyClient } from "@corti/sdk";
import type { ReactiveController, ReactiveControllerHost } from "lit";
import { DEFAULT_DICTATION_CONFIG } from "../constants.js";
import type { ProxyOptions } from "../types.js";

type TranscribeSocket = Awaited<
  ReturnType<CortiClient["transcribe"]["connect"]>
>;

interface DictationControllerHost extends ReactiveControllerHost {
  _accessToken?: string;
  _authConfig?: Corti.BearerOptions;
  _region?: string;
  _tenantName?: string;
  _socketUrl?: string;
  _socketProxy?: ProxyOptions;
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

  #cortiClient: CortiClient | null = null;
  #webSocket: TranscribeSocket | null = null;
  #closeTimeout?: number;
  #onNetworkActivity?: WebSocketCallbacks["onNetworkActivity"];

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
    if (!mediaRecorder) {
      throw new Error("MediaRecorder is required to connect");
    }

    if (this.#webSocket?.readyState === WebSocket.OPEN) {
      throw new Error("Already connected. Disconnect before reconnecting.");
    }

    this.#webSocket =
      this.host._socketUrl || this.host._socketProxy
        ? await this.#connectProxy(dictationConfig)
        : await this.#connectAuth(dictationConfig);

    this.#onNetworkActivity = callbacks.onNetworkActivity;
    this.#setupMediaRecorder(mediaRecorder);
    this.#setupWebSocketHandlers(callbacks);
  }

  async #connectProxy(
    dictationConfig: Corti.TranscribeConfig,
  ): Promise<TranscribeSocket> {
    const proxyOptions = this.host._socketProxy || {
      url: this.host._socketUrl || "",
    };

    if (!proxyOptions.url) {
      throw new Error("Proxy URL is required when using proxy client");
    }

    return await CortiWebSocketProxyClient.transcribe.connect({
      configuration: dictationConfig,
      proxy: proxyOptions,
    });
  }

  async #connectAuth(
    dictationConfig: Corti.TranscribeConfig,
  ): Promise<TranscribeSocket> {
    if (!this.host._authConfig && !this.host._accessToken) {
      throw new Error(
        "Auth configuration or access token is required to connect",
      );
    }

    // Use authConfig if available, otherwise create one from accessToken
    const auth: Corti.BearerOptions = this.host._authConfig || {
      accessToken: this.host._accessToken || "",
      refreshAccessToken: () => ({
        accessToken: this.host._accessToken || "",
      }),
    };

    this.#cortiClient = new CortiClient({
      auth,
      environment: this.host._region,
      tenantName: this.host._tenantName,
    });

    return await this.#cortiClient.transcribe.connect({
      configuration: dictationConfig,
    });
  }

  #setupWebSocketHandlers(callbacks: WebSocketCallbacks): void {
    if (!this.#webSocket) {
      throw new Error("WebSocket not initialized");
    }

    this.#webSocket.on("message", (message: TranscribeMessage) => {
      this.#onNetworkActivity?.("received", message);

      if (callbacks.onMessage) {
        callbacks.onMessage(message);
      }
    });

    this.#webSocket.on("error", (event: Error) => {
      if (callbacks.onError) {
        callbacks.onError(event);
      }
    });

    this.#webSocket.on("close", (event: unknown) => {
      if (callbacks.onClose) {
        callbacks.onClose(event);
      }
    });
  }

  #setupMediaRecorder(mediaRecorder: MediaRecorder): void {
    mediaRecorder.ondataavailable = (event) => {
      this.#webSocket?.sendAudio(event.data);
      this.#onNetworkActivity?.("sent", {
        size: event.data.size,
        type: "audio",
      });
    };
  }

  async disconnect(onClose?: (event: unknown) => void): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (!this.#webSocket || this.#webSocket.readyState !== WebSocket.OPEN) {
        resolve();
        return;
      }

      this.#webSocket.on("close", (event) => {
        if (this.#closeTimeout) {
          clearTimeout(this.#closeTimeout);
          this.#closeTimeout = undefined;
        }

        if (onClose) {
          onClose(event);
        }

        resolve();
      });

      this.#webSocket.sendEnd({ type: "end" });
      this.#onNetworkActivity?.("sent", { type: "end" });

      this.#closeTimeout = window.setTimeout(() => {
        // Reject the promise before closing the web socket, so the promise rejects before close event fires
        reject(new Error("WebSocket close timeout"));

        if (this.#webSocket?.readyState === WebSocket.OPEN) {
          this.#webSocket.close();
        }
      }, 10000);
    });

    this.cleanup();
  }

  cleanup(): void {
    if (this.#closeTimeout) {
      clearTimeout(this.#closeTimeout);
      this.#closeTimeout = undefined;
    }

    if (this.#webSocket?.readyState === WebSocket.OPEN) {
      this.#webSocket.close();
    }

    this.#webSocket = null;
    this.#cortiClient = null;
  }
}
