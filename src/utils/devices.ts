/**
 * Requests access to the microphone.
 *
 * This function checks if the microphone permission is in "prompt" state, then requests
 * access and stops any active tracks immediately.
 *
 * @returns A promise that resolves when the permission request is complete.
 * @throws Error if microphone access is denied or unavailable.
 */
export async function requestMicAccess(): Promise<void> {
  if (!navigator.permissions) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    stream.getTracks().forEach((track) => {
      track.stop();
    });

    return;
  }

  const permissionStatus = await navigator.permissions.query({
    name: "microphone" as PermissionName,
  });

  if (permissionStatus.state === "denied") {
    throw new Error("Microphone permission is denied");
  }

  if (permissionStatus.state === "prompt") {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }
}

/**
 * Retrieves available audio input devices.
 *
 * This function uses the mediaDevices API to enumerate devices and filters out those
 * which are audio inputs. In some browsers, you may need to request user media before
 * device labels are populated.
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

  await requestMicAccess();

  const devices = await navigator.mediaDevices.enumerateDevices();
  const audioDevices = devices.filter((device) => device.kind === "audioinput");
  const defaultDevice = audioDevices.length > 0 ? audioDevices[0] : undefined;

  return { defaultDevice, devices: audioDevices };
}
