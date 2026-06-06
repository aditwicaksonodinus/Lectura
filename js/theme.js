/**
 * theme.js
 * ─────────────────────────────────────────────────────────────
 * Dark/Light mode theme management.
 * Reads preferences from localStorage and handles toggling.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Initializes the theme based on saved preferences,
 * and attaches event listener for the toggle button.
 */
export function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html        = document.documentElement;

    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        html.classList.add('dark-mode');
    }

    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark-mode');
        const isDark = html.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}
