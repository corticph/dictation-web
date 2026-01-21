import type { ReactiveController, ReactiveControllerHost } from "lit";
import { keybindingActivatedEvent } from "../utils/events.js";
import {
  matchesKeybinding,
  shouldIgnoreKeybinding,
} from "../utils/keybinding.js";

interface KeybindingControllerHost extends ReactiveControllerHost {
  _pushToTalkKeybinding?: string | null;
  _toggleToTalkKeybinding?: string | null;
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
  #isPushToTalkKeyPressed: boolean = false;

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
      if (shouldIgnoreKeybinding(document.activeElement)) {
        return;
      }

      if (
        this.host._toggleToTalkKeybinding &&
        matchesKeybinding(event, this.host._toggleToTalkKeybinding) &&
        !this.#isPushToTalkKeyPressed
      ) {
        if (!this.host.dispatchEvent(keybindingActivatedEvent(event))) {
          return;
        }

        this.host.toggleRecording();
        return;
      }

      if (
        this.host._pushToTalkKeybinding &&
        matchesKeybinding(event, this.host._pushToTalkKeybinding)
      ) {
        if (!this.host.dispatchEvent(keybindingActivatedEvent(event))) {
          return;
        }

        this.#isPushToTalkKeyPressed = true;
        this.host.startRecording();
      }
    };

    this.#keyupHandler = (event: KeyboardEvent) => {
      if (
        this.host._pushToTalkKeybinding &&
        matchesKeybinding(event, this.host._pushToTalkKeybinding)
      ) {
        if (!this.host.dispatchEvent(keybindingActivatedEvent(event))) {
          return;
        }
        this.#isPushToTalkKeyPressed = false;
        this.host.stopRecording();
      }
    };

    this.#blurHandler = () => {
      if (this.#isPushToTalkKeyPressed) {
        this.#isPushToTalkKeyPressed = false;
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
