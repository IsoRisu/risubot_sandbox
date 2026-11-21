/**
 * @file js/game.js
 * @description Core game state, snake movement, collision detection, scoring, and power-up timer logic.
 */

import { CONFIG, FOOD_TYPES } from './constants.js';

export class GameModel {
    constructor() {
        this.gridSize = CONFIG.GRID_SIZE;
        this.tileCount = CONFIG.CANVAS_WIDTH / CONFIG.GRID_SIZE;
        this.highScore = parseInt(localStorage.getItem(CONFIG.STORAGE_KEY) || "0", 10);
        
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
        if (rand < FOOD_TYPES.NORMAL.weight) {
            this.food.type = FOOD_TYPES.NORMAL.type;
        } else if (rand < FOOD_TYPES.NORMAL.weight + FOOD_TYPES.BONUS.weight) {
            this.food.type = FOOD_TYPES.BONUS.type;
        } else if (rand < FOOD_TYPES.NORMAL.weight + FOOD_TYPES.BONUS.weight + FOOD_TYPES.SLOW.weight) {
            this.food.type = FOOD_TYPES.SLOW.type;
        } else {
            this.food.type = FOOD_TYPES.SPEED.type;
        }

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
            if (this.food.type === FOOD_TYPES.NORMAL.type) {
                pointsGained = FOOD_TYPES.NORMAL.score;
            } else if (this.food.type === FOOD_TYPES.BONUS.type) {
                pointsGained = FOOD_TYPES.BONUS.score;
            } else if (this.food.type === FOOD_TYPES.SLOW.type) {
                pointsGained = FOOD_TYPES.SLOW.score;
                this.applyEffect('slow', FOOD_TYPES.SLOW.duration, onEffectExpire);
            } else if (this.food.type === FOOD_TYPES.SPEED.type) {
                pointsGained = FOOD_TYPES.SPEED.score;
                this.applyEffect('speed', FOOD_TYPES.SPEED.duration, onEffectExpire);
            }

            this.score += pointsGained;

            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem(CONFIG.STORAGE_KEY, this.highScore);
            }

            this.spawnFood();
            return { ateFood: true, pointsGained };
        } else {
            this.snake.pop();
            return { ateFood: false, pointsGained: 0 };
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
    }
}