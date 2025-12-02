import { CortiDictation } from "./components/corti-dictation.js";
import { DeviceSelector } from "./components/device-selector.js";
import { LanguageSelector } from "./components/language-selector.js";
import { RecordingButton } from "./components/recording-button.js";
import { SettingsMenu } from "./components/settings-menu.js";
import { DictationContext } from "./contexts/dictation-context.js";

if (!customElements.get("corti-dictation")) {
  customElements.define("corti-dictation", CortiDictation);
}

if (!customElements.get("recording-button")) {
  customElements.define("recording-button", RecordingButton);
}

if (!customElements.get("device-selector")) {
  customElements.define("device-selector", DeviceSelector);
}

if (!customElements.get("language-selector")) {
  customElements.define("language-selector", LanguageSelector);
}

if (!customElements.get("settings-menu")) {
  customElements.define("settings-menu", SettingsMenu);
}

if (!customElements.get("dictation-context-provider")) {
  customElements.define("dictation-context-provider", DictationContext);
}

export { CortiDictation } from "./components/corti-dictation.js";
export { DeviceSelector } from "./components/device-selector.js";
export { LanguageSelector } from "./components/language-selector.js";
export { RecordingButton } from "./components/recording-button.js";
export { SettingsMenu } from "./components/settings-menu.js";
export { DictationContext } from "./contexts/dictation-context.js";

export default CortiDictation;
