/**
 * accessibility.js
 * ─────────────────────────────────────────────────────────────
 * Manajemen dropdown menu aksesibilitas.
 * Menangani visibility, interaksi tombol, close-on-outside-click,
 * dan keyboard shortcut (Escape + 'A').
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Inisialisasi menu aksesibilitas beserta semua event listener-nya.
 */
export function initAccessibilityMenu() {
    const container = document.querySelector('.accessibility-container');
    const toggleBtn = document.getElementById('accessibility-toggle');
    const menu      = document.getElementById('accessibility-menu');

    if (!toggleBtn || !menu) return;

    /**
     * Toggle menu buka/tutup.
     * @param {boolean|undefined} forceState - Jika didefinisikan, paksa ke state ini
     */
    const toggleMenu = (forceState) => {
        const isExpanded = forceState !== undefined
            ? forceState
            : toggleBtn.getAttribute('aria-expanded') !== 'true';

        toggleBtn.setAttribute('aria-expanded', isExpanded);
        menu.classList.toggle('active', isExpanded);
    };

    // Tombol toggle utama
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Tutup menu saat tombol aksi di dalamnya diklik
    // (kecuali scribble toggle/clear yang butuh tetap terbuka)
    const actionButtons = menu.querySelectorAll('button');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id === 'scribble-toggle' || btn.id === 'scribble-clear') return;
            // Delay singkat agar visual feedback tombol terlihat sebelum menu tertutup
            setTimeout(() => toggleMenu(false), 150);
        });
    });

    // Tutup menu saat klik di luar area container
    document.addEventListener('click', (e) => {
        if (
            menu.classList.contains('active') &&
            !container.contains(e.target) &&
            e.target.id !== 'scribble-canvas'
        ) {
            toggleMenu(false);
        }
    });

    // Tutup menu dengan Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            toggleMenu(false);
        }
    });

    // Shortcut keyboard: 'A' untuk toggle menu
    document.addEventListener('keydown', (e) => {
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
