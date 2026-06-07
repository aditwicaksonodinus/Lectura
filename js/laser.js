/**
 * laser.js
 * ─────────────────────────────────────────────────────────────
 * Virtual laser pointer for presentations.
 * Features:
 *   - Toggle via button or 'L' shortcut
 *   - Adaptive offset for touchscreens (shift 50px up)
 *   - Disable Reveal touch gestures when laser is active
 *   - Cross-module interaction: if laser is active, scribble is disabled
 * ─────────────────────────────────────────────────────────────
 */

let initialized = false;

/**
 * Initializes the laser pointer.
 * Exposes window.setLaserEnabled for cross-module coordination.
 */
export function initLaserPointer() {
    if (initialized) return;
    initialized = true;

    const toggleBtn = document.getElementById('laser-toggle');
    const cursor    = document.getElementById('laser-cursor');
    let enabled     = false;

    // Move laser cursor (Mouse & Touch)
    const handlePointer = (e) => {
        let x = e.clientX;
        let y = e.clientY;

        // Touch offset: shift 50px up to avoid being covered by the finger
        if (e.pointerType === 'touch') {
            y -= 50;
        }

        cursor.style.left = `${x}px`;
        cursor.style.top  = `${y}px`;
    };

    // Prevent scroll while laser is active and touching the screen
    const handleTouchMove = (e) => {
        if (e.cancelable) e.preventDefault();
    };

    /**
     * Enables or disables the laser pointer.
     * @param {boolean} state
     */
    const setEnabled = (state) => {
        if (enabled === state) return;
        enabled = state;

        if (enabled) {
            cursor.style.display = 'block';
            if (toggleBtn) toggleBtn.setAttribute('aria-pressed', 'true');

            // Attach listeners dynamically only when active
            document.addEventListener('pointermove',  handlePointer);
            document.addEventListener('pointerdown', handlePointer);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });

            // If laser is active, disable scribble
            if (window.setScribbleEnabled) window.setScribbleEnabled(false);

            // Disable Reveal touch to prevent slide slips while pointing
            if (typeof Reveal !== 'undefined') Reveal.configure({ touch: false });
        } else {
            cursor.style.display = 'none';
            if (toggleBtn) toggleBtn.setAttribute('aria-pressed', 'false');

            // Detach listeners immediately when inactive
            document.removeEventListener('pointermove',  handlePointer);
            document.removeEventListener('pointerdown', handlePointer);
            document.removeEventListener('touchmove', handleTouchMove);

            // Re-enable Reveal touch if scribble is also inactive
            if (!window.scribbleEnabled && typeof Reveal !== 'undefined') {
                Reveal.configure({ touch: true });
            }
        }
    };

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => setEnabled(!enabled));
    }

    // Keyboard shortcut: 'L' to toggle
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'l') {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            e.preventDefault();
            setEnabled(!enabled);
        }
    });

    // Expose for cross-module coordination (scribble.js)
    window.setLaserEnabled = setEnabled;
}
