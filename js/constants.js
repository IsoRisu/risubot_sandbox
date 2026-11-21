/**
 * Game constants and configuration definitions for the Snake game.
 */

export const CONFIG = {
    GRID_SIZE: 20,
    CANVAS_WIDTH: 400,
    CANVAS_HEIGHT: 400,
    INITIAL_SPEED: 100,
    MIN_SPEED: 40,
    STORAGE_KEY: "snake_high_score"
};

export const GAME_STATES = {
    IDLE: 'IDLE',
    RUNNING: 'RUNNING',
    PAUSED: 'PAUSED',
    GAME_OVER: 'GAME_OVER'
};

export const COLORS = {
    BACKGROUND: '#0b0f19',
    GRID_LINE: 'rgba(255, 255, 255, 0.03)',
    SNAKE_HEAD: '#22c55e',
    SNAKE_BODY: '#4ade80',
    TEXT_MAIN: '#f8fafc',
    TEXT_MUTED: '#94a3b8',
    OVERLAY_BG: 'rgba(15, 23, 42, 0.85)'
};

export const FOOD_TYPES = {
    NORMAL: {
        type: 'normal',
        score: 10,
        color: '#ef4444',
        glowColor: '#ef4444',
        weight: 0.60
    },
    BONUS: {
        type: 'bonus',
        score: 30,
        color: '#eab308',
        glowColor: '#eab308',
        weight: 0.20
    },
    SLOW: {
        type: 'slow',
        score: 15,
        color: '#38bdf8',
        glowColor: '#38bdf8',
        duration: 6000,
        weight: 0.10
    },
    SPEED: {
        type: 'speed',
        score: 20,
        color: '#a855f7',
        glowColor: '#a855f7',
        duration: 5000,
        weight: 0.10
    }
};

export const CONTROLS = {
    LEFT: ['arrowleft', 'a'],
    UP: ['arrowup', 'w'],
    RIGHT: ['arrowright', 'd'],
    DOWN: ['arrowdown', 's'],
    PAUSE: ['p'],
    RESTART: ['r', ' ']
};
