export type MediaCaptureResult = {
  stream: MediaStream;
  sourceStreams: MediaStream[];
  cleanupContext?: AudioContext;
};

async function getMicStream(deviceId?: string): Promise<MediaStream> {
  if (!deviceId) {
    throw new Error("No device ID provided");
  }

  const constraints: MediaStreamConstraints =
    deviceId !== "default"
      ? { audio: { deviceId: { exact: deviceId } } }
      : { audio: true };

  return await navigator.mediaDevices.getUserMedia(constraints);
}

async function getDisplayAudioStream(): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: true,
  });

  if (stream.getAudioTracks().length === 0) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    throw new Error(
      "Virtual mode requires sharing audio. The selected source did not include audio.",
    );
  }

  stream.getVideoTracks().forEach((track) => {
    stream.removeTrack(track);
    track.stop();
  });

  return stream;
}

function mixAudioStreams(
  micStream: MediaStream,
  displayStream: MediaStream,
): {
  stream: MediaStream;
  cleanupContext: AudioContext;
} {
  const audioContext = new AudioContext();
  const destination = audioContext.createMediaStreamDestination();
  const merger = audioContext.createChannelMerger(2);

  merger.connect(destination);

  const microphoneSource = audioContext.createMediaStreamSource(micStream);
  microphoneSource.connect(merger, 0, 0);

  const systemSource = audioContext.createMediaStreamSource(displayStream);
  systemSource.connect(merger, 0, 1);

  return {
    cleanupContext: audioContext,
    stream: destination.stream,
  };
}

export async function getMediaStream(
  deviceId?: string,
  virtualMode?: boolean,
  debug_displayAudio?: boolean,
): Promise<MediaCaptureResult> {
  if (virtualMode) {
    const micStream = await getMicStream(deviceId);
    try {
      const displayStream = await getDisplayAudioStream();
      const mixed = mixAudioStreams(micStream, displayStream);
      return {
        cleanupContext: mixed.cleanupContext,
        sourceStreams: [micStream, displayStream],
        stream: mixed.stream,
      };
    } catch (error) {
      micStream.getTracks().forEach((track) => {
        track.stop();
      });
      throw error;
    }
  }

  if (debug_displayAudio) {
    const displayStream = await getDisplayAudioStream();
    return {
      sourceStreams: [displayStream],
      stream: displayStream,
    };
  }

  const micStream = await getMicStream(deviceId);
  return {
    sourceStreams: [micStream],
    stream: micStream,
  };
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
