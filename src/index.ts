import { CortiDictation } from "./components/corti-dictation.js";
import { DictationDeviceSelector } from "./components/device-selector.js";
import { DictationKeybindingSelector } from "./components/keybinding-selector.js";
import { DictationLanguageSelector } from "./components/language-selector.js";
import { DictationModeSelector } from "./components/mode-selector.js";
import { DictationRecordingButton } from "./components/recording-button.js";
import { DictationSettingsMenu } from "./components/settings-menu.js";
import { DictationRoot } from "./contexts/dictation-context.js";

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

if (!customElements.get("dictation-mode-selector")) {
  customElements.define("dictation-mode-selector", DictationModeSelector);
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

if (!customElements.get("dictation-root")) {
  customElements.define("dictation-root", DictationRoot);
}

export { CortiDictation } from "./components/corti-dictation.js";
export { DictationDeviceSelector } from "./components/device-selector.js";
export { DictationKeybindingSelector } from "./components/keybinding-selector.js";
export { DictationLanguageSelector } from "./components/language-selector.js";
export { DictationModeSelector } from "./components/mode-selector.js";
export { DictationRecordingButton } from "./components/recording-button.js";
export { DictationSettingsMenu } from "./components/settings-menu.js";
export { DictationRoot } from "./contexts/dictation-context.js";

export type {
  ConfigurableSettings,
  DictationMode,
  Keybinding,
  RecordingState,
} from "./types.js";
export type {
  AudioLevelChangedEventDetail,
  CommandEventDetail,
  ErrorEventDetail,
  KeybindingActivatedEventDetail,
  KeybindingChangedEventDetail,
  LanguageChangedEventDetail,
  LanguagesChangedEventDetail,
  ModeChangedEventDetail,
  NetworkActivityEventDetail,
  RecordingDevicesChangedEventDetail,
  RecordingStateChangedEventDetail,
  TranscriptEventDetail,
  UsageEventDetail,
} from "./utils/events.js";

export default CortiDictation;
