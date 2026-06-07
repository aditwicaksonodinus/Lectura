/**
 * gestures.js
 * ─────────────────────────────────────────────────────────────
 * Unintentional gesture prevention:
 *   - Browser swipe back/forward
 *   - Pull-to-refresh
 *   - Horizontal wheel scroll (trackpad back/forward gestures)
 *   - Confirmation before closing tab during active presentation
 * ─────────────────────────────────────────────────────────────
 */

import { isRunning } from './timer.js';

// ── Touch position state ─────────────────────────────────────
let touchStartPosX = 0;
let touchStartPosY = 0;

let initialized = false;

/**
 * Attaches all gesture prevention event listeners.
 * Called once from main.js on window.onload.
 */
export function initGestures() {
    if (initialized) return;
    initialized = true;

    // Confirmation before closing tab (only when timer is running)
    window.addEventListener('beforeunload', (e) => {
        if (isRunning()) {
            e.preventDefault();
            e.returnValue = ''; // Standard for modern browsers
        }
    });

    // Record initial touch position
    window.addEventListener('touchstart', (e) => {
        touchStartPosX = e.touches[0].pageX;
        touchStartPosY = e.touches[0].pageY;
    }, { passive: true });

    // Prevent gestures on touchmove
    window.addEventListener('touchmove', (e) => {
        if (!e.touches || !e.touches[0]) return;

        const touchMovePosX = e.touches[0].pageX;
        const touchMovePosY = e.touches[0].pageY;
        const diffX         = touchStartPosX - touchMovePosX;
        const diffY         = touchStartPosY - touchMovePosY;
        const absDiffX      = Math.abs(diffX);
        const absDiffY      = Math.abs(diffY);

        // Vertical scroll within container? Let it pass (higher FPS)
        if (absDiffY > absDiffX && e.target.closest('.content-wrapper')) {
            return;
        }

        // 1. Prevent "Pull-to-refresh"
        if (window.scrollY === 0 && diffY < 0) {
            const scrollable = e.target.closest('.content-wrapper');
            if (!scrollable || scrollable.scrollTop === 0) {
                e.preventDefault();
                return;
            }
        }

        // 2. Prevent browser navigation (back/forward swipe)
        if (absDiffX > absDiffY && absDiffX > 10) {
            e.preventDefault();
            return;
        }

        // 3. Prevent swipe from screen edges
        const threshold = 50;
        if (touchStartPosX < threshold || touchStartPosX > window.innerWidth - threshold) {
            e.preventDefault();
        }
    }, { passive: false });

    // Prevent horizontal wheel scroll (trackpad back/forward gestures)
    window.addEventListener('wheel', (e) => {
        if (e.deltaX !== 0 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
        }
    }, { passive: false });
}
