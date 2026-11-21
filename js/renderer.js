/**
 * @file js/renderer.js
 * @description Canvas rendering, grid drawing, food, snake, particle/visual effects, and HUD/DOM updates.
 */

import { CONFIG, COLORS, FOOD_TYPES } from './constants.js';
import { ParticleSystem } from './particles.js';

export class GameRenderer {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} elements DOM elements for HUD and buttons
     */
    constructor(canvas, elements) {
        this.particleSystem = new ParticleSystem();
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
     * Clear the canvas and draw background grid, particles, and all game entities.
     * @param {import('./types.js').GameState} state 
     */
    draw(state) {
        this.clearCanvas();
        this.drawGrid();
        this.particleSystem.update();
        this.particleSystem.draw(this.ctx);
        this.drawFood(state.food);
        this.drawActiveEffect(state.activeEffect);
        this.drawSnake(state.snake, state.currentSkin);
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

        const ft = food.type;
        if (ft === FOOD_TYPES.BONUS.type) {
            foodColor = FOOD_TYPES.BONUS.color;
            glowColor = FOOD_TYPES.BONUS.glowColor;
        } else if (ft === FOOD_TYPES.SLOW.type) {
            foodColor = FOOD_TYPES.SLOW.color;
            glowColor = FOOD_TYPES.SLOW.glowColor;
        } else if (ft === FOOD_TYPES.SPEED.type) {
            foodColor = FOOD_TYPES.SPEED.color;
            glowColor = FOOD_TYPES.SPEED.glowColor;
        } else if (ft === FOOD_TYPES.MULTIPLIER.type) {
            foodColor = FOOD_TYPES.MULTIPLIER.color;
            glowColor = FOOD_TYPES.MULTIPLIER.glowColor;
        } else if (ft === FOOD_TYPES.GHOST.type) {
            foodColor = FOOD_TYPES.GHOST.color;
            glowColor = FOOD_TYPES.GHOST.glowColor;
        } else if (ft === FOOD_TYPES.MAGNET.type) {
            foodColor = FOOD_TYPES.MAGNET.color;
            glowColor = FOOD_TYPES.MAGNET.glowColor;
        } else if (ft === FOOD_TYPES.FREEZE.type) {
            foodColor = FOOD_TYPES.FREEZE.color;
            glowColor = FOOD_TYPES.FREEZE.glowColor;
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
        let color = "rgba(168, 85, 247, 0.85)";
        if (activeEffect === 'slow') color = "rgba(56, 189, 248, 0.85)";
        else if (activeEffect === 'multiplier') color = "rgba(16, 185, 129, 0.85)";
        else if (activeEffect === 'ghost') color = "rgba(99, 102, 241, 0.85)";
        else if (activeEffect === 'magnet') color = "rgba(249, 115, 22, 0.85)";
        else if (activeEffect === 'freeze') color = "rgba(6, 182, 212, 0.85)";

        this.ctx.fillStyle = color;
        this.ctx.font = "bold 12px 'Segoe UI', sans-serif";
        this.ctx.textAlign = "left";
        this.ctx.fillText(`EFFECT: ${activeEffect.toUpperCase()}`, 10, 22);
    }

    /**
     * @param {import('./types.js').Point[]} snake 
     * @param {string} skinId 
     */
    drawSnake(snake, skinId = 'default') {
        import('./constants.js').then(({ SNAKE_SKINS }) => {
            // Handled or inline color selection
        });

        let headColor = COLORS.SNAKE_HEAD;
        let bodyColor = COLORS.SNAKE_BODY;

        if (skinId === 'neon') {
            headColor = '#06b6d4'; bodyColor = '#38bdf8';
        } else if (skinId === 'golden') {
            headColor = '#eab308'; bodyColor = '#facc15';
        } else if (skinId === 'cyberpunk') {
            headColor = '#ec4899'; bodyColor = '#f43f5e';
        } else if (skinId === 'rainbow') {
            headColor = '#a855f7'; bodyColor = '#c084fc';
        }

        snake.forEach((part, index) => {
            this.ctx.fillStyle = index === 0 ? headColor : bodyColor;
            if (index === 0) {
                this.ctx.shadowColor = headColor;
                this.ctx.shadowBlur = 6;
                this.particleSystem.emitTrail(
                    part.x * this.gridSize + this.gridSize / 2,
                    part.y * this.gridSize + this.gridSize / 2,
                    headColor
                );
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
