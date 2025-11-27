import type { ReactiveController, ReactiveControllerHost } from "lit";
import { calculateAudioLevel, createAudioAnalyzer } from "../utils/media.js";
import { getMediaStream } from "../utils.js";

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

  constructor(host: MediaControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostDisconnected(): void {
    this.cleanup();
  }

  async initialize(): Promise<void> {
    this.cleanup();

    const deviceId = this.host._selectedDevice?.deviceId;

    this._mediaStream = await getMediaStream(deviceId);

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

    if (this._mediaStream) {
      this._mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      this._mediaStream = null;
    }

    if (this._audioContext) {
      await this._audioContext.close();
      this._audioContext = null;
    }

    this._analyser = null;
    this._mediaRecorder = null;
  }

  get mediaStream(): MediaStream | null {
    return this._mediaStream;
  }

  get mediaRecorder(): MediaRecorder | null {
    return this._mediaRecorder;
  }

  get audioLevel(): number {
    return this._audioLevel;
  }
}
