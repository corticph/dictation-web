import type { Corti } from "@corti/sdk";

/**
 * Extracts the initial access token from auth config
 * @throws Error if token is missing or invalid
 */
export async function getInitialToken(
  config: Corti.BearerOptions,
): Promise<{ accessToken: string; refreshToken?: string }> {
  const initialToken =
    "accessToken" in config
      ? {
          accessToken: config.accessToken,
          refreshToken: config.refreshToken,
        }
      : await config.refreshAccessToken();

  if (
    !initialToken?.accessToken ||
    typeof initialToken.accessToken !== "string"
  ) {
    throw new Error("Access token is required and must be a string");
  }

  return {
    accessToken: initialToken.accessToken,
    refreshToken: initialToken.refreshToken,
  };
}
