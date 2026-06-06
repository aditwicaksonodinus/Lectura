/**
 * tabs.js
 * ─────────────────────────────────────────────────────────────
 * Navigation tab management (Book Tabs).
 * Handles Active and Completed states for integrated progress tracking.
 * ─────────────────────────────────────────────────────────────
 */

// ── DOM Cache ─────────────────────────────────────────────────
let tabsCache = null;

/**
 * Invalidates the tab cache (called after slides are rebuilt).
 */
export function resetTabsCache() {
    tabsCache = null;
}

/**
 * Updates tab display based on the currently active slide.
 * Marks tabs before the active slide as 'completed'.
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
            // Tab before active tab → completed
            if (!activeFound) {
                tab.classList.add('completed');
            } else {
                tab.classList.remove('completed');
            }
        }
    });
}
