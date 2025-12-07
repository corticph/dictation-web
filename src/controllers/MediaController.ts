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

  private _mediaStream: MediaStream | null = null;
  private _audioContext: AudioContext | null = null;
  private _analyser: AnalyserNode | null = null;
  private _mediaRecorder: MediaRecorder | null = null;
  private _visualiserInterval?: number;
  private _audioLevel: number = 0;
  private _onTrackEnded?: () => void;
  private _onAudioLevelChange?: (level: number) => void;

  constructor(host: MediaControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostDisconnected(): void {
    this.cleanup();
  }

  async initialize(onTrackEnded?: () => void): Promise<void> {
    await this.cleanup();

    this._onTrackEnded = onTrackEnded;
    this._mediaStream = await getMediaStream(
      this.host._selectedDevice?.deviceId,
      this.host._debug_displayAudio,
    );

    this._mediaStream.getTracks().forEach((track: MediaStreamTrack) => {
      track.addEventListener("ended", () => {
        if (this._onTrackEnded) {
          this._onTrackEnded();
        }
      });
    });

    const { audioContext, analyser } = createAudioAnalyzer(this._mediaStream);

    this._audioContext = audioContext;
    this._analyser = analyser;

    this._mediaRecorder = new MediaRecorder(this._mediaStream);
  }

  getAudioLevel(): number {
    return this._analyser ? calculateAudioLevel(this._analyser) : 0;
  }

  startAudioLevelMonitoring(
    onAudioLevelChange?: (level: number) => void,
  ): void {
    this.stopAudioLevelMonitoring();

    this._onAudioLevelChange = onAudioLevelChange;

    this._visualiserInterval = window.setInterval(() => {
      this._audioLevel = this.getAudioLevel() * 3;
      this.host.requestUpdate();

      if (this._onAudioLevelChange) {
        this._onAudioLevelChange(this._audioLevel);
      }
    }, 150);
  }

  stopAudioLevelMonitoring(): void {
    if (this._visualiserInterval) {
      clearInterval(this._visualiserInterval);
      this._visualiserInterval = undefined;
    }

    this._audioLevel = 0;
    this.host.requestUpdate();

    if (this._onAudioLevelChange) {
      this._onAudioLevelChange(this._audioLevel);
    }
  }

  async cleanup(): Promise<void> {
    this.stopAudioLevelMonitoring();

    if (this._mediaRecorder?.state === "recording") {
      this._mediaRecorder.stop();
    }

    if (this._mediaStream) {
      this._mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      this._mediaStream = null;
    }

    if (this._audioContext && this._audioContext.state !== "closed") {
      await this._audioContext.close();
    }

    this._audioContext = null;

    this._analyser = null;
    this._mediaRecorder = null;
    this._onTrackEnded = undefined;
    this._onAudioLevelChange = undefined;
  }

  /**
   * Stops the media recorder and waits for all buffered data to be flushed.
   * This ensures the final ondataavailable event fires before resolving.
   */
  async stopRecording(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this._mediaRecorder || this._mediaRecorder.state !== "recording") {
        resolve();
        return;
      }

      this._mediaRecorder.onstop = () => {
        resolve();
      };

      this._mediaRecorder.stop();
    });
  }

  get mediaRecorder(): MediaRecorder | null {
    return this._mediaRecorder;
  }

  get audioLevel(): number {
    return this._audioLevel;
  }
}
