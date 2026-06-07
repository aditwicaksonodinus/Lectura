# 03-slide-layouts.md — Slide Layouts & Markdown Engine

Lectura presentations are built using structured Markdown parsed dynamically on page load. This guide covers writing, parsing, and rendering custom slide layouts, equations, and diagrams.

---

## 📝 1. Slide Syntax & Separators

Slides are written in the configured Markdown file (e.g. `content-id.md`) and must strictly use two core delimiters:

1. **Slide Separator**:
   ```markdown
   ---slide-break---
   ```
   *No leading/trailing whitespace, other characters, or sub-headers on the same line.*
   
2. **Column/Row Content Splitter**:
   ```markdown
   <!-- split -->
   ```
   *Splits slide content into sections for multi-column or multi-row layouts. In layout types 4, 5, 6, 7, 8, and 9, content before and after the split is mapped to separate container boxes.*

---

## 🛠️ 2. Slide Layout Dictionary

Every slide begins with HTML metadata comments. If `layout` is omitted, the default is `1-content-with-text`.

| Layout Name | Behavior | Structure | Required Metadata |
|---|---|---|---|
| `title` | Centered logo, metadata block, full title. | Single centered pane (no header/footer) | `<!-- logo: assets/logo.png -->`, `<!-- state: hide-header-footer -->` |
| `closing` | Centered text for Q&A, thanks, or conclusion. | Single centered pane (no header/footer) | `<!-- state: hide-header-footer -->` |
| `1-content-with-text` | Full width slide layout (Default). | Single column `academic-box` | `<!-- title: ... -->` |
| `1-column-stacked` | Split horizontally (Top / Bottom). | Two rows of `academic-box` | `<!-- top-title: ... -->`, `<!-- bottom-title: ... -->` |
| `2-content-with-text` | Two columns side-by-side. | Two equal width columns | `<!-- left-title: ... -->`, `<!-- right-title: ... -->` |
| `3-content-with-text` | Three columns side-by-side. | Three equal columns | `<!-- left-title: ... -->`, `<!-- center-title: ... -->`, `<!-- right-title: ... -->` |
| `2-content-with-img` | Image on left, text on right. | Left image, right `academic-box` | `<!-- image: assets/image.jpg -->` |
| `2-column-grid` | Free grids without wrapping. | Side-by-side custom HTML/CSS | `<!-- title: ... -->` |
| `2-content-center-mermaid`| Diagram on top, description below. | Top Mermaid block, bottom box | None |

---

## ⚙️ 3. Layout Rendering Engine (`js/layouts.js`)

Slide structure is parsed inside [`js/layouts.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/layouts.js) using the function `generateLayoutHtml(metadata, contents)`.

### How Metadata is Captured
Metadata comments (e.g. `<!-- layout: title -->`) are parsed using regular expressions:
```javascript
const metadataRegex = /<!--\s*([\w-]+)\s*:\s*(.*?)\s*-->/g;
```
Attributes extracted include: `layout`, `title`, `section`, `state`, and columns titles (`left-title`, `top-title`, etc.).

### HTML Generation Pattern
All elements rendered within content slides (excluding title, closing, and free grids) should be wrapped in:
```html
<div class="academic-box">
  <!-- parsed markdown content -->
</div>
```
If you need to add custom classes or animations to slides, edit `generateLayoutHtml` directly to inject those attributes into the returned template string.

---

## 📐 4. MathJax & Mermaid Integration

### MathJax (Equations)
Equations are written in standard LaTeX notation:
- Inline: `$...$`
- Block: `$$...$$`
MathJax is loaded via CDN in `index.html`. During slide transitions, `js/slides.js` calls:
```javascript
MathJax.typesetPromise();
```
to compile newly rendered slide markup.

### Mermaid (Flowcharts & Diagrams)
Mermaid diagrams are declared inside a fenced code block:
```markdown
​```mermaid
flowchart LR
    A --> B
​```
```
Mermaid logic is handled inside [`js/mermaid.js`](file:///run/media/aditlinux/SSD%20NVME/Lectura/js/mermaid.js). On load or slide change, it re-renders the diagram to ensure styling matches the current theme preset (`dark-mode` vs `light-mode` colors).
