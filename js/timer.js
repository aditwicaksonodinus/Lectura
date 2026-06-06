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

// ── DOM Cache (di-populate saat pertama kali dibutuhkan) ──────
let _display   = null;
let _container = null;
let _startBtn  = null;

/** Lazy-init DOM cache untuk elemen timer */
function _initDOMCache() {
    if (!_display) {
        _display   = document.getElementById('timer-display');
        _container = document.getElementById('presentation-timer');
        _startBtn  = document.getElementById('start-timer');
    }
}

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
    _initDOMCache();

    if (timerInterval) return; // Sudah berjalan

    if (_startBtn) _startBtn.style.display = 'none';

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
        if (_display) {
            _display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        // Mode alert (kurang dari 2 menit)
        if (_container) {
            _container.classList.toggle('alert-mode', timeLeft <= 120);
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
    _initDOMCache();

    // Reset ke durasi awal dari PRESENTATION_MINUTES (sudah di-update via setTimerDuration)
    timeLeft = PRESENTATION_MINUTES * 60;

    if (_display) {
        _display.textContent = `${PRESENTATION_MINUTES.toString().padStart(2, '0')}:00`;
    }
    if (_container) {
        _container.classList.remove('alert-mode');
    }
    if (_startBtn) {
        _startBtn.style.display = 'inline-block';
    }
}

