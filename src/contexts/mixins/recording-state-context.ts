import { createContext, provide } from "@lit/context";
import type { LitElement } from "lit";
import { state } from "lit/decorators.js";
import type { RecordingState } from "../../types.js";
import type { Constructor } from "./types.js";

/**
 * Lit context and mixin for recording UI state (`stopped`, `recording`, …).
 */

export const recordingStateContext = createContext<RecordingState>(
  Symbol("recordingState"),
);

export declare class RecordingStateContextInterface {
  recordingState: RecordingState;
}

export function RecordingStateContextMixin<T extends Constructor<LitElement>>(
  superclass: T,
): Constructor<RecordingStateContextInterface> & T {
  class RecordingStateContextMixinClass extends superclass {
    @provide({ context: recordingStateContext })
    @state()
    recordingState: RecordingState = "stopped";

    constructor(...args: any[]) {
      super(...args);

      this.addEventListener("recording-state-changed", (e: Event) => {
        const event = e as CustomEvent<{ state: RecordingState }>;

        this.recordingState = event.detail.state;
      });
    }
  }

  return RecordingStateContextMixinClass as Constructor<RecordingStateContextInterface> &
    T;
}
