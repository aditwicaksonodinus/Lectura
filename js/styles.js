/**
 * styles.js
 * ─────────────────────────────────────────────────────────────
 * Dynamic integration between JS and style.css.
 *
 * Responsibilities:
 *  1. Load the style.css stylesheet with a version-controlled
 *     cache-busting parameter (not hardcoded in HTML).
 *  2. Sync CSS Custom Properties with config values:
 *     - --presentation-width  ← from ASPECT_RATIO
 *     - --base-font-size      ← from BASE_FONT_SIZE (for CSS reference)
 *
 * Why is this necessary?
 *  style.css uses var(--presentation-width) extensively
 *  (h2 title width, academic-box max-width, h3 card width, etc.).
 *  Its value must reflect the ASPECT_RATIO loaded from config.json,
 *  rather than being hardcoded statically in CSS alone.
 * ─────────────────────────────────────────────────────────────
 */


/**
 * Sync CSS Custom Properties with presentation configuration values.
 * Called after loadConfig() completes, before Reveal.initialize().
 *
 * Affected CSS (from style.css):
 *  - var(--presentation-width) → used in h2, h3, .academic-box, etc.
 *  - var(--base-font-size)     → optional, for reference in CSS calc()
 *
 * @param {{ aspectRatio: string, baseFontSize: string }} options
 */
export function applyCSSConfig({ aspectRatio, baseFontSize }) {
    const root = document.documentElement;

    // ── --presentation-width ──────────────────────────────────
    // Sync with same logic in CSS:
    //   html.ratio-4-3 { --presentation-width: 1200px; }
    //   default (16:9)  { --presentation-width: 1600px; }
    //
    // By setting it from JS, we ensure its value reflects config.json,
    // not just the CSS class that might not be applied when JS first runs.
    const presentationWidth = aspectRatio === '4:3' ? '1200px' : '1600px';
    root.style.setProperty('--presentation-width', presentationWidth);

    // ── --base-font-size ──────────────────────────────────────
    // Store as a custom property so it can be used in CSS calc() if needed.
    // Example: font-size: calc(var(--base-font-size) * 0.8);
    if (baseFontSize) {
        root.style.setProperty('--base-font-size', baseFontSize);
    }
}
