/* 
  ========================================================================
  ⚠️ WARNING:
  To respect the creator's original work, please do NOT remove or modify 
  the watermark "Lectura by AditDinus 🔥" in the footer of this presentation.
  Thank you for supporting academic integrity and respecting creative works!
  ========================================================================
*/

/**
 * CONFIGURATION: Presentation
 * Dynamic configs loaded from config.json (with local fallbacks).
 */
let PRESENTATION_MINUTES = 15;
let BASE_FONT_SIZE = '18pt';
let PRESENTATION_TITLE = 'Sidang Tesis: Arsitektur Hibrida Lectura';
let AUTHOR_NAME = 'Praditya Wicaksono';
let INSTITUTION_INFO = 'Universitas Dian Nuswantoro © 2026';
let STUDY_PROGRAM = 'Teknik Informatika';
let LANG = 'id';
let REVEAL_THEME = 'black';
let TIMER_START_TEXT = 'START';
let TIMER_RESET_TEXT = 'RESET';
let THEME_TOGGLE_TITLE = 'Toggle Dark/Light Mode';
let ASPECT_RATIO = '16:9';
let CONTENT_FILE = LANG === 'en' ? 'content-en.md' : 'content-id.md';

/**
 * Theme Management
 * Handles Dark/Light mode toggle and persistence
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        html.classList.add('dark-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark-mode');
            const isDark = html.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
}

/**
 * Accessibility Menu Management
 * Handles the dropdown menu visibility and interactions
 */
function initAccessibilityMenu() {
    const container = document.querySelector('.accessibility-container');
    const toggleBtn = document.getElementById('accessibility-toggle');
    const menu = document.getElementById('accessibility-menu');

    if (!toggleBtn || !menu) return;

    const toggleMenu = (forceState) => {
        const isExpanded = forceState !== undefined ? forceState : toggleBtn.getAttribute('aria-expanded') !== 'true';
        toggleBtn.setAttribute('aria-expanded', isExpanded);
        menu.classList.toggle('active', isExpanded);
    };

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when any action button inside is clicked (except scribble controls)
    const actionButtons = menu.querySelectorAll('button');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Don't auto-close if clicking scribble toggle or clear
            if (btn.id === 'scribble-toggle' || btn.id === 'scribble-clear') return;
            
            // Short delay to allow visual feedback on the button before closing
            setTimeout(() => toggleMenu(false), 150);
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        // Don't close if clicking inside container OR clicking on the scribble canvas
        if (menu.classList.contains('active') && 
            !container.contains(e.target) && 
            e.target.id !== 'scribble-canvas') {
            toggleMenu(false);
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            toggleMenu(false);
        }
    });

    // Keyboard shortcut: press 'A' to toggle menu
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            e.preventDefault();
            toggleMenu();
        }
    });
}

/**
 * Lectura Presentation Script
 * Dynamic Markdown Rendering with Layout Support
 */

// 1. Initialize Mermaid
function initMermaid(baseFontSize) {
    if (typeof mermaid !== 'undefined') {
        // Calculate mermaid font size from baseFontSize
        const baseSizeValue = parseFloat(baseFontSize);
        const mermaidFontSize = baseFontSize.endsWith('pt') ? Math.round(baseSizeValue * 1.333) : baseSizeValue;

        mermaid.initialize({
            startOnLoad: false,
            theme: 'neutral',
            securityLevel: 'loose',
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            fontSize: mermaidFontSize,
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'linear'
            },
            sequence: {
                diagramMarginX: 50,
                diagramMarginY: 10,
                actorMargin: 50,
                width: 150,
                height: 65,
                boxMargin: 10,
                boxTextMargin: 5,
                noteMargin: 10,
                messageMargin: 35,
                mirrorActors: true,
                bottomMarginAdjustment: 1,
                useMaxWidth: true,
                rightAngles: false,
                showSequenceNumbers: false,
            },
            state: {
                useMaxWidth: true
            },
            er: {
                useMaxWidth: true
            }
        });
    }
}

// 2. Configure Marked to handle Mermaid code blocks and footnotes
const renderer = new marked.Renderer();

// Custom renderer for Mermaid code blocks
renderer.code = function(code, language) {
    if (language === 'mermaid') {
        return `<div class="mermaid">${code}</div>`;
    }
    return `<pre><code class="language-${language}">${code}</code></pre>`;
};

