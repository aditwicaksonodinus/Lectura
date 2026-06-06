// ── Module-level state ────────────────────────────────────────
// Menyimpan referensi elemen staggered dari slide sebelumnya
// agar cleanup tidak perlu DOM scan global setiap slide change.
let _prevStaggered = [];

/**
 * Terapkan animasi staggered pada elemen dalam slide yang aktif.
 * Bersihkan animasi dari slide sebelumnya terlebih dahulu.
 * @param {HTMLElement|null} slide - Elemen section slide saat ini
 */
export function applyStaggeredAnimation(slide) {
    // Bersihkan state stagger dari slide sebelumnya via tracked refs
    // (lebih efisien dari querySelectorAll('.staggered') global scan)
    for (const el of _prevStaggered) {
        el.classList.remove('staggered');
        el.style.removeProperty('--stagger-index');
    }
    _prevStaggered = [];

    if (!slide) return;

    const elements = slide.querySelectorAll('.academic-box > *');
    elements.forEach((el, i) => {
        el.style.setProperty('--stagger-index', i);
        el.classList.add('staggered');
    });
    _prevStaggered = Array.from(elements);
}
