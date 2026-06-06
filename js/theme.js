/**
 * theme.js
 * ─────────────────────────────────────────────────────────────
 * Manajemen tema Dark/Light mode.
 * Membaca preferensi dari localStorage dan menangani toggle.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Inisialisasi tema berdasarkan preferensi tersimpan,
 * dan pasang event listener untuk tombol toggle.
 */
export function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html        = document.documentElement;

    // Terapkan tema tersimpan
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
