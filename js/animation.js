// ── Module-level state ────────────────────────────────────────
// Keeps references to staggered elements from the previous slide
// so cleanup doesn't require a global DOM scan on every slide change.
let _prevStaggered = [];

/**
 * Applies staggered animation to elements in the active slide.
 * Cleans up animations from the previous slide first.
 * @param {HTMLElement|null} slide - The current slide section element
 */
export function applyStaggeredAnimation(slide) {
    // Clear stagger state from the previous slide via tracked refs
    // (more efficient than a global querySelectorAll('.staggered') scan)
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
