export function createAudioAnalyzer(
  mediaStream: MediaStream,
): { audioContext: AudioContext; analyser: AnalyserNode } {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(mediaStream);
  const analyser = audioContext.createAnalyser();

  analyser.fftSize = 8192;

  source.connect(analyser);

  return { audioContext, analyser };
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

