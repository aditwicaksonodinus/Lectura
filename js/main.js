/**
 * main.js
 * ─────────────────────────────────────────────────────────────
 * Lectura entry point.
 * Imports and orchestrates all modules.
 * All init functions are called from here in the correct order.
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

document.addEventListener('DOMContentLoaded', () => {

    // ── Watermark Console ─────────────────────────────────────
    console.log(
        "%c✨ Lectura Presentation %cby AditDinus <3\n%cPlease do not remove the watermark to respect the creator's work. Thank you for your support! 😊\n\n",
        "color: #1b365d; font-size: 18px; font-weight: bold; font-family: serif;",
        "color: #f59e0b; font-size: 18px; font-weight: bold; font-family: serif; font-style: italic;",
        "color: #64748b; font-size: 13px; font-family: sans-serif;"
    );

    // ── Module Initialization ─────────────────────────────────
    // Order is important: theme & gestures before presentation loads,
    // interactive tools after presentation is ready.
    initTheme();
    initGestures();
    initPresentation();      // async — Reveal.js and slides are loaded here
    initImagePreview();
    initAccessibilityMenu();
    initLaserPointer();
    initScribbleMode();
    initNavigation();
    initCardInteractions();
});

