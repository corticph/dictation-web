import {
  type Corti,
  type CortiClient,
  CortiWebSocketProxyClient,
} from "@corti/sdk";
import type { ProxyOptions } from "../types.js";
import { SocketController } from "./socket-controller.js";

type TranscribeSocket = Awaited<
  ReturnType<CortiClient["transcribe"]["connect"]>
>;

export type TranscribeMessage =
  | Corti.TranscribeConfigStatusMessage
  | Corti.TranscribeUsageMessage
  | Corti.TranscribeDeltaUsageMessage
  | Corti.TranscribeEndedMessage
  | Corti.TranscribeErrorMessage
  | Corti.TranscribeTranscriptMessage
  | Corti.TranscribeCommandMessage
  | Corti.TranscribeFlushedMessage;

type OutboundItem =
  | Blob
  | Corti.TranscribeFlushMessage
  | Corti.TranscribeEndMessage;

export class DictationController extends SocketController<
  OutboundItem,
  TranscribeMessage,
  Corti.TranscribeConfig,
  TranscribeSocket
> {
  async stopRecording(): Promise<void> {
    await this.pause();
  }

  protected async _connectThroughProxy(
    dictationConfig: Corti.TranscribeConfig,
    proxy: ProxyOptions,
  ): Promise<TranscribeSocket> {
    return await CortiWebSocketProxyClient.transcribe.connect({
      // awaitConfiguration: false — CONFIG_* appears in network activity before the socket is configured server-side
      awaitConfiguration: false,
      configuration: dictationConfig,
      proxy,
    });
  }

  protected async _connectThroughAuth(
    client: CortiClient,
    dictationConfig: Corti.TranscribeConfig,
  ): Promise<TranscribeSocket> {
    return await client.transcribe.connect({
      // awaitConfiguration: false — CONFIG_* appears in network activity before the socket is configured server-side
      awaitConfiguration: false,
      configuration: dictationConfig,
    });
  }
}