// Custom renderer for Academic Tables (Booktabs Style with Pipes Header)
renderer.table = function(header, body) {
    return `
        <div class="academic-table-wrapper">
            <table>
                <thead>${header}</thead>
                <tbody>${body}</tbody>
            </table>
        </div>
    `;
};

renderer.tablecell = function(content, flags) {
    if (flags.header) {
        return `<th>${content}</th>`;
    }
    return `<td>${content}</td>`;
};

marked.setOptions({
    renderer: renderer,
    headerIds: true,
    gfm: true,
    breaks: true
});

/**
 * Enhanced markdown parser with footnote support
 * @param {string} md
 * @returns {string} HTML
 */
function renderMarkdown(md) {
    if (!md) return '';

    // 0. Academic Footnotes / Source notes: [^1)] content
    // Group consecutive footnotes into a single container for side-by-side display
    // Regex matches a block of lines starting with [^ marker )]
    md = md.replace(/((?:\[\^[^\]]*?\)\][^\n\r]*(?:\r?\n|$)\s*)+)/g, (match) => {
        const lines = match.trim().split(/\r?\n/);
        const footnoteSpans = lines.map(line => {
            const parts = line.match(/\[\^([^\]]*?\))\]\s*(.*)/);
            if (parts) {
                // Use marked.parseInline to support markdown within footnotes (like bold/italic)
                return `<span class="academic-footnote"><span class="footnote-marker"><sup>${parts[1]}</sup></span> <span class="footnote-text">${marked.parseInline(parts[2])}</span></span>`;
            }
            return line;
        }).join('');
        return `<div class="footnote-container">${footnoteSpans}</div>`;
    });

    // 1. IEEE Equation Style: $$eq$$ (label) (Anchored to start of line to prevent inline match)
    md = md.replace(/^[ \t]*\$\$([^\$]+?)\$\$\s*\(([^)]+)\)/gm, (match, eq, label) => {
        return `\n<div class="ieee-equation-container">\n<div class="ieee-equation-content">\n\n$$\n${eq.trim()}\n$$\n\n</div>\n<div class="ieee-equation-number">(${label})</div>\n</div>\n`;
    });

    // 2. Footnote references: [^1]
    let html = md.replace(/\[\^([^\]]+)\](?!\:)/g, '<sup><a href="#/slide?fn=$1" id="fnref-$1" class="footnote-ref" onclick="return false;">$1</a></sup>');
    // 3. Footnote definitions: [^1]: content
    html = html.replace(/^\[\^([^\]]+)\]:\s*(.*)$/gm, '<div class="footnote-definition" id="fn-$1"><sup>[$1]</sup> $2</div>');

    return marked.parse(html);
}

// 3. Prevent accidental exits and browser navigation gestures
window.addEventListener('beforeunload', (e) => {
    // Only show confirmation if the presentation is running
    if (timerInterval) {
        e.preventDefault();
        e.returnValue = ''; // Standard for modern browsers
    }
});

/**
 * 4. Aggressive gesture prevention (Swipe back/forward & Pull-to-refresh)
 */
let touchStartPosX = 0;
let touchStartPosY = 0;

window.addEventListener('touchstart', (e) => {
    touchStartPosX = e.touches[0].pageX;
    touchStartPosY = e.touches[0].pageY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (!e.touches || !e.touches[0]) return;

    const touchMovePosX = e.touches[0].pageX;
    const touchMovePosY = e.touches[0].pageY;
    const diffX = touchStartPosX - touchMovePosX;
    const diffY = touchStartPosY - touchMovePosY;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);

    // If scrolling vertically inside scrollable container, bypass gestures check immediately (improves FPS)
    if (absDiffY > absDiffX && e.target.closest('.content-wrapper')) {
        return;
    }

    // 1. Prevent "Pull-to-refresh"
    if (window.scrollY === 0 && diffY < 0) {
        const scrollable = e.target.closest('.content-wrapper');
        if (!scrollable || scrollable.scrollTop === 0) {
            e.preventDefault();
            return;
        }
    }

    // 2. Browser Navigation Prevention (Back/Forward)
    if (absDiffX > absDiffY && absDiffX > 10) {
        e.preventDefault();
        return;
    }

    // 3. Edge swipes
    const threshold = 50;
    if (touchStartPosX < threshold || touchStartPosX > window.innerWidth - threshold) {
        e.preventDefault();
    }
}, { passive: false });

