/**
 * Primes the document with an active microphone stream.
 *
 * Opens (and immediately stops) a media stream so the document holds an
 * active mic permission for this session. In Firefox this is what makes
 * real deviceIds and labels appear in subsequent enumerateDevices() calls.
 * Throws early if the user has already denied permission.
 *
 * @returns A promise that resolves once the stream has been opened and stopped.
 * @throws Error if microphone access is denied or unavailable.
 */
export async function primeMicStream(): Promise<void> {
  if (navigator.permissions) {
    const permissionStatus = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });

    if (permissionStatus.state === "denied") {
      throw new Error("Microphone permission is denied");
    }
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

/**
 * Retrieves available audio input devices.
 *
 * Enumerates devices first; if the result looks like Firefox's pre-permission
 * placeholder (an entry with empty deviceId/label even though the Permissions
 * API reports access), primes the document with getUserMedia and re-enumerates.
 * Browsers that already return populated entries (Chrome, Safari) skip the
 * priming call entirely.
 *
 * @returns A promise that resolves with an object containing:
 *  - `devices`: an array of MediaDeviceInfo objects for audio inputs.
 *  - `defaultDevice`: the first audio input device, if available.
 * @throws Error if mediaDevices API is unavailable or device enumeration fails.
 */
export async function getAudioDevices(): Promise<{
  devices: MediaDeviceInfo[];
  defaultDevice?: MediaDeviceInfo;
}> {
  if (!navigator.mediaDevices?.enumerateDevices) {
    throw new Error("MediaDevices API is not available");
  }

  let audioDevices = await listAudioInputs();

  if (needsMicPriming(audioDevices)) {
    await primeMicStream();
    audioDevices = await listAudioInputs();
  }

  return {
    defaultDevice: audioDevices[0],
    devices: audioDevices,
  };
}

async function listAudioInputs(): Promise<MediaDeviceInfo[]> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === "audioinput");
}

function needsMicPriming(audioInputs: MediaDeviceInfo[]): boolean {
  if (audioInputs.length === 0) {
    return false; // no mic hardware — don't trigger a permission prompt
  }
  return audioInputs.some((d) => d.deviceId === "" || d.label === "");
}
