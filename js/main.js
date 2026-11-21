/**
 * @file js/main.js
 * @description Main game bootstrap script for the modular Snake game.
 */

import { GameModel } from './game.js';
import { GameRenderer } from './renderer.js';
import { InputController } from './input.js';

class GameApp {
    constructor() {
        const canvas = document.getElementById("gameCanvas");
        const scoreEl = document.getElementById("score");
        const highScoreEl = document.getElementById("high-score");
        const pauseBtn = document.getElementById("pause-btn");
        const restartBtn = document.getElementById("restart-btn");

        this.model = new GameModel();
        this.renderer = new GameRenderer(canvas, {
            scoreEl,
            highScoreEl,
            pauseBtn,
            restartBtn
        });

        this.input = new InputController({
            onDirectionChange: (dx, dy) => this.handleDirectionChange(dx, dy),
            onPause: () => this.handleTogglePause(),
            onRestart: () => this.handleRestart()
        }, pauseBtn, restartBtn);

        this.gameInterval = null;

        // Initialize high score display
        this.renderer.updateHUD(this.model.score, this.model.highScore);
        
        // Start the game
        this.restart();
    }

    getSpeed() {
        return this.model.getSpeed();
    }

    updateGameInterval() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }

        if (!this.model.isPaused && !this.model.isGameOver) {
            this.gameInterval = setInterval(() => this.gameLoop(), this.getSpeed());
        }
    }

    gameLoop() {
        const prevHighScore = this.model.highScore;
        const result = this.model.update(() => {
            // On effect expire
            this.updateGameInterval();
        });

        if (this.model.isGameOver) {
            if (this.gameInterval) clearInterval(this.gameInterval);
            this.renderer.draw({
                snake: this.model.snake,
                food: this.model.food,
                activeEffect: this.model.activeEffect
            });
            this.renderer.drawOverlay("GAME OVER", "Press R or Space to Restart");
            return;
        }

        if (result && result.ateFood) {
            const isNewHighScore = this.model.highScore > prevHighScore;
            this.renderer.updateHUD(this.model.score, this.model.highScore, true, isNewHighScore);
            this.updateGameInterval();
        }

        this.renderer.draw({
            snake: this.model.snake,
            food: this.model.food,
            activeEffect: this.model.activeEffect
        });
    }

    handleDirectionChange(dx, dy) {
        this.model.setDirection(dx, dy);
    }

    handleTogglePause() {
        if (this.model.isGameOver) return;
        const isPaused = this.model.togglePause();
        this.renderer.setPauseButtonState(isPaused);

        if (isPaused) {
            if (this.gameInterval) {
                clearInterval(this.gameInterval);
                this.gameInterval = null;
            }
            this.renderer.draw({
                snake: this.model.snake,
                food: this.model.food,
                activeEffect: this.model.activeEffect
            });
            this.renderer.drawOverlay("PAUSED", "Press P to Resume");
        } else {
            this.updateGameInterval();
        }
    }

    handleRestart() {
        this.restart();
    }

    restart() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }

        this.model.reset();
        this.renderer.setPauseButtonState(false);
        this.renderer.updateHUD(this.model.score, this.model.highScore);
        
        this.updateGameInterval();
        this.renderer.draw({
            snake: this.model.snake,
            food: this.model.food,
            activeEffect: this.model.activeEffect
        });
    }
}

// Start app when DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    new GameApp();
});
