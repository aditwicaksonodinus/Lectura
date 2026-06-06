/**
 * scribble.js
 * ─────────────────────────────────────────────────────────────
 * Mode coretan (Scribble) di atas slide menggunakan Canvas API.
 * Fitur:
 *   - Toggle via tombol atau shortcut 'S'
 *   - Hapus semua coretan via tombol atau 'Ctrl+K'
 *   - Auto-clear saat ganti slide
 *   - Support Pointer Events (unified Mouse & Touch)
 *   - Non-aktifkan Reveal touch gestures saat scribble aktif
 *   - Interaksi lintas modul: jika scribble aktif, laser dimatikan
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Inisialisasi mode scribble.
 * Mengekspos window.setScribbleEnabled dan window.clearAllScribbles.
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
    // Mencegah spike CPU saat window di-resize (firing ratusan kali/detik)
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

            // Jika scribble aktif, matikan laser
            if (window.setLaserEnabled) window.setLaserEnabled(false);

            // Nonaktifkan Reveal touch agar tidak slip slide saat menggambar
            if (typeof Reveal !== 'undefined') Reveal.configure({ touch: false });
        } else {
            html.classList.remove('scribble-active');
            toggleBtn.setAttribute('aria-pressed', 'false');
            clearBtn.style.display = 'none';

            // Aktifkan kembali Reveal touch jika laser juga tidak aktif
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

        // Gaya stroke akademik
        ctx.strokeStyle = '#ff3b30'; // Merah
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

    // Pointer events untuk unified Mouse/Touch support
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

    // Shortcut keyboard
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

    // Auto-clear saat ganti slide
    if (typeof Reveal !== 'undefined') {
        Reveal.on('slidechanged', clearAll);
    }

    // Ekspos untuk koordinasi lintas modul (laser.js)
    window.setScribbleEnabled  = setEnabled;
    window.clearAllScribbles   = clearAll;
}
