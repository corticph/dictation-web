import { expect } from "@open-wc/testing";
import * as sinon from "sinon";
import { getAudioDevices, requestMicAccess } from "../src/utils/devices.js";

interface FakeMediaDevices {
  getUserMedia: sinon.SinonStub;
  enumerateDevices: sinon.SinonStub;
  addEventListener: () => void;
  removeEventListener: () => void;
}

interface FakePermissions {
  query: sinon.SinonStub;
}

const audioInput = (deviceId: string, label: string): MediaDeviceInfo => ({
  deviceId,
  groupId: deviceId === "" ? "" : `group-${deviceId}`,
  kind: "audioinput",
  label,
  toJSON: () => ({}),
});

const FIREFOX_PLACEHOLDER: MediaDeviceInfo = audioInput("", "");

const REAL_DEVICES: MediaDeviceInfo[] = [
  audioInput("mic1", "MacBook Pro Microphone"),
  audioInput("mic2", "ZoomAudioDevice"),
];

const NON_AUDIO_DEVICES: MediaDeviceInfo[] = [
  {
    deviceId: "speaker1",
    groupId: "group-speaker1",
    kind: "audiooutput",
    label: "Speaker",
    toJSON: () => ({}),
  } as MediaDeviceInfo,
  {
    deviceId: "cam1",
    groupId: "group-cam1",
    kind: "videoinput",
    label: "Webcam",
    toJSON: () => ({}),
  } as MediaDeviceInfo,
];

let originalMediaDevices: PropertyDescriptor | undefined;
let originalPermissions: PropertyDescriptor | undefined;

function installFakeNavigator(opts: {
  permissionState?: PermissionState | "unavailable";
  enumerateResults: MediaDeviceInfo[][];
  getUserMediaRejection?: Error;
}): { fakeMediaDevices: FakeMediaDevices; trackStop: sinon.SinonSpy } {
  const trackStop = sinon.spy();
  const fakeStream = {
    getTracks: () => [{ stop: trackStop }],
  } as unknown as MediaStream;

  const enumerateStub = sinon.stub();
  opts.enumerateResults.forEach((result, i) => {
    enumerateStub.onCall(i).resolves(result);
  });
  const lastResult =
    opts.enumerateResults[opts.enumerateResults.length - 1] ?? [];
  enumerateStub.resolves(lastResult);

  const getUserMediaStub = sinon.stub();
  if (opts.getUserMediaRejection) {
    getUserMediaStub.rejects(opts.getUserMediaRejection);
  } else {
    getUserMediaStub.resolves(fakeStream);
  }

  const fakeMediaDevices: FakeMediaDevices = {
    addEventListener: () => {},
    enumerateDevices: enumerateStub,
    getUserMedia: getUserMediaStub,
    removeEventListener: () => {},
  };

  originalMediaDevices = Object.getOwnPropertyDescriptor(
    navigator,
    "mediaDevices",
  );
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: fakeMediaDevices,
  });

  originalPermissions = Object.getOwnPropertyDescriptor(
    navigator,
    "permissions",
  );
  if (opts.permissionState === "unavailable") {
    Object.defineProperty(navigator, "permissions", {
      configurable: true,
      value: undefined,
    });
  } else {
    const fakePermissions: FakePermissions = {
      query: sinon
        .stub()
        .resolves({ state: opts.permissionState ?? "granted" }),
    };
    Object.defineProperty(navigator, "permissions", {
      configurable: true,
      value: fakePermissions,
    });
  }

  return { fakeMediaDevices, trackStop };
}

function restoreNavigator(): void {
  if (originalMediaDevices) {
    Object.defineProperty(navigator, "mediaDevices", originalMediaDevices);
    originalMediaDevices = undefined;
  }
  if (originalPermissions) {
    Object.defineProperty(navigator, "permissions", originalPermissions);
    originalPermissions = undefined;
  }
}

