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
 * @property {'normal'|'bonus'|'slow'|'speed'} type
 */

/**
 * @typedef {Object} GameState
 * @property {Point[]} snake
 * @property {FoodItem} food
 * @property {Point} direction
 * @property {Point} nextDirection
 * @property {number} score
 * @property {number} highScore
 * @property {boolean} isGameOver
 * @property {boolean} isPaused
 * @property {boolean} changingDirection
 * @property {string|null} activeEffect
 * @property {number|null} effectTimer
 */

export {};