/**
 * accessibility.js
 * ─────────────────────────────────────────────────────────────
 * Accessibility menu management.
 * Handles visibility, button interactions, close-on-outside-click,
 * and keyboard shortcuts (Escape + 'A').
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Initializes the accessibility menu and all its event listeners.
 */
export function initAccessibilityMenu() {
    const container = document.querySelector('.accessibility-container');
    const toggleBtn = document.getElementById('accessibility-toggle');
    const menu      = document.getElementById('accessibility-menu');

    if (!toggleBtn || !menu) return;

    /**
     * Toggles the menu open/closed.
     * @param {boolean|undefined} forceState - If defined, forces to this state
     */
    const toggleMenu = (forceState) => {
        const isExpanded = forceState !== undefined
            ? forceState
            : toggleBtn.getAttribute('aria-expanded') !== 'true';

        toggleBtn.setAttribute('aria-expanded', isExpanded);
        menu.classList.toggle('active', isExpanded);
    };

    // Main toggle button
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when internal action buttons are clicked
    // (except scribble toggle/clear, which should remain open)
    const actionButtons = menu.querySelectorAll('button');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id === 'scribble-toggle' || btn.id === 'scribble-clear') return;
            // Short delay to allow visual feedback before menu closes
            setTimeout(() => toggleMenu(false), 150);
        });
    });

    // Close menu on click outside the container
    document.addEventListener('click', (e) => {
        if (
            menu.classList.contains('active') &&
            !container.contains(e.target) &&
            e.target.id !== 'scribble-canvas'
        ) {
            toggleMenu(false);
        }
    });

    // Keyboard shortcuts: Escape (close) and 'A' (toggle)
    // Combined in a single listener for efficiency
    document.addEventListener('keydown', (e) => {
        // Escape → close menu if open
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            toggleMenu(false);
            return;
        }

        // 'A' → toggle menu (ignore if in input fields or with modifier keys)
        if (
            e.key.toLowerCase() === 'a' &&
            !e.ctrlKey && !e.altKey && !e.metaKey
        ) {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            e.preventDefault();
            toggleMenu();
        }
    });
}
