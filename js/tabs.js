/**
 * tabs.js
 * ─────────────────────────────────────────────────────────────
 * Manajemen tab navigasi (Book Tabs).
 * Menangani state Active dan Completed untuk progress terintegrasi.
 * ─────────────────────────────────────────────────────────────
 */

// ── Cache DOM ─────────────────────────────────────────────────
let tabsCache = null;

/**
 * Invalidate cache tab (dipanggil setelah slide di-rebuild).
 */
export function resetTabsCache() {
    tabsCache = null;
}

/**
 * Update tampilan tab berdasarkan slide yang sedang aktif.
 * Menandai tab sebelum slide aktif sebagai 'completed'.
 */
export function updateActiveTab() {
    const currentSlideElement = Reveal.getCurrentSlide();
    if (!currentSlideElement) return;

    const currentSection = currentSlideElement.getAttribute('data-section');

    if (!tabsCache) {
        tabsCache = document.querySelectorAll('.tab-item');
    }

    let activeFound = false;

    tabsCache.forEach(tab => {
        const tabSection = tab.getAttribute('data-section-name');

        if (tabSection === currentSection) {
            tab.classList.add('active');
            tab.classList.remove('completed');
            activeFound = true;
        } else {
            tab.classList.remove('active');
            // Tab sebelum tab aktif → completed
            if (!activeFound) {
                tab.classList.add('completed');
            } else {
                tab.classList.remove('completed');
            }
        }
    });
}
