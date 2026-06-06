/**
 * animation.js
 * ─────────────────────────────────────────────────────────────
 * Animasi staggered untuk elemen di dalam slide.
 * Setiap elemen anak dari .academic-box mendapat CSS custom
 * property --stagger-index untuk delay animasi berurutan.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Terapkan animasi staggered pada elemen dalam slide yang aktif.
 * Bersihkan animasi dari slide sebelumnya terlebih dahulu.
 * @param {HTMLElement|null} slide - Elemen section slide saat ini
 */
export function applyStaggeredAnimation(slide) {
    // Bersihkan state stagger dari slide sebelumnya
    document.querySelectorAll('.staggered').forEach(el => {
        el.classList.remove('staggered');
        el.style.removeProperty('--stagger-index');
    });

    if (!slide) return;

    const elements = slide.querySelectorAll('.academic-box > *');
    elements.forEach((el, i) => {
        el.style.setProperty('--stagger-index', i);
        el.classList.add('staggered');
    });
}
