/**
 * markdown.js
 * ─────────────────────────────────────────────────────────────
 * Setup Marked.js dan fungsi renderMarkdown.
 * Menangani:
 *   - Custom renderer (Mermaid code blocks, academic tables)
 *   - Footnote akademik [^1)] 
 *   - IEEE Equation Style $$eq$$ (label)
 *   - Footnote references [^1] & definitions [^1]: content
 * ─────────────────────────────────────────────────────────────
 */

// ── Custom Marked Renderer ────────────────────────────────────
const renderer = new marked.Renderer();

// Render Mermaid code blocks sebagai <div class="mermaid">
renderer.code = function(code, language) {
    if (language === 'mermaid') {
        return `<div class="mermaid">${code}</div>`;
    }
    return `<pre><code class="language-${language}">${code}</code></pre>`;
};

// Render tabel dengan academic wrapper (Booktabs style)
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
 * Enhanced markdown parser dengan footnote dan IEEE equation support.
 * @param {string} md - Raw markdown string
 * @returns {string} HTML yang sudah di-render
 */
export function renderMarkdown(md) {
    if (!md) return '';

    // 0. Academic Footnotes: [^1)] content
    // Grupkan footnote berurutan ke dalam satu container (side-by-side display)
    md = md.replace(/((?:\[\^[^\]]*?\)\][^\n\r]*(?:\r?\n|$)\s*)+)/g, (match) => {
        const lines = match.trim().split(/\r?\n/);
        const footnoteSpans = lines.map(line => {
            const parts = line.match(/\[\^([^\]]*?\))\]\s*(.*)/);
            if (parts) {
                return `<span class="academic-footnote"><span class="footnote-marker"><sup>${parts[1]}</sup></span> <span class="footnote-text">${marked.parseInline(parts[2])}</span></span>`;
            }
            return line;
        }).join('');
        return `<div class="footnote-container">${footnoteSpans}</div>`;
    });

    // 1. IEEE Equation Style: $$eq$$ (label) — harus di awal baris
    md = md.replace(/^[ \t]*\$\$([^\$]+?)\$\$\s*\(([^)]+)\)/gm, (match, eq, label) => {
        return `\n<div class="ieee-equation-container">\n<div class="ieee-equation-content">\n\n$$\n${eq.trim()}\n$$\n\n</div>\n<div class="ieee-equation-number">(${label})</div>\n</div>\n`;
    });

    // 2. Footnote references: [^1]
    let html = md.replace(/\[\^([^\]]+)\](?!\:)/g, '<sup><a href="#/slide?fn=$1" id="fnref-$1" class="footnote-ref" onclick="return false;">$1</a></sup>');

    // 3. Footnote definitions: [^1]: content
    html = html.replace(/^\[\^([^\]]+)\]:\s*(.*)$/gm, '<div class="footnote-definition" id="fn-$1"><sup>[$1]</sup> $2</div>');

    return marked.parse(html);
}
