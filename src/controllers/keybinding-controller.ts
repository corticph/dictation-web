import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { DictationMode } from "../types.js";
import {
  getPressedKeyFromEvent,
  matchesKeybinding,
  shouldIgnoreKeybinding,
} from "../utils/keybinding.js";

interface KeybindingControllerHost extends ReactiveControllerHost {
  _keybinding?: string | null;
  _mode?: DictationMode;
  startRecording(): void;
  stopRecording(): void;
  toggleRecording(): void;
}

export class KeybindingController implements ReactiveController {
  host: KeybindingControllerHost;

  #pressedKeys: Set<string> = new Set();
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
    this.#pressedKeys.clear();
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

      const pressedKey = getPressedKeyFromEvent(event);
      this.#pressedKeys.add(pressedKey);

      if (matchesKeybinding(this.#pressedKeys, this.host._keybinding)) {
        event.preventDefault();

        if (this.host._mode === "push-to-talk") {
          this.host.startRecording();
        }

        if (this.host._mode === "toggle-to-talk") {
          this.host.toggleRecording();
        }
      }
    };

    this.#keyupHandler = (event: KeyboardEvent) => {
      const pressedKey = getPressedKeyFromEvent(event);
      this.#pressedKeys.delete(pressedKey);

      if (
        this.host._mode === "push-to-talk" &&
        !matchesKeybinding(this.#pressedKeys, this.host._keybinding)
      ) {
        this.host.stopRecording();
      }
    };

    this.#blurHandler = () => {
      // Clear all pressed keys when window loses focus
      // This prevents stuck keys when user switches windows/apps
      this.#pressedKeys.clear();

      // window.blur (not element blur) - fires when switching apps/windows
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
