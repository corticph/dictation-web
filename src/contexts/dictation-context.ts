import type { Corti } from "@corti/sdk";
import { createContext, provide } from "@lit/context";
import type { PropertyValues } from "lit";
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
      const selectedLanguage = event.detail.selectedLanguage as
        | Corti.TranscribeSupportedLanguage
        | undefined;

      this.dictationConfig = {
        ...this.dictationConfig,
        primaryLanguage: selectedLanguage ?? "en",
      };
    });
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (!changedProperties.has("dictationConfig")) {
      return;
    }

    this._selectedLanguage = this.dictationConfig?.primaryLanguage;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dictation-root": DictationRoot;
  }
}
