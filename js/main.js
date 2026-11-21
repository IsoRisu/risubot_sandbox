/**
 * @file js/main.js
 * @description Main game bootstrap script for the modular Snake game.
 */

import { GameModel } from './game.js';
import { GameRenderer } from './renderer.js';
import { InputController } from './input.js';
import { AudioManager } from './audio.js';
import { SOUND_EFFECTS, SNAKE_SKINS, ACHIEVEMENTS } from './constants.js';

class GameApp {
    constructor() {
        const canvas = document.getElementById("gameCanvas");
        const scoreEl = document.getElementById("score");
        const highScoreEl = document.getElementById("high-score");
        const pauseBtn = document.getElementById("pause-btn");
        const restartBtn = document.getElementById("restart-btn");
        const skinsBtn = document.getElementById("skins-btn");
        const achievementsBtn = document.getElementById("achievements-btn");
        const skinsModal = document.getElementById("skins-modal");
        const achievementsModal = document.getElementById("achievements-modal");
        const closeSkinsBtn = document.getElementById("close-skins-btn");
        const closeAchievementsBtn = document.getElementById("close-achievements-btn");

        this.model = new GameModel();
        this.audio = new AudioManager();
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

        // UI Event Listeners for modals
        if (skinsBtn) {
            skinsBtn.addEventListener('click', () => {
                if (!this.model.isPaused && !this.model.isGameOver) {
                    this.handleTogglePause();
                }
                this.renderSkinsUI();
                skinsModal.style.display = 'flex';
                this.audio.play(SOUND_EFFECTS.CLICK);
            });
        }

        if (closeSkinsBtn) {
            closeSkinsBtn.addEventListener('click', () => {
                skinsModal.style.display = 'none';
                this.audio.play(SOUND_EFFECTS.CLICK);
            });
        }

        if (achievementsBtn) {
            achievementsBtn.addEventListener('click', () => {
                if (!this.model.isPaused && !this.model.isGameOver) {
                    this.handleTogglePause();
                }
                this.renderAchievementsUI();
                achievementsModal.style.display = 'flex';
                this.audio.play(SOUND_EFFECTS.CLICK);
            });
        }

        if (closeAchievementsBtn) {
            closeAchievementsBtn.addEventListener('click', () => {
                achievementsModal.style.display = 'none';
                this.audio.play(SOUND_EFFECTS.CLICK);
            });
        }

        this.gameInterval = null;

        // Initialize high score display
        this.renderer.updateHUD(this.model.score, this.model.highScore);
        
        // Start the game
        this.restart();
    }

    renderSkinsUI() {
        const coinCountEl = document.getElementById('coin-count');
        const skinsListEl = document.getElementById('skins-list');
        if (coinCountEl) coinCountEl.textContent = this.model.coins;
        if (!skinsListEl) return;

        skinsListEl.innerHTML = '';
        Object.values(SNAKE_SKINS).forEach(skin => {
            const isUnlocked = this.model.unlockedSkins[skin.id];
            const isSelected = this.model.currentSkin === skin.id;

            const item = document.createElement('div');
            item.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.5); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);";
            
            item.innerHTML = `
                <div style="text-align: left;">
                    <div style="font-weight: bold; color: ${skin.headColor};">${skin.name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${isUnlocked ? (isSelected ? 'Equipped' : 'Unlocked') : `Cost: ${skin.cost} coins`}</div>
                </div>
            `;

            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.style.cssText = "padding: 6px 12px; font-size: 0.8rem;";
            
            if (isSelected) {
                btn.textContent = 'Active';
                btn.disabled = true;
                btn.style.opacity = '0.6';
            } else if (isUnlocked) {
                btn.textContent = 'Equip';
                btn.className = 'btn btn-primary';
                btn.onclick = () => {
                    this.model.selectSkin(skin.id);
                    this.audio.play(SOUND_EFFECTS.CLICK);
                    this.renderSkinsUI();
                };
            } else {
                btn.textContent = `Buy (${skin.cost})`;
                if (this.model.coins < skin.cost) {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                } else {
                    btn.onclick = () => {
                        if (this.model.buySkin(skin.id)) {
                            this.audio.play(SOUND_EFFECTS.SKIN_UNLOCK);
                            this.renderSkinsUI();
                        }
                    };
                }
            }

            item.appendChild(btn);
            skinsListEl.appendChild(item);
        });
    }

    renderAchievementsUI() {
        const listEl = document.getElementById('achievements-list');
        if (!listEl) return;

        listEl.innerHTML = '';
        Object.values(ACHIEVEMENTS).forEach(ach => {
            const unlocked = !!this.model.achievements[ach.id];

            const item = document.createElement('div');
            item.style.cssText = `display: flex; align-items: center; gap: 12px; background: rgba(15, 23, 42, 0.5); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); opacity: ${unlocked ? '1' : '0.6'};`;
            
            item.innerHTML = `
                <div style="font-size: 1.5rem;">${ach.icon}</div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: ${unlocked ? '#4ade80' : 'var(--text-main)'};">${ach.title} ${unlocked ? '✓' : ''}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${ach.description}</div>
                    <div style="font-size: 0.75rem; color: #eab308; margin-top: 2px;">Reward: +${ach.reward} coins</div>
                </div>
            `;
            listEl.appendChild(item);
        });
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
            this.audio.play(SOUND_EFFECTS.GAMEOVER);
            this.renderer.particleSystem.emitExplosion(
                this.model.snake[0].x * this.model.gridSize + this.model.gridSize / 2,
                this.model.snake[0].y * this.model.gridSize + this.model.gridSize / 2,
                '#ef4444',
                25
            );
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
            this.audio.play(result.isPowerUp ? SOUND_EFFECTS.POWERUP : SOUND_EFFECTS.EAT);
            
            if (result.unlockedNewAchievement) {
                this.audio.play(SOUND_EFFECTS.ACHIEVEMENT);
            }

            // Emit explosion particles on food collection
            const foodScreenX = this.model.food.x * this.model.gridSize + this.model.gridSize / 2;
            const foodScreenY = this.model.food.y * this.model.gridSize + this.model.gridSize / 2;
            const foodColor = result.isPowerUp ? '#a855f7' : '#ef4444';
            this.renderer.particleSystem.emitExplosion(foodScreenX, foodScreenY, foodColor, result.isPowerUp ? 20 : 12);

            this.updateGameInterval();
        }

        this.renderer.draw({
            snake: this.model.snake,
            food: this.model.food,
            activeEffect: this.model.activeEffect,
            currentSkin: this.model.currentSkin
        });
    }

    handleDirectionChange(dx, dy) {
        if (this.model.setDirection(dx, dy)) {
            this.audio.play(SOUND_EFFECTS.MOVE);
        }
    }

    handleTogglePause() {
        if (this.model.isGameOver) return;
        const isPaused = this.model.togglePause();
        this.renderer.setPauseButtonState(isPaused);
        this.audio.play(SOUND_EFFECTS.CLICK);

        if (isPaused) {
            if (this.gameInterval) {
                clearInterval(this.gameInterval);
                this.gameInterval = null;
            }
            this.renderer.draw({
                snake: this.model.snake,
                food: this.model.food,
                activeEffect: this.model.activeEffect,
                currentSkin: this.model.currentSkin
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
            activeEffect: this.model.activeEffect,
            currentSkin: this.model.currentSkin
        });
    }
}

// Start app when DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    new GameApp();
});