window.addEventListener('wheel', (e) => {
    // Only prevent default on horizontal wheel scroll to block swipe back/forward gesture
    if (e.deltaX !== 0 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
    }
}, { passive: false });

/**
 * Extracts metadata from HTML comments in markdown
 * @param {string} markdown
 * @returns {object} { metadata: Object, cleanContent: String }
 */
function extractMetadata(markdown) {
    const metadata = {};
    const commentRegex = /<!--\s*([\w-]+)\s*:\s*(.*?)\s*-->/g;
    let match;

    while ((match = commentRegex.exec(markdown)) !== null) {
        metadata[match[1]] = match[2].trim();
    }

    const metadataRegex = /<!--\s*[\w-]+\s*:\s*.*?\s*-->/g;
    const cleanContent = markdown.replace(metadataRegex, '').trim();

    return { metadata, cleanContent };
}

/**
 * Template Registry for Slide Layouts
 */
const LayoutTemplates = {
    // Helper for generating academic boxes
    _box: (content, title = '', extraClass = '') => `
        <div class="academic-box ${extraClass}">
            ${title ? `<h4>${title}</h4>` : ''}
            ${renderMarkdown(content)}
        </div>`,

    'title': (metadata, cleanContent) => {
        const rendered = renderMarkdown(cleanContent);
        const h1 = (rendered.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '';
        const h2 = (rendered.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || [])[1] || '';
        const remaining = rendered.replace(/<h[12][^>]*>[\s\S]*?<\/h[12]>/gi, '');

        return `
            <div class="layout-title-slide">
                ${h1 ? `<h1 class="tesis-top">${h1}</h1>` : ''}
                ${metadata.logo ? `<img src="${metadata.logo}" class="title-logo" alt="Logo">` : ''}
                ${h2 ? `<h2 class="thesis-title">${h2}</h2>` : ''}
                ${remaining}
            </div>`;
    },

    'closing': (metadata, cleanContent) => `
        <div class="layout-closing-slide">
            ${renderMarkdown(cleanContent)}
        </div>`,

    '1-column-stacked': (metadata, cleanContent, titleHtml, splitParts) => {
        const boxes = splitParts.map((part, i) => {
            const extra = i % 2 === 0 ? 'full-width' : 'full-width red-top';
            const title = metadata[i === 0 ? 'top-title' : i === 1 ? 'bottom-title' : `part-${i+1}-title`];
            return LayoutTemplates._box(part, title, extra);
        }).join('');
        return `${titleHtml}<div class="content-wrapper">${boxes}</div>`;
    },

    '3-content-with-text': (metadata, cleanContent, titleHtml, splitParts) => `
        ${titleHtml}
        <div class="content-wrapper">
            <div class="flex-container">
                <div class="flex-item">${LayoutTemplates._box(splitParts[0] || '', metadata['left-title'])}</div>
                <div class="flex-item">${LayoutTemplates._box(splitParts[1] || '', metadata['center-title'], 'red-top')}</div>
                <div class="flex-item">${LayoutTemplates._box(splitParts[2] || '', metadata['right-title'], 'blue-top')}</div>
            </div>
        </div>`,

    '2-content-with-img': (metadata, cleanContent, titleHtml) => `
        ${titleHtml}
        <div class="content-wrapper">
            <div class="flex-container">
                ${metadata.image ? `<div class="flex-item"><img src="${metadata.image}" alt="Slide Image"></div>` : ''}
                <div class="flex-item">${LayoutTemplates._box(cleanContent)}</div>
            </div>
        </div>`,

    '2-content-center-mermaid': (metadata, cleanContent, titleHtml, splitParts) => `
        ${titleHtml}
        <div class="content-wrapper">
            <div class="flex-item" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
                <div class="mermaid-container" style="width: 100%; margin-bottom: 25px;">
                    ${renderMarkdown(splitParts[0] || '')}
                </div>
                ${LayoutTemplates._box(splitParts[1] || '')}
            </div>
        </div>`,

    '2-content-with-text': (metadata, cleanContent, titleHtml, splitParts) => `
        ${titleHtml}
        <div class="content-wrapper">
            <div class="flex-container">
                <div class="flex-item">${LayoutTemplates._box(splitParts[0] || '', metadata['left-title'])}</div>
                <div class="flex-item">${LayoutTemplates._box(splitParts[1] || '', metadata['right-title'], 'red-top')}</div>
            </div>
        </div>`,

    '1-content-with-text': (metadata, cleanContent, titleHtml) => `
        ${titleHtml}
        <div class="content-wrapper">${LayoutTemplates._box(cleanContent, '', 'full-width')}</div>`,

    '1-content-with-img': (...args) => LayoutTemplates['1-content-with-text'](...args),

    '2-column-grid': (metadata, cleanContent, titleHtml, splitParts) => `
        ${titleHtml}
        <div class="content-wrapper">
            <div class="flex-container" style="align-items: flex-start;">
                <div class="flex-item">${renderMarkdown(splitParts[0] || '')}</div>
                <div class="flex-item">${renderMarkdown(splitParts[1] || '')}</div>
            </div>
        </div>`,

    'default': (...args) => LayoutTemplates['1-content-with-text'](...args)
};


/**
 * Renders a slide based on layout template registry
 * @param {object} slideData
 * @returns {HTMLElement} section element
 */
function createSlideElement(slideData) {
    const { metadata, cleanContent } = slideData;
    const section = document.createElement('section');

    // Set Reveal.js attributes
    if (metadata.title) section.setAttribute('data-title', metadata.title);
    if (metadata.state) section.setAttribute('data-state', metadata.state);
    if (metadata.section) section.setAttribute('data-section', metadata.section);
    if (metadata.page) section.setAttribute('data-page', metadata.page);

    const layout = metadata.layout || 'default';
    const titleHtml = metadata.title ? `<h2>${metadata.title}</h2>` : '';

    // Process split parts for templates that utilize them
    const splitParts = cleanContent.split(/<!--\s*split\s*-->/).map(p => p.trim());

    // Add layout-specific class for CSS targeting
    section.classList.add(`layout-${layout}`);

    // Fetch and render the template, fallback to default if not found
    const renderer = LayoutTemplates[layout] || LayoutTemplates['default'];
    section.innerHTML = renderer(metadata, cleanContent, titleHtml, splitParts);

    return section;
}

/**
 * Handles UI updates and Mermaid rendering
 */
let timerInterval = null;
let timeLeft = PRESENTATION_MINUTES * 60;

function startTimer() {
    const display = document.getElementById('timer-display');
    const container = document.getElementById('presentation-timer');
    const startBtn = document.getElementById('start-timer');

    if (timerInterval) return; // Already running

    startBtn.style.display = 'none'; // Hide button once started

    timerInterval = setInterval(() => {
        timeLeft--;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeLeft = 0;
        }

        // Format MM:SS
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        // Alert mode (less than 2 minutes)
        if (timeLeft <= 120) {
            container.classList.add('alert-mode');
        } else {
            container.classList.remove('alert-mode');
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    timeLeft = PRESENTATION_MINUTES * 60;
    const display = document.getElementById('timer-display');
    if (display) {
        display.textContent = `${PRESENTATION_MINUTES.toString().padStart(2, '0')}:00`;
    }
    const container = document.getElementById('presentation-timer');
    if (container) {
        container.classList.remove('alert-mode');
    }
    const startBtn = document.getElementById('start-timer');
    if (startBtn) {
        startBtn.style.display = 'inline-block';
    }
}

/**
 * Navigation Tabs Logic (Book Tabs)
 * Handles Active and Completed states for Integrated Progress
 */
// Cache variables to hold references to global DOM elements
let tabsCache = null;
let headerCache = null;
let footerCache = null;
let slideNumberCache = null;
let timerCache = null;
let tabsContainerCache = null;

function updateActiveTab() {
    const currentSlideElement = Reveal.getCurrentSlide();
    if (!currentSlideElement) return;

    const currentSection = currentSlideElement.getAttribute('data-section');

    if (!tabsCache) {
        tabsCache = document.querySelectorAll('.tab-item');
    }

    let activeFound = false;

    tabsCache.forEach(tab => {
        const tabSection = tab.getAttribute('data-section-name');

        if (tabSection === currentSection) {
            tab.classList.add('active');
            tab.classList.remove('completed');
            activeFound = true;
        } else {
            tab.classList.remove('active');
            // If we haven't found the active tab yet, this tab is in the past (completed)
            if (!activeFound) {
                tab.classList.add('completed');
            } else {
                tab.classList.remove('completed');
            }
        }
    });
}

// Persistent decoder to avoid repetitive DOM creation
const htmlDecoder = document.createElement('div');

/**
 * Promisified Mermaid renderer with batching support
 * @param {HTMLElement} diagram
 * @returns {Promise}
 */
async function processMermaidDiagram(diagram) {
    if (typeof mermaid === 'undefined' || diagram.hasAttribute('data-processed')) return;

    const id = `mermaid-svg-${Math.floor(Math.random() * 1000000)}`;

    // Decode HTML entities
    htmlDecoder.innerHTML = diagram.innerHTML.trim();
    let text = htmlDecoder.textContent;
    text = text.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');

    if (!text) return;

    try {
        diagram.setAttribute('data-processed', 'true');

        // Wrap mermaid.render in a promise
        const svgCode = await new Promise((resolve, reject) => {
            try {
                mermaid.render(id, text, (code) => resolve(code));
            } catch (err) {
                reject(err);
            }
        });

        diagram.innerHTML = svgCode;
        const svg = diagram.querySelector('svg');
        if (svg) {
            svg.style.maxWidth = '100%';
            svg.style.height = 'auto';
            svg.style.display = 'block';
            svg.style.margin = '0 auto';

            // Specific scaling logic
            if (text.includes('sequenceDiagram')) {
                svg.style.maxHeight = '1300px';
            } else if (text.includes('graph LR') && text.includes('FLUTTER')) {
                svg.style.maxHeight = '650px';
                svg.style.maxWidth = '60%';
                svg.style.transform = 'scale(0.6)';
                svg.style.transformOrigin = 'top left';
            } else {
                svg.style.maxHeight = '650px';
            }
        }
    } catch (err) {
        console.error('Mermaid Render Error:', err);
        diagram.innerHTML = `<pre style="color:red; font-size: 0.5em; background: #fff0f0; padding: 10px; border: 1px solid red;">Mermaid Error: ${err.message}</pre>`;
        diagram.setAttribute('data-processed', 'error');
    }
}

async function updateUI(currentSlide) {
    if (!currentSlide) return;

    // Retrieve from cache or query DOM once
    headerCache = headerCache || document.querySelector('.header');
    footerCache = footerCache || document.querySelector('.footer');
    slideNumberCache = slideNumberCache || document.querySelector('.slide-number');
    timerCache = timerCache || document.getElementById('presentation-timer');
    tabsContainerCache = tabsContainerCache || document.getElementById('book-tabs');

    // Data from slide
    const state = currentSlide.getAttribute('data-state');
    const isTitleSlide = currentSlide.querySelector('.layout-title-slide') !== null;
    const isClosingSlide = currentSlide.querySelector('.layout-closing-slide') !== null;
    const hideContent = state === 'hide-header-footer';

    // Auto-off timer if last slide
    if (Reveal.isLastSlide()) {
        stopTimer();
    }

    // Visibility and Content Toggle
    if (headerCache && footerCache) {
        headerCache.style.display = 'flex';
        footerCache.style.display = 'grid';

        if (hideContent) {
            headerCache.classList.add('plain-ui');
            footerCache.classList.add('hidden-footer');
        } else {
            headerCache.classList.remove('plain-ui');
            footerCache.classList.remove('hidden-footer');
        }

        // Timer and Tabs always visible
        if (timerCache) timerCache.style.visibility = 'visible';
        if (tabsContainerCache) tabsContainerCache.style.visibility = 'visible';
    }

    // Update the visual state of tabs
    updateActiveTab();

    // Automatic Slide Number Update with Manual Override
    if (slideNumberCache && !hideContent) {
        const manualPage = currentSlide.getAttribute('data-page');
        if (manualPage) {
            slideNumberCache.textContent = manualPage;
        } else {
            const indices = Reveal.getIndices();
            const total = Reveal.getTotalSlides();
            slideNumberCache.textContent = `${indices.h + 1} / ${total}`;
        }
    }

    // Mermaid Rendering (Batching)
    const diagrams = currentSlide.querySelectorAll('.mermaid');
    if (diagrams.length > 0) {
        await Promise.all(Array.from(diagrams).map(processMermaidDiagram));
        // Single layout call after all diagrams in this slide are done
        setTimeout(() => { Reveal.layout(); }, 50);
    }
}


/**
 * Load markdown content and initialize presentation
 */
async function initPresentation() {
    try {
        // Fetch config.json dynamically
        try {
            const configResponse = await fetch('config.json');
            if (configResponse.ok) {
                const config = await configResponse.json();
                PRESENTATION_MINUTES = config.presentationMinutes || PRESENTATION_MINUTES;
                BASE_FONT_SIZE = config.baseFontSize || BASE_FONT_SIZE;
                PRESENTATION_TITLE = config.presentationTitle || PRESENTATION_TITLE;
                AUTHOR_NAME = config.authorName || AUTHOR_NAME;
                INSTITUTION_INFO = config.institutionInfo || INSTITUTION_INFO;
                STUDY_PROGRAM = config.studyProgram || STUDY_PROGRAM;
                LANG = config.lang || LANG;
                REVEAL_THEME = config.revealTheme || REVEAL_THEME;
                TIMER_START_TEXT = config.timerStartText || TIMER_START_TEXT;
                TIMER_RESET_TEXT = config.timerResetText || TIMER_RESET_TEXT;
                THEME_TOGGLE_TITLE = config.themeToggleTitle || THEME_TOGGLE_TITLE;
                ASPECT_RATIO = config.aspectRatio || ASPECT_RATIO;
                CONTENT_FILE = config.contentFile || (LANG === 'en' ? 'content-en.md' : 'content-id.md');
            }
        } catch (configErr) {
            console.warn('Error loading config.json, using default presentation values:', configErr);
        }

        // Apply dynamically loaded attributes, theme, title, and footer info
        document.documentElement.setAttribute('lang', LANG);
        
        // Apply aspect ratio class
        document.documentElement.classList.remove('ratio-16-9', 'ratio-4-3');
        const ratioClass = `ratio-${ASPECT_RATIO.replace(':', '-')}`;
        document.documentElement.classList.add(ratioClass);

        const themeLink = document.getElementById('theme');
        if (themeLink) {
            themeLink.href = `https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.3.1/theme/${REVEAL_THEME}.min.css`;
        }
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('title', THEME_TOGGLE_TITLE);
        }

        document.title = PRESENTATION_TITLE;
        const centerInfo = document.querySelector('.footer .center-info');
        if (centerInfo) centerInfo.textContent = INSTITUTION_INFO;

        document.documentElement.style.fontSize = BASE_FONT_SIZE;
        initMermaid(BASE_FONT_SIZE);
        timeLeft = PRESENTATION_MINUTES * 60; // Initialize timeLeft with fetched config value

        const response = await fetch(CONTENT_FILE);
        if (!response.ok) throw new Error(`Could not load ${CONTENT_FILE}`);

        let text = await response.text();
        // Replace dynamic placeholders
        text = text.replace(/\{\{studyProgram\}\}/g, STUDY_PROGRAM);
        text = text.replace(/\{\{authorName\}\}/g, AUTHOR_NAME);
        text = text.replace(/\{\{institutionInfo\}\}/g, INSTITUTION_INFO);

        const slideSections = text.split(/\n---slide-break---\n/);
        const slidesContainer = document.querySelector('.slides');
        const tabsContainer = document.getElementById('book-tabs');

        // Efficient DOM manipulation using DocumentFragment
        const slidesFragment = document.createDocumentFragment();
        const tabsFragment = document.createDocumentFragment();

        slidesContainer.innerHTML = '';
        if (tabsContainer) tabsContainer.innerHTML = '';

        const uniqueSections = [];
        const sectionMap = {}; // Name -> first slide index

        slideSections.forEach((sectionText, index) => {
            if (sectionText.trim()) {
                const slideData = extractMetadata(sectionText);
                const slideElement = createSlideElement(slideData);
                slidesFragment.appendChild(slideElement);

                const sectionName = slideData.metadata.section;
                if (sectionName && !uniqueSections.includes(sectionName)) {
                    uniqueSections.push(sectionName);
                    sectionMap[sectionName] = index;
                }
            }
        });

        // Append all slides at once
        slidesContainer.appendChild(slidesFragment);

        // Create Tabs Dynamically
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
            // Pre-populate tabs cache
            tabsCache = tabsContainer.querySelectorAll('.tab-item');
        }

        // Set initial timer display based on config
        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            timerDisplay.textContent = `${PRESENTATION_MINUTES.toString().padStart(2, '0')}:00`;
        }

        // Initialize Reveal.js with await for cleaner flow
        const revealWidth = ASPECT_RATIO === '4:3' ? 1440 : 1920;

        await Reveal.initialize({
            width: revealWidth,
            height: 1080,
            margin: 0,
            minScale: 0.1,
            maxScale: 2.0,
            hash: true,
            slideNumber: false,
            transition: 'fade',
            transitionSpeed: 'slow', /* Set to fast for snappier feel */
            center: true,
            touch: true,
            controls: false,
            overview: false,
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

        // Post-initialization setup
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

        updateUI(Reveal.getCurrentSlide());

    } catch (error) {
        console.error('Presentation Load Error:', error);
        document.querySelector('.slides').innerHTML = `<section><h2>Error loading content</h2><p>${error.message}</p></section>`;
        Reveal.initialize();
    }
}


// Event Listeners
Reveal.on('slidechanged', event => { updateUI(event.currentSlide); applyStaggeredAnimation(event.currentSlide); });
Reveal.on('ready', () => updateUI(Reveal.getCurrentSlide()));

// Image Preview Functionality
function initImagePreview() {
    const overlay = document.getElementById('image-preview');
    const previewImg = document.getElementById('image-preview-img');
    const closeBtn = document.getElementById('image-preview-close');

    if (!overlay || !previewImg) return;

    // Open preview
    document.addEventListener('click', (e) => {
        const img = e.target.closest('img');
        if (img && !img.closest('.image-preview-overlay')) {
            e.preventDefault();
            e.stopPropagation();
            previewImg.src = img.src;
            previewImg.alt = img.alt || 'Preview';
            overlay.style.display = 'flex';
            setTimeout(() => overlay.classList.add('active'), 10);
        }
    });

    // Close preview
    function closePreview() {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
            previewImg.src = '';
        }, 300);
    }

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closePreview();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePreview();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.style.display === 'flex') {
            closePreview();
        }
    });
}

