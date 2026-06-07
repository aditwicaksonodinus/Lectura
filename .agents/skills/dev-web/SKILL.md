---
name: dev-web-lectura
description: Skill for Lectura academic presentation website development. Stack HTML5, CSS3 (7-Layer Architecture), Vanilla JS (ES Modules), and Reveal.js. Use this skill when creating, editing, or debugging HTML, CSS (styles/), or JS (js/) files within the Lectura project.
---

# Lectura — Web Development Skill

> Development guide for the Lectura academic presentation website.
> Stack: HTML5 · CSS3 (7-Layer Architecture) · Vanilla JS (ES Modules) · Reveal.js

---

## 📁 Project Structure

```
📦 Lectura
├── 📄 index.html           # Entry point — CDN deps (Reveal.js, Marked, Mermaid)
├── 📄 style.css            # CSS entrypoint — only contains @import
├── 📄 config.json          # Presentation configuration (duration, theme, stylePreset, etc.)
├── 📄 content-{lang}.md   # Slide content in markdown
├── 📁 js/                  # 19 ES modules — orchestrated from main.js
├── 📁 styles/              # 7 CSS files — layer architecture
├── 📁 assets/              # Images, logos, backgrounds
└── 📁 Noto_Serif/          # Custom fonts
```

---

## 🎨 CSS — 7-Layer Architecture

The import order in `style.css` **must** follow the dependency cascade:

| Layer | File | Function |
|-------|------|--------|
| 1 | `styles/tokens.css` | Design tokens & CSS variables (colors, shadows, gradients) |
| 2 | `styles/base.css` | Reset, html/body stacking, dark mode variable overrides |
| 3 | `styles/typography.css` | Headings, lists, blockquotes, dark mode text colors |
| 4 | `styles/layout.css` | Slide sections, content wrapper, title/closing slides |
| 5 | `styles/components.css` | Academic cards, tables (booktabs), equations, mermaid |
| 6 | `styles/ui.css` | Header, footer, timer, navigation, accessibility, tools |
| 7 | `styles/animations.css` | @keyframes & animation utilities |

### CSS Rules

- **Use CSS variables** from `tokens.css` — do not hardcode values.
- **Dark mode**: all colors are redefined in `base.css` via `[data-theme="dark"]`.
- **Naming**: use descriptive classes (`academic-box`, `booktabs`, `slide-title`).
- **No inline styles** in HTML except for dynamic JS.
- **Avoid `!important`** — cascade layers already guarantee specificity.

---

## ⚡ JavaScript — ES Module Architecture

**Entry point**: `js/main.js` → call all `init*()` functions in the correct order.

### Modules & Responsibilities

| Module | Function |
|-------|--------|
| `config.js` | Load config.json, export constants |
| `slides.js` | Parse markdown, render layouts, init Reveal.js |
| `theme.js` | Dark/light mode toggle + localStorage |
| `navigation.js` | Prev/next buttons, keyboard shortcuts |
| `styles.js` | Cache-busting stylesheet loader |
| `markdown.js` | Markdown → HTML parser (Marked.js wrapper) |
| `cards.js` | Academic card hover/click interactions |
| `gestures.js` | Touch/gesture handling |
| `layouts.js` | Layout template renderer |
| `tabs.js` | Book/chapter tab navigation |
| `timer.js` | Presentation countdown timer |
| `image-preview.js` | Lightbox overlay |
| `accessibility.js` | Accessibility menu |
| `laser.js` | Laser pointer mode |
| `scribble.js` | Scribble/drawing mode |
| `ui.js` | UI utilities |
| `animation.js` | Animation helpers |
| `mermaid.js` | Mermaid diagram renderer |

### JavaScript Rules

- **ES Modules** — use `import`/`export`, no global scripts.
- **Module pattern** — each file exports an `init*()` function and utilities.
- **No frameworks** — vanilla JS with Reveal.js API.
- **Async handling** — fetch config & content at the start, await before rendering.
- **Event listeners** — attach in `init*()`, not in global scope.
- **Cache DOM references** — query once, store in local variables.

---

## 📄 HTML — index.html Conventions

- **CDN dependencies** are placed in `<head>` (CSS) and before `</body>` (JS).
- **JS Modules** are loaded via `<script type="module" src="js/main.js">`.
- **Semantic containers**: `.reveal` → `.slides` → `<section>` (per slide).
- **Dynamic content** — `.slides` is populated by JS from markdown.
- **Custom elements** outside Reveal: `#scribble-canvas`, `#laser-cursor`, `.image-preview-overlay`.

---

## 🚀 Development Workflow

### Setup

```bash
# Must use an HTTP server (CORS for fetching content.md)
python3 -m http.server 8000
# or VS Code Live Server / npx http-server -p 8080
```

### Common Tasks

**1. Adding a new slide layout**
- Add CSS in `styles/layout.css` (or `components.css`).
- Add template rendering in `js/layouts.js`.
- Register in the `js/slides.js` layout switch-case.
- Document in `GUIDE.md`.

**2. Adding UI/UX features**
- Create a new module in `js/` (export `init*()`).
- Add style in `styles/ui.css`.
- Import & call from `js/main.js`.

**3. Changing the color theme**
- Edit CSS variables in `styles/tokens.css`.
- Dark mode overrides in `styles/base.css`.

**4. Changing the style preset**
- Edit `stylePreset` in `config.json` (supported values: `"glass"`, `"formal"`, `"retro"`, `"cyber"`, or `"minimal"`).
- Customize preset rules under `styles/base.css` (`Preset 1: Dark Mode Glass Overrides` and `Preset 2: Dark Mode Formal Overrides`).

**5. Adding card interactions**
- Edit the `.academic-box` CSS selector in `styles/components.css`.
- Edit logic in `js/cards.js`.

### Slide Content

- Edit `content-id.md` or `content-en.md`.
- Use `---slide-break---` as a slide separator.
- Metadata in HTML comments (`<!-- layout: ... -->`).
- `<!-- split -->` for multi-column/row.

---

## 🔧 Code Conventions

### CSS

```css
/* Variables in tokens.css */
--lectura-primary: #1b365d;
--lectura-accent: #f59e0b;
--lectura-bg: #0f172a;

/* Dark mode in base.css */
[data-theme="dark"] {
  --lectura-bg: #0f172a;
  --lectura-text: #e2e8f0;
}

/* Components in components.css */
.academic-box { /* ... */ }
.booktabs { /* ... */ }
```

### JavaScript

```js
// config.js — export constants + async loader
export let CONFIG_VALUE = 'default';
export async function loadConfig() { /* ... */ }

// module.js — init pattern
export function initFeature() {
  const el = document.querySelector('.selector');
  if (!el) return;
  el.addEventListener('click', handler);
}
```

---

## ✅ Pre-Commit Checklist

- [ ] No `console.log` remaining (except watermark).
- [ ] No new `!important` declarations.
- [ ] Dark mode works for all new elements.
- [ ] JS modules are imported in `main.js` (if new).
- [ ] CSS is imported in `style.css` (if new).
- [ ] Does not break the footer watermark.
- [ ] Slide layouts remain responsive in 16:9 and 4:3.

---

## 🔗 How to Activate Skill

```bash
# Link skill to workspace (if not already)
gemini skills link .agents/skills/dev-web

# Enable skill
gemini skills enable dev-web-lectura

# Reload in interactive session
/skills reload

# Verify
gemini skills list --all
```

---

> **Reference**: `GUIDE.md` for user documentation, `README.md` for general architecture.
