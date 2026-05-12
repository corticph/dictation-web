import { customElement, property } from "lit/decorators.js";
import { DEFAULT_STREAM_CONFIG } from "../constants.js";
import {
  AmbientController,
  type AmbientStreamSessionConfig,
  type StreamAmbientMessage,
} from "../controllers/ambient-controller.js";
import { RecordingButtonBase } from "./recording-button-base.js";

@customElement("ambient-recording-button")
export class AmbientRecordingButton extends RecordingButtonBase<
  AmbientStreamSessionConfig,
  StreamAmbientMessage
> {
  @property({ attribute: "interaction-id", type: String })
  interactionId: string = "9254ec9b-70e6-45d1-bacb-63d6cce19e86";

  protected _socketController = new AmbientController(this);

  protected _getConnectConfig(): AmbientStreamSessionConfig {
    return {
      configuration: DEFAULT_STREAM_CONFIG,
      interactionId: this.interactionId,
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ambient-recording-button": AmbientRecordingButton;
  }
}