function initLaserPointer() {
    const toggleBtn = document.getElementById('laser-toggle');
    const cursor = document.getElementById('laser-cursor');
    let enabled = false;

    const setEnabled = (state) => {
        enabled = state;
        if (enabled) {
            cursor.style.display = 'block';
            toggleBtn.setAttribute('aria-pressed', 'true');
            // If laser is enabled, disable scribble
            if (window.scribbleEnabled) window.setScribbleEnabled(false);
            
            // Disable Reveal gestures to prevent accidental slide changes while pointing
            if (typeof Reveal !== 'undefined') Reveal.configure({ touch: false });
        } else {
            cursor.style.display = 'none';
            toggleBtn.setAttribute('aria-pressed', 'false');
            
            // Re-enable Reveal gestures if no other interaction mode is active
            if (!window.scribbleEnabled && typeof Reveal !== 'undefined') {
                Reveal.configure({ touch: true });
            }
        }
    };

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => setEnabled(!enabled));
    }

    // Keyboard shortcut: press 'L'
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'l') {
            // Don't trigger if user is typing
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            e.preventDefault();
            setEnabled(!enabled);
        }
    });

    // Move cursor when active (Optimized for Mouse & Touch)
    const handlePointer = (e) => {
        if (!enabled) return;
        
        let x = e.clientX;
        let y = e.clientY;

        // Adaptive Offset: If using touch, shift the laser 50px up 
        // so it's not covered by the user's finger.
        if (e.pointerType === 'touch') {
            y -= 50;
        }

        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
    };

    document.addEventListener('pointermove', handlePointer);
    document.addEventListener('pointerdown', handlePointer);

    // Prevent scrolling when laser is enabled and touching the screen
    document.addEventListener('touchmove', (e) => {
        if (enabled && e.cancelable) e.preventDefault();
    }, { passive: false });

    // Expose for cross-feature interaction
    window.setLaserEnabled = setEnabled;
}

