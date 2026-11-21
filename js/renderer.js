/**
 * @file js/renderer.js
 * @description Canvas rendering, grid drawing, food, snake, particle/visual effects, and HUD/DOM updates.
 */

import { CONFIG, COLORS, FOOD_TYPES } from './constants.js';

export class GameRenderer {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} elements DOM elements for HUD and buttons
     */
    constructor(canvas, elements) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = CONFIG.GRID_SIZE;
        this.tileCount = CONFIG.CANVAS_WIDTH / CONFIG.GRID_SIZE;

        this.scoreEl = elements.scoreEl;
        this.highScoreEl = elements.highScoreEl;
        this.pauseBtn = elements.pauseBtn;
        this.restartBtn = elements.restartBtn;

        this._scorePulseTimer = null;
        this._highScorePulseTimer = null;
    }

    /**
     * Clear the canvas and draw background grid and all game entities.
     * @param {import('./types.js').GameState} state 
     */
    draw(state) {
        this.clearCanvas();
        this.drawGrid();
        this.drawFood(state.food);
        this.drawActiveEffect(state.activeEffect);
        this.drawSnake(state.snake);
    }

    clearCanvas() {
        this.ctx.fillStyle = COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid() {
        this.ctx.strokeStyle = COLORS.GRID_LINE;
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
    }

    /**
     * @param {import('./types.js').FoodItem} food 
     */
    drawFood(food) {
        let foodColor = FOOD_TYPES.NORMAL.color;
        let glowColor = FOOD_TYPES.NORMAL.glowColor;

        if (food.type === FOOD_TYPES.BONUS.type) {
            foodColor = FOOD_TYPES.BONUS.color;
            glowColor = FOOD_TYPES.BONUS.glowColor;
        } else if (food.type === FOOD_TYPES.SLOW.type) {
            foodColor = FOOD_TYPES.SLOW.color;
            glowColor = FOOD_TYPES.SLOW.glowColor;
        } else if (food.type === FOOD_TYPES.SPEED.type) {
            foodColor = FOOD_TYPES.SPEED.color;
            glowColor = FOOD_TYPES.SPEED.glowColor;
        }

        this.ctx.fillStyle = foodColor;
        this.ctx.shadowColor = glowColor;
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(
            food.x * this.gridSize + 2,
            food.y * this.gridSize + 2,
            this.gridSize - 4,
            this.gridSize - 4
        );
        this.ctx.shadowBlur = 0;
    }

    /**
     * @param {string|null} activeEffect 
     */
    drawActiveEffect(activeEffect) {
        if (!activeEffect) return;
        this.ctx.fillStyle = activeEffect === 'slow' ? "rgba(56, 189, 248, 0.85)" : "rgba(168, 85, 247, 0.85)";
        this.ctx.font = "bold 12px 'Segoe UI', sans-serif";
        this.ctx.textAlign = "left";
        this.ctx.fillText(`EFFECT: ${activeEffect.toUpperCase()}`, 10, 22);
    }

    /**
     * @param {import('./types.js').Point[]} snake 
     */
    drawSnake(snake) {
        snake.forEach((part, index) => {
            this.ctx.fillStyle = index === 0 ? COLORS.SNAKE_HEAD : COLORS.SNAKE_BODY;
            if (index === 0) {
                this.ctx.shadowColor = COLORS.SNAKE_HEAD;
                this.ctx.shadowBlur = 6;
            }
            this.ctx.fillRect(
                part.x * this.gridSize + 1,
                part.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
            this.ctx.shadowBlur = 0;
        });
    }

    /**
     * Draw pause or game over overlays on the canvas.
     * @param {string} title 
     * @param {string} subtitle 
     */
    drawOverlay(title, subtitle) {
        this.ctx.fillStyle = COLORS.OVERLAY_BG;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = COLORS.TEXT_MAIN;
        this.ctx.font = "bold 26px 'Segoe UI', sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.fillText(title, this.canvas.width / 2, this.canvas.height / 2 - 12);

        this.ctx.fillStyle = COLORS.TEXT_MUTED;
        this.ctx.font = "14px 'Segoe UI', sans-serif";
        this.ctx.fillText(subtitle, this.canvas.width / 2, this.canvas.height / 2 + 20);
    }

    /**
     * Update HUD scores and trigger pulse animation if specified.
     * @param {number} score 
     * @param {number} highScore 
     * @param {boolean} [pulseScore=false] 
     * @param {boolean} [pulseHighScore=false] 
     */
    updateHUD(score, highScore, pulseScore = false, pulseHighScore = false) {
        if (this.scoreEl) {
            this.scoreEl.textContent = score;
            if (pulseScore) {
                this.scoreEl.classList.add("pulse");
                if (this._scorePulseTimer) clearTimeout(this._scorePulseTimer);
                this._scorePulseTimer = setTimeout(() => {
                    this.scoreEl.classList.remove("pulse");
                }, 250);
            }
        }

        if (this.highScoreEl) {
            this.highScoreEl.textContent = highScore;
            if (pulseHighScore) {
                this.highScoreEl.classList.add("pulse");
                if (this._highScorePulseTimer) clearTimeout(this._highScorePulseTimer);
                this._highScorePulseTimer = setTimeout(() => {
                    this.highScoreEl.classList.remove("pulse");
                }, 250);
            }
        }
    }

    /**
     * Update pause button text and style.
     * @param {boolean} isPaused 
     */
    setPauseButtonState(isPaused) {
        if (this.pauseBtn) {
            this.pauseBtn.textContent = isPaused ? "Resume (P)" : "Pause (P)";
        }
    }
}
