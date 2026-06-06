/**
 * config.js
 * ─────────────────────────────────────────────────────────────
 * Modul konfigurasi presentasi.
 * Menyimpan semua variabel global config dan menyediakan
 * fungsi loadConfig() untuk mengisi ulang nilainya dari config.json.
 * ─────────────────────────────────────────────────────────────
 */

// ── Default values (fallback jika config.json gagal dimuat) ──
export let PRESENTATION_MINUTES = 15;
export let BASE_FONT_SIZE       = '18pt';
export let PRESENTATION_TITLE   = 'Sidang Tesis: Arsitektur Hibrida Lectura';
export let AUTHOR_NAME          = 'Praditya Wicaksono';
export let STUDENT_ID           = 'P31.2024.02610';
export let INSTITUTION_INFO     = 'Universitas Dian Nuswantoro © 2026';
export let STUDY_PROGRAM        = 'Teknik Informatika';
export let LANG                 = 'id';
export let REVEAL_THEME         = 'black';
export let TIMER_START_TEXT     = 'START';
export let TIMER_RESET_TEXT     = 'RESET';
export let THEME_TOGGLE_TITLE   = 'Toggle Dark/Light Mode';
export let ASPECT_RATIO         = '16:9';
export let CONTENT_FILE         = 'content-id.md';

/**
 * Memuat konfigurasi dari config.json dan mengupdate variabel di atas.
 * Jika gagal, variabel default di atas tetap dipakai.
 * @returns {Promise<void>}
 */
export async function loadConfig() {
    try {
        const configResponse = await fetch('config.json');
        if (!configResponse.ok) return;

        const config = await configResponse.json();

        PRESENTATION_MINUTES = config.presentationMinutes || PRESENTATION_MINUTES;
        BASE_FONT_SIZE       = config.baseFontSize        || BASE_FONT_SIZE;
        PRESENTATION_TITLE   = config.presentationTitle   || PRESENTATION_TITLE;
        AUTHOR_NAME          = config.authorName          || AUTHOR_NAME;
        STUDENT_ID           = config.studentId           || STUDENT_ID;
        INSTITUTION_INFO     = config.institutionInfo     || INSTITUTION_INFO;
        STUDY_PROGRAM        = config.studyProgram        || STUDY_PROGRAM;
        LANG                 = config.lang                || LANG;
        REVEAL_THEME         = config.revealTheme         || REVEAL_THEME;
        TIMER_START_TEXT     = config.timerStartText      || TIMER_START_TEXT;
        TIMER_RESET_TEXT     = config.timerResetText      || TIMER_RESET_TEXT;
        THEME_TOGGLE_TITLE   = config.themeToggleTitle    || THEME_TOGGLE_TITLE;
        ASPECT_RATIO         = config.aspectRatio         || ASPECT_RATIO;
        CONTENT_FILE         = config.contentFile || (LANG === 'en' ? 'content-en.md' : 'content-id.md');
    } catch (configErr) {
        console.warn('Error loading config.json, using default values:', configErr);
    }
}