function initScribbleMode() {
    const canvas = document.getElementById('scribble-canvas');
    const toggleBtn = document.getElementById('scribble-toggle');
    const clearBtn = document.getElementById('scribble-clear');
    if (!canvas || !toggleBtn || !clearBtn) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    window.scribbleEnabled = false;

    // Resize canvas to match window
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const setEnabled = (state) => {
        window.scribbleEnabled = state;
        const html = document.documentElement;
        
        if (window.scribbleEnabled) {
            html.classList.add('scribble-active');
            toggleBtn.setAttribute('aria-pressed', 'true');
            clearBtn.style.display = 'flex';
            
            // If scribble is enabled, disable laser
            if (window.setLaserEnabled) window.setLaserEnabled(false);
            
            // Disable Reveal gestures while scribbling
            if (typeof Reveal !== 'undefined') Reveal.configure({ touch: false });
        } else {
            html.classList.remove('scribble-active');
            toggleBtn.setAttribute('aria-pressed', 'false');
            clearBtn.style.display = 'none';
            
            // Re-enable Reveal gestures if laser is not active
            const laserCursor = document.getElementById('laser-cursor');
            const laserActive = laserCursor && laserCursor.style.display === 'block';
            
            if (!laserActive && typeof Reveal !== 'undefined') {
                 Reveal.configure({ touch: true });
            }
        }
    };

    const clearAll = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // Drawing logic (Mouse & Touch)
    const startDrawing = (e) => {
        if (!window.scribbleEnabled) return;
        isDrawing = true;
        
        // Use clientX/Y which are relative to the viewport
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
        
        // Academic Style Stroke
        ctx.strokeStyle = '#ff3b30'; // Red
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    };

    const draw = (e) => {
        if (!isDrawing || !window.scribbleEnabled) return;
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        isDrawing = false;
        ctx.closePath();
    };

    // Pointer events for unified Mouse/Touch support
    canvas.addEventListener('pointerdown', startDrawing);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointerleave', stopDrawing);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => setEnabled(!window.scribbleEnabled));
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing menu immediately if desired, or keep it
            clearAll();
        });
    }

    // Keyboard shortcut integration
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        // 'S' for Toggle
        if (key === 's' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            setEnabled(!window.scribbleEnabled);
        }
        
        // 'Ctrl+K' for Clear All
        if (key === 'k' && (e.ctrlKey || e.metaKey)) {
            if (window.scribbleEnabled) {
                e.preventDefault();
                clearAll();
            }
        }
    });

    // Auto-clear on slide change
    if (typeof Reveal !== 'undefined') {
        Reveal.on('slidechanged', clearAll);
    }

    // Expose for cross-feature interaction
    window.setScribbleEnabled = setEnabled;
    window.clearAllScribbles = clearAll;
}

function initNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (typeof Reveal !== 'undefined') Reveal.prev();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (typeof Reveal !== 'undefined') Reveal.next();
        });
    }
}

function applyStaggeredAnimation(slide) {
    // Clean previous staggered elements
    document.querySelectorAll('.staggered').forEach(el => {
        el.classList.remove('staggered');
        el.style.removeProperty('--stagger-index');
    });
    if (!slide) return;
    const elements = slide.querySelectorAll('.academic-box > *');
    elements.forEach((el, i) => {
        el.style.setProperty('--stagger-index', i);
        el.classList.add('staggered');
    });
}
/**
 * Card Interaction Functionality
 * Adds responsive touch and mouse feedback for academic cards
 * Highlights stay active until another card is selected or slide changes
 */
function initCardInteractions() {
    const handleInteractionStart = (e) => {
        const box = e.target.closest('.academic-box');
        if (box) {
            // Remove highlight from the currently active box only (much faster than looping querySelectorAll)
            const activeBox = document.querySelector('.academic-box.is-interacting');
            if (activeBox && activeBox !== box) {
                activeBox.classList.remove('is-interacting');
            }

            // Set current box as active
            box.classList.add('is-interacting');
        }
    };

    // Support both Touch and Mouse for activation
    document.addEventListener('touchstart', handleInteractionStart, { passive: true });
    document.addEventListener('mousedown', handleInteractionStart);

    // Clear highlights on slide change to ensure a fresh start
    Reveal.on('slidechanged', () => {
        const activeBox = document.querySelector('.academic-box.is-interacting');
        if (activeBox) {
            activeBox.classList.remove('is-interacting');
        }
    });
}

// Kick off the load process
window.onload = () => {
    console.log(
        "%c✨ Lectura Presentation %cby AditDinus <3\n%cPlease do not remove the watermark to respect the creator's work. Thank you for your support! 😊\n\n",
        "color: #1b365d; font-size: 18px; font-weight: bold; font-family: serif;",
        "color: #f59e0b; font-size: 18px; font-weight: bold; font-family: serif; font-style: italic;",
        "color: #64748b; font-size: 13px; font-family: sans-serif;"
    );
    initTheme();
    initPresentation();
    initImagePreview();
    initAccessibilityMenu();
    initLaserPointer();
    initScribbleMode();
    initNavigation();
    initCardInteractions();
};
