/**
 * timer.js
 * ─────────────────────────────────────────────────────────────
 * Presentation timer management.
 * State (timerInterval, timeLeft) is stored at module-level —
 * not polluting the global scope.
 * ─────────────────────────────────────────────────────────────
 */

import { PRESENTATION_MINUTES } from './config.js';

// ── Module-level State ────────────────────────────────────────
let timerInterval = null;
let timeLeft      = PRESENTATION_MINUTES * 60;

// ── DOM Cache (populated when first needed) ──────────────────
let _display   = null;
let _container = null;
let _startBtn  = null;

/** Lazy-init DOM cache for timer elements */
function _initDOMCache() {
    if (!_display) {
        _display   = document.getElementById('timer-display');
        _container = document.getElementById('presentation-timer');
        _startBtn  = document.getElementById('start-timer');
    }
}

// ── Getters ───────────────────────────────────────────────────

/** @returns {boolean} true if timer is running */
export function isRunning() {
    return timerInterval !== null;
}

/** @returns {number} time left in seconds */
export function getTimeLeft() {
    return timeLeft;
}

/**
 * Set total timer duration (called after config is loaded).
 * @param {number} minutes
 */
export function setTimerDuration(minutes) {
    timeLeft = minutes * 60;
}

// ── Actions ───────────────────────────────────────────────────

/** Starts countdown. Does nothing if already running. */
export function startTimer() {
    _initDOMCache();

    if (timerInterval) return; // Already running

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

        // Alert mode (less than 2 minutes)
        if (_container) {
            _container.classList.toggle('alert-mode', timeLeft <= 120);
        }
    }, 1000);
}

/** Stops timer without resetting. */
export function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/** Resets timer to initial value and shows START button again. */
export function resetTimer() {
    stopTimer();
    _initDOMCache();

    // Reset to initial duration from PRESENTATION_MINUTES (updated via setTimerDuration)
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

