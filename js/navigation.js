/**
 * navigation.js
 * ─────────────────────────────────────────────────────────────
 * Manual navigation control (Prev/Next buttons).
 * Physical UI buttons as an alternative to keyboard/gestures.
 * ─────────────────────────────────────────────────────────────
 */

let initialized = false;

/**
 * Attaches event listeners to the prev/next buttons.
 */
export function initNavigation() {
    if (initialized) return;
    initialized = true;

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (typeof Reveal !== 'undefined') Reveal.prev();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (typeof Reveal !== 'undefined') Reveal.next();
        });
    }
}
