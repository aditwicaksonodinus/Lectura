/**
 * styles.js
 * ─────────────────────────────────────────────────────────────
 * Integrasi dinamis antara JS dan style.css.
 *
 * Tanggung jawab:
 *  1. Memuat stylesheet style.css dengan cache-busting version
 *     yang dapat dikontrol dari JS (tidak hardcoded di HTML).
 *  2. Menyinkronkan CSS Custom Properties dengan nilai config:
 *     - --presentation-width  ← dari ASPECT_RATIO
 *     - --base-font-size      ← dari BASE_FONT_SIZE (untuk referensi CSS)
 *
 * Kenapa perlu?
 *  style.css menggunakan var(--presentation-width) secara ekstensif
 *  (h2 title width, academic-box max-width, h3 card width, dll).
 *  Nilainya harus mencerminkan ASPECT_RATIO yang dimuat dari config.json,
 *  bukan dikodekan statis di CSS saja.
 * ─────────────────────────────────────────────────────────────
 */

/** Versi CSS — naikkan saat style.css berubah untuk cache-busting */
const CSS_VERSION = '2';

/**
 * Muat style.css secara dinamis dengan versi sebagai cache-buster.
 * Menggantikan tag <link> statis di index.html agar versi terkontrol dari JS.
 *
 * Catatan: Fungsi ini harus dipanggil SEBELUM konten dirender
 * agar tidak terjadi FOUC (Flash of Unstyled Content).
 */
export function loadStylesheet() {
    // Cek apakah sudah ada link style.css dari HTML (hindari duplikasi)
    const existing = document.querySelector('link[href^="style.css"]');
    if (existing) {
        // Update versi pada link yang sudah ada
        existing.href = `style.css?v=${CSS_VERSION}`;
        return;
    }

    // Buat link element baru jika belum ada
    const link  = document.createElement('link');
    link.rel    = 'stylesheet';
    link.href   = `style.css?v=${CSS_VERSION}`;
    document.head.appendChild(link);
}

/**
 * Sinkronkan CSS Custom Properties dengan nilai konfigurasi presentasi.
 * Dipanggil setelah loadConfig() selesai, sebelum Reveal.initialize().
 *
 * CSS yang terpengaruh (dari style.css):
 *  - var(--presentation-width) → dipakai di h2, h3, .academic-box, dll
 *  - var(--base-font-size)     → opsional, untuk referensi di CSS calc()
 *
 * @param {{ aspectRatio: string, baseFontSize: string }} options
 */
export function applyCSSConfig({ aspectRatio, baseFontSize }) {
    const root = document.documentElement;

    // ── --presentation-width ──────────────────────────────────
    // Sinkronkan dengan logika yang sama di CSS:
    //   html.ratio-4-3 { --presentation-width: 1200px; }
    //   default (16:9)  { --presentation-width: 1600px; }
    //
    // Dengan menyetnya dari JS, kita memastikan nilainya
    // mencerminkan config.json, bukan hanya class CSS yang
    // mungkin belum ter-apply saat JS pertama kali berjalan.
    const presentationWidth = aspectRatio === '4:3' ? '1200px' : '1600px';
    root.style.setProperty('--presentation-width', presentationWidth);

    // ── --base-font-size ──────────────────────────────────────
    // Simpan sebagai custom property agar bisa dipakai CSS calc() jika dibutuhkan.
    // Contoh: font-size: calc(var(--base-font-size) * 0.8);
    if (baseFontSize) {
        root.style.setProperty('--base-font-size', baseFontSize);
    }
}
