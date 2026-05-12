import type { Corti } from "@corti/sdk";
import { consume } from "@lit/context";
import { customElement, state } from "lit/decorators.js";
import { DEFAULT_DICTATION_CONFIG } from "../constants.js";
import { dictationConfigContext } from "../contexts/dictation-context.js";
import {
  DictationController,
  type TranscribeMessage,
} from "../controllers/dictation-controller.js";
import { RecordingButtonBase } from "./recording-button-base.js";

@customElement("dictation-recording-button")
export class DictationRecordingButton extends RecordingButtonBase<
  Corti.TranscribeConfig,
  TranscribeMessage
> {
  @consume({ context: dictationConfigContext, subscribe: true })
  @state()
  protected _dictationConfig?: Corti.TranscribeConfig;

  protected _socketController = new DictationController(this);

  protected _getConnectConfig(): Corti.TranscribeConfig {
    return this._dictationConfig ?? DEFAULT_DICTATION_CONFIG;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-recording-button": DictationRecordingButton;
  }
}
