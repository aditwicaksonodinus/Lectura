/**
 * ui.js
 * ─────────────────────────────────────────────────────────────
 * Orchestrator update UI per pergantian slide.
 * Mengelola:
 *   - Visibility header/footer
 *   - Update nomor slide
 *   - Render Mermaid diagram dalam slide aktif
 *   - Delegasi ke modul tab dan animasi
 * ─────────────────────────────────────────────────────────────
 */

import { updateActiveTab } from './tabs.js';
import { processMermaidDiagram } from './mermaid.js';
import { stopTimer } from './timer.js';

// ── DOM Cache ─────────────────────────────────────────────────
// Di-populate sekali, kemudian di-reuse di setiap slide change
let headerCache       = null;
let footerCache       = null;
let slideNumberCache  = null;
let timerCache        = null;
let tabsContainerCache = null;

/**
 * Update seluruh UI berdasarkan slide yang sedang ditampilkan.
 * Dipanggil pada event: Reveal.ready, Reveal.slidechanged.
 * @param {HTMLElement|null} currentSlide
 * @returns {Promise<void>}
 */
export async function updateUI(currentSlide) {
    if (!currentSlide) return;

    // Populate cache hanya satu kali (query DOM mahal)
    headerCache        = headerCache        || document.querySelector('.header');
    footerCache        = footerCache        || document.querySelector('.footer');
    slideNumberCache   = slideNumberCache   || document.querySelector('.slide-number');
    timerCache         = timerCache         || document.getElementById('presentation-timer');
    tabsContainerCache = tabsContainerCache || document.getElementById('book-tabs');

    const state         = currentSlide.getAttribute('data-state');
    const hideContent   = state === 'hide-header-footer';

    // Hentikan timer otomatis di slide terakhir
    if (Reveal.isLastSlide()) {
        stopTimer();
    }

    // ── Visibility Header & Footer ────────────────────────────
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

        // Timer dan tabs selalu visible
        if (timerCache)        timerCache.style.visibility        = 'visible';
        if (tabsContainerCache) tabsContainerCache.style.visibility = 'visible';
    }

    // ── Update Tab Navigasi ───────────────────────────────────
    updateActiveTab();

    // ── Nomor Slide (dengan override manual via data-page) ────
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

    // ── Render Mermaid (batch, tunggu semua selesai) ──────────
    const diagrams = currentSlide.querySelectorAll('.mermaid');
    if (diagrams.length > 0) {
        await Promise.all(Array.from(diagrams).map(processMermaidDiagram));
        // Satu layout call setelah semua diagram dalam slide ini selesai
        setTimeout(() => { Reveal.layout(); }, 50);
    }
}
