/**
 * ui.js
 * ─────────────────────────────────────────────────────────────
 * UI update orchestrator per slide change.
 * Manages:
 *   - Header/footer visibility
 *   - Slide number update
 *   - Mermaid diagram rendering in active slide
 *   - Delegation to tabs and animation modules
 * ─────────────────────────────────────────────────────────────
 */

import { updateActiveTab } from './tabs.js';
import { processMermaidDiagram } from './mermaid.js';
import { stopTimer } from './timer.js';

// ── DOM Cache ─────────────────────────────────────────────────
// Populated once, then reused on each slide change
let headerCache       = null;
let footerCache       = null;
let slideNumberCache  = null;
let timerCache        = null;
let tabsContainerCache = null;

/**
 * Updates the entire UI based on the slide currently being displayed.
 * Called on events: Reveal.ready, Reveal.slidechanged.
 * @param {HTMLElement|null} currentSlide
 * @returns {Promise<void>}
 */
export async function updateUI(currentSlide) {
    if (!currentSlide) return;

    // Populate cache only once (DOM queries are expensive)
    headerCache        = headerCache        || document.querySelector('.header');
    footerCache        = footerCache        || document.querySelector('.footer');
    slideNumberCache   = slideNumberCache   || document.querySelector('.slide-number');
    timerCache         = timerCache         || document.getElementById('presentation-timer');
    tabsContainerCache = tabsContainerCache || document.getElementById('book-tabs');

    const state         = currentSlide.getAttribute('data-state');
    const hideContent   = state === 'hide-header-footer';

    // Stop timer automatically on the last slide
    if (Reveal.isLastSlide()) {
        stopTimer();
    }

    // ── Header & Footer Visibility ────────────────────────────
    if (headerCache && footerCache) {
        headerCache.style.display = 'flex';
        footerCache.style.display = 'grid';

        if (hideContent) {
            headerCache.classList.add('plain-ui');
            footerCache.classList.add('hidden-footer');
        } else {
            headerCache.classList.remove('plain-ui');
            footerCache.classList.remove('hidden-footer');
        }

        // Timer and tabs are always visible
        if (timerCache)        timerCache.style.visibility        = 'visible';
        if (tabsContainerCache) tabsContainerCache.style.visibility = 'visible';
    }

    // ── Update Navigation Tab ─────────────────────────────────
    updateActiveTab();

    // ── Slide Number (with manual override via data-page) ─────
    if (slideNumberCache && !hideContent) {
        const manualPage = currentSlide.getAttribute('data-page');
        if (manualPage) {
            slideNumberCache.textContent = manualPage;
        } else {
            const indices = Reveal.getIndices();
            const total   = Reveal.getTotalSlides();
            slideNumberCache.textContent = `${indices.h + 1} / ${total}`;
        }
    }

    // ── Render Mermaid (batch, wait for all to finish) ────────
    const diagrams = currentSlide.querySelectorAll('.mermaid');
    if (diagrams.length > 0) {
        await Promise.all(Array.from(diagrams).map(processMermaidDiagram));
        // One layout call after all diagrams in this slide are finished
        setTimeout(() => { Reveal.layout(); }, 50);
    }
}
