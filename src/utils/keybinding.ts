/**
 * Checks if the current platform is macOS.
 * Uses userAgent string for reliable cross-browser detection.
 *
 * @returns true if running on macOS
 */
function isMac(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  // Check user agent for Mac patterns (most reliable method)
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param str - String to capitalize
 * @returns String with first letter capitalized
 */
function capitalize(str: string): string {
  if (str.length === 0) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Normalizes a key string to the keybinding format.
 * Handles platform-specific mappings and capitalization.
 *
 * @param key - Key string to normalize (will be trimmed and lowercased)
 * @returns Formatted key string for keybinding
 *
 * @example
 * normalizeKeyForKeybinding("Control") // "Ctrl"
 * normalizeKeyForKeybinding("META") // "Cmd" on Mac, "Meta" elsewhere
 * normalizeKeyForKeybinding(" alt ") // "Opt" on Mac, "Alt" elsewhere
 * normalizeKeyForKeybinding("shift") // "Shift"
 * normalizeKeyForKeybinding("k") // "k"
 */
function normalizeKeyForKeybinding(key: string): string {
  if (key === " ") {
    return "Space";
  }

  const normalized = key.trim().toLowerCase();

  if (normalized === "control") {
    return "Ctrl";
  }
  if (normalized === "meta" || normalized === "cmd") {
    return isMac() ? "Cmd" : "Meta";
  }
  if (normalized === "alt" || normalized === "opt") {
    return isMac() ? "Opt" : "Alt";
  }
  if (normalized === "space") {
    return "Space";
  }

  return normalized.length > 1 ? capitalize(normalized) : normalized;
}

/**
 * Parses a keybinding string into an array of keys.
 * Supports any combination of keys, not limited to modifier keys.
 * Normalizes keys to match the format from getPressedKeyFromEvent.
 * Platform-specific: "meta"/"cmd" -> "Cmd" on Mac, "alt"/"opt" -> "Opt" on Mac.
 *
 * @param keybinding - Keybinding string (e.g., "`", "Cmd+`", "Opt+Shift+k", "a+b")
 * @returns Array of normalized keys, or null if keybinding is null/undefined/empty
 *
 * @example
 * parseKeybinding("Cmd+k") // ["Cmd", "k"] on Mac
 * parseKeybinding("opt+a") // ["Opt", "a"] on Mac
 * parseKeybinding("ctrl+shift+a") // ["Ctrl", "Shift", "a"]
 * parseKeybinding("`") // ["`"]
 */
export function parseKeybinding(
  keybinding: string | null | undefined,
): string[] | null {
  if (!keybinding) {
    return null;
  }

  const trimmed = keybinding.trim();

  if (trimmed === "") {
    return null;
  }

  return trimmed.split("+").map(normalizeKeyForKeybinding);
}

/**
 * Checks if all keys in the keybinding are currently pressed.
 *
 * @param pressedKeys - Set of currently pressed keys (normalized with capitalization)
 * @param keybinding - Keybinding string to match against
 * @returns true if all keys in keybinding are in pressedKeys set
 *
 * @example
 * const pressed = new Set(["Cmd", "k"]);
 * matchesKeybinding(pressed, "Cmd+k") // true
 * matchesKeybinding(pressed, "a+b") // false
 */
export function matchesKeybinding(
  pressedKeys: Set<string>,
  keybinding: string | null | undefined,
): boolean {
  const requiredKeys = parseKeybinding(keybinding);

  if (!requiredKeys || requiredKeys.length === 0) {
    return false;
  }

  return requiredKeys.every((key) => pressedKeys.has(key));
}

/**
 * Gets the pressed key from a KeyboardEvent.
 * Treats modifier keys the same as any other key - they generate their own events.
 * Keys longer than 1 character are capitalized (e.g., "Cmd", "Ctrl", "Space").
 * Platform-specific: "Meta" -> "Cmd" on Mac, "Alt" -> "Opt" on Mac.
 *
 * @param event - KeyboardEvent to extract the pressed key from
 * @returns Normalized key string in keybinding format (e.g., "Cmd", "Opt", "Ctrl", "k")
 *
 * @example
 * getPressedKeyFromEvent(event) // "Cmd" when Meta key is pressed on Mac, "Opt" when Alt is pressed on Mac
 */
export function getPressedKeyFromEvent(event: KeyboardEvent): string {
  return normalizeKeyForKeybinding(event.key);
}

/**
 * Converts a set of pressed keys to a keybinding string format.
 * Keys longer than 1 character should be capitalized.
 *
 * @param pressedKeys - Set of pressed keys (e.g., Set(["Cmd", "k"]))
 * @returns Keybinding string (e.g., "Cmd+k") or empty string if no keys
 *
 * @example
 * pressedKeysToKeybinding(new Set(["Cmd", "k"])) // "Cmd+k"
 * pressedKeysToKeybinding(new Set(["a", "b"])) // "a+b"
 * pressedKeysToKeybinding(new Set(["k"])) // "k"
 */
export function pressedKeysToKeybinding(pressedKeys: Set<string>): string {
  if (pressedKeys.size === 0) {
    return "";
  }

  const keys = Array.from(pressedKeys);
  return keys.join("+");
}

/**
 * Checks if keybindings should be ignored for the current active element.
 * Returns true if the user is typing in an input field.
 *
 * @param element - Element to check
 * @returns true if keybindings should be ignored for this element
 *
 * @example
 * shouldIgnoreKeybinding(document.activeElement) // true if input/textarea/contenteditable
 */
export function shouldIgnoreKeybinding(element: Element | null): boolean {
  if (!element) {
    return false;
  }

  const tagName = element.tagName.toLowerCase();

  if (tagName === "input" || tagName === "textarea") {
    return true;
  }

  if (element instanceof HTMLElement && element.contentEditable === "true") {
    return true;
  }

  return false;
}
