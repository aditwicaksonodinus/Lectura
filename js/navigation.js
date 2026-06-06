/**
 * navigation.js
 * ─────────────────────────────────────────────────────────────
 * Kontrol navigasi manual (tombol Prev/Next).
 * Tombol fisik di UI sebagai alternatif keyboard/gesture.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Pasang event listener pada tombol prev/next.
 */
export function initNavigation() {
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
