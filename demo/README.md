# Corti Dictation SDK Demos

This directory contains example implementations of the **Corti Dictation SDK**. These demos showcase how to integrate and customize the SDK in different scenarios.

## Available Demos

### 1. Basic Demo ([basic-demo.html](basic-demo.html))
A simple example demonstrating:
- Starting a dictation session.
- Capturing and displaying transcribed text in a `<textarea>`.
- Handling commands (e.g., "delete that").
- Managing interim and final transcripts.

🔹 Best for: Getting started quickly.

---

### 2. Custom UI Demo ([custom-ui-demo.html](custom-ui-demo.html))
A more advanced example where:
- The built-in UI of the `<corti-dictation>` component is hidden.
- Custom buttons control recording.
- A dropdown allows selecting an audio input device.
- A visualizer shows real-time audio levels.

🔹 Best for: Developers who want full control over the UI and user experience.

---

### 3. OAuth Demo ([oauth-demo.html](oauth-demo.html))
This example demonstrates:
- How to configure OAuth authentication using `authConfig`.
- Automatic token refresh handled by the SDK.
- Using the `refreshAccessToken` callback for seamless session continuity.

🔹 Best for: Understanding how to integrate OAuth authentication with the SDK.

---

## Running the Demos
These examples use the **Corti Dictation SDK** and require an access token to function. To run them:
1. Clone the [repository](https://github.com/corticph/dictation-web).
2. Install dependencies:
   ```sh
   npm install
   ```
3. Paste your access token into the code (for the purpose of demoing only)
4. Start the local server:
   ```sh
   npm run start
   ```
5. Open your browser and go to: http://localhost:8000/demo/


For more information, visit the [Corti Dictation SDK documentation](https://docs.corti.ai/stt/dictation-web).
