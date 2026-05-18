import { AmbientRecordingButton } from "./components/ambient-recording-button.js";
import { AmbientVirtualModeSelector } from "./components/ambient-virtual-mode-selector.js";
import { CortiAmbient } from "./components/corti-ambient.js";
import { CortiDictation } from "./components/corti-dictation.js";
import { DictationDeviceSelector } from "./components/device-selector.js";
import { DictationRecordingButton } from "./components/dictation-recording-button.js";
import { DictationKeybindingSelector } from "./components/keybinding-selector.js";
import { DictationLanguageSelector } from "./components/language-selector.js";
import { DictationSettingsMenu } from "./components/settings-menu.js";
import { AmbientRoot } from "./contexts/ambient-context.js";
import { DictationRoot } from "./contexts/dictation-context.js";

if (!customElements.get("ambient-recording-button")) {
  customElements.define("ambient-recording-button", AmbientRecordingButton);
}

if (!customElements.get("ambient-virtual-mode-selector")) {
  customElements.define(
    "ambient-virtual-mode-selector",
    AmbientVirtualModeSelector,
  );
}

if (!customElements.get("corti-ambient")) {
  customElements.define("corti-ambient", CortiAmbient);
}

if (!customElements.get("corti-dictation")) {
  customElements.define("corti-dictation", CortiDictation);
}

if (!customElements.get("dictation-recording-button")) {
  customElements.define("dictation-recording-button", DictationRecordingButton);
}

if (!customElements.get("dictation-device-selector")) {
  customElements.define("dictation-device-selector", DictationDeviceSelector);
}

if (!customElements.get("dictation-language-selector")) {
  customElements.define(
    "dictation-language-selector",
    DictationLanguageSelector,
  );
}

if (!customElements.get("dictation-keybinding-selector")) {
  customElements.define(
    "dictation-keybinding-selector",
    DictationKeybindingSelector,
  );
}

if (!customElements.get("dictation-settings-menu")) {
  customElements.define("dictation-settings-menu", DictationSettingsMenu);
}

if (!customElements.get("ambient-root")) {
  customElements.define("ambient-root", AmbientRoot);
}

if (!customElements.get("dictation-root")) {
  customElements.define("dictation-root", DictationRoot);
}

export { AmbientRecordingButton } from "./components/ambient-recording-button.js";
export { AmbientVirtualModeSelector } from "./components/ambient-virtual-mode-selector.js";
export { CortiAmbient } from "./components/corti-ambient.js";
export { CortiDictation } from "./components/corti-dictation.js";
export { DictationDeviceSelector } from "./components/device-selector.js";
export { DictationRecordingButton } from "./components/dictation-recording-button.js";
export { DictationKeybindingSelector } from "./components/keybinding-selector.js";
export { DictationLanguageSelector } from "./components/language-selector.js";
export { DictationSettingsMenu } from "./components/settings-menu.js";
export { AmbientRoot } from "./contexts/ambient-context.js";
export { DictationRoot } from "./contexts/dictation-context.js";

export type { AmbientStreamSessionConfig } from "./controllers/ambient-controller.js";
export type {
  ConfigurableSettings,
  Keybinding,
  RecordingState,
} from "./types.js";
export type {
  AudioLevelChangedEventDetail,
  CommandEventDetail,
  DeltaUsageEventDetail,
  ErrorEventDetail,
  FactsEventDetail,
  KeybindingActivatedEventDetail,
  KeybindingChangedEventDetail,
  LanguageChangedEventDetail,
  LanguagesChangedEventDetail,
  NetworkActivityEventDetail,
  RecordingDevicesChangedEventDetail,
  RecordingStateChangedEventDetail,
  TranscriptEventDetail,
  UsageEventDetail,
  VirtualModeChangedEventDetail,
} from "./utils/events.js";

export default CortiDictation;
