# 01-architecture-guidelines.md — Core System Architecture

Lectura is designed as a modular, client-side rendered presentation system using Native ES Modules for Javascript and a 7-Layer Clean Architecture for stylesheets.

---

## 🎨 1. CSS Architecture (7-Layer Structure)

All stylesheet modules reside under `styles/`. The main `style.css` in the project root must only import these layers in sequence. Do not write raw rules directly inside `style.css`.

| Layer | File | Purpose & Guidelines |
|---|---|---|
| **Layer 1** | [`styles/tokens.css`](file:///run/media/aditlinux/SSD%20NVME/Lectura/styles/tokens.css) | Defines CSS Custom Properties (variables), fonts (`@font-face`), aspect ratios, and dimensions. No component styles are allowed here. |
| **Layer 1.5** | [`styles/themes.css`](file:///run/media/aditlinux/SSD%20NVME/Lectura/styles/themes.css) | Contains preset specific semantic overrides (e.g. `html.style-glass`, `html.style-retro`). Governs dark mode styling rules for each preset. |
| **Layer 2** | [`styles/base.css`](file:///run/media/aditlinux/SSD%20NVME/Lectura/styles/base.css) | Reset rules, standard html/body layout overrides, theme transition properties, and Reveal.js background transparent overrides. |
| **Layer 3** | [`styles/typography.css`](file:///run/media/aditlinux/SSD%20NVME/Lectura/styles/typography.css) | Heading hierarchies (`h1` to `h6`), lists, inline text, blockquotes, and fallback fonts for academic texts. |
| **Layer 4** | [`styles/layout.css`](file:///run/media/aditlinux/SSD%20NVME/Lectura/styles/layout.css) | Structural layouts for Reveal slides, slide columns, stack layouts, title slides, and closing slides. |
| **Layer 5** | [`styles/components.css`](file:///run/media/aditlinux/SSD%20NVME/Lectura/styles/components.css) | Individual widgets and content styles: Academic cards (`.academic-box`), tables (booktabs styling), MathJax equations, Mermaid diagrams, and footnotes. |
| **Layer 6** | [`styles/ui.css`](file:///run/media/aditlinux/SSD%20NVME/Lectura/styles/ui.css) | Global presentation tools UI: Navigation headers, footer elements, countdown timer container, accessibility settings menu, scribble toolbar, and preview lightboxes. |
| **Layer 7** | [`styles/animations.css`](file:///run/media/aditlinux/SSD%20NVME/Lectura/styles/animations.css) | Keyframe declarations and transition helper classes (staggered entries, fade-ins, and slides movement). |

---

## ⚙️ 2. JS Architecture (ES Modules)

The Javascript codebase is structured into self-contained ES Modules located in the `js/` directory. They are preloaded in `index.html` and initialized sequentially in `js/main.js` on `DOMContentLoaded`.

### Core Orchestration
- [`js/main.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/main.js): Entry point. Loads setup modules first, sets up global variables, and calls all individual `init*` sub-functions.

### Slide Engine & Markdown Rendering
- [`js/slides.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/slides.js): Fetches the markdown slide content and boots Reveal.js. Manages transition configs.
- [`js/config.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/config.js): Handles fetching and caching options from `config.json`.
- [`js/markdown.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/markdown.js): Integrates Marked.js to transform Markdown slide sources to raw HTML.
- [`js/layouts.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/layouts.js): Decodes slide layouts from slide metadata comments and returns structured templates.
- [`js/mermaid.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/mermaid.js): Orchestrates Mermaid diagram rendering with correct styling hooks matching current theme presets.

### User Interface & Tools
- [`js/ui.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/ui.js): Builds structural HTML headers, footers, watermark labels, and updates slide numbers.
- [`js/theme.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/theme.js): Manages light/dark mode and preset styling switches (`html.classList`).
- [`js/styles.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/styles.js): Dynamically injects style references or cache versioning parameters.
- [`js/timer.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/timer.js): Manages countdown state, play/pause controls, and time display logic.
- [`js/tabs.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/tabs.js): Creates top-navigation academic tabs representing presentation chapters/sections.

### Interactive Controls
- [`js/accessibility.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/accessibility.js): Keyboard shortcut mapping menu and audio-visual helper toggles.
- [`js/laser.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/laser.js): Generates a custom virtual laser pointer tracking cursor movements.
- [`js/scribble.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/scribble.js): HTML5 Canvas overlay allowing presenters to draw/annotate directly on top of slides.
- [`js/navigation.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/navigation.js): Overrides normal slide progression for structured page bounds.
- [`js/cards.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/cards.js): Dynamic hover effects, cards focus modes, and interactive box layout expansions.
- [`js/gestures.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/gestures.js): Mobile touch swipe detection.
- [`js/image-preview.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/image-preview.js): Fullscreen image modal lightbox trigger on image clicks.
