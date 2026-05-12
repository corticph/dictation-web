import type { Corti } from "@corti/sdk";
import { createContext, provide } from "@lit/context";
import { customElement, property } from "lit/decorators.js";
import { RootContext } from "./root-context.js";

export const dictationConfigContext = createContext<
  Corti.TranscribeConfig | undefined
>(Symbol("dictationConfig"));
export const debugDisplayAudioContext = createContext<boolean | undefined>(
  Symbol("debugDisplayAudio"),
);
@customElement("dictation-root")
export class DictationRoot extends RootContext {
  // ─────────────────────────────────────────────────────────────────────────────
  // Properties
  // ─────────────────────────────────────────────────────────────────────────────

  @provide({ context: dictationConfigContext })
  @property({ attribute: false, type: Object })
  dictationConfig?: Corti.TranscribeConfig;

  @provide({ context: debugDisplayAudioContext })
  @property({ attribute: "debug-display-audio", type: Boolean })
  debug_displayAudio?: boolean;

  // ─────────────────────────────────────────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────────────────────────────────────────

  constructor() {
    super();

    this.addEventListener("languages-changed", (e: Event) => {
      const event = e as CustomEvent;

      this.dictationConfig = {
        ...this.dictationConfig,
        primaryLanguage: event.detail.selectedLanguage ?? "en",
      };
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-root": DictationRoot;
  }
}
