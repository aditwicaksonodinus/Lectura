/**
 * cards.js
 * ─────────────────────────────────────────────────────────────
 * Academic card interactions (.academic-box).
 * Provides responsive touch/mouse feedback.
 * Highlight remains active until another card is selected or the slide changes.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Attaches event listeners for card interactions.
 */
export function initCardInteractions() {

    const handleInteractionStart = (e) => {
        const box = e.target.closest('.academic-box');
        if (!box) return;

        // Remove highlight from the previously active card (faster than querySelectorAll loop)
        const activeBox = document.querySelector('.academic-box.is-interacting');
        if (activeBox && activeBox !== box) {
            activeBox.classList.remove('is-interacting');
        }

        box.classList.add('is-interacting');
    };

    // Support Touch and Mouse for activation
    document.addEventListener('touchstart', handleInteractionStart, { passive: true });
    document.addEventListener('mousedown',  handleInteractionStart);

    // Clear highlight on slide change
    Reveal.on('slidechanged', () => {
        const activeBox = document.querySelector('.academic-box.is-interacting');
        if (activeBox) {
            activeBox.classList.remove('is-interacting');
        }
    });
}
