/**
 * Decodes a JWT token and extracts environment and tenant information.
 *
 * @param token - The JWT token to decode
 * @returns Object containing environment, tenant, accessToken, and expiresAt
 * @throws Error if token format is invalid or cannot be decoded
 */
export function decodeToken(token: string) {
  // Validate the token structure (should contain at least header and payload parts)
  const parts = token.split(".");
  if (parts.length < 2) {
    throw new Error("Invalid token format");
  }

  // Retrieve the payload (second part) of the JWT token
  const base64Url = parts[1];

  // Replace URL-safe characters to match standard base64 encoding
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

  // Decode the base64 string into a JSON string
  let jsonPayload: string;
  try {
    jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
  } catch (error) {
    throw new Error("Failed to decode token payload");
  }

  // Parse the JSON string to obtain token details
  let tokenDetails: { iss: string; exp?: number; [key: string]: unknown };
  try {
    tokenDetails = JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error("Invalid JSON payload in token");
  }

  // Extract the issuer URL from the token details
  const issuerUrl: string = tokenDetails.iss;
  if (!issuerUrl) {
    throw new Error("Token payload does not contain an issuer (iss) field");
  }

  // Regex to extract environment and tenant from issuer URL:
  // Expected format: https://keycloak.{environment}.corti.app/realms/{tenant}
  const regex =
    /^https:\/\/(keycloak|auth)\.([^.]+)\.corti\.app\/realms\/([^/]+)/;
  const match = issuerUrl.match(regex);

  if (!match) {
    throw new Error("Issuer URL does not match expected format");
  }

  // If the issuer URL matches the expected pattern, return the extracted values along with the token
  const expiresAt =
    tokenDetails.exp && typeof tokenDetails.exp === "number"
      ? tokenDetails.exp
      : undefined;

  return {
    accessToken: token,
    environment: match[2],
    expiresAt,
    tenant: match[3],
  };
}
