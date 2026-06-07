# 02-style-presets.md — Theme Presets & Customization

Lectura features 5 distinct design presets to fit various presentation environments. The active preset is determined by the `stylePreset` attribute in `config.json` and applied via `html.style-[preset-name]`.

---

## 🎨 1. Preset Details

### 💎 Glass (`glass`)
- **Visuals**: Semi-transparent backing cards, backdrop blurs, subtle glowing shadows, gradient headers, and grid overlays.
- **Aesthetic**: Premium, futuristic, and highly polished.
- **Key variables**:
  - `--bg-card`: `linear-gradient(135deg, #ffffffb2, #ffffff80)`
  - `--blur-backdrop`: `blur(5px)`
  - `--opacity-grid`: `0.60`

### 💼 Formal (`formal`)
- **Visuals**: Solid background, sharp, card borders, no shadows, strict margins, traditional headers.
- **Aesthetic**: IEEE academic paper publishing look, minimal distractions.
- **Key variables**:
  - `--bg-card`: `#ffffff`
  - `--shadow-card`: `none`
  - `--opacity-grid`: `0.0`

### 📻 Retro (`retro`)
- **Visuals**: Thick solid black borders, drop shadow offsets, paper-like warm backdrops (cream in light mode, deep warm stone in dark mode), bright color blocks.
- **Aesthetic**: Neobrutalist web design.
- **Key variables**:
  - `--border-primary`: `3px solid #111111`
  - `--shadow-card`: `2px 2px 0px #e11d48, 4px 4px 0px #f59e0b, 6px 6px 0px #2d3fe7`
  - `--radius-card`: `4px`

### ⚡ Cyber (`cyber`)
- **Visuals**: Solarized color palette, solid neon lines, monospace typography, razor-sharp corners (0px radius).
- **Aesthetic**: Retro-futuristic terminal or sci-fi control panel.
- **Key variables**:
  - `--border-primary`: `2px solid #00c8ff`
  - `--radius-card`: `0px`
  - `--bg-main`: `#f5f6fa` (Solarized base variant)

### 🔲 Minimal (`minimal`)
- **Visuals**: Pure black and white contrasts, simple lines, clean system-default styling, maximum white space.
- **Aesthetic**: Strict distraction-free minimalism.
- **Key variables**:
  - `--radius-card`: `4px` or less
  - `--border-primary`: `1px solid var(--border-light)`

---

## 🔧 2. Customizing Preset Variables

All presets define variables under their respective classes in [`styles/themes.css`](file:///run/media/aditlinux/SSD%20NVME/Lectura/styles/themes.css). When creating or editing variables:
1. **Light Mode Rules**: Define variables under `html.style-[preset]`.
2. **Dark Mode Rules**: Override variables under `html.dark-mode.style-[preset]`.

### Custom Variable Conventions
Always map variables to semantic purposes:
- `--bg-main`: Main window canvas background.
- `--bg-card`: Card wrapper background.
- `--border-primary`: Standard border formatting.
- `--text-primary`: Primary title and text reading color.
- `--text-secondary`: Secondary heading or highlighted text color.

### Guidelines for Design Upgrades
- **Avoid Flat Solid Colors**: Instead of pure blue or red, use curated HSL gradients.
- **Micro-Animations**: Hover states on interactive cards (`.academic-box`) should scale up slightly (e.g. `transform: translateY(-2px)`) and increase shadow depth. Make sure to define these transitions in `styles/base.css` or `styles/animations.css`.
- **Contrast Ratios**: Check that all text variables maintain WCAG AA contrast (at least 4.5:1) against their matching background variables.
