# Corti Dictation Web Component

[![Published on npm](https://img.shields.io/npm/v/@corti/dictation-web.svg?logo=npm)](https://www.npmjs.com/package/@corti/dictation-web)
[![License: MIT](https://img.shields.io/npm/l/%40corti%2Fdictation-web)](https://opensource.org/licenses/MIT)
[![Get Support on Discord](https://img.shields.io/badge/Discord-Get%20Support-5865F2.svg?logo=discord&logoColor=fff)](https://discord.com/invite/zXeXHgnZXX)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-blue.svg?logo=rocket&logoColor=fff)](https://codepen.io/hccullen/pen/OPJmxQR)

## Overview

The **Corti Dictation Web Component** is a web component that enables real-time speech-to-text dictation using Corti's Dictation API. It provides a simple interface for capturing audio, streaming it to the API, and handling transcripts.

> **Note:** OAuth 2.0 authentication is not handled by this library. The client must provide an API key or authorization token before using the component.

## Installation

Include the Web Component in your project by importing the JavaScript module:

```html
npm i @corti/dictation-web
```

Then import the module like so:

```js
// Import the Corti Dictation Web Component
import '@corti/dictation-web';
```

Alternatively, use a CDN to start quickly (not recommended).

```html
<script
  src="https://cdn.jsdelivr.net/npm/@corti/dictation-web/dist/bundle.min.js"
  preload
  type="module"
></script>
```

## Usage

### Demo

🚀 [Hosted Demo](https://codepen.io/hccullen/pen/OPJmxQR)

### Basic Example

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <corti-dictation id="dictation"></corti-dictation>
    <textarea
      id="transcript"
      placeholder="Transcript will appear here..."
    ></textarea>

    <script>
      import '@corti/dictation-web';
      const dictationEl = document.getElementById('dictation');
      dictationEl.addEventListener('ready', () => {
        dictationEl.setAccessToken('YOUR_AUTH_TOKEN'); // Note: Never hardcode tokens
      });
      dictationEl.addEventListener('transcript', e => {
        document.getElementById('transcript').value += e.detail.data.text + ' ';
      });
    </script>
  </body>
</html>
```

## API Reference

### Properties

| Property             | Type    | Description                                                                                                               |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| `devices`            | Array   | List of available recording devices.                                                                                      |
| `selectedDevice`     | Object  | The selected device used for recording (MediaDeviceInfo).                                                                 |
| `recordingState`     | String  | Current state of recording (`stopped`, `recording`, `initializing` and `stopping`, ).                                     |
| `dictationConfig`    | Object  | Configuration settings for dictation.                                                                                     |
| `settingsEnabled`    | Array   | Which settings should be available in the UI. If an empty array is passed, the settings will be disabled entirely. Options are `language` and `devices` |
| `languagesSupported`    | String[]  | List of all language codes available for use with the Web Component.                                                                                     |
| `debug_displayAudio` | Boolean | Overrides any device selection and instead uses getDisplayMedia to stream system audio. Should only be used for debugging |
| `preventButtonFocus` | Boolean | When `true` (default), prevents the start/stop button from taking focus when clicked, allowing textareas or other input elements to maintain focus. Set to `false` to allow the button to receive focus on click. |

### Methods

| Method                                 | Description                                                      |
| -------------------------------------- | ---------------------------------------------------------------- |
| `startRecording()`                     | Starts a recording.                                              |
| `stopRecording()`                      | Stops a recording.                                               |
| `toggleRecording()`                    | Starts or stops recording. Convenience layer on top of the start/stop methods. |
| `setAccessToken(access_token: string)` | Set the latest access token. This will return the server config. |
| `setAuthConfig(config: AuthConfig)`    | Set authentication configuration with optional refresh mechanism. |

### Events

| Event                       | Description                                                                                                                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ready`                     | Fired once the component is ready.                                                                                                                                                                      |
| `recording-state-changed`   | Fired when the recording state changes. `detail.state` contains the new state.                                                                                                                          |
| `recording-devices-changed` | Fired when the user switches recording devices or the list of recording devices changes. `detail.devices` contains the full devices list. `detail.selectedDevice` contains the current selected device. |
| `transcript`                | Fired when a new transcript is received. `detail.data.text` contains the transcribed text.                                                                                                              |
| `command`                   | Fired whenever a new command is detected.                                                                                                                                                               |
| `audio-level-changed`       | Fired when the input audio level changes. `detail.audioLevel` contains the new level.                                                                                                                   |
| `usage`                     | Fired when usage information is received from the server. `detail.credits` contains the usage data.                                                                                                             |
| `stream-closed`             | Fired when the WebSocket stream is closed. `detail` contains the close event data.                                                                                                                     |
| `error`                     | Fired on error. `detail` contains the full error.                                                                                                                                                       |

## Authentication

This library supports multiple authentication methods:

### Basic Bearer Token
```javascript
dictation.setAccessToken('YOUR_JWT_TOKEN');
```

### With Refresh Token Support

The library can automatically refresh tokens when they expire:

```javascript
dictation.setAuthConfig({
  // This function runs before any API call when the access_token is near expiration
  refreshAccessToken: async (refreshToken?: string) => {
      // Custom refresh logic -- get new access_token from server
      // if accessToken is not passed to AuthConfig, refreshToken will be `undefined` for the first call,
      //   then it will be the refreshToken returned from the previous token request
      const response = await fetch("https://your-auth-server/token", {
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
      });
      
      const result = await response.json();
      
      // Return in the expected format
      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      };
  }
});
```

The refresh mechanism automatically handles token renewal when the access token is near expiration, ensuring uninterrupted dictation sessions.

## Usage Examples

Explore practical implementations and usage examples in the [Demo Folder](https://github.com/corticph/dictation-web/tree/main/demo). These demos can also be run locally.

## Styling

![UI Overview](https://github.com/corticph/dictation-web/blob/main/docs/ui.png)

The default UI is designed to be slotted into existing applications seamlessly, however, it also supports custom styling as well as theming. The UI can be fully customized using CSS properties. Refer to our [Styling Guide](https://github.com/corticph/dictation-web/blob/main/docs/styling.md) for detailed instructions.

## License

This Web Component library is licensed under MIT.

## Support

For issues or questions, contact **Corti Support** at [support@corti.ai](mailto:help@corti.ai) or [join our Discord](https://discord.com/invite/zXeXHgnZXX).
