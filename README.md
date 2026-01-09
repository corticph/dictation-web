# Corti Dictation Web Component

[![Published on npm](https://img.shields.io/npm/v/@corti/dictation-web.svg?logo=npm)](https://www.npmjs.com/package/@corti/dictation-web)
[![License: MIT](https://img.shields.io/npm/l/%40corti%2Fdictation-web)](https://opensource.org/licenses/MIT)
[![Get Support on Discord](https://img.shields.io/badge/Discord-Get%20Support-5865F2.svg?logo=discord&logoColor=fff)](https://discord.com/invite/zXeXHgnZXX)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-blue.svg?logo=rocket&logoColor=fff)](https://codepen.io/hccullen/pen/OPJmxQR)

## Overview

The **Corti Dictation Web Component** is a web component that enables real-time speech-to-text dictation using Corti's Dictation API. It provides a simple interface for capturing audio, streaming it to the API, and handling transcripts.

This library offers two approaches:
- **Opinionated Component**: Use `<corti-dictation>` for a complete, ready-to-use solution with built-in UI
- **Modular Components**: Use individual components for maximum flexibility and custom UI implementations

> **Note:** OAuth 2.0 authentication is not handled by this library. The client must provide an authorization token or token refresh function while using the component.

## Component Architecture

### Opinionated Component

**`<corti-dictation>`** - A complete, ready-to-use component that includes:
- Recording button with visual feedback
- Settings menu for device, language, and keybinding selection
- Automatic state management
- Built-in styling and theming
- Support for both push-to-talk and toggle-to-talk keybindings simultaneously
- Keyboard shortcut (keybinding) support

This is the easiest way to get started and works out of the box.

### Modular Components

For more control and flexibility, you can use individual components:

- **`<dictation-root>`** - Context provider that manages authentication, configuration, and shared state
- **`<dictation-recording-button>`** - Standalone recording button with audio visualization
- **`<dictation-settings-menu>`** - Settings menu with device, language, and keybinding selectors
- **`<dictation-device-selector>`** - Device selection dropdown
- **`<dictation-language-selector>`** - Language selection dropdown
- **`<dictation-keybinding-selector>`** - Keybinding configuration component for keyboard shortcuts (supports both push-to-talk and toggle-to-talk)

These components share state through a context system, allowing you to build custom UIs while leveraging the same underlying functionality.

## Installation

Install the package using your preferred package manager:

```bash
# npm
npm i @corti/dictation-web

# yarn
yarn add @corti/dictation-web

# pnpm
pnpm add @corti/dictation-web

# bun
bun add @corti/dictation-web
```

Then import the module in your code. You can either use a side-effect import to auto-register the component:

```js
// Side-effect import - automatically registers the component
import '@corti/dictation-web';
```

Or import the component class directly:

```js
// Named import - register the component manually if needed
import { CortiDictation } from '@corti/dictation-web';
```

Alternatively, use a CDN to start quickly (not recommended for production):

```html
<script
  src="https://cdn.jsdelivr.net/npm/@corti/dictation-web/dist/bundle.js"
  type="module"
></script>
```

## Demo

🚀 [Hosted Demo](https://codepen.io/hccullen/pen/OPJmxQR)

## Quick Start

Here's a simple example to get you started:

```html
<!DOCTYPE html>
<html lang="en">
<body>
<corti-dictation id="dictation"></corti-dictation>
<textarea
  id="transcript"
  placeholder="Transcript will appear here..."
></textarea>

<script type="module">
  import '@corti/dictation-web';

  const dictationEl = document.getElementById('dictation');
  const transcriptEl = document.getElementById('transcript');

  dictationEl.addEventListener('ready', () => {
    dictationEl.accessToken = 'YOUR_AUTH_TOKEN'; // Note: Never hardcode tokens
  });

  dictationEl.addEventListener('transcript', (e) => {
    if (e.detail.data.isFinal) {
      transcriptEl.value += e.detail.data.text + ' ';
    }
  });
</script>
</body>
</html>
```

### Modular Example

For more control, use individual components to build a custom UI:

```html
<!DOCTYPE html>
<html lang="en">
<body>
<dictation-root id="dictationRoot">
  <dictation-recording-button></dictation-recording-button>
  <dictation-settings-menu settingsEnabled="device,language,keybinding"></dictation-settings-menu>
</dictation-root>

<textarea
  id="transcript"
  placeholder="Transcript will appear here..."
></textarea>

<script type="module">
  import '@corti/dictation-web';

  const root = document.getElementById('dictationRoot');
  const transcriptEl = document.getElementById('transcript');

  root.addEventListener('ready', () => {
    root.accessToken = 'YOUR_AUTH_TOKEN'; // Note: Never hardcode tokens
  });

  root.addEventListener('transcript', (e) => {
    if (e.detail.data.isFinal) {
      transcriptEl.value += e.detail.data.text + ' ';
    }
  });
</script>
</body>
</html>
```

### Keyboard Shortcuts (Keybindings)

The component supports both push-to-talk and toggle-to-talk keybindings simultaneously. You can configure separate keybindings for each behavior:

**Toggle-to-Talk Keybinding (default: `` ` ``):**
- Pressing the key toggles recording on/off
- Works like clicking the button

**Push-to-Talk Keybinding (default: `Space`):**
- Keydown starts recording
- Keyup stops recording
- Works like press-and-hold

You can use either key names (from `event.key`) or key codes (from `event.code`):

```html
<!-- Configure toggle-to-talk keybinding (default: backtick) -->
<corti-dictation toggleToTalkKeybinding="`"></corti-dictation>

<!-- Configure push-to-talk keybinding (default: Space) -->
<corti-dictation pushToTalkKeybinding="Space"></corti-dictation>

<!-- Use key codes instead of key names -->
<corti-dictation toggleToTalkKeybinding="Backquote"></corti-dictation> <!-- backtick -->
<corti-dictation pushToTalkKeybinding="Space"></corti-dictation> <!-- Space key -->
```

Keybindings are platform-aware:
- Keybindings are automatically ignored when typing in input fields, textareas, or contenteditable elements
- Both key names (e.g., `"k"`, `"Meta"`, `"Space"`) and key codes (e.g., `"KeyK"`, `"MetaLeft"`, `"Space"`) are supported
- Both keybindings can be active at the same time
- **Note:** If both keybindings are set to the same key, toggle-to-talk takes priority

## Documentation

For more detailed information, see:

- **[API Reference](docs/API_REFERENCE.md)** - Complete API documentation for properties, methods, and events
- **[Authentication Guide](docs/AUTHENTICATION.md)** - How to set up authentication with tokens and refresh mechanisms
- **[Styling Guide](docs/styling.md)** - Customize the component's appearance with CSS variables and themes
- **[Examples](demo/README.md)** - Practical usage examples and demos
- **[Development Guide](docs/DEV_README.md)** - Information for contributors and developers
