/**
 * slides.js
 * ─────────────────────────────────────────────────────────────
 * Core slide engine: metadata parsing, slide element construction,
 * and full presentation initialization (including Reveal.js).
 * ─────────────────────────────────────────────────────────────
 */

import {
    loadConfig,
    PRESENTATION_MINUTES,
    BASE_FONT_SIZE,
    PRESENTATION_TITLE,
    AUTHOR_NAME,
    STUDENT_ID,
    INSTITUTION_INFO,
    LANG,
    REVEAL_THEME,
    TIMER_START_TEXT,
    TIMER_RESET_TEXT,
    THEME_TOGGLE_TITLE,
    ASPECT_RATIO,
    CONTENT_FILE,
    STYLE_PRESET,
} from './config.js';


import { LayoutTemplates }      from './layouts.js';
import { updateUI }             from './ui.js';
import { prepareStaggeredAnimation, playStaggeredAnimation } from './animation.js';
import { startTimer, resetTimer, setTimerDuration } from './timer.js';
import { resetTabsCache }       from './tabs.js';
import { applyCSSConfig }       from './styles.js';

// Module-level initialization state
let _listenersAttached = false;

// ─────────────────────────────────────────────────────────────
// extractMetadata
// ─────────────────────────────────────────────────────────────

/**
 * Extracts metadata from HTML comments in slide markdown.
 * Format: <!-- key: value -->
 * @param {string} markdown
 * @returns {{ metadata: Object, cleanContent: string }}
 */
export function extractMetadata(markdown) {
    const metadata     = {};
    const commentRegex = /<!--\s*([\w-]+)\s*:\s*(.*?)\s*-->/g;
    let match;

    while ((match = commentRegex.exec(markdown)) !== null) {
        metadata[match[1]] = match[2].trim();
    }

    const cleanContent = markdown
        .replace(/<!--\s*[\w-]+\s*:\s*.*?\s*-->/g, '')
        .trim();

    return { metadata, cleanContent };
}

// ─────────────────────────────────────────────────────────────
// createSlideElement
// ─────────────────────────────────────────────────────────────

/**
 * Creates a <section> element for a slide based on extracted data.
 * @param {{ metadata: Object, cleanContent: string }} slideData
 * @returns {HTMLElement} section element ready to be appended to .slides
 */
export function createSlideElement(slideData) {
    const { metadata, cleanContent } = slideData;
    const section = document.createElement('section');

    // Set Reveal.js attributes
    if (metadata.title)   section.setAttribute('data-title',   metadata.title);
    if (metadata.state)   section.setAttribute('data-state',   metadata.state);
    if (metadata.section) section.setAttribute('data-section', metadata.section);
    if (metadata.page)    section.setAttribute('data-page',    metadata.page);

    const layout    = metadata.layout || 'default';
    const titleHtml = metadata.title ? `<h2>${metadata.title}</h2>` : '';

    // Split content for multi-part templates
    const splitParts = cleanContent
        .split(/<!--\s*split\s*-->/)
        .map(p => p.trim());

    // Add class for CSS targeting
    section.classList.add(`layout-${layout}`);

    // Render via registry, fallback to default
    const templateFn = LayoutTemplates[layout] || LayoutTemplates['default'];
    section.innerHTML = templateFn(metadata, cleanContent, titleHtml, splitParts);

    return section;
}

// ─────────────────────────────────────────────────────────────
// initPresentation — Main Orchestrator
// ─────────────────────────────────────────────────────────────

/**
 * Loads config, parses markdown, builds slides & tabs, initializes Reveal.js.
 * @returns {Promise<void>}
 */
