import { type ContextEvent, createContext, provide } from "@lit/context";
import type { LitElement } from "lit";
import { property } from "lit/decorators.js";
import {
  type KeybindingChangedEventDetail,
  keybindingChangedEvent,
} from "../../utils/events.js";
import type { Constructor } from "./types.js";

export const pushToTalkKeybindingContext = createContext<
  string | null | undefined
>(Symbol("pushToTalkKeybinding"));

export const toggleToTalkKeybindingContext = createContext<
  string | null | undefined
>(Symbol("toggleToTalkKeybinding"));

export declare class KeybindingsContextInterface {
  pushToTalkKeybinding?: string | null;
  toggleToTalkKeybinding?: string | null;
}

export function KeybindingsContextMixin<T extends Constructor<LitElement>>(
  superclass: T,
): Constructor<KeybindingsContextInterface> & T {
  class KeybindingsContextMixinClass extends superclass {
    @provide({ context: pushToTalkKeybindingContext })
    @property({ type: String })
    pushToTalkKeybinding?: string | null;

    @provide({ context: toggleToTalkKeybindingContext })
    @property({ type: String })
    toggleToTalkKeybinding?: string | null;

    constructor(...args: any[]) {
      super(...args);

      this.addEventListener(
        "keybinding-changed",
        this.#handleKeybindingChanged,
      );
      this.addEventListener("context-request", this.#handleContextRequest);
    }

    #handleContextRequest = (e: ContextEvent<any>) => {
      if (
        e.contextTarget.tagName.toLowerCase() ===
        "dictation-keybinding-selector"
      ) {
        if (
          e.context === pushToTalkKeybindingContext &&
          this.pushToTalkKeybinding === undefined
        ) {
          this.pushToTalkKeybinding = "Space";
          this.dispatchEvent(
            keybindingChangedEvent(" ", "Space", "Space", "push-to-talk"),
          );
        }

        if (
          e.context === toggleToTalkKeybindingContext &&
          this.toggleToTalkKeybinding === undefined
        ) {
          this.toggleToTalkKeybinding = "Enter";
          this.dispatchEvent(
            keybindingChangedEvent("Enter", "Enter", "Enter", "toggle-to-talk"),
          );
        }
      }
    };

    #handleKeybindingChanged = (e: Event) => {
      const event = e as CustomEvent<KeybindingChangedEventDetail>;

      const keybinding = event.detail.keybinding;

      if (event.detail.type === "push-to-talk") {
        this.pushToTalkKeybinding = keybinding;
      } else if (event.detail.type === "toggle-to-talk") {
        this.toggleToTalkKeybinding = keybinding;
      }
    };
  }

  return KeybindingsContextMixinClass as Constructor<KeybindingsContextInterface> &
    T;
}
