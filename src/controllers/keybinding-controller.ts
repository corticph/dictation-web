import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { DictationMode } from "../types.js";
import { keybindingActivatedEvent } from "../utils/events.js";
import {
  matchesKeybinding,
  shouldIgnoreKeybinding,
} from "../utils/keybinding.js";

interface KeybindingControllerHost extends ReactiveControllerHost {
  _keybinding?: string | null;
  _mode?: DictationMode;
  startRecording(): void;
  stopRecording(): void;
  toggleRecording(): void;
  dispatchEvent(event: Event): boolean;
}

export class KeybindingController implements ReactiveController {
  host: KeybindingControllerHost;

  #keydownHandler?: (event: KeyboardEvent) => void;
  #keyupHandler?: (event: KeyboardEvent) => void;
  #blurHandler?: () => void;

  constructor(host: KeybindingControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected(): void {
    this.#setupListeners();
  }

  hostDisconnected(): void {
    this.#removeListeners();
  }

  #setupListeners(): void {
    this.#removeListeners();

    this.#keydownHandler = (event: KeyboardEvent) => {
      if (!this.host._keybinding) {
        return;
      }

      if (shouldIgnoreKeybinding(document.activeElement)) {
        return;
      }

      if (matchesKeybinding(event, this.host._keybinding)) {
        if (!this.host.dispatchEvent(keybindingActivatedEvent(event))) {
          return;
        }

        if (this.host._mode === "push-to-talk") {
          this.host.startRecording();
        }

        if (this.host._mode === "toggle-to-talk") {
          this.host.toggleRecording();
        }
      }
    };

    this.#keyupHandler = (event: KeyboardEvent) => {
      if (!this.host._keybinding) {
        return;
      }

      if (
        this.host._mode === "push-to-talk" &&
        matchesKeybinding(event, this.host._keybinding)
      ) {
        this.host.stopRecording();
      }
    };

    this.#blurHandler = () => {
      if (this.host._mode === "push-to-talk") {
        this.host.stopRecording();
      }
    };

    window.addEventListener("keydown", this.#keydownHandler);
    window.addEventListener("keyup", this.#keyupHandler);
    window.addEventListener("blur", this.#blurHandler);
  }

  #removeListeners(): void {
    if (this.#keydownHandler) {
      window.removeEventListener("keydown", this.#keydownHandler);
      this.#keydownHandler = undefined;
    }

    if (this.#keyupHandler) {
      window.removeEventListener("keyup", this.#keyupHandler);
      this.#keyupHandler = undefined;
    }

    if (this.#blurHandler) {
      window.removeEventListener("blur", this.#blurHandler);
      this.#blurHandler = undefined;
    }
  }
}
