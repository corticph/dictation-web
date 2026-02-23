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

type OutboundItem =
  | Blob
  | Corti.TranscribeFlushMessage
  | Corti.TranscribeEndMessage;

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
  #outboundQueue: OutboundItem[] = [];
  #socketReady = false;
  #connectingPromise: Promise<boolean | "superseded"> | null = null;
  #connectionGeneration = 0;
  #isConnecting = false;

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
  ): Promise<boolean | "superseded"> {
    if (this.#connectingPromise && !this.#configHasChanged()) {
      return this.#connectingPromise;
    }

    this.#isConnecting = true;
    this.#connectingPromise = this.#doConnect(
      dictationConfig,
      callbacks,
    ).finally(() => {
      this.#isConnecting = false;
      this.#connectingPromise = null;
    });

    return this.#connectingPromise;
  }

  async #doConnect(
    dictationConfig: Corti.TranscribeConfig,
    callbacks: WebSocketCallbacks,
  ): Promise<boolean | "superseded"> {
    const newConnection = this.#configHasChanged() || !this.isConnectionOpen();

    if (newConnection) {
      this.cleanup();

      this.#lastDictationConfig = this.host._dictationConfig || null;
      this.#lastSocketUrl = this.host._socketUrl;
      this.#lastSocketProxy = this.host._socketProxy;

      const generation = this.#connectionGeneration;

      const socket =
        this.host._socketUrl || this.host._socketProxy
          ? await this.#connectProxy(dictationConfig)
          : await this.#connectAuth(dictationConfig);

      if (this.#connectionGeneration !== generation) {
        socket.close();
        return "superseded";
      }

      this.#webSocket = socket;

      this.#callbacks?.onNetworkActivity?.("sent", {
        configuration: dictationConfig,
        type: "config",
      });
    }

    this.#callbacks = callbacks;
    this.#setupWebSocketHandlers(callbacks);

    if (!newConnection && this.isConnectionOpen()) {
      this.#socketReady = true;
      this.#drain();
    }

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
      if (message.type === "CONFIG_ACCEPTED") {
        this.#socketReady = true;
        this.#drain();
      }

      callbacks.onNetworkActivity?.("received", message);

      if (callbacks.onMessage) {
        callbacks.onMessage(message);
      }
    });

    this.#webSocket.on("error", (event: Error) => {
      this.#socketReady = false;
      if (callbacks.onError) {
        callbacks.onError(event);
      }
    });

    this.#webSocket.on("close", (event: unknown) => {
      this.#socketReady = false;
      if (callbacks.onClose) {
        callbacks.onClose(event);
      }
    });
  }

  #drain(): void {
    if (
      !this.#socketReady ||
      !this.isConnectionOpen() ||
      this.#outboundQueue.length === 0
    ) {
      return;
    }

    while (this.#outboundQueue.length > 0 && this.isConnectionOpen()) {
      const item = this.#outboundQueue.shift();

      if (item === undefined) {
        break;
      }

      if (item instanceof Blob) {
        this.#webSocket!.send(item);
        this.#callbacks?.onNetworkActivity?.("sent", {
          size: item.size,
          type: "audio",
        });
        continue;
      }

      this.#webSocket!.send(JSON.stringify(item));
      this.#callbacks?.onNetworkActivity?.("sent", {
        type: item.type,
      });
    }
  }

  mediaRecorderHandler = (data: Blob): void => {
    if (this.#socketReady && this.isConnectionOpen()) {
      this.#webSocket?.send(data);
      this.#callbacks?.onNetworkActivity?.("sent", {
        size: data.size,
        type: "audio",
      });
      return;
    }

    this.#outboundQueue.push(data);
  };

  async pause(): Promise<void> {
    if (this.#socketReady && this.isConnectionOpen()) {
      this.#webSocket?.send(JSON.stringify({ type: "flush" }));
      this.#callbacks?.onNetworkActivity?.("sent", { type: "flush" });
      return;
    }

    this.#outboundQueue.push({ type: "flush" });
  }

  isConnectionOpen(): boolean {
    return (
      this.#webSocket !== null &&
      (this.#webSocket.readyState === WebSocket.OPEN ||
        this.#webSocket.readyState === WebSocket.CONNECTING)
    );
  }

  isConnecting(): boolean {
    return this.#isConnecting;
  }

  async waitForConnection(): Promise<void> {
    await this.#connectingPromise;
  }

  async closeConnection(onClose?: (event: unknown) => void): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      const oldSocket = this.#webSocket;
      this.#webSocket = null;

      if (
        !oldSocket ||
        (oldSocket.readyState !== WebSocket.OPEN &&
          oldSocket.readyState !== WebSocket.CONNECTING)
      ) {
        this.#socketReady = false;
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

      const wasReady = this.#socketReady;
      this.#socketReady = false;

      oldSocket.on("message", (message) => {
        this.#callbacks?.onNetworkActivity?.("received", message);

        if (this.#callbacks?.onMessage) {
          this.#callbacks?.onMessage(message);
        }

        if (!wasReady && message.type === "CONFIG_ACCEPTED") {
          oldSocket.sendEnd({ type: "end" });
          this.#callbacks?.onNetworkActivity?.("sent", { type: "end" });
          return;
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

      if (wasReady) {
        oldSocket.sendEnd({ type: "end" });
        this.#callbacks?.onNetworkActivity?.("sent", { type: "end" });
      }

      this.#closeTimeout = window.setTimeout(() => {
        reject(new Error("Connection close timeout"));

        if (oldSocket?.readyState === WebSocket.OPEN) {
          oldSocket.close();
        }
      }, 10000);
    });
  }

  cleanup(): void {
    this.#connectionGeneration++;
    this.#socketReady = false;

    if (this.#closeTimeout) {
      clearTimeout(this.#closeTimeout);
      this.#closeTimeout = undefined;
    }

    if (this.isConnectionOpen()) {
      this.#webSocket?.close();
    }

    this.#webSocket = null;
    this.#cortiClient = null;
    this.#lastDictationConfig = null;
    this.#lastSocketUrl = undefined;
    this.#lastSocketProxy = undefined;
    this.#outboundQueue = [];
  }
}
