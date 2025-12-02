import type { ReactiveController, ReactiveControllerHost } from "lit";
import {
  calculateAudioLevel,
  createAudioAnalyzer,
  getMediaStream,
} from "../utils/media.js";

interface MediaControllerHost extends ReactiveControllerHost {
  _selectedDevice?: MediaDeviceInfo;
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

  startAudioLevelMonitoring(): void {
    this.stopAudioLevelMonitoring();

    this._visualiserInterval = window.setInterval(() => {
      this._audioLevel = this.getAudioLevel() * 3;
      this.host.requestUpdate();
    }, 150);
  }

  stopAudioLevelMonitoring(): void {
    if (this._visualiserInterval) {
      clearInterval(this._visualiserInterval);
      this._visualiserInterval = undefined;
    }

    this._audioLevel = 0;
    this.host.requestUpdate();
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
  }

  get mediaRecorder(): MediaRecorder | null {
    return this._mediaRecorder;
  }

  get audioLevel(): number {
    return this._audioLevel;
  }
}
