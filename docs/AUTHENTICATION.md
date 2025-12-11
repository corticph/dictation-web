# Authentication Guide

The Corti Dictation Web Component requires authentication to connect to the Corti Dictation API. This guide explains how to set up authentication using access tokens and automatic token refresh.

> **Note:** The component is automatically hidden until authentication is provided. Once you set an `accessToken` or `authConfig`, the component will become visible and ready to use.

> **Note:** If you're using proxying (`socketUrl` or `socketProxy`), you don't need to provide any authentication information. The component connects directly to your proxy endpoint, and any `accessToken` or `authConfig` you provide will be ignored.

## Overview

The component supports two authentication approaches:

1. **Simple Access Token** - Provide a single access token (suitable for short-lived sessions)
2. **Token Refresh Configuration** - Provide a refresh function for automatic token renewal (recommended for production)

## Basic Access Token

The simplest way to authenticate is by setting an access token directly on the component:

```html
<corti-dictation id="dictation"></corti-dictation>

<script type="module">
  import '@corti/dictation-web';
  
  const dictation = document.getElementById('dictation');
  dictation.accessToken = 'YOUR_ACCESS_TOKEN';
</script>
```

**Note:** This approach requires you to manually update the token when it expires. For production applications, use the token refresh configuration described below.

## Token Refresh Configuration

For production applications, it's recommended to use `authConfig` with a `refreshAccessToken` function. This allows the component to automatically refresh tokens when they expire, ensuring uninterrupted dictation sessions.

### Basic Refresh Configuration

```javascript
const dictation = document.getElementById('dictation');

dictation.authConfig = {
  // Optional: Provide initial tokens if you already have them
  accessToken: 'YOUR_INITIAL_ACCESS_TOKEN', // Optional
  refreshToken: 'YOUR_INITIAL_REFRESH_TOKEN', // Optional
  
  refreshAccessToken: async (refreshToken) => {
    // This function is called:
    // 1. Initially when the component needs a token (if accessToken is not provided, refreshToken will be undefined)
    // 2. Automatically when the access token is near expiration
    
    // Call your authentication service to get a new token
    const tokens = await getNewToken(refreshToken);
    
    // Return the new tokens
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken, // Optional: for future refreshes
    };
  },
};

// Example function that retrieves a new token from your auth server
async function getNewToken(refreshToken) {
  const response = await fetch('https://your-auth-server/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  
  return response.json();
}
```

## How Token Refresh Works

1. **Initial Token**: If `accessToken` is provided in `authConfig`, it's used immediately. Otherwise, `refreshAccessToken` is called with `undefined` to get the first token.

2. **Automatic Refresh**: The component monitors the token's expiration time and automatically calls `refreshAccessToken` before it expires. The `refreshToken` parameter will be:
   - `undefined` on the first call (if no initial `refreshToken` was provided)
   - The `refreshToken` returned from the previous refresh call

3. **Seamless Operation**: Token refresh happens automatically in the background, so your dictation sessions continue without interruption.

## Using with Modular Components

When using individual components (like `dictation-root`), set the `authConfig` on the root component:

```html
<dictation-root id="root">
  <dictation-recording-button></dictation-recording-button>
</dictation-root>

<script type="module">
  import '@corti/dictation-web';
  
  const root = document.getElementById('root');
  root.authConfig = {
    refreshAccessToken: async (refreshToken) => {
      // Your refresh logic
    },
  };
</script>
```

## See Also

- [API Reference](API_REFERENCE.md) - For complete API documentation
- [Examples](../demo/README.md) - See the refresh-demo.html for a working example
