/**
 * Normalizes a key from KeyboardEvent to match keybinding format.
 * Converts to lowercase and handles special cases.
 *
 * @param key - Key string from KeyboardEvent
 * @returns Normalized key string in lowercase
 *
 * @example
 * normalizeKey("Meta") // "meta"
 * normalizeKey("K") // "k"
 * normalizeKey("`") // "`"
 */
function normalizeKey(key: string): string {
  return key.toLowerCase();
}

/**
 * Parses a keybinding string into an array of keys.
 * Supports any combination of keys, not limited to modifier keys.
 *
 * @param keybinding - Keybinding string (e.g., "`", "meta+`", "ctrl+shift+k", "a+b")
 * @returns Array of keys in lowercase, or null if keybinding is null/undefined/empty
 *
 * @example
 * parseKeybinding("meta+k") // ["meta", "k"]
 * parseKeybinding("a+b") // ["a", "b"]
 * parseKeybinding("ctrl+shift+a") // ["ctrl", "shift", "a"]
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

  return trimmed.split("+").map((key) => key.toLowerCase().trim());
}

/**
 * Checks if all keys in the keybinding are currently pressed.
 *
 * @param pressedKeys - Set of currently pressed keys (in lowercase)
 * @param keybinding - Keybinding string to match against
 * @returns true if all keys in keybinding are in pressedKeys set
 *
 * @example
 * const pressed = new Set(["meta", "k"]);
 * matchesKeybinding(pressed, "meta+k") // true
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
 *
 * @param event - KeyboardEvent to extract the pressed key from
 * @returns Normalized key string in keybinding format (e.g., "meta", "ctrl", "k")
 *
 * @example
 * getPressedKeyFromEvent(event) // "meta" when Meta key is pressed, "k" when K is pressed
 */
export function getPressedKeyFromEvent(event: KeyboardEvent): string {
  const normalized = normalizeKey(event.key);

  if (normalized === "control") {
    return "ctrl";
  }

  return normalized;
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
