/**
 * mermaid.js
 * ─────────────────────────────────────────────────────────────
 * Inisialisasi Mermaid dan pemrosesan diagram per-slide.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Inisialisasi Mermaid dengan konfigurasi sesuai ukuran font presentasi.
 * @param {string} baseFontSize - Ukuran font dasar (contoh: '18pt')
 */
export function initMermaid(baseFontSize) {
    if (typeof mermaid === 'undefined') return;

    const baseSizeValue = parseFloat(baseFontSize);
    const mermaidFontSize = baseFontSize.endsWith('pt')
        ? Math.round(baseSizeValue * 1.333)
        : baseSizeValue;

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
        state: { useMaxWidth: true },
        er: { useMaxWidth: true }
    });
}

// Counter deterministik untuk ID diagram — bebas collision, lebih cepat dari Math.random()
let _mermaidCounter = 0;

// Decoder persisten untuk menghindari pembuatan DOM berulang
const _htmlDecoder = document.createElement('div');

/**
 * Render satu elemen diagram Mermaid secara async.
 * @param {HTMLElement} diagram - Elemen .mermaid yang akan di-render
 * @returns {Promise<void>}
 */
export async function processMermaidDiagram(diagram) {
    if (typeof mermaid === 'undefined' || diagram.hasAttribute('data-processed')) return;

    const id = `mermaid-svg-${_mermaidCounter++}`;

    // Decode HTML entities dari konten diagram
    _htmlDecoder.innerHTML = diagram.innerHTML.trim();
    let text = _htmlDecoder.textContent;
    text = text.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');

    if (!text) return;

    try {
        diagram.setAttribute('data-processed', 'true');

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
            svg.style.maxWidth  = '100%';
            svg.style.height    = 'auto';
            svg.style.display   = 'block';
            svg.style.margin    = '0 auto';

            // Logika scaling spesifik per jenis diagram
            if (text.includes('sequenceDiagram')) {
                svg.style.maxHeight = '1300px';
            } else if (text.includes('graph LR') && text.includes('FLUTTER')) {
                svg.style.maxHeight      = '650px';
                svg.style.maxWidth       = '60%';
                svg.style.transform      = 'scale(0.6)';
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
