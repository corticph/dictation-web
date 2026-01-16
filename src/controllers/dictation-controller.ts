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
  _dictationConfig?: Corti.TranscribeConfig;
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
  #callbacks?: WebSocketCallbacks;
  #lastDictationConfig: Corti.TranscribeConfig | null = null;
  #lastSocketUrl?: string;
  #lastSocketProxy?: ProxyOptions;

  constructor(host: DictationControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostDisconnected(): void {
    this.cleanup();
  }

  #configHasChanged(): boolean {
    return (
      JSON.stringify(this.host._dictationConfig) !==
        JSON.stringify(this.#lastDictationConfig) ||
      this.host._socketUrl !== this.#lastSocketUrl ||
      JSON.stringify(this.host._socketProxy) !==
        JSON.stringify(this.#lastSocketProxy)
    );
  }

  async connect(
    dictationConfig: Corti.TranscribeConfig = DEFAULT_DICTATION_CONFIG,
    callbacks: WebSocketCallbacks = {},
  ): Promise<boolean> {
    const newConnection =
      this.#configHasChanged() ||
      this.#webSocket?.readyState !== WebSocket.OPEN;

    if (newConnection) {
      this.cleanup();

      if (this.#webSocket?.readyState === WebSocket.OPEN) {
        throw new Error("Already connected. Disconnect before reconnecting.");
      }

      this.#webSocket =
        this.host._socketUrl || this.host._socketProxy
          ? await this.#connectProxy(dictationConfig)
          : await this.#connectAuth(dictationConfig);

      this.#callbacks?.onNetworkActivity?.("sent", {
        configuration: dictationConfig,
        type: "config",
      });

      this.#lastDictationConfig = this.host._dictationConfig || null;
      this.#lastSocketUrl = this.host._socketUrl;
      this.#lastSocketProxy = this.host._socketProxy;
    }

    this.#callbacks = callbacks;
    this.#setupWebSocketHandlers(callbacks);

    return newConnection;
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
      callbacks.onNetworkActivity?.("received", message);

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

  mediaRecorderHandler = (data: Blob): void => {
    this.#webSocket?.sendAudio(data);
    this.#callbacks?.onNetworkActivity?.("sent", {
      size: data.size,
      type: "audio",
    });
  };

  async pause(): Promise<void> {
    this.#webSocket?.sendFlush({ type: "flush" });
    this.#callbacks?.onNetworkActivity?.("sent", { type: "flush" });
  }

  isConnectionOpen(): boolean {
    return (
      this.#webSocket !== null &&
      (this.#webSocket.readyState === WebSocket.OPEN ||
        this.#webSocket.readyState === WebSocket.CONNECTING)
    );
  }

  async closeConnection(onClose?: (event: unknown) => void): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      const oldSocket = this.#webSocket;
      this.#webSocket = null;

      if (!oldSocket || oldSocket.readyState !== WebSocket.OPEN) {
        resolve();
        return;
      }

      oldSocket.on("close", (event) => {
        if (this.#closeTimeout) {
          clearTimeout(this.#closeTimeout);
          this.#closeTimeout = undefined;
        }

        if (onClose) {
          onClose(event);
        }

        resolve();
      });

      oldSocket.on("message", (message) => {
        this.#callbacks?.onNetworkActivity?.("received", message);

        if (this.#callbacks?.onMessage) {
          this.#callbacks?.onMessage(message);
        }

        if (message.type === "ended") {
          if (this.#closeTimeout) {
            clearTimeout(this.#closeTimeout);
            this.#closeTimeout = undefined;
          }

          resolve();
          return;
        }
      });

      oldSocket.sendEnd({ type: "end" });
      this.#callbacks?.onNetworkActivity?.("sent", { type: "end" });

      this.#closeTimeout = window.setTimeout(() => {
        reject(new Error("Connection close timeout"));

        if (oldSocket?.readyState === WebSocket.OPEN) {
          oldSocket.close();
        }
      }, 10000);
    });
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
    this.#lastDictationConfig = null;
    this.#lastSocketUrl = undefined;
    this.#lastSocketProxy = undefined;
  }
}
