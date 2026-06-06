<div align="center">

# 📖 Lectura — Academic Presentation System

> **Academic Dashboard** — Present your thesis, research, or seminar with elegance.

[![Reveal.js](https://img.shields.io/badge/Reveal.js-4.6-FF2E63?style=flat-square&logo=reveal.js&logoColor=white)](https://revealjs.com/)
[![GitHub License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)]()

**Lectura** is a web-based academic slide platform that combines **Markdown** simplicity with a modern *Glassmorphism* dashboard and *High-Contrast Dark Mode*, all powered by **Reveal.js**.

<p align="center">
  <img src="assets/dark-mode.png" alt="High-Contrast Dark Mode" width="49%">
  <img src="assets/light-mode.png" alt="Light Mode" width="49%">
</p>

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [📁 Architecture & File Structure](#-architecture--file-structure)
- [📖 User Guide (Documentation)](#-user-guide-documentation)
  - [🚀 Getting Started](GUIDE.md#-getting-started)
  - [⚙️ Configuration](GUIDE.md#️-configuration)
  - [📝 Writing Slides](GUIDE.md#-writing-slides)
  - [🎨 Slide Layouts](GUIDE.md#-slide-layouts)
  - [📐 Academic Features](GUIDE.md#-academic-features)
  - [🎮 Interactive Controls](GUIDE.md#-interactive-controls)

---

## ✨ Features

| Area | Highlights |
|------|------------|
| **Content** | Markdown-based ✅ LaTeX Math (MathJax 3) ✅ Mermaid Diagrams ✅ |
| **UI/UX** | Glassmorphism 🌓 Dark/Light Mode 🔖 Chapter Tabs ⏱️ Timer 📐 16:9 & 4:3 Ratios |
| **Layouts** | 9 slide layouts 🖼️ Image Lightbox 🎴 Booktabs Tables |
| **Control** | Server-side parsed 🛡️ Navigation Protection 🚀 Enhanced Navigation |

---

## 📁 Architecture & File Structure

The system is **server-side parsed**: slide content is dynamically read from external markdown files when the page loads.

```
📦 Lectura
├── 📄 index.html          # HTML scaffold + CDN deps
├── 📄 script.js           # Core engine: config, markdown parsing, UI
├── 📄 style.css           # Glassmorphism, themes, responsive layout
├── 📄 config.json         # Global presentation settings
├── 📄 GUIDE.md           # Detailed user guide & documentation 👈
├── 📄 content-id.md       # Slide content (Bahasa Indonesia)
├── 📄 content-en.md       # Slide content (English)
├── 🖼️ placeholder.png     # Preview / demo image
├── 📁 assets/             # Assets directory (images)
└── 📁 Noto_Serif/         # Custom font
```

### 🔧 Core Files

| File | Role |
|------|------|
| **[index.html](index.html)** | Loads Reveal.js, Marked.js, MathJax 3, Mermaid via CDN. |
| **[script.js](script.js)** | Reads `config.json` → Fetches & parses Markdown → Renders layouts & UI. |
| **[style.css](style.css)** | Glassmorphism, grid layouts, navigation controls, and themes. |
| **[config.json](config.json)** | Single source of truth for presentation metadata and settings. |
| **[GUIDE.md](GUIDE.md)** | **Complete documentation for setup and usage.** |

---

## 📖 User Guide (Documentation)

For complete instructions on how to use Lectura, please refer to the **[GUIDE.md](GUIDE.md)** file.

### Quick Links:
- **[🚀 How to Start](GUIDE.md#-getting-started)**
- **[⚙️ Configuration Options](GUIDE.md#️-configuration)**
- **[📝 How to Write Slides](GUIDE.md#-writing-slides)**
- **[🎨 Available Layouts](GUIDE.md#-slide-layouts)**

---

<div align="center">

**Built with ❤️ for thesis defenses, research seminars, and academic presentations.**

⭐ Star this repo if you find it useful!

</div>
