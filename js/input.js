/**
 * @file js/input.js
 * @description Keyboard and UI button event listeners for steering, pausing, and restarting.
 */

import { CONTROLS } from './constants.js';

export class InputController {
    /**
     * @param {Object} callbacks 
     * @param {Function} callbacks.onDirectionChange
     * @param {Function} callbacks.onPause
     * @param {Function} callbacks.onRestart
     * @param {HTMLElement} [pauseBtn]
     * @param {HTMLElement} [restartBtn]
     */
    constructor(callbacks, pauseBtn = null, restartBtn = null) {
        this.onDirectionChange = callbacks.onDirectionChange;
        this.onPause = callbacks.onPause;
        this.onRestart = callbacks.onRestart;

        this.pauseBtn = pauseBtn;
        this.restartBtn = restartBtn;

        this._boundHandleKeyDown = this._handleKeyDown.bind(this);
        this._boundHandlePauseClick = this._handlePauseClick.bind(this);
        this._boundHandleRestartClick = this._handleRestartClick.bind(this);

        this.init();
    }

    init() {
        document.addEventListener('keydown', this._boundHandleKeyDown);

        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', this._boundHandlePauseClick);
        }

        if (this.restartBtn) {
            this.restartBtn.addEventListener('click', this._boundHandleRestartClick);
        }
    }

    destroy() {
        document.removeEventListener('keydown', this._boundHandleKeyDown);

        if (this.pauseBtn) {
            this.pauseBtn.removeEventListener('click', this._boundHandlePauseClick);
        }

        if (this.restartBtn) {
            this.restartBtn.removeEventListener('click', this._boundHandleRestartClick);
        }
    }

    _handleKeyDown(e) {
        const key = e.key.toLowerCase();
        const keyCode = e.keyCode;

        // Restart keys: R or Space
        if (CONTROLS.RESTART.includes(key) || keyCode === 32) {
            if (key === 'r' || key === ' ' || keyCode === 32) {
                this.onRestart();
                e.preventDefault();
                return;
            }
        }

        // Pause key: P
        if (CONTROLS.PAUSE.includes(key)) {
            this.onPause();
            e.preventDefault();
            return;
        }

        // Steering controls
        if (CONTROLS.LEFT.includes(key) || keyCode === 37) {
            this.onDirectionChange(-1, 0);
            e.preventDefault();
        } else if (CONTROLS.UP.includes(key) || keyCode === 38) {
            this.onDirectionChange(0, -1);
            e.preventDefault();
        } else if (CONTROLS.RIGHT.includes(key) || keyCode === 39) {
            this.onDirectionChange(1, 0);
            e.preventDefault();
        } else if (CONTROLS.DOWN.includes(key) || keyCode === 40) {
            this.onDirectionChange(0, 1);
            e.preventDefault();
        }
    }

    _handlePauseClick(e) {
        this.onPause();
        e.currentTarget.blur();
    }

    _handleRestartClick(e) {
        this.onRestart();
        e.currentTarget.blur();
    }
}
