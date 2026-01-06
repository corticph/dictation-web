# API Reference

Complete API documentation for all components in the Corti Dictation Web Component library.

## Component Overview

The library provides two ways to use components:

1. **`<corti-dictation>`** - Opinionated, all-in-one component (recommended for most use cases)
2. **Modular Components** - Individual components for custom UI implementations

> **Important:** Modular components (`dictation-recording-button`, `dictation-settings-menu`, `dictation-device-selector`, `dictation-language-selector`) **require** a `<dictation-root>` parent component to provide context. They cannot be used standalone.

## Events

> **Note:** Events should be subscribed to on `<corti-dictation>` or `<dictation-root>` components only. Individual modular components do not dispatch these events directly.

All events bubble and can be listened to on the root component:

| Event                       | Description                                                                                                                               | Detail                                                                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `ready`                     | Fired once the component is ready.                                                                                                       | No detail                                                                                                                                  |
| `recording-state-changed`   | Fired when the recording state changes.                                                                                                    | `detail.state` (string): The new recording state. One of: `"stopped"`, `"recording"`, `"initializing"`, `"stopping"`                       |
| `recording-devices-changed` | Fired when the user switches recording devices or the list of recording devices changes.                                                  | `detail.devices` (MediaDeviceInfo[]): Full list of available recording devices<br>`detail.selectedDevice` (MediaDeviceInfo): Currently selected device |
| `languages-changed`         | Fired when the list of available languages changes or a language is selected.                                                              | `detail.languages` (string[]): Array of available language codes<br>`detail.selectedLanguage` (string): Currently selected language code |
| `language-changed`          | **⚠️ DEPRECATED** - Fired when the selected language changes. Use `languages-changed` instead.                                               | `detail.language` (string): The selected language code                                                                                    |
| `transcript`                | Fired when a new transcript is received.                                                                                                  | `detail.type` (string): Always `"transcript"`<br>`detail.data.text` (string): Transcript with punctuation applied and command phrases removed<br>`detail.data.rawTranscriptText` (string): Raw transcript without punctuation or command phrase removal<br>`detail.data.start` (number): Start time of the transcript segment in seconds<br>`detail.data.end` (number): End time of the transcript segment in seconds<br>`detail.data.isFinal` (boolean): Whether this is a final transcript (false indicates interim result) |
| `command`                   | Fired whenever a new command is detected.                                                                                                  | `detail.type` (string): Always `"command"`<br>`detail.data.id` (string): Command identifier<br>`detail.data.variables` (object, optional): Command variables as key-value pairs, where values can be string or null<br>`detail.data.rawTranscriptText` (string): Raw transcript text that triggered the command<br>`detail.data.start` (number): Start time of the command segment in seconds<br>`detail.data.end` (number): End time of the command segment in seconds |
| `audio-level-changed`       | Fired when the input audio level changes.                                                                                                 | `detail.audioLevel` (number): The current audio level, ranging from 0 to 1                                                                 |
| `usage`                     | Fired when usage information is received from the server.                                                                                 | `detail.type` (string): Always `"usage"`<br>`detail.credits` (number): The amount of credits used for this stream                         |
| `network-activity`          | Fired when network activity occurs (data sent or received).                                                                              | `detail.direction` (string): Direction of network activity, either `"sent"` or `"received"`<br>`detail.data` (unknown): The data that was sent or received |
| `stream-closed`             | Fired when the WebSocket stream is closed.                                                                                                | `detail` (unknown): WebSocket close event data, typically containing close code and reason                                                 |
| `error`                     | Fired on error.                                                                                                                           | `detail.message` (string): Error message describing what went wrong                                                                      |
| `mode-changed`              | Fired when the dictation mode changes.                                                                                                    | `detail.mode` (string): The new dictation mode. One of: `"toggle-to-talk"`, `"push-to-talk"`                                            |
| `keybinding-changed`        | Fired when the keybinding configuration changes.                                                                                          | `detail.key` (string | null | undefined): The raw key from the keyboard event (e.g., `"k"`, `"Meta"`, `"`"`). `detail.code` (string | null | undefined): The raw code from the keyboard event (e.g., `"KeyK"`, `"MetaLeft"`, `"Backquote"`). The keybinding value is normalized from `key` for internal use. Only single keys are supported, not combinations. |
| `keybinding-activated`       | Fired when a keybinding is activated (key pressed). This event is cancelable - call `event.preventDefault()` to prevent the keybinding from triggering recording. | `detail.keyboardEvent` (KeyboardEvent): The original keyboard event that triggered the keybinding. |

---

## `<corti-dictation>`

The main opinionated component that includes all functionality with a built-in UI.

### Properties

| Property             | Type    | Attribute | Writable | Default | Required | Description                                                                                                               |
| -------------------- | ------- | --------- | -------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `accessToken`        | String  | `accessToken` | ✅       | -       | ✅*       | Latest access token for authentication. Required if no other authentication or proxy methods provided.              |
| `authConfig`         | Object  | -         | ✅       | -       | ✅*       | Authentication configuration with optional refresh mechanism. Must be set via JavaScript property. Required if no other authentication or proxy methods provided. |
| `socketUrl`          | String  | `socketUrl` | ✅       | -       | ✅*       | WebSocket URL for proxy connection. When provided, uses proxy client instead of direct client. Required if no other authentication or proxy methods provided.                            |
| `socketProxy`        | Object  | -         | ✅       | -       | ✅*       | Socket proxy configuration object. Must be set via JavaScript property. Required if no other authentication or proxy methods provided.                                                   |
| `devices`            | Array   | -         | ✅       | `auto-loaded` | ❌       | List of all available recording devices (MediaDeviceInfo[]). Auto-loaded asynchronously from browser's available audio input devices. Must be set via JavaScript property.                              |
| `selectedDevice`     | Object  | -         | ✅       | -       | ❌       | The selected device used for recording (MediaDeviceInfo). Must be set via JavaScript property.                             |
| `recordingState`     | String  | -         | ❌       | `"stopped"` | ❌       | Current state of recording: `"stopped"`, `"recording"`, `"initializing"`, `"stopping"`.                        |
| `dictationConfig`    | Object  | -         | ✅       | <code>{<br>&nbsp;&nbsp;automaticPunctuation: false,<br>&nbsp;&nbsp;primaryLanguage: "en",<br>&nbsp;&nbsp;spokenPunctuation: true<br>}</code> | ❌       | Configuration settings for dictation. Must be set via JavaScript property.                                                 |
| `settingsEnabled`    | String[] | `settingsEnabled` | ✅       | `["device", "language"]` | ❌       | Which settings should be available in the UI. If empty, settings are disabled. Options: `"device"`, `"language"`, `"mode"`, `"keybinding"`. |
| `languagesSupported` | String[] | `languagesSupported` | ✅       | `LANGUAGES_SUPPORTED_EU`<br>or `LANGUAGES_SUPPORTED_US` | ❌       | List of all language codes available. Auto-loaded based on region (EU or US).                                 |
| `mode`              | String   | `mode` | ✅       | `"toggle-to-talk"` | ❌       | Dictation mode: `"toggle-to-talk"` (click to start/stop) or `"push-to-talk"` (press and hold to record). |
| `keybinding`        | String   | `keybinding` | ✅       | "`" (if in settingsEnabled) | ❌       | Keyboard shortcut for starting/stopping recording. Single key only (e.g., `` ` ``, `"k"`, `"meta"`, `"ctrl"`, `"KeyK"`, `"Backquote"`). Supports both key names (from `event.key`) and key codes (from `event.code`). Combinations are not supported. |
| `debug_displayAudio` | Boolean | `debug-display-audio` | ✅       | `false` | ❌       | Overrides device selection and uses getDisplayMedia to stream system audio. Should only be used for debugging.           |
| `allowButtonFocus`   | Boolean | `allowButtonFocus` | ✅       | `false` | ❌       | When `false` (default), prevents the start/stop button from taking focus when clicked. Set to `true` to allow focus.     |

### Methods

| Method                                 | Description                                                      |
| -------------------------------------- | ---------------------------------------------------------------- |
| `startRecording()`                     | Starts a recording.                                              |
| `stopRecording()`                      | Stops a recording.                                               |
| `toggleRecording()`                    | Starts or stops recording. Convenience method.                    |
| `setAccessToken(token: string)`        | **⚠️ DEPRECATED** - Sets the access token. Use `accessToken` property instead. |
| `setAuthConfig(config: BearerOptions)` | **⚠️ DEPRECATED** - Sets the auth configuration. Use `authConfig` property instead. |

---

## `<dictation-root>`

Context provider component that manages authentication, configuration, and shared state. Required parent for all modular components.

> **Important:** All modular components must be children of `<dictation-root>` to receive context.

### Properties

| Property             | Type    | Attribute | Writable | Default | Required | Description                                                                                                               |
| -------------------- | ------- | --------- | -------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `accessToken`        | String  | `accessToken` | ✅       | -       | ✅*      | Latest access token for authentication. Required if no other authentication or proxy methods provided.              |
| `authConfig`         | Object  | -         | ✅       | -       | ✅*      | Authentication configuration with optional refresh mechanism. Must be set via JavaScript property. Required if no other authentication or proxy methods provided. |
| `socketUrl`          | String  | `socketUrl` | ✅       | -       | ✅*      | WebSocket URL for proxy connection. When provided, uses proxy client instead of direct client. Required if no other authentication or proxy methods provided.                            |
| `socketProxy`        | Object  | -         | ✅       | -       | ✅*      | Socket proxy configuration object. Must be set via JavaScript property. Required if no other authentication or proxy methods provided.                                                   |
| `dictationConfig`    | Object  | -         | ✅       | <code>{<br>&nbsp;&nbsp;automaticPunctuation: false,<br>&nbsp;&nbsp;primaryLanguage: "en",<br>&nbsp;&nbsp;spokenPunctuation: true<br>}</code> | ❌       | Configuration settings for dictation. Must be set via JavaScript property.                                               |
| `languages`          | String[] | `languages` | ✅       | `LANGUAGES_SUPPORTED_EU`<br>or `LANGUAGES_SUPPORTED_US` | ❌       | List of all language codes available. Auto-loaded based on region (EU or US).                                  |
| `devices`            | Array   | -         | ✅       | `auto-loaded` | ❌       | List of all available recording devices (MediaDeviceInfo[]). Auto-loaded asynchronously from browser's available audio input devices. Must be set via JavaScript property.                             |
| `selectedDevice`     | Object  | -         | ✅       | -       | ❌       | The selected device used for recording (MediaDeviceInfo). Must be set via JavaScript property.                           |
| `recordingState`     | String  | -         | ❌       | `"stopped"` | ❌       | Current state of recording: `"stopped"`, `"recording"`, `"initializing"`, `"stopping"`.                        |
| `mode`              | String  | `mode` | ✅       | `"toggle-to-talk"` | ❌       | Dictation mode: `"toggle-to-talk"` (click to start/stop) or `"push-to-talk"` (press and hold to record). |
| `keybinding`        | String  | `keybinding` | ✅       | `` ` `` (if in settingsEnabled) | ❌       | Keyboard shortcut for starting/stopping recording. Single key only (e.g., `` ` ``, `"k"`, `"meta"`, `"ctrl"`, `"KeyK"`, `"Backquote"`). Supports both key names (from `event.key`) and key codes (from `event.code`). Combinations are not supported. |
| `debug_displayAudio` | Boolean | `debug-display-audio` | ✅       | -       | ❌       | Overrides device selection and uses getDisplayMedia to stream system audio. Should only be used for debugging.                                               |
| `noWrapper`          | Boolean | `noWrapper` | ✅       | `false` | ❌       | When `true`, removes the default wrapper styling. Useful for custom layouts.                                              |

---

## `<dictation-recording-button>`

Standalone recording button component with audio visualization.

> **Requires:** Must be a child of `<dictation-root>`.

### Properties

| Property           | Type    | Attribute | Writable | Default | Required | Description                                                                                                               |
| ------------------ | ------- | --------- | -------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `allowButtonFocus` | Boolean | `allowButtonFocus` | ✅       | `false` | ❌       | When `false` (default), prevents the button from taking focus when clicked. Set to `true` to allow focus.                |

### Methods

| Method              | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `startRecording()`  | Starts a recording.                                              |
| `stopRecording()`   | Stops a recording.                                               |
| `toggleRecording()` | Starts or stops recording. Convenience method.                    |

---

## `<dictation-settings-menu>`

Settings menu component with device and language selectors.

> **Requires:** Must be a child of `<dictation-root>`.

### Properties

| Property        | Type    | Attribute | Writable | Default | Required | Description                                                                                                               |
| --------------- | ------- | --------- | -------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `settingsEnabled` | String[] | `settingsEnabled` | ✅       | `["device", "language"]` | ❌       | Which settings should be available. If empty array, menu is hidden. Options: `"device"`, `"language"`, `"mode"`, `"keybinding"`. |

---

## `<dictation-device-selector>`

Device selection dropdown component.

> **Requires:** Must be a child of `<dictation-root>`.

### Properties

| Property   | Type    | Attribute | Writable | Default | Required | Description                                                                                                               |
| ---------- | ------- | --------- | -------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `disabled` | Boolean | `disabled` | ✅       | `false` | ❌       | When `true`, disables the device selector.                                                                                |

---

## `<dictation-language-selector>`

Language selection dropdown component.

> **Requires:** Must be a child of `<dictation-root>`.

### Properties

| Property   | Type    | Attribute | Writable | Default | Required | Description                                                                                                               |
| ---------- | ------- | --------- | -------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `disabled` | Boolean | `disabled` | ✅       | `false` | ❌       | When `true`, disables the language selector.                                                                              |

---

## `<dictation-mode-selector>`

Mode selection component for choosing between toggle-to-talk and push-to-talk dictation modes.

> **Requires:** Must be a child of `<dictation-root>`.

### Properties

| Property   | Type    | Attribute | Writable | Default | Required | Description                                                                                                               |
| ---------- | ------- | --------- | -------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `disabled` | Boolean | `disabled` | ✅       | `false` | ❌       | When `true`, disables the mode selector.                                                                                  |

---

## `<dictation-keybinding-selector>`

Keybinding configuration component for setting keyboard shortcuts to start/stop recording.

> **Requires:** Must be a child of `<dictation-root>`.

### Properties

| Property   | Type    | Attribute | Writable | Default | Required | Description                                                                                                               |
| ---------- | ------- | --------- | -------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `disabled` | Boolean | `disabled` | ✅       | `false` | ❌       | When `true`, disables the keybinding selector.                                                                           |

---

## Attribute Formatting

When using attributes (instead of JavaScript properties), follow these guidelines:

- **Boolean attributes**: Use the attribute name to set `true`, omit it to set `false`
  ```html
  <corti-dictation debug-display-audio></corti-dictation> <!-- true -->
  <corti-dictation></corti-dictation> <!-- false -->
  ```

- **String attributes**: Use the attribute value directly
  ```html
  <corti-dictation accessToken="YOUR_TOKEN"></corti-dictation>
  ```

- **Array attributes**: Use comma-separated values
  ```html
  <corti-dictation settingsEnabled="device,language,mode,keybinding"></corti-dictation>
  <corti-dictation languagesSupported="en,da,sv"></corti-dictation>
  ```

- **Object/Complex types**: Must be set via JavaScript properties, not attributes
  ```javascript
  dictation.authConfig = { refreshAccessToken: async () => {...} };
  dictation.dictationConfig = { primaryLanguage: 'en' };
  ```

## See Also

- [Authentication Guide](AUTHENTICATION.md) - How to set up authentication
- [Styling Guide](styling.md) - How to customize component appearance
- [Examples](../demo/README.md) - Practical usage examples
