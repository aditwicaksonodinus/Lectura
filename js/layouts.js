/**
 * layouts.js
 * ─────────────────────────────────────────────────────────────
 * Slide Layout Template Registry.
 * Each key is a layout name defined in markdown
 * via <!-- layout: layout-name -->.
 * Each value is a function that returns an HTML string.
 * ─────────────────────────────────────────────────────────────
 */

import { renderMarkdown } from './markdown.js';

/**
 * Template Registry for all available slide layouts.
 * Function signature: (metadata, cleanContent, titleHtml, splitParts) => HTMLString
 */
export const LayoutTemplates = {

    // ── Internal helper: render academic box ─────────────────
    _box: (content, title = '', extraClass = '') => `
        <div class="academic-box ${extraClass}">
            ${title ? `<h4>${title}</h4>` : ''}
            ${renderMarkdown(content)}
        </div>`,

    // ── Title Slide ──────────────────────────────────────────
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

    // ── Closing Slide ────────────────────────────────────────
    'closing': (metadata, cleanContent) => `
        <div class="layout-closing-slide">
            ${renderMarkdown(cleanContent)}
        </div>`,

    // ── 1 Column Stacked (multiple vertical boxes) ───────────
    '1-column-stacked': (metadata, cleanContent, titleHtml, splitParts) => {
        const boxes = splitParts.map((part, i) => {
            const extra = i % 2 === 0 ? 'full-width' : 'full-width red-top';
            const title = metadata[i === 0 ? 'top-title' : i === 1 ? 'bottom-title' : `part-${i + 1}-title`];
            return LayoutTemplates._box(part, title, extra);
        }).join('');
        return `${titleHtml}<div class="content-wrapper">${boxes}</div>`;
    },

    // ── 3 Content Columns ────────────────────────────────────
    '3-content-with-text': (metadata, cleanContent, titleHtml, splitParts) => `
        ${titleHtml}
        <div class="content-wrapper">
            <div class="flex-container">
                <div class="flex-item">${LayoutTemplates._box(splitParts[0] || '', metadata['left-title'])}</div>
                <div class="flex-item">${LayoutTemplates._box(splitParts[1] || '', metadata['center-title'], 'red-top')}</div>
                <div class="flex-item">${LayoutTemplates._box(splitParts[2] || '', metadata['right-title'], 'blue-top')}</div>
            </div>
        </div>`,

    // ── 2 Content: Image + Text ──────────────────────────────
    '2-content-with-img': (metadata, cleanContent, titleHtml) => `
        ${titleHtml}
        <div class="content-wrapper">
            <div class="flex-container">
                ${metadata.image ? `<div class="flex-item"><img src="${metadata.image}" alt="Slide Image"></div>` : ''}
                <div class="flex-item">${LayoutTemplates._box(cleanContent)}</div>
            </div>
        </div>`,

    // ── 2 Content: Mermaid top, Text bottom ──────────────────
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

    // ── 2 Content Columns ────────────────────────────────────
    '2-content-with-text': (metadata, cleanContent, titleHtml, splitParts) => `
        ${titleHtml}
        <div class="content-wrapper">
            <div class="flex-container">
                <div class="flex-item">${LayoutTemplates._box(splitParts[0] || '', metadata['left-title'])}</div>
                <div class="flex-item">${LayoutTemplates._box(splitParts[1] || '', metadata['right-title'], 'red-top')}</div>
            </div>
        </div>`,

    // ── 1 Content Full Width ─────────────────────────────────
    '1-content-with-text': (metadata, cleanContent, titleHtml) => `
        ${titleHtml}
        <div class="content-wrapper">${LayoutTemplates._box(cleanContent, '', 'full-width')}</div>`,

    // ── 1 Content with Image (alias) ─────────────────────────
    '1-content-with-img': (...args) => LayoutTemplates['1-content-with-text'](...args),

    // ── 2 Column Grid (direct markdown, without boxes) ───────
    '2-column-grid': (metadata, cleanContent, titleHtml, splitParts) => `
        ${titleHtml}
        <div class="content-wrapper">
            <div class="flex-container" style="align-items: flex-start;">
                <div class="flex-item">${renderMarkdown(splitParts[0] || '')}</div>
                <div class="flex-item">${renderMarkdown(splitParts[1] || '')}</div>
            </div>
        </div>`,

    // ── Default: fallback to 1-content-with-text ─────────────
    'default': (...args) => LayoutTemplates['1-content-with-text'](...args)
};
