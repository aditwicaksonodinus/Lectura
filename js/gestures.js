/**
 * gestures.js
 * ─────────────────────────────────────────────────────────────
 * Pencegahan gesture tidak disengaja:
 *   - Swipe back/forward browser
 *   - Pull-to-refresh
 *   - Horizontal wheel scroll (gesture back/forward trackpad)
 *   - Konfirmasi sebelum menutup tab saat presentasi berjalan
 * ─────────────────────────────────────────────────────────────
 */

import { isRunning } from './timer.js';

// ── State posisi sentuhan ─────────────────────────────────────
let touchStartPosX = 0;
let touchStartPosY = 0;

/**
 * Pasang semua event listener pencegahan gesture.
 * Dipanggil satu kali dari main.js saat window.onload.
 */
export function initGestures() {

    // Konfirmasi sebelum menutup tab (hanya saat timer berjalan)
    window.addEventListener('beforeunload', (e) => {
        if (isRunning()) {
            e.preventDefault();
            e.returnValue = ''; // Standar untuk browser modern
        }
    });

    // Catat posisi awal sentuhan
    window.addEventListener('touchstart', (e) => {
        touchStartPosX = e.touches[0].pageX;
        touchStartPosY = e.touches[0].pageY;
    }, { passive: true });

    // Cegah gesture saat touchmove
    window.addEventListener('touchmove', (e) => {
        if (!e.touches || !e.touches[0]) return;

        const touchMovePosX = e.touches[0].pageX;
        const touchMovePosY = e.touches[0].pageY;
        const diffX         = touchStartPosX - touchMovePosX;
        const diffY         = touchStartPosY - touchMovePosY;
        const absDiffX      = Math.abs(diffX);
        const absDiffY      = Math.abs(diffY);

        // Scroll vertikal di dalam container? Biarkan saja (FPS lebih tinggi)
        if (absDiffY > absDiffX && e.target.closest('.content-wrapper')) {
            return;
        }

        // 1. Cegah "Pull-to-refresh"
        if (window.scrollY === 0 && diffY < 0) {
            const scrollable = e.target.closest('.content-wrapper');
            if (!scrollable || scrollable.scrollTop === 0) {
                e.preventDefault();
                return;
            }
        }

        // 2. Cegah navigasi browser (back/forward swipe)
        if (absDiffX > absDiffY && absDiffX > 10) {
            e.preventDefault();
            return;
        }

        // 3. Cegah swipe dari tepi layar
        const threshold = 50;
        if (touchStartPosX < threshold || touchStartPosX > window.innerWidth - threshold) {
            e.preventDefault();
        }
    }, { passive: false });

    // Cegah horizontal wheel scroll (gesture back/forward trackpad)
    window.addEventListener('wheel', (e) => {
        if (e.deltaX !== 0 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
        }
    }, { passive: false });
}
