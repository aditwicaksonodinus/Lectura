/**
 * image-preview.js
 * ─────────────────────────────────────────────────────────────
 * Preview gambar full-screen saat gambar dalam slide diklik.
 * Overlay menutup saat:
 *   - Tombol close diklik
 *   - Area di luar gambar diklik
 *   - Escape ditekan
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Inisialisasi overlay image preview.
 */
export function initImagePreview() {
    const overlay   = document.getElementById('image-preview');
    const previewImg = document.getElementById('image-preview-img');
    const closeBtn  = document.getElementById('image-preview-close');

    if (!overlay || !previewImg) return;

    // ── Buka Preview ──────────────────────────────────────────
    document.addEventListener('click', (e) => {
        const img = e.target.closest('img');
        if (img && !img.closest('.image-preview-overlay')) {
            e.preventDefault();
            e.stopPropagation();
            previewImg.src = img.src;
            previewImg.alt = img.alt || 'Preview';
            overlay.style.display = 'flex';
            // Delay kecil agar transisi CSS berjalan
            setTimeout(() => overlay.classList.add('active'), 10);
        }
    });

    // ── Tutup Preview ─────────────────────────────────────────
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

    // Klik di luar gambar (di area overlay)
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
