import type { ReactiveController, ReactiveControllerHost } from "lit";
import { errorEvent } from "../utils/events.js";
import {
  calculateAudioLevel,
  createAudioAnalyzer,
  getMediaStream,
} from "../utils/media.js";

interface MediaControllerHost extends ReactiveControllerHost {
  _selectedDevice?: MediaDeviceInfo;
  _debug_displayAudio?: boolean;
  dispatchEvent(event: Event): boolean;
}

export class MediaController implements ReactiveController {
  host: MediaControllerHost;

  #mediaStream: MediaStream | null = null;
  #audioContext: AudioContext | null = null;
  #analyser: AnalyserNode | null = null;
  #mediaRecorder: MediaRecorder | null = null;
  #visualiserInterval?: number;
  #audioLevel: number = 0;
  #onTrackEnded?: () => void;
  #onAudioLevelChange?: (level: number) => void;
  #dataHandler?: (data: Blob) => void;
  #bufferedChunks: Blob[] = [];

  constructor(host: MediaControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostDisconnected(): void {
    this.cleanup();
  }

  async initialize(onTrackEnded?: () => void): Promise<void> {
    await this.cleanup();

    this.#onTrackEnded = onTrackEnded;
    this.#mediaStream = await getMediaStream(
      this.host._selectedDevice?.deviceId,
      this.host._debug_displayAudio,
    );

    this.#mediaStream.getTracks().forEach((track: MediaStreamTrack) => {
      track.addEventListener("ended", () => {
        if (this.#onTrackEnded) {
          this.#onTrackEnded();
        }
      });
    });

    const { audioContext, analyser } = createAudioAnalyzer(this.#mediaStream);

    this.#audioContext = audioContext;
    this.#analyser = analyser;

    this.#mediaRecorder = new MediaRecorder(this.#mediaStream);
    this.#mediaRecorder.ondataavailable = (event) => {
      if (this.#dataHandler) {
        this.#dataHandler(event.data);
        return;
      }

      this.#bufferedChunks.push(event.data);
    };
  }

  getAudioLevel(): number {
    return this.#analyser ? calculateAudioLevel(this.#analyser) : 0;
  }

  startAudioLevelMonitoring(
    onAudioLevelChange?: (level: number) => void,
  ): void {
    this.stopAudioLevelMonitoring();

    this.#onAudioLevelChange = onAudioLevelChange;

    this.#visualiserInterval = window.setInterval(() => {
      this.#audioLevel = this.getAudioLevel() * 3;
      this.host.requestUpdate();

      if (this.#onAudioLevelChange) {
        this.#onAudioLevelChange(this.#audioLevel);
      }
    }, 150);
  }

  stopAudioLevelMonitoring(): void {
    if (this.#visualiserInterval) {
      clearInterval(this.#visualiserInterval);
      this.#visualiserInterval = undefined;
    }

    this.#audioLevel = 0;
    this.host.requestUpdate();

    if (this.#onAudioLevelChange) {
      this.#onAudioLevelChange(this.#audioLevel);
    }
  }

  async cleanup(): Promise<void> {
    this.stopAudioLevelMonitoring();

    if (this.#mediaRecorder?.state === "recording") {
      this.#mediaRecorder.stop();
    }

    if (this.#mediaRecorder) {
      this.#mediaRecorder.ondataavailable = null;
    }

    if (this.#mediaStream) {
      this.#mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.#mediaStream = null;
    }

    if (this.#audioContext && this.#audioContext.state !== "closed") {
      await this.#audioContext.close();
    }

    this.#audioContext = null;

    this.#analyser = null;
    this.#mediaRecorder = null;
    this.#onTrackEnded = undefined;
    this.#onAudioLevelChange = undefined;
    this.#dataHandler = undefined;
    this.#bufferedChunks = [];
  }

  /**
   * Stops the media recorder and waits for all buffered data to be flushed.
   * This ensures the final ondataavailable event fires before resolving.
   */
  async stopRecording(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.#mediaRecorder || this.#mediaRecorder.state !== "recording") {
        resolve();
        return;
      }

      this.#mediaRecorder.onstop = () => {
        resolve();
      };

      this.#mediaRecorder.stop();
    });
  }

  addDataHandler(handler: (data: Blob) => void): void {
    for (const chunk of this.#bufferedChunks) {
      handler(chunk);
    }

    this.#bufferedChunks = [];
    this.#dataHandler = handler;
  }

  removeDataHandler(): void {
    if (this.#bufferedChunks.length > 0) {
      this.host.dispatchEvent(
        errorEvent(
          "Connection timeout: server did not respond in time. Buffered audio was not processed.",
        ),
      );
      this.#bufferedChunks = [];
    }

    this.#dataHandler = undefined;
  }

  get mediaRecorder(): MediaRecorder | null {
    return this.#mediaRecorder;
  }

  get audioLevel(): number {
    return this.#audioLevel;
  }
}
