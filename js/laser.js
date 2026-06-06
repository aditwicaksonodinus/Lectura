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

/**
 * Initializes the laser pointer.
 * Exposes window.setLaserEnabled for cross-module coordination.
 */
export function initLaserPointer() {
    const toggleBtn = document.getElementById('laser-toggle');
    const cursor    = document.getElementById('laser-cursor');
    let enabled     = false;

    /**
     * Enables or disables the laser pointer.
     * @param {boolean} state
     */
    const setEnabled = (state) => {
        enabled = state;

        if (enabled) {
            cursor.style.display = 'block';
            toggleBtn.setAttribute('aria-pressed', 'true');

            // If laser is active, disable scribble
            if (window.setScribbleEnabled) window.setScribbleEnabled(false);

            // Disable Reveal touch to prevent slide slips while pointing
            if (typeof Reveal !== 'undefined') Reveal.configure({ touch: false });
        } else {
            cursor.style.display = 'none';
            toggleBtn.setAttribute('aria-pressed', 'false');

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

    // Move laser cursor (Mouse & Touch)
    const handlePointer = (e) => {
        if (!enabled) return;

        let x = e.clientX;
        let y = e.clientY;

        // Touch offset: shift 50px up to avoid being covered by the finger
        if (e.pointerType === 'touch') {
            y -= 50;
        }

        cursor.style.left = `${x}px`;
        cursor.style.top  = `${y}px`;
    };

    document.addEventListener('pointermove',  handlePointer);
    document.addEventListener('pointerdown', handlePointer);

    // Prevent scroll while laser is active and touching the screen
    document.addEventListener('touchmove', (e) => {
        if (enabled && e.cancelable) e.preventDefault();
    }, { passive: false });

    // Expose for cross-module coordination (scribble.js)
    window.setLaserEnabled = setEnabled;
}
