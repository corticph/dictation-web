import type { ReactiveController, ReactiveControllerHost } from "lit";
import {
  calculateAudioLevel,
  createAudioAnalyzer,
  getMediaStream,
} from "../utils/media.js";

interface MediaControllerHost extends ReactiveControllerHost {
  _selectedDevice?: MediaDeviceInfo;
  _debug_displayAudio?: boolean;
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

  get mediaRecorder(): MediaRecorder | null {
    return this.#mediaRecorder;
  }

  get audioLevel(): number {
    return this.#audioLevel;
  }
}
