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
        weight: 0.50
    },
    BONUS: {
        type: 'bonus',
        score: 30,
        color: '#eab308',
        glowColor: '#eab308',
        weight: 0.15
    },
    SLOW: {
        type: 'slow',
        score: 15,
        color: '#38bdf8',
        glowColor: '#38bdf8',
        duration: 6000,
        weight: 0.08
    },
    SPEED: {
        type: 'speed',
        score: 20,
        color: '#a855f7',
        glowColor: '#a855f7',
        duration: 5000,
        weight: 0.08
    },
    MULTIPLIER: {
        type: 'multiplier',
        score: 25,
        color: '#10b981',
        glowColor: '#10b981',
        duration: 7000,
        weight: 0.07
    },
    GHOST: {
        type: 'ghost',
        score: 25,
        color: '#6366f1',
        glowColor: '#6366f1',
        duration: 6000,
        weight: 0.04
    },
    MAGNET: {
        type: 'magnet',
        score: 25,
        color: '#f97316',
        glowColor: '#f97316',
        duration: 8000,
        weight: 0.04
    },
    FREEZE: {
        type: 'freeze',
        score: 25,
        color: '#06b6d4',
        glowColor: '#06b6d4',
        duration: 5000,
        weight: 0.04
    }
};

export const SOUND_EFFECTS = {
    EAT: 'eat',
    POWERUP: 'powerup',
    GAMEOVER: 'gameover',
    MOVE: 'move',
    CLICK: 'click',
    ACHIEVEMENT: 'achievement',
    SKIN_UNLOCK: 'skin_unlock'
};

export const SNAKE_SKINS = {
    DEFAULT: {
        id: 'default',
        name: 'Classic Green',
        headColor: '#22c55e',
        bodyColor: '#4ade80',
        glowColor: '#22c55e',
        cost: 0,
        unlocked: true
    },
    NEON: {
        id: 'neon',
        name: 'Neon Cyber',
        headColor: '#06b6d4',
        bodyColor: '#38bdf8',
        glowColor: '#06b6d4',
        cost: 100,
        unlocked: false
    },
    GOLDEN: {
        id: 'golden',
        name: 'Golden Serpent',
        headColor: '#eab308',
        bodyColor: '#facc15',
        glowColor: '#eab308',
        cost: 250,
        unlocked: false
    },
    CYBERPUNK: {
        id: 'cyberpunk',
        name: 'Cyberpunk Riot',
        headColor: '#ec4899',
        bodyColor: '#f43f5e',
        glowColor: '#ec4899',
        cost: 500,
        unlocked: false
    },
    RAINBOW: {
        id: 'rainbow',
        name: 'Rainbow Prism',
        headColor: '#a855f7',
        bodyColor: '#c084fc',
        glowColor: '#a855f7',
        cost: 1000,
        unlocked: false
    }
};

export const ACHIEVEMENTS = {
    FIRST_STEPS: {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Score your first 50 points.',
        target: 50,
        reward: 50,
        icon: '🌟'
    },
    POINT_MASTER: {
        id: 'point_master',
        title: 'Score Master',
        description: 'Reach a score of 200 points.',
        target: 200,
        reward: 150,
        icon: '🏆'
    },
    SPEED_DEMON: {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Collect 10 speed power-ups.',
        target: 10,
        reward: 100,
        icon: '⚡'
    },
    GHOST_WALKER: {
        id: 'ghost_walker',
        title: 'Ghost Walker',
        description: 'Use the Ghost power-up 5 times.',
        target: 5,
        reward: 120,
        icon: '👻'
    },
    COLLECTOR: {
        id: 'collector',
        title: 'Fashion Icon',
        description: 'Unlock at least 2 extra snake skins.',
        target: 2,
        reward: 200,
        icon: '🎨'
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