export async function initPresentation() {
    try {
        // 1. Load configuration from config.json
        await loadConfig();

        // 2. Apply document attributes from config
        document.documentElement.setAttribute('lang', LANG);

        // Sync CSS Custom Properties (--presentation-width, --base-font-size)
        // with loaded config values. This ensures CSS layout reflects
        // ASPECT_RATIO from config.json in real-time.
        applyCSSConfig({
            aspectRatio: ASPECT_RATIO,
            baseFontSize: BASE_FONT_SIZE,
        });

        // Aspect ratio class (for additional CSS selectors if needed)
        document.documentElement.classList.remove('ratio-16-9', 'ratio-4-3');
        const ratioClass = `ratio-${ASPECT_RATIO.replace(':', '-')}`;
        document.documentElement.classList.add(ratioClass);

        // Apply Style Preset class
        document.documentElement.classList.remove('style-glass', 'style-formal', 'style-retro', 'style-cyber', 'style-minimal', 'style-ieee');
        const stylePresetClass = `style-${STYLE_PRESET}`;
        document.documentElement.classList.add(stylePresetClass);

        // Reveal theme
        const themeLink = document.getElementById('theme');
        if (themeLink) {
            themeLink.href = `styles/vendor/theme-${REVEAL_THEME}.min.css`;
        }

        // Theme toggle title
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('title', THEME_TOGGLE_TITLE);
        }

        // Title and footer info
        document.title = PRESENTATION_TITLE;
        const centerInfo = document.querySelector('.footer .center-info');
        if (centerInfo) centerInfo.textContent = INSTITUTION_INFO;

        // Font size and Mermaid
        document.documentElement.style.fontSize = BASE_FONT_SIZE;


        // Sync timer state with newly loaded config
        setTimerDuration(PRESENTATION_MINUTES);

        // 3. Fetch and process markdown content file
        const response = await fetch(CONTENT_FILE);
        if (!response.ok) throw new Error(`Could not load ${CONTENT_FILE}`);

        let text = await response.text();

        // Replace dynamic placeholders
        text = text.replace(/\{\{authorName\}\}/g,     AUTHOR_NAME);
        text = text.replace(/\{\{studentId\}\}/g,      STUDENT_ID);
        text = text.replace(/\{\{institutionInfo\}\}/g, INSTITUTION_INFO);

        // 4. Build slide elements and tabs
        const slideSections   = text.split(/\n---slide-break---\n/);
        const slidesContainer = document.querySelector('.slides');
        const tabsContainer   = document.getElementById('book-tabs');

        // Use DocumentFragment for efficient DOM manipulation
        const slidesFragment = document.createDocumentFragment();
        const tabsFragment   = document.createDocumentFragment();

        slidesContainer.innerHTML = '';
        if (tabsContainer) tabsContainer.innerHTML = '';

        // Set for O(1) deduplication — replaces O(n) Array.includes()
        const uniqueSections = new Set();
        const sectionMap     = {}; // sectionName → first slide index

        slideSections.forEach((sectionText, index) => {
            if (!sectionText.trim()) return;

            const slideData    = extractMetadata(sectionText);
            const slideElement = createSlideElement(slideData);
            slidesFragment.appendChild(slideElement);

            const sectionName = slideData.metadata.section;
            if (sectionName && !uniqueSections.has(sectionName)) {
                uniqueSections.add(sectionName);
                sectionMap[sectionName] = index;
            }
        });

        // Append all slides at once
        slidesContainer.appendChild(slidesFragment);

        // 5. Create navigation tabs dynamically (event delegation — 1 listener)
        if (tabsContainer) {
            for (const name of uniqueSections) {
                const button = document.createElement('button');
                button.className = 'tab-item';
                button.textContent = name.toUpperCase();
                button.setAttribute('data-section-name', name);
                tabsFragment.appendChild(button);
            }
            tabsContainer.appendChild(tabsFragment);

            // Event delegation: single listener for all tab-items
            tabsContainer.addEventListener('click', (e) => {
                const tab = e.target.closest('.tab-item');
                if (!tab) return;
                e.preventDefault();
                const sectionName = tab.getAttribute('data-section-name');
                if (sectionName in sectionMap) {
                    Reveal.slide(sectionMap[sectionName]);
                }
            });

            // Reset tabs cache after rebuild
            resetTabsCache();
        }

        // 6. Set initial timer view
        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            timerDisplay.textContent = `${PRESENTATION_MINUTES.toString().padStart(2, '0')}:00`;
        }

        // 7. Setup timer buttons & event listeners (only once)
        if (!_listenersAttached) {
            const startBtn = document.getElementById('start-timer');
            if (startBtn) {
                startBtn.addEventListener('click', startTimer);
            }
            const resetBtn = document.getElementById('reset-timer');
            if (resetBtn) {
                resetBtn.addEventListener('click', resetTimer);
            }

            // Register Reveal event listeners before calling initialize
            if (typeof Reveal !== 'undefined') {
                Reveal.on('slidechanged', event => {
                    updateUI(event.currentSlide);
                    prepareStaggeredAnimation(event.currentSlide);

                    // Safety fallback: play animation after 900ms in case slidetransitionend doesn't fire
                    // Must exceed the CSS transition duration (0.8s default, 1.2s slow) to avoid
                    // triggering stagger mid-transition.
                    if (event.currentSlide) {
                        if (event.currentSlide._staggerTimeout) {
                            clearTimeout(event.currentSlide._staggerTimeout);
                        }
                        event.currentSlide._staggerTimeout = setTimeout(() => {
                            playStaggeredAnimation(event.currentSlide);
                        }, 900);
                    }
                });

                Reveal.on('slidetransitionend', event => {
                    if (event.currentSlide && event.currentSlide._staggerTimeout) {
                        clearTimeout(event.currentSlide._staggerTimeout);
                        event.currentSlide._staggerTimeout = null;
                    }
                    playStaggeredAnimation(event.currentSlide);
                });

                Reveal.on('ready', () => {
                    updateUI(Reveal.getCurrentSlide());
                    playStaggeredAnimation(Reveal.getCurrentSlide());
                });
            }
        }

        // Timer buttons text updates (always sync with current config on init)
        const startBtn = document.getElementById('start-timer');
        if (startBtn) startBtn.textContent = TIMER_START_TEXT;
        const resetBtn = document.getElementById('reset-timer');
        if (resetBtn) resetBtn.textContent = TIMER_RESET_TEXT;

        // 8. Initialize Reveal.js (only once)
        if (!_listenersAttached) {
            const revealWidth = ASPECT_RATIO === '4:3' ? 1440 : 1920;

            await Reveal.initialize({
                width:          revealWidth,
                height:         1080,
                margin:         0,
                minScale:       0.1,
                maxScale:       2.0,
                hash:           true,
                slideNumber:    false,
                transition:     'fade',
                transitionSpeed: 'slow',
                center:         true,
                touch:          true,
                controls:       false,
                overview:       false,
                mathjax3: {
                    mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
                    tex: {
                        inlineMath: [['$', '$'], ['\\(', '\\)']]
                    },
                    options: {
                        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
                    }
                },
                plugins: [ RevealMath.MathJax3 ]
            });
            _listenersAttached = true;
        } else {
            // Re-sync and update if presentation is re-loaded
            if (typeof Reveal !== 'undefined') {
                Reveal.sync();
                updateUI(Reveal.getCurrentSlide());
                playStaggeredAnimation(Reveal.getCurrentSlide());
            }
        }

        // 9. Fade out premium loading overlay after a brief delay for assets to cache
        setTimeout(() => {
            const loader = document.getElementById('loading-overlay');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => loader.remove(), 600);
            }
        }, 800);

    } catch (error) {
        console.error('Presentation Load Error:', error);
        document.querySelector('.slides').innerHTML = `<section><h2>Error loading content</h2><p>${error.message}</p></section>`;
        Reveal.initialize();
    }
}
