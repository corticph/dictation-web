import { createContext, provide } from "@lit/context";
import type { LitElement } from "lit";
import { property } from "lit/decorators.js";
import type { ProxyOptions } from "../../types.js";
import type { Constructor } from "./types.js";

export const socketUrlContext = createContext<string | undefined>(
  Symbol("socketUrl"),
);
export const socketProxyContext = createContext<ProxyOptions | undefined>(
  Symbol("socketProxy"),
);

export declare class ProxyContextInterface {
  socketUrl?: string;
  socketProxy?: ProxyOptions;
}

export function ProxyContextMixin<T extends Constructor<LitElement>>(
  superclass: T,
): Constructor<ProxyContextInterface> & T {
  class ProxyContextMixinClass extends superclass {
    // ─────────────────────────────────────────────────────────────────────────────
    // Properties
    // ─────────────────────────────────────────────────────────────────────────────

    @provide({ context: socketUrlContext })
    @property({ type: String })
    socketUrl?: string;

    @provide({ context: socketProxyContext })
    @property({ attribute: false, type: Object })
    socketProxy?: ProxyOptions;
  }

  return ProxyContextMixinClass as Constructor<ProxyContextInterface> & T;
}
