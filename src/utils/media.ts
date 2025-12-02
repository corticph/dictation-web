export async function getMediaStream(deviceId?: string): Promise<MediaStream> {
  if (!deviceId) {
    throw new Error("No device ID provided");
  }

  const constraints: MediaStreamConstraints =
    deviceId !== "default"
      ? { audio: { deviceId: { exact: deviceId } } }
      : { audio: true };

  return await navigator.mediaDevices.getUserMedia(constraints);
}

export function createAudioAnalyzer(mediaStream: MediaStream): {
  audioContext: AudioContext;
  analyser: AnalyserNode;
} {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(mediaStream);
  const analyser = audioContext.createAnalyser();

  analyser.fftSize = 8192;

  source.connect(analyser);

  return { analyser, audioContext };
}

export function calculateAudioLevel(analyser: AnalyserNode): number {
  const dataArray = new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(dataArray);

  const sumSquares = Array.from(dataArray).reduce((sum, value) => {
    const normalized = (value - 128) / 128;
    return sum + normalized * normalized;
  }, 0);

  return Math.sqrt(sumSquares / dataArray.length);
}
