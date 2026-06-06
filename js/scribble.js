/**
 * scribble.js
 * ─────────────────────────────────────────────────────────────
 * Scribble mode over slides using Canvas API.
 * Features:
 *   - Toggle via button or 'S' shortcut
 *   - Clear all scribbles via button or 'Ctrl+K'
 *   - Auto-clear on slide change
 *   - Supports Pointer Events (unified Mouse & Touch)
 *   - Disable Reveal touch gestures when scribble is active
 *   - Cross-module interaction: if scribble is active, laser is disabled
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Initializes scribble mode.
 * Exposes window.setScribbleEnabled and window.clearAllScribbles.
 */
export function initScribbleMode() {
    const canvas    = document.getElementById('scribble-canvas');
    const toggleBtn = document.getElementById('scribble-toggle');
    const clearBtn  = document.getElementById('scribble-clear');

    if (!canvas || !toggleBtn || !clearBtn) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    window.scribbleEnabled = false;

    // ── Debounce Helper ───────────────────────────────────────
    // Prevent CPU spikes during window resize (firing hundreds of times/sec)
    const debounce = (fn, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    // ── Resize Canvas ─────────────────────────────────────────
    const resizeCanvas = () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', debounce(resizeCanvas, 100));
    resizeCanvas();


    // ── Toggle Enable/Disable ─────────────────────────────────
    /**
     * @param {boolean} state
     */
    const setEnabled = (state) => {
        window.scribbleEnabled = state;
        const html = document.documentElement;

        if (window.scribbleEnabled) {
            html.classList.add('scribble-active');
            toggleBtn.setAttribute('aria-pressed', 'true');
            clearBtn.style.display = 'flex';

            // If scribble is active, disable laser
            if (window.setLaserEnabled) window.setLaserEnabled(false);

            // Disable Reveal touch to prevent slide slips while drawing
            if (typeof Reveal !== 'undefined') Reveal.configure({ touch: false });
        } else {
            html.classList.remove('scribble-active');
            toggleBtn.setAttribute('aria-pressed', 'false');
            clearBtn.style.display = 'none';

            // Re-enable Reveal touch if laser is also inactive
            const laserCursor = document.getElementById('laser-cursor');
            const laserActive = laserCursor && laserCursor.style.display === 'block';
            if (!laserActive && typeof Reveal !== 'undefined') {
                Reveal.configure({ touch: true });
            }
        }
    };

    // ── Clear Canvas ──────────────────────────────────────────
    const clearAll = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // ── Drawing Logic ─────────────────────────────────────────
    const startDrawing = (e) => {
        if (!window.scribbleEnabled) return;
        isDrawing = true;

        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);

        // Academic stroke style
        ctx.strokeStyle = '#ff3b30'; // Red
        ctx.lineWidth   = 4;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
    };

    const draw = (e) => {
        if (!isDrawing || !window.scribbleEnabled) return;
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        isDrawing = false;
        ctx.closePath();
    };

    // Pointer events for unified Mouse/Touch support
    canvas.addEventListener('pointerdown',  startDrawing);
    canvas.addEventListener('pointermove',  draw);
    canvas.addEventListener('pointerup',    stopDrawing);
    canvas.addEventListener('pointerleave', stopDrawing);

    // ── Event Listeners ───────────────────────────────────────
    toggleBtn.addEventListener('click', () => setEnabled(!window.scribbleEnabled));

    clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearAll();
    });

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        // 'S' → toggle scribble
        if (key === 's' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            setEnabled(!window.scribbleEnabled);
        }

        // 'Ctrl+K' → clear all
        if (key === 'k' && (e.ctrlKey || e.metaKey)) {
            if (window.scribbleEnabled) {
                e.preventDefault();
                clearAll();
            }
        }
    });

    // Auto-clear on slide change
    if (typeof Reveal !== 'undefined') {
        Reveal.on('slidechanged', clearAll);
    }

    // Expose for cross-module coordination (laser.js)
    window.setScribbleEnabled  = setEnabled;
    window.clearAllScribbles   = clearAll;
}
