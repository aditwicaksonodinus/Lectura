/**
 * slides.js
 * ─────────────────────────────────────────────────────────────
 * Inti engine slide: parsing metadata, pembangunan elemen slide,
 * dan inisialisasi penuh presentasi (termasuk Reveal.js).
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
    STUDY_PROGRAM,
    LANG,
    REVEAL_THEME,
    TIMER_START_TEXT,
    TIMER_RESET_TEXT,
    THEME_TOGGLE_TITLE,
    ASPECT_RATIO,
    CONTENT_FILE,
} from './config.js';

import { initMermaid }          from './mermaid.js';
import { LayoutTemplates }      from './layouts.js';
import { updateUI }             from './ui.js';
import { applyStaggeredAnimation } from './animation.js';
import { startTimer, resetTimer, setTimerDuration } from './timer.js';
import { resetTabsCache }       from './tabs.js';
import { applyCSSConfig }       from './styles.js';

// ─────────────────────────────────────────────────────────────
// extractMetadata
// ─────────────────────────────────────────────────────────────

/**
 * Ekstrak metadata dari komentar HTML dalam markdown slide.
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
 * Buat elemen <section> untuk satu slide berdasarkan data yang diekstrak.
 * @param {{ metadata: Object, cleanContent: string }} slideData
 * @returns {HTMLElement} section element siap diappend ke .slides
 */
export function createSlideElement(slideData) {
    const { metadata, cleanContent } = slideData;
    const section = document.createElement('section');

    // Set atribut Reveal.js
    if (metadata.title)   section.setAttribute('data-title',   metadata.title);
    if (metadata.state)   section.setAttribute('data-state',   metadata.state);
    if (metadata.section) section.setAttribute('data-section', metadata.section);
    if (metadata.page)    section.setAttribute('data-page',    metadata.page);

    const layout    = metadata.layout || 'default';
    const titleHtml = metadata.title ? `<h2>${metadata.title}</h2>` : '';

    // Split content untuk template multi-bagian
    const splitParts = cleanContent
        .split(/<!--\s*split\s*-->/)
        .map(p => p.trim());

    // Tambah class untuk CSS targeting
    section.classList.add(`layout-${layout}`);

    // Render via registry, fallback ke default
    const templateFn = LayoutTemplates[layout] || LayoutTemplates['default'];
    section.innerHTML = templateFn(metadata, cleanContent, titleHtml, splitParts);

    return section;
}

// ─────────────────────────────────────────────────────────────
// initPresentation — Main Orchestrator
// ─────────────────────────────────────────────────────────────

/**
 * Muat config, parsing markdown, bangun slides & tabs, inisialisasi Reveal.js.
 * @returns {Promise<void>}
 */
