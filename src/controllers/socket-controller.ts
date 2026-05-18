import { type CortiAuth, CortiClient } from "@corti/sdk";
import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { ProxyOptions } from "../types.js";
import { errorEvent } from "../utils/events.js";

export interface SocketControllerHost extends ReactiveControllerHost {
  dispatchEvent: (event: Event) => void;
  _accessToken?: string;
  _authConfig?: CortiAuth.AuthTokenDerivable;
  _region?: string;
  _tenantName?: string;
  _socketUrl?: string;
  _socketProxy?: ProxyOptions;
}

export type SocketControllerWebSocket = {
  readyState: number;
  close(): void;
  on(event: "message", handler: (message: { type: string }) => void): void;
  on(event: "error", handler: (error: Error) => void): void;
  on(event: "close", handler: (event: unknown) => void): void;
  send(data: Blob | ArrayBufferLike | string): void;
  sendEnd(message: { type: "end" }): void;
};

export type SocketControllerCallbacks<TMessage = unknown> = {
  onMessage?: (message: TMessage) => void;
  onError?: (error: Error) => void;
  onClose?: (event: unknown) => void;
  onNetworkActivity?: (direction: "sent" | "received", data: unknown) => void;
};

export type SocketControllerOutboundItem = Blob | { type: string };

export abstract class SocketController<
  TOutbound extends SocketControllerOutboundItem,
  TMessage = unknown,
  TConfig = unknown,
  TSocket extends SocketControllerWebSocket = SocketControllerWebSocket,
