/**
 * laser.js
 * ─────────────────────────────────────────────────────────────
 * Laser pointer virtual untuk presentasi.
 * Fitur:
 *   - Toggle via tombol atau shortcut 'L'
 *   - Adaptive offset untuk layar sentuh (geser 50px ke atas)
 *   - Non-aktifkan Reveal touch gestures saat laser aktif
 *   - Interaksi lintas modul: jika laser aktif, scribble dimatikan
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Inisialisasi laser pointer.
 * Mengekspos window.setLaserEnabled untuk koordinasi lintas modul.
 */
export function initLaserPointer() {
    const toggleBtn = document.getElementById('laser-toggle');
    const cursor    = document.getElementById('laser-cursor');
    let enabled     = false;

    /**
     * Aktifkan atau matikan laser pointer.
     * @param {boolean} state
     */
    const setEnabled = (state) => {
        enabled = state;

        if (enabled) {
            cursor.style.display = 'block';
            toggleBtn.setAttribute('aria-pressed', 'true');

            // Jika laser aktif, matikan scribble
            if (window.setScribbleEnabled) window.setScribbleEnabled(false);

            // Nonaktifkan Reveal touch agar tidak slip slide saat pointing
            if (typeof Reveal !== 'undefined') Reveal.configure({ touch: false });
        } else {
            cursor.style.display = 'none';
            toggleBtn.setAttribute('aria-pressed', 'false');

            // Aktifkan kembali Reveal touch jika scribble juga tidak aktif
            if (!window.scribbleEnabled && typeof Reveal !== 'undefined') {
                Reveal.configure({ touch: true });
            }
        }
    };

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => setEnabled(!enabled));
    }

    // Shortcut keyboard: 'L' untuk toggle
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'l') {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            e.preventDefault();
            setEnabled(!enabled);
        }
    });

    // Gerakkan cursor laser (Mouse & Touch)
    const handlePointer = (e) => {
        if (!enabled) return;

        let x = e.clientX;
        let y = e.clientY;

        // Offset sentuh: geser 50px ke atas agar tidak tertutup jari
        if (e.pointerType === 'touch') {
            y -= 50;
        }

        cursor.style.left = `${x}px`;
        cursor.style.top  = `${y}px`;
    };

    document.addEventListener('pointermove',  handlePointer);
    document.addEventListener('pointerdown', handlePointer);

    // Cegah scroll saat laser aktif dan menyentuh layar
    document.addEventListener('touchmove', (e) => {
        if (enabled && e.cancelable) e.preventDefault();
    }, { passive: false });

    // Ekspos untuk koordinasi lintas modul (scribble.js)
    window.setLaserEnabled = setEnabled;
}