export async function initPresentation() {
    try {
        // 1. Muat konfigurasi dari config.json
        await loadConfig();

        // 2. Terapkan atribut dokumen dari config
        document.documentElement.setAttribute('lang', LANG);

        // Sinkronkan CSS Custom Properties (--presentation-width, --base-font-size)
        // dengan nilai config yang sudah dimuat. Ini memastikan layout CSS
        // mencerminkan ASPECT_RATIO dari config.json secara real-time.
        applyCSSConfig({
            aspectRatio: ASPECT_RATIO,
            baseFontSize: BASE_FONT_SIZE,
        });

        // Aspect ratio class (untuk selector CSS tambahan jika diperlukan)
        document.documentElement.classList.remove('ratio-16-9', 'ratio-4-3');
        const ratioClass = `ratio-${ASPECT_RATIO.replace(':', '-')}`;
        document.documentElement.classList.add(ratioClass);

        // Reveal theme
        const themeLink = document.getElementById('theme');
        if (themeLink) {
            themeLink.href = `https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/theme/${REVEAL_THEME}.min.css`;
        }

        // Theme toggle title
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('title', THEME_TOGGLE_TITLE);
        }

        // Title dan footer info
        document.title = PRESENTATION_TITLE;
        const centerInfo = document.querySelector('.footer .center-info');
        if (centerInfo) centerInfo.textContent = INSTITUTION_INFO;

        // Font size dan Mermaid
        document.documentElement.style.fontSize = BASE_FONT_SIZE;
        initMermaid(BASE_FONT_SIZE);

        // Sinkronkan timer state dengan config yang baru dimuat
        setTimerDuration(PRESENTATION_MINUTES);

        // 3. Fetch dan proses file konten markdown
        const response = await fetch(CONTENT_FILE);
        if (!response.ok) throw new Error(`Could not load ${CONTENT_FILE}`);

        let text = await response.text();

        // Ganti placeholder dinamis
        text = text.replace(/\{\{studyProgram\}\}/g,   STUDY_PROGRAM);
        text = text.replace(/\{\{authorName\}\}/g,     AUTHOR_NAME);
        text = text.replace(/\{\{studentId\}\}/g,      STUDENT_ID);
        text = text.replace(/\{\{institutionInfo\}\}/g, INSTITUTION_INFO);

        // 4. Bangun elemen slide dan tab
        const slideSections   = text.split(/\n---slide-break---\n/);
        const slidesContainer = document.querySelector('.slides');
        const tabsContainer   = document.getElementById('book-tabs');

        // Gunakan DocumentFragment untuk manipulasi DOM yang efisien
        const slidesFragment = document.createDocumentFragment();
        const tabsFragment   = document.createDocumentFragment();

        slidesContainer.innerHTML = '';
        if (tabsContainer) tabsContainer.innerHTML = '';

        const uniqueSections = [];
        const sectionMap     = {}; // sectionName → index slide pertama

        slideSections.forEach((sectionText, index) => {
            if (!sectionText.trim()) return;

            const slideData    = extractMetadata(sectionText);
            const slideElement = createSlideElement(slideData);
            slidesFragment.appendChild(slideElement);

            const sectionName = slideData.metadata.section;
            if (sectionName && !uniqueSections.includes(sectionName)) {
                uniqueSections.push(sectionName);
                sectionMap[sectionName] = index;
            }
        });

        // Append semua slide sekaligus
        slidesContainer.appendChild(slidesFragment);

        // 5. Buat tab navigasi secara dinamis
        if (tabsContainer) {
            uniqueSections.forEach(name => {
                const button = document.createElement('button');
                button.className = 'tab-item';
                button.textContent = name.toUpperCase();
                button.setAttribute('data-section-name', name);
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    Reveal.slide(sectionMap[name]);
                });
                tabsFragment.appendChild(button);
            });
            tabsContainer.appendChild(tabsFragment);

            // Reset cache tabs setelah rebuild
            resetTabsCache();
        }

        // 6. Set tampilan awal timer
        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            timerDisplay.textContent = `${PRESENTATION_MINUTES.toString().padStart(2, '0')}:00`;
        }

        // 7. Inisialisasi Reveal.js
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

        // 8. Setup tombol timer setelah Reveal siap
        const startBtn = document.getElementById('start-timer');
        if (startBtn) {
            startBtn.textContent = TIMER_START_TEXT;
            startBtn.addEventListener('click', startTimer);
        }
        const resetBtn = document.getElementById('reset-timer');
        if (resetBtn) {
            resetBtn.textContent = TIMER_RESET_TEXT;
            resetBtn.addEventListener('click', resetTimer);
        }

        // 9. Daftarkan Reveal event listeners
        Reveal.on('slidechanged', event => {
            updateUI(event.currentSlide);
            applyStaggeredAnimation(event.currentSlide);
        });
        Reveal.on('ready', () => updateUI(Reveal.getCurrentSlide()));

        // 10. Update UI untuk slide awal
        updateUI(Reveal.getCurrentSlide());

    } catch (error) {
        console.error('Presentation Load Error:', error);
        document.querySelector('.slides').innerHTML = `<section><h2>Error loading content</h2><p>${error.message}</p></section>`;
        Reveal.initialize();
    }
}
