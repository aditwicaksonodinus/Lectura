/**
 * image-preview.js
 * ─────────────────────────────────────────────────────────────
 * Full-screen image preview when an image in a slide is clicked.
 * Overlay closes when:
 *   - Close button is clicked
 *   - Area outside the image is clicked
 *   - Escape is pressed
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Initializes the image preview overlay.
 */
export function initImagePreview() {
    const overlay   = document.getElementById('image-preview');
    const previewImg = document.getElementById('image-preview-img');
    const closeBtn  = document.getElementById('image-preview-close');

    if (!overlay || !previewImg) return;

    // ── Open Preview ──────────────────────────────────────────
    document.addEventListener('click', (e) => {
        const img = e.target.closest('img');
        if (img && !img.closest('.image-preview-overlay')) {
            e.preventDefault();
            e.stopPropagation();
            previewImg.src = img.src;
            previewImg.alt = img.alt || 'Preview';
            overlay.style.display = 'flex';
            // Short delay to allow CSS transitions to run
            setTimeout(() => overlay.classList.add('active'), 10);
        }
    });

    // ── Close Preview ─────────────────────────────────────────
    const closePreview = () => {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
            previewImg.src = '';
        }, 300);
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closePreview();
        });
    }

    // Click outside image (in overlay area)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePreview();
        }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.style.display === 'flex') {
            closePreview();
        }
    });
}
