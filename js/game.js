/**
 * @file js/game.js
 * @description Core game state, snake movement, collision detection, scoring, and power-up timer logic.
 */

import { CONFIG, FOOD_TYPES, SNAKE_SKINS, ACHIEVEMENTS } from './constants.js';

export class GameModel {
    constructor() {
        this.gridSize = CONFIG.GRID_SIZE;
        this.tileCount = CONFIG.CANVAS_WIDTH / CONFIG.GRID_SIZE;
        
        // Load progression from localStorage
        this.highScore = parseInt(localStorage.getItem(CONFIG.STORAGE_KEY) || "0", 10);
        this.coins = parseInt(localStorage.getItem('snake_coins') || "0", 10);
        this.currentSkin = localStorage.getItem('snake_current_skin') || 'default';
        
        const savedSkins = localStorage.getItem('snake_unlocked_skins');
        this.unlockedSkins = savedSkins ? JSON.parse(savedSkins) : { default: true };

        const savedAchievements = localStorage.getItem('snake_achievements');
        this.achievements = savedAchievements ? JSON.parse(savedAchievements) : {};

        const savedProgress = localStorage.getItem('snake_achievement_progress');
        this.achievementProgress = savedProgress ? JSON.parse(savedProgress) : {};

        this.stats = {
            totalScore: 0,
            speedPowerUps: 0,
            ghostPowerUps: 0,
            totalFood: 0
        };
        const savedStats = localStorage.getItem('snake_stats');
        if (savedStats) {
            try { this.stats = JSON.parse(savedStats); } catch(e){}
        }

        this.reset();
    }

    reset() {
        this.snake = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.dx = 1;
        this.dy = 0;
        this.nextDx = 1;
        this.nextDy = 0;
        this.score = 0;
        this.isGameOver = false;
        this.isPaused = false;
        this.changingDirection = false;
        this.activeEffect = null;
        this.effectTimer = null;

        this.food = { x: 5, y: 5, type: 'normal' };
        this.spawnFood();
    }

    getSpeed() {
        let base = Math.max(CONFIG.MIN_SPEED, CONFIG.INITIAL_SPEED - Math.floor(this.score / 40) * 8);
        if (this.activeEffect === 'slow') base += 35;
        if (this.activeEffect === 'speed') base = Math.max(40, base - 30);
        return base;
    }

    setDirection(newDx, newDy) {
        if (this.changingDirection || this.isPaused || this.isGameOver) return false;

        // Prevent reversing directly into oneself
        if (newDx !== 0 && this.dx === 0) {
            this.nextDx = newDx;
            this.nextDy = 0;
            this.changingDirection = true;
            return true;
        }
        if (newDy !== 0 && this.dy === 0) {
            this.nextDx = 0;
            this.nextDy = newDy;
            this.changingDirection = true;
            return true;
        }
        return false;
    }

    spawnFood() {
        this.food.x = Math.floor(Math.random() * this.tileCount);
        this.food.y = Math.floor(Math.random() * this.tileCount);

        const rand = Math.random();
        let cumulative = 0;
        let selectedType = FOOD_TYPES.NORMAL.type;

        for (const key of Object.keys(FOOD_TYPES)) {
            const ft = FOOD_TYPES[key];
            cumulative += ft.weight;
            if (rand <= cumulative) {
                selectedType = ft.type;
                break;
            }
        }
        this.food.type = selectedType;

        // Ensure food doesn't spawn on snake
        const collisionWithSnake = this.snake.some(part => part.x === this.food.x && part.y === this.food.y);
        if (collisionWithSnake) {
            this.spawnFood();
        }
    }

    update(onEffectExpire) {
        if (this.isGameOver || this.isPaused) return;

        this.dx = this.nextDx;
        this.dy = this.nextDy;
        this.changingDirection = false;

        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

        // Wall collision check
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.endGame();
            return;
        }

