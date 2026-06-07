# 04-testing-validation.md — Local Server & Verification Protocol

Lectura fetches configuration files and slide resources asynchronously. Consequently, it cannot be run by opening `index.html` directly (CORS restriction). A local HTTP server is required for development.

---

## 🚀 1. Starting the Development Server

The user runs a local Live Preview HTTP server manually on port 3000. Always run CLI interactions through the **RTK hook** or **RTK proxy** to comply with the global environment protocols.

### Option A: Node http-server (Recommended)
Launch a local server manually on port 3000:
```bash
rtk proxy npx http-server -p 3000 -c-1
```
*Note: The `-c-1` flag disables caching, which prevents style or configuration caching issues during development.*

### Option B: Python SimpleHTTPServer
If Node is not available, launch on port 3000 manually:
```bash
rtk proxy python3 -m http.server 3000
```

---

## 🔍 2. Developer Verification Checklist

Once the server is running, perform the following quality assurance checks:

### 1. Browser Console Check
- Open your browser's Developer Tools (F12).
- Ensure there are **no uncaught reference errors**, import failures, or CORS errors.
- Confirm the custom watermark is logged in the console: `"✨ Lectura Presentation by AditDinus <3"`.

### 2. Styling Presets & Dark Mode
- Toggle Dark/Light Mode using the theme button. Verify that elements transition smoothly without color flickering.
- Switch presets in `config.json` (e.g. from `glass` to `retro`). Verify that the correct classes (`style-glass`, `style-retro`, etc.) are attached to the `<html>` tag and the corresponding layout styles are applied instantly.

### 3. Layout Dimensions & Ratios
- Verify that slides conform to the configured `aspectRatio` (`16:9` or `4:3`).
- Ensure no scrollbars appear inside `academic-box` containers, and content stays centered without overflowing off-screen.

### 4. Interactive Components
- Verify that **Mermaid** graphs update colors dynamically when changing themes.
- Test that clicking images opens them in the **lightbox modal**.
- Ensure the countdown timer displays the correct duration from `config.json` and transitions to warning colors near expiration.

### 5. Offline Capabilities (Service Worker)
- Verify that `sw.js` registers successfully in the Application tab of your browser tools.
- Reload the page in offline mode. Ensure that the presentation still loads, using the locally cached assets and CDN script files.
