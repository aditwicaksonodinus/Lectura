// ── Module-level state ────────────────────────────────────────
// Keeps references to staggered elements from the previous slide
// so cleanup doesn't require a global DOM scan on every slide change.
let _prevStaggered = [];
let _currentActiveSlide = null;

/**
 * Prepares elements in the incoming slide by hiding them to avoid overlap during transition.
 * @param {HTMLElement|null} slide - The incoming slide section element
 */
export function prepareStaggeredAnimation(slide) {
    if (!slide) return;
    if (slide === _currentActiveSlide) return;

    const elements = slide.querySelectorAll('.academic-box > *');
    elements.forEach((el, i) => {
        el.style.setProperty('--stagger-index', i);
        el.classList.add('staggered-prepare');
    });
}

/**
 * Cleans up previous slide animations and triggers the staggered animation for current slide.
 * @param {HTMLElement|null} slide - The current slide section element
 */
export function playStaggeredAnimation(slide) {
    if (!slide) return;

    // Guard against stale slide animations (timeouts from rapidly skipped slides)
    if (typeof Reveal !== 'undefined' && slide !== Reveal.getCurrentSlide()) {
        return;
    }

    // Guard against double execution on the same slide
    if (slide === _currentActiveSlide) return;
    _currentActiveSlide = slide;

    // Clean up elements from previous slide (now fully hidden)
    for (const el of _prevStaggered) {
        el.classList.remove('staggered', 'staggered-prepare');
        el.style.removeProperty('--stagger-index');
    }
    _prevStaggered = [];

    const elements = slide.querySelectorAll('.academic-box > *');
    elements.forEach((el, i) => {
        el.style.setProperty('--stagger-index', i);
        el.classList.remove('staggered-prepare');
        el.classList.add('staggered');
    });
    _prevStaggered = Array.from(elements);
}