describe("requestMicAccess", () => {
  afterEach(() => {
    sinon.restore();
    restoreNavigator();
  });

  it("throws when microphone permission is denied", async () => {
    const { fakeMediaDevices } = installFakeNavigator({
      enumerateResults: [],
      permissionState: "denied",
    });

    let error: Error | undefined;
    try {
      await requestMicAccess();
    } catch (e) {
      error = e as Error;
    }

    expect(error?.message).to.equal("Microphone permission is denied");
    expect(fakeMediaDevices.getUserMedia.called).to.equal(false);
  });

  it("opens and stops a stream when permission is 'prompt'", async () => {
    const { fakeMediaDevices, trackStop } = installFakeNavigator({
      enumerateResults: [],
      permissionState: "prompt",
    });

    await requestMicAccess();

    expect(fakeMediaDevices.getUserMedia.calledOnce).to.equal(true);
    expect(trackStop.calledOnce).to.equal(true);
  });

  it("opens and stops a stream when permission is already 'granted'", async () => {
    const { fakeMediaDevices, trackStop } = installFakeNavigator({
      enumerateResults: [],
      permissionState: "granted",
    });

    await requestMicAccess();

    expect(fakeMediaDevices.getUserMedia.calledOnce).to.equal(true);
    expect(trackStop.calledOnce).to.equal(true);
  });

  it("opens a stream when the Permissions API is unavailable", async () => {
    const { fakeMediaDevices, trackStop } = installFakeNavigator({
      enumerateResults: [],
      permissionState: "unavailable",
    });

    await requestMicAccess();

    expect(fakeMediaDevices.getUserMedia.calledOnce).to.equal(true);
    expect(trackStop.calledOnce).to.equal(true);
  });
});

describe("getAudioDevices", () => {
  afterEach(() => {
    sinon.restore();
    restoreNavigator();
  });

  // Chrome / Safari path: enumerateDevices returns populated entries on the
  // first call, so we should not invoke getUserMedia at all.
  it("returns devices without priming when entries are already populated", async () => {
    const { fakeMediaDevices } = installFakeNavigator({
      enumerateResults: [[...REAL_DEVICES, ...NON_AUDIO_DEVICES]],
      permissionState: "granted",
    });

    const { devices, defaultDevice } = await getAudioDevices();

    expect(fakeMediaDevices.enumerateDevices.callCount).to.equal(1);
    expect(fakeMediaDevices.getUserMedia.called).to.equal(false);
    expect(devices.map((d) => d.deviceId)).to.deep.equal(["mic1", "mic2"]);
    expect(defaultDevice?.deviceId).to.equal("mic1");
  });

  // Regression for DXG-831. Models Firefox's actual behavior: cold
  // enumerateDevices returns a single placeholder with empty deviceId/label
  // even when permission is granted; only after getUserMedia does
  // enumerateDevices return the real devices.
  it("primes with getUserMedia and re-enumerates when Firefox returns a placeholder", async () => {
    const { fakeMediaDevices, trackStop } = installFakeNavigator({
      enumerateResults: [[FIREFOX_PLACEHOLDER], REAL_DEVICES],
      permissionState: "granted",
    });

    const { devices, defaultDevice } = await getAudioDevices();

    expect(fakeMediaDevices.enumerateDevices.callCount).to.equal(2);
    expect(fakeMediaDevices.getUserMedia.calledOnce).to.equal(true);
    expect(trackStop.calledOnce).to.equal(true);
    expect(devices.map((d) => d.deviceId)).to.deep.equal(["mic1", "mic2"]);
    expect(defaultDevice?.label).to.equal("MacBook Pro Microphone");
  });

  it("primes when any audio input has a blank label but a real deviceId", async () => {
    const blankLabel = audioInput("mic1", "");
    const { fakeMediaDevices } = installFakeNavigator({
      enumerateResults: [[blankLabel], REAL_DEVICES],
      permissionState: "granted",
    });

    await getAudioDevices();

    expect(fakeMediaDevices.getUserMedia.calledOnce).to.equal(true);
    expect(fakeMediaDevices.enumerateDevices.callCount).to.equal(2);
  });

  it("does not call getUserMedia when no audio inputs exist", async () => {
    const { fakeMediaDevices } = installFakeNavigator({
      enumerateResults: [NON_AUDIO_DEVICES],
      permissionState: "granted",
    });

    const { devices, defaultDevice } = await getAudioDevices();

    expect(fakeMediaDevices.getUserMedia.called).to.equal(false);
    expect(devices).to.deep.equal([]);
    expect(defaultDevice).to.equal(undefined);
  });

  it("propagates the denied error when priming is needed but permission is denied", async () => {
    const { fakeMediaDevices } = installFakeNavigator({
      enumerateResults: [[FIREFOX_PLACEHOLDER]],
      permissionState: "denied",
    });

    let error: Error | undefined;
    try {
      await getAudioDevices();
    } catch (e) {
      error = e as Error;
    }

    expect(error?.message).to.equal("Microphone permission is denied");
    expect(fakeMediaDevices.getUserMedia.called).to.equal(false);
  });
});