> implements ReactiveController
{
  readonly host: SocketControllerHost;

  #webSocket: TSocket | null = null;
  #cortiClient: CortiClient | null = null;
  #connectionGeneration = 0;
  #socketReady = false;
  #closeTimeout?: number;
  #outboundQueue: TOutbound[] = [];
  #callbacks?: SocketControllerCallbacks<TMessage>;
  #lastConfig: TConfig | null = null;
  #lastSocketUrl?: string;
  #lastSocketProxy?: ProxyOptions;
  #connectingPromise: Promise<boolean | "superseded"> | null = null;
  #isConnecting = false;

  protected abstract _connectThroughProxy(
    config: TConfig,
    proxy: ProxyOptions,
  ): Promise<TSocket>;
  protected abstract _connectThroughAuth(
    client: CortiClient,
    config: TConfig,
  ): Promise<TSocket>;

  constructor(host: SocketControllerHost) {
    this.host = host;
    host.addController(this);
  }

  async #openViaProxy(config: TConfig): Promise<TSocket> {
    const proxyOptions = this.host._socketProxy || {
      url: this.host._socketUrl || "",
    };

    if (!proxyOptions.url) {
      throw new Error("Proxy URL is required when using proxy client");
    }

    return this._connectThroughProxy(config, proxyOptions);
  }

  async #openViaAuth(config: TConfig): Promise<TSocket> {
    if (!this.host._authConfig && !this.host._accessToken) {
      throw new Error(
        "Auth configuration or access token is required to connect",
      );
    }

    const auth: CortiAuth.AuthTokenDerivable = this.host._authConfig || {
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

    return this._connectThroughAuth(this.#cortiClient, config);
  }

  async connect(
    config: TConfig,
    callbacks: SocketControllerCallbacks<TMessage>,
  ): Promise<boolean | "superseded"> {
    // If a connection attempt is already in progress with the same config, reuse it
    // to avoid opening multiple sockets when connect() is called concurrently.
    if (this.#connectingPromise && !this.#configHasChanged(config)) {
      return this.#connectingPromise;
    }

    // #isConnecting must be set synchronously before #doConnect runs, because
    // #doConnect calls cleanup() which closes the old socket, firing its "close"
    // event synchronously. Handlers that check isConnecting() need to see true
    // at that point — before #connectingPromise is even assigned.
    this.#isConnecting = true;
    this.#connectingPromise = this.#doConnect(config, callbacks).finally(() => {
      this.#isConnecting = false;
      this.#connectingPromise = null;
    });

    return this.#connectingPromise;
  }

  async #doConnect(
    config: TConfig,
    callbacks: SocketControllerCallbacks<TMessage>,
  ): Promise<boolean | "superseded"> {
    const newConnection =
      this.#configHasChanged(config) || !this.isConnectionOpen();

    if (newConnection) {
      this.cleanup();

      this.#lastConfig = config;
      this.#lastSocketUrl = this.host._socketUrl;
      this.#lastSocketProxy = this.host._socketProxy;

      const generation = this.#connectionGeneration;

      const socket =
        this.host._socketUrl || this.host._socketProxy
          ? await this.#openViaProxy(config)
          : await this.#openViaAuth(config);

      // If cleanup() was called while we were awaiting (e.g. config changed),
      // the generation counter will have advanced — discard this stale socket.
      if (this.#connectionGeneration !== generation) {
        socket.close();
        return "superseded";
      }

      this.#webSocket = socket;

      callbacks?.onNetworkActivity?.("sent", {
        configuration: config,
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

  hostDisconnected(): void {
    this.cleanup();
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

  #isSocketOpen(): boolean {
    return (
      this.#webSocket !== null && this.#webSocket.readyState === WebSocket.OPEN
    );
  }

  #configHasChanged(nextConfig: TConfig): boolean {
    return (
      JSON.stringify(nextConfig) !== JSON.stringify(this.#lastConfig) ||
      this.host._socketUrl !== this.#lastSocketUrl ||
      JSON.stringify(this.host._socketProxy) !==
        JSON.stringify(this.#lastSocketProxy)
    );
  }

  #drain(): void {
    if (
      !this.#socketReady ||
      !this.#isSocketOpen() ||
      this.#outboundQueue.length === 0
    ) {
      return;
    }

    while (this.#outboundQueue.length > 0 && this.#isSocketOpen()) {
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
    if (this.#socketReady && this.#isSocketOpen()) {
      this.#webSocket?.send(data);
      this.#callbacks?.onNetworkActivity?.("sent", {
        size: data.size,
        type: "audio",
      });
      return;
    }

    this.#outboundQueue.push(data as TOutbound);
  };

  async pause(): Promise<void> {
    if (this.#socketReady && this.#isSocketOpen()) {
      this.#webSocket?.send(JSON.stringify({ type: "flush" }));
      this.#callbacks?.onNetworkActivity?.("sent", { type: "flush" });
      return;
    }

    this.#outboundQueue.push({ type: "flush" } as TOutbound);
  }

  async stopRecording(): Promise<void> {
    await this.pause();
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
        } else if (this.#callbacks?.onClose) {
          this.#callbacks.onClose(event);
        }

        resolve();
      });

      const wasReady = this.#socketReady;
      this.#socketReady = false;

      oldSocket.on("message", (message) => {
        this.#callbacks?.onNetworkActivity?.("received", message);

        if (this.#callbacks?.onMessage) {
          this.#callbacks.onMessage(message as TMessage);
        }

        // closeConnection() may be called before CONFIG_ACCEPTED arrives (e.g.
        // openConnection() followed immediately by closeConnection()). We can't
        // use the outbound queue here because #webSocket is already null, so we
        // send "end" directly on oldSocket as soon as config is accepted.
        if (!wasReady && message.type === "CONFIG_ACCEPTED") {
          oldSocket.sendEnd({ type: "end" });
          this.#callbacks?.onNetworkActivity?.("sent", { type: "end" });
          return;
        }

        if (message.type === "ended" || message.type === "ENDED") {
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
    this.#lastConfig = null;
    this.#lastSocketUrl = undefined;
    this.#lastSocketProxy = undefined;

    if (this.#outboundQueue.length > 0) {
      this.host.dispatchEvent(
        errorEvent(
          `${this.#outboundQueue.length} unsent message(s) were discarded because the configuration changed before the connection was closed`,
        ),
      );
    }

    this.#outboundQueue = [];
  }

  #setupWebSocketHandlers(
    callbacks: SocketControllerCallbacks<TMessage>,
  ): void {
    if (!this.#webSocket) {
      throw new Error("WebSocket not initialized");
    }

    this.#webSocket.on("message", (message) => {
      if (message.type === "CONFIG_ACCEPTED") {
        this.#socketReady = true;
        this.#drain();
      }

      callbacks.onNetworkActivity?.("received", message);

      if (callbacks.onMessage) {
        callbacks.onMessage(message as TMessage);
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
}
