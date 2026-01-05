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
 * Normalizes a keybinding string.
 *
 * @param keybinding - Keybinding string to normalize
 * @returns Normalized keybinding string or null if empty
 *
 * @example
 * normalizeKeybinding("k") // "k"
 * normalizeKeybinding("meta") // "Cmd" on Mac
 * normalizeKeybinding(" space ") // "Space"
 */
export function normalizeKeybinding(
  keybinding: string | null | undefined,
): string | null {
  if (!keybinding) {
    return null;
  }

  const trimmed = keybinding.trim();

  if (trimmed === "") {
    return null;
  }

  return normalizeKeyForKeybinding(trimmed);
}

/**
 * Checks if a pressed key matches the keybinding.
 * Checks both event.key and event.code for better reliability.
 *
 * @param event - KeyboardEvent to check
 * @param keybinding - Keybinding string to match against
 * @returns true if either the key or code matches the keybinding
 *
 * @example
 * matchesKeybinding(event, "k") // true if event.key is "k" or event.code is "KeyK"
 * matchesKeybinding(event, "`") // true if event.key is "`" or event.code is "Backquote"
 */
export function matchesKeybinding(
  event: KeyboardEvent,
  keybinding: string | null | undefined,
): boolean {
  const normalizedKeybinding = normalizeKeybinding(keybinding);

  if (!normalizedKeybinding) {
    return false;
  }

  const normalizedKey = normalizeKeyForKeybinding(event.key);
  const normalizedCode = normalizeKeyForKeybinding(event.code);

  return (
    normalizedKey === normalizedKeybinding ||
    normalizedCode === normalizedKeybinding
  );
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