        // Self collision check
        for (let i = 0; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                this.endGame();
                return;
            }
        }

        this.snake.unshift(head);

        // Food collision check
        if (head.x === this.food.x && head.y === this.food.y) {
            let pointsGained = 10;
            let isPowerUp = false;
            const fType = this.food.type;

            if (fType === FOOD_TYPES.NORMAL.type) {
                pointsGained = FOOD_TYPES.NORMAL.score;
            } else if (fType === FOOD_TYPES.BONUS.type) {
                pointsGained = FOOD_TYPES.BONUS.score;
                isPowerUp = true;
            } else if (fType === FOOD_TYPES.SLOW.type) {
                pointsGained = FOOD_TYPES.SLOW.score;
                isPowerUp = true;
                this.applyEffect('slow', FOOD_TYPES.SLOW.duration, onEffectExpire);
            } else if (fType === FOOD_TYPES.SPEED.type) {
                pointsGained = FOOD_TYPES.SPEED.score;
                isPowerUp = true;
                this.stats.speedPowerUps++;
                this.applyEffect('speed', FOOD_TYPES.SPEED.duration, onEffectExpire);
            } else if (fType === FOOD_TYPES.MULTIPLIER.type) {
                pointsGained = FOOD_TYPES.MULTIPLIER.score * 2;
                isPowerUp = true;
                this.applyEffect('multiplier', FOOD_TYPES.MULTIPLIER.duration, onEffectExpire);
            } else if (fType === FOOD_TYPES.GHOST.type) {
                pointsGained = FOOD_TYPES.GHOST.score;
                isPowerUp = true;
                this.stats.ghostPowerUps++;
                this.applyEffect('ghost', FOOD_TYPES.GHOST.duration, onEffectExpire);
            } else if (fType === FOOD_TYPES.MAGNET.type) {
                pointsGained = FOOD_TYPES.MAGNET.score;
                isPowerUp = true;
                this.applyEffect('magnet', FOOD_TYPES.MAGNET.duration, onEffectExpire);
            } else if (fType === FOOD_TYPES.FREEZE.type) {
                pointsGained = FOOD_TYPES.FREEZE.score;
                isPowerUp = true;
                this.applyEffect('freeze', FOOD_TYPES.FREEZE.duration, onEffectExpire);
            }

            this.score += pointsGained;
            this.coins += Math.floor(pointsGained / 5) + (isPowerUp ? 5 : 1);
            this.stats.totalFood++;

            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem(CONFIG.STORAGE_KEY, this.highScore);
            }

            this.saveProgress();
            const unlockedNewAchievement = this.checkAchievements();

            this.spawnFood();
            return { ateFood: true, pointsGained, isPowerUp, unlockedNewAchievement };
        } else {
            this.snake.pop();
            return { ateFood: false, pointsGained: 0, isPowerUp: false };
        }
    }

    applyEffect(effectType, duration, onExpire) {
        this.activeEffect = effectType;
        if (this.effectTimer) {
            clearTimeout(this.effectTimer);
        }
        this.effectTimer = setTimeout(() => {
            this.activeEffect = null;
            if (onExpire) onExpire();
        }, duration);
    }

    togglePause() {
        if (this.isGameOver) return this.isPaused;
        this.isPaused = !this.isPaused;
        return this.isPaused;
    }

    endGame() {
        this.isGameOver = true;
        if (this.effectTimer) {
            clearTimeout(this.effectTimer);
        }
        this.stats.totalScore += this.score;
        this.saveProgress();
    }

    saveProgress() {
        localStorage.setItem(CONFIG.STORAGE_KEY, this.highScore);
        localStorage.setItem('snake_coins', this.coins);
        localStorage.setItem('snake_current_skin', this.currentSkin);
        localStorage.setItem('snake_unlocked_skins', JSON.stringify(this.unlockedSkins));
        localStorage.setItem('snake_achievements', JSON.stringify(this.achievements));
        localStorage.setItem('snake_achievement_progress', JSON.stringify(this.achievementProgress));
        localStorage.setItem('snake_stats', JSON.stringify(this.stats));
    }

    checkAchievements() {
        let newlyUnlocked = false;
        
        // 1. First steps (score 50)
        if (!this.achievements[ACHIEVEMENTS.FIRST_STEPS.id] && this.score >= ACHIEVEMENTS.FIRST_STEPS.target) {
            this.achievements[ACHIEVEMENTS.FIRST_STEPS.id] = true;
            this.coins += ACHIEVEMENTS.FIRST_STEPS.reward;
            newlyUnlocked = true;
        }

        // 2. Point Master (score 200)
        if (!this.achievements[ACHIEVEMENTS.POINT_MASTER.id] && this.score >= ACHIEVEMENTS.POINT_MASTER.target) {
            this.achievements[ACHIEVEMENTS.POINT_MASTER.id] = true;
            this.coins += ACHIEVEMENTS.POINT_MASTER.reward;
            newlyUnlocked = true;
        }

        // 3. Speed Demon (collect 10 speed powerups)
        if (!this.achievements[ACHIEVEMENTS.SPEED_DEMON.id] && this.stats.speedPowerUps >= ACHIEVEMENTS.SPEED_DEMON.target) {
            this.achievements[ACHIEVEMENTS.SPEED_DEMON.id] = true;
            this.coins += ACHIEVEMENTS.SPEED_DEMON.reward;
            newlyUnlocked = true;
        }

        // 4. Ghost Walker (use ghost power-up 5 times)
        if (!this.achievements[ACHIEVEMENTS.GHOST_WALKER.id] && this.stats.ghostPowerUps >= ACHIEVEMENTS.GHOST_WALKER.target) {
            this.achievements[ACHIEVEMENTS.GHOST_WALKER.id] = true;
            this.coins += ACHIEVEMENTS.GHOST_WALKER.reward;
            newlyUnlocked = true;
        }

        // 5. Collector (unlock 2 extra skins)
        const unlockedCount = Object.keys(this.unlockedSkins).filter(k => this.unlockedSkins[k] && k !== 'default').length;
        if (!this.achievements[ACHIEVEMENTS.COLLECTOR.id] && unlockedCount >= ACHIEVEMENTS.COLLECTOR.target) {
            this.achievements[ACHIEVEMENTS.COLLECTOR.id] = true;
            this.coins += ACHIEVEMENTS.COLLECTOR.reward;
            newlyUnlocked = true;
        }

        if (newlyUnlocked) {
            this.saveProgress();
        }
        return newlyUnlocked;
    }

    buySkin(skinId) {
        const skin = Object.values(SNAKE_SKINS).find(s => s.id === skinId);
        if (!skin || this.unlockedSkins[skinId]) return false;
        if (this.coins >= skin.cost) {
            this.coins -= skin.cost;
            this.unlockedSkins[skinId] = true;
            this.currentSkin = skinId;
            this.saveProgress();
            this.checkAchievements();
            return true;
        }
        return false;
    }

    selectSkin(skinId) {
        if (this.unlockedSkins[skinId]) {
            this.currentSkin = skinId;
            this.saveProgress();
            return true;
        }
        return false;
    }
}