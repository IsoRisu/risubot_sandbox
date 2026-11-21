/**
 * @file js/types.js
 * @description JSDoc type definitions for the game state, snake, food items, and power-ups.
 */

/**
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} FoodItem
 * @property {number} x
 * @property {number} y
 * @property {'normal'|'bonus'|'slow'|'speed'|'multiplier'|'ghost'|'magnet'|'freeze'} type
 */

/**
 * @typedef {Object} SnakeSkin
 * @property {string} id
 * @property {string} name
 * @property {string} headColor
 * @property {string} bodyColor
 * @property {string} glowColor
 * @property {number} cost
 * @property {boolean} unlocked
 */

/**
 * @typedef {Object} Achievement
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} target
 * @property {number} reward
 * @property {string} icon
 * @property {boolean} [unlocked]
 * @property {number} [progress]
 */

/**
 * @typedef {Object} GameState
 * @property {Point[]} snake
 * @property {FoodItem} food
 * @property {Point} direction
 * @property {Point} nextDirection
 * @property {number} score
 * @property {number} highScore
 * @property {number} coins
 * @property {boolean} isGameOver
 * @property {boolean} isPaused
 * @property {boolean} changingDirection
 * @property {string|null} activeEffect
 * @property {number|null} effectTimer
 * @property {string} currentSkin
 * @property {Object.<string, boolean>} unlockedSkins
 * @property {Object.<string, boolean>} achievements
 * @property {Object.<string, number>} achievementProgress
 * @property {number} soundVolume
 * @property {number} musicVolume
 * @property {boolean} soundEnabled
 * @property {boolean} musicEnabled
 */

export {};