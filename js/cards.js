/**
 * cards.js
 * ─────────────────────────────────────────────────────────────
 * Interaksi kartu akademis (.academic-box).
 * Memberikan feedback sentuhan/mouse yang responsif.
 * Highlight tetap aktif sampai kartu lain dipilih atau slide berganti.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Pasang event listener untuk interaksi kartu.
 */
export function initCardInteractions() {

    const handleInteractionStart = (e) => {
        const box = e.target.closest('.academic-box');
        if (!box) return;

        // Hapus highlight dari kartu yang sebelumnya aktif (lebih cepat dari querySelectorAll loop)
        const activeBox = document.querySelector('.academic-box.is-interacting');
        if (activeBox && activeBox !== box) {
            activeBox.classList.remove('is-interacting');
        }

        box.classList.add('is-interacting');
    };

    // Support Touch dan Mouse untuk aktivasi
    document.addEventListener('touchstart', handleInteractionStart, { passive: true });
    document.addEventListener('mousedown',  handleInteractionStart);

    // Bersihkan highlight saat ganti slide
    Reveal.on('slidechanged', () => {
        const activeBox = document.querySelector('.academic-box.is-interacting');
        if (activeBox) {
            activeBox.classList.remove('is-interacting');
        }
    });
}
