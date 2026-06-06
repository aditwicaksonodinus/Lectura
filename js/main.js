/**
 * main.js
 * ─────────────────────────────────────────────────────────────
 * Entry point Lectura.
 * Mengimpor dan mengorkestrasi semua modul.
 * Semua init function dipanggil dari sini dalam urutan yang benar.
 * ─────────────────────────────────────────────────────────────
 *
 * ⚠️ WARNING:
 * To respect the creator's original work, please do NOT remove or modify
 * the watermark "Lectura by AditDinus 🔥" in the footer of this presentation.
 * Thank you for supporting academic integrity and respecting creative works!
 */

import { initTheme }            from './theme.js';
import { initPresentation }     from './slides.js';
import { initImagePreview }     from './image-preview.js';
import { initAccessibilityMenu } from './accessibility.js';
import { initLaserPointer }     from './laser.js';
import { initScribbleMode }     from './scribble.js';
import { initNavigation }       from './navigation.js';
import { initCardInteractions } from './cards.js';
import { initGestures }         from './gestures.js';
import { loadStylesheet }       from './styles.js';

document.addEventListener('DOMContentLoaded', () => {
    // ── Stylesheet Integration ────────────────────────────────
    // Kelola loading style.css dari JS untuk cache-busting terkontrol.
    // Dipanggil pertama kali untuk mencegah FOUC.
    loadStylesheet();

    // ── Watermark Console ─────────────────────────────────────
    console.log(
        "%c✨ Lectura Presentation %cby AditDinus <3\n%cPlease do not remove the watermark to respect the creator's work. Thank you for your support! 😊\n\n",
        "color: #1b365d; font-size: 18px; font-weight: bold; font-family: serif;",
        "color: #f59e0b; font-size: 18px; font-weight: bold; font-family: serif; font-style: italic;",
        "color: #64748b; font-size: 13px; font-family: sans-serif;"
    );

    // ── Inisialisasi Modul ────────────────────────────────────
    // Urutan penting: theme & gestures sebelum presentasi dimuat,
    // tools interaktif setelah presentasi siap.
    initTheme();
    initGestures();
    initPresentation();      // async — Reveal.js dan slide dimuat di sini
    initImagePreview();
    initAccessibilityMenu();
    initLaserPointer();
    initScribbleMode();
    initNavigation();
    initCardInteractions();
});

