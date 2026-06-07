# requirements.md — Execution Protocol & Requirements

This document outlines the strict technical standards and guidelines that must be enforced by the agent when completing web development tasks on Lectura.

---

## ⚠️ 1. Watermark & Original Creator Attribution

To protect the intellectual property of the original creator:
- **Non-Removal**: You are **forbidden** from removing, hiding, commenting out, or modifying any instance of the text `"Lectura by AditDinus 🔥"`, `"Lectura by AditDinus <3"`, or `"Lectura by AditDinus"` in the HTML body, footers, JS logs, CSS markers, or comments.
- **Verification**: Before concluding any change, perform a full project search to ensure the watermark remains fully functional and visible in both the code and runtime browser output.

---

## 🎨 2. Design & Styling Policies

Every interface and style update must feel premium, modern, and visually impressive. Simple, default, or unstyled designs represent a **failure** of execution.

- **Harmonious Color Systems**: Do not use raw web colors (`red`, `blue`, `#ff0000`). Instead, define HSL values or clean CSS variables (e.g. `--color-academic-primary: #1b365d;`).
- **Typography Selection**: Rely on the loaded CDNs for **Inter** (sans-serif UI), **Noto Serif** (academic body text), and **JetBrains Mono** (code blocks).
- **Preset Boundaries**: Do not mix aesthetic styles. If the project is running the `retro` theme, do not inject backdrop blur properties that belong to `glass`.
- **Transitions and Micro-Animations**: Use smooth, hardware-accelerated transitions:
  ```css
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
  ```

---

## 🔧 3. Javascript Development Rules

- **Strict ES Modules**: Use standard `import` and `export` statements. Do not use CommonJS (`require`).
- **Module Segregation**: Add new functions to their respective files (e.g., scribble adjustments go to `js/scribble.js`). Only use `js/main.js` for importing and launching components.
- **Asynchronous Flow Safety**: Always handle async operations (fetching `config.json` or markdown files) with robust `try-catch` blocks and user-facing loading feedback.

---

## 🔒 4. Security & Performance

- **Sanitization**: All markdown translations outputted to the DOM should be parsed safely to prevent cross-site scripting (XSS).
- **Service Worker Integrity**: When adding new style or logic files, ensure they are registered in the cache lists of `sw.js` to prevent offline presentation failures.
- **FOUC Prevention**: Keep early theme settings inline and synchronous within `<script>` blocks in the `<head>` tag of `index.html`.
