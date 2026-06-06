/**
 * timer.js
 * ─────────────────────────────────────────────────────────────
 * Manajemen timer presentasi.
 * State (timerInterval, timeLeft) disimpan di module-level —
 * tidak mengotori global scope.
 * ─────────────────────────────────────────────────────────────
 */

import { PRESENTATION_MINUTES } from './config.js';

// ── Module-level State ────────────────────────────────────────
let timerInterval = null;
let timeLeft      = PRESENTATION_MINUTES * 60;

// ── Getters ───────────────────────────────────────────────────

/** @returns {boolean} true jika timer sedang berjalan */
export function isRunning() {
    return timerInterval !== null;
}

/** @returns {number} sisa waktu dalam detik */
export function getTimeLeft() {
    return timeLeft;
}

/**
 * Set total waktu timer (dipanggil setelah config dimuat).
 * @param {number} minutes
 */
export function setTimerDuration(minutes) {
    timeLeft = minutes * 60;
}

// ── Actions ───────────────────────────────────────────────────

/** Mulai menghitung mundur. Tidak melakukan apa-apa jika sudah berjalan. */
export function startTimer() {
    const display   = document.getElementById('timer-display');
    const container = document.getElementById('presentation-timer');
    const startBtn  = document.getElementById('start-timer');

    if (timerInterval) return; // Sudah berjalan

    if (startBtn) startBtn.style.display = 'none';

    timerInterval = setInterval(() => {
        timeLeft--;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            timeLeft = 0;
        }

        // Format MM:SS
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        if (display) {
            display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        // Mode alert (kurang dari 2 menit)
        if (container) {
            container.classList.toggle('alert-mode', timeLeft <= 120);
        }
    }, 1000);
}

/** Hentikan timer tanpa reset. */
export function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/** Reset timer ke nilai awal dan tampilkan kembali tombol START. */
export function resetTimer() {
    stopTimer();

    // Import dinamis untuk membaca nilai terbaru dari config
    // (config mungkin sudah berubah sejak modul ini dimuat)
    import('./config.js').then(({ PRESENTATION_MINUTES: mins }) => {
        timeLeft = mins * 60;

        const display = document.getElementById('timer-display');
        if (display) {
            display.textContent = `${mins.toString().padStart(2, '0')}:00`;
        }
        const container = document.getElementById('presentation-timer');
        if (container) {
            container.classList.remove('alert-mode');
        }
        const startBtn = document.getElementById('start-timer');
        if (startBtn) {
            startBtn.style.display = 'inline-block';
        }
    });
}
