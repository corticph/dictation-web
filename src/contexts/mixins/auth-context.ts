import type { CortiAuth } from "@corti/sdk";
import { createContext, provide } from "@lit/context";
import type { LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { getInitialToken } from "../../utils/auth.js";
import { errorEvent } from "../../utils/events.js";
import { decodeToken } from "../../utils/token.js";
import type { Constructor } from "./types.js";

export const regionContext = createContext<string | undefined>(
  Symbol("region"),
);
export const tenantNameContext = createContext<string | undefined>(
  Symbol("tenantName"),
);
export const accessTokenContext = createContext<string | undefined>(
  Symbol("accessToken"),
);
export const authConfigContext = createContext<
  CortiAuth.AuthTokenDerivable | undefined
>(Symbol("authConfig"));

export declare class AuthContextInterface {
  region?: string;
  tenantName?: string;
  accessToken?: string;
  authConfig?: CortiAuth.AuthTokenDerivable | undefined;
  setAccessToken(token: string | undefined): {
    accessToken: string | undefined;
    environment: string | undefined;
    tenant: string | undefined;
  };
  setAuthConfig(config?: CortiAuth.AuthTokenDerivable): Promise<{
    accessToken: string | undefined;
    environment: string | undefined;
    tenant: string | undefined;
  }>;
}

export function AuthContextMixin<T extends Constructor<LitElement>>(
  superclass: T,
): Constructor<AuthContextInterface> & T {
  class AuthContextMixinClass extends superclass {
    // ─────────────────────────────────────────────────────────────────────────────
    // Context state
    // ─────────────────────────────────────────────────────────────────────────────

    @provide({ context: regionContext })
    @state()
    region?: string;

    @provide({ context: tenantNameContext })
    @state()
    tenantName?: string;

    // ─────────────────────────────────────────────────────────────────────────────
    // Properties
    // ─────────────────────────────────────────────────────────────────────────────

    @provide({ context: accessTokenContext })
    @state()
    _accessToken?: string;

    @property({ type: String })
    set accessToken(token: string | undefined) {
      this.setAccessToken(token);
    }

    get accessToken(): string | undefined {
      return this._accessToken;
    }

    @provide({ context: authConfigContext })
    @state()
    _authConfig?: CortiAuth.AuthTokenDerivable;

    @property({ attribute: false, type: Object })
    set authConfig(config: CortiAuth.AuthTokenDerivable | undefined) {
      this.setAuthConfig(config);
    }

    get authConfig(): CortiAuth.AuthTokenDerivable | undefined {
      return this._authConfig;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Public methods
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * Sets the access token and parses region/tenant from it.
     * @returns ServerConfig with environment, tenant, and accessToken
     * @deprecated Use 'accessToken' property instead.
     */
    public setAccessToken(token: string | undefined) {
      this._accessToken = token;
      this.region = undefined;
      this.tenantName = undefined;

      if (!token) {
        return {
          accessToken: token,
          environment: undefined,
          tenant: undefined,
        };
      }

      try {
        const decoded = decodeToken(token);

        this.region = decoded?.environment;
        this.tenantName = decoded?.tenant;

        return {
          accessToken: token,
          environment: decoded?.environment,
          tenant: decoded?.tenant,
        };
      } catch (error) {
        this.dispatchEvent(errorEvent(error));
      }

      return { accessToken: token, environment: undefined, tenant: undefined };
    }

    /**
     * Sets the auth config and parses region/tenant from the initial token.
     * @returns Promise with ServerConfig containing environment, tenant, and accessToken
     * @deprecated Use 'authConfig' property instead.
     */
    public async setAuthConfig(config?: CortiAuth.AuthTokenDerivable) {
      this._authConfig = config;

      if (!config) {
        return {
          accessToken: undefined,
          environment: undefined,
          tenant: undefined,
        };
      }

      try {
        const { accessToken } = await getInitialToken(config);

        return this.setAccessToken(accessToken);
      } catch (error) {
        this.dispatchEvent(errorEvent(error));
      }

      return {
        accessToken: undefined,
        environment: undefined,
        tenant: undefined,
      };
    }
  }

  return AuthContextMixinClass as Constructor<AuthContextInterface> & T;
}
