/**
 * Requests access to the microphone.
 *
 * This function checks if the microphone permission is in "prompt" state, then requests
 * access and stops any active tracks immediately. It also logs if permission is already granted.
 *
 * @returns A promise that resolves when the permission request is complete.
 */
export async function requestMicAccess(): Promise<void> {
  try {
    // Fallback if Permissions API is not available
    if (!navigator.permissions) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      stream.getTracks().forEach((track) => {
        track.stop();
      });

      return;
    }

    const permissionStatus = await navigator.permissions.query({
      // eslint-disable-next-line no-undef
      name: "microphone" as PermissionName,
    });

    if (permissionStatus.state === "prompt") {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      stream.getTracks().forEach((track) => {
        track.stop();
      });
    } else if (permissionStatus.state === "denied") {
      // console.warn("Microphone permission is denied.");
    }
  } catch {
    // console.error("Error checking/requesting microphone permission:", error);
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
 *  - `defaultDeviceId`: the deviceId of the first audio input, if available.
 */
export async function getAudioDevices(): Promise<{
  devices: MediaDeviceInfo[];
  defaultDevice?: MediaDeviceInfo;
}> {
  if (!navigator.mediaDevices?.enumerateDevices) {
    return { devices: [] };
  }

  await requestMicAccess();

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(
      (device) => device.kind === "audioinput",
    );
    const defaultDevice = audioDevices.length > 0 ? audioDevices[0] : undefined;

    return { defaultDevice, devices: audioDevices };
  } catch {
    return { devices: [] };
  }
}
