// Global browser API mocks for Three.js, SoundSystem, and DOM
import { vi } from 'vitest';

// AudioContext mock
class MockAudioContext {
  constructor() {
    this.state = 'running';
    this.currentTime = 0;
    this.sampleRate = 44100;
    this.destination = {};
  }
  resume() { return Promise.resolve(); }
  createOscillator() {
    return {
      type: 'sine',
      frequency: { value: 440, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} },
      connect() {},
      start() {},
      stop() {},
      disconnect() {}
    };
  }
  createGain() {
    return {
      gain: { value: 1, setValueAtTime() {}, exponentialRampToValueAtTime() {} },
      connect() {},
      disconnect() {}
    };
  }
  createBuffer(channels, length, sampleRate) {
    return {
      getChannelData() { return new Float32Array(length); }
    };
  }
  createBufferSource() {
    return {
      buffer: null,
      connect() {},
      start() {},
      stop() {},
      disconnect() {}
    };
  }
  createBiquadFilter() {
    return {
      type: 'bandpass',
      frequency: { value: 1000 },
      Q: { value: 1 },
      connect() {}
    };
  }
}

global.window = global.window || {};
global.window.AudioContext = MockAudioContext;
global.window.webkitAudioContext = MockAudioContext;

// Mock / stub Three.js globals for test environment
import * as THREE from 'three';
global.window.THREE = THREE;
global.THREE = THREE;
globalThis.THREE = THREE;

// Import version and game engine to populate global variables (state, WEAPONS, CONSUMABLES, Octree, SoundSystem, etc.)
import '../version.js';
import '../game.js';

// Ensure core game globals are exposed on globalThis / window / global for test suites
if (typeof GAME_VERSION !== 'undefined') {
  globalThis.GAME_VERSION = GAME_VERSION;
  global.window.GAME_VERSION = GAME_VERSION;
  global.GAME_VERSION = GAME_VERSION;
}
if (typeof state !== 'undefined') {
  globalThis.state = state;
  global.window.state = state;
  global.state = state;
}
if (typeof WEAPONS !== 'undefined') {
  globalThis.WEAPONS = WEAPONS;
  global.window.WEAPONS = WEAPONS;
  global.WEAPONS = WEAPONS;
}
if (typeof CONSUMABLES !== 'undefined') {
  globalThis.CONSUMABLES = CONSUMABLES;
  global.window.CONSUMABLES = CONSUMABLES;
  global.CONSUMABLES = CONSUMABLES;
}
if (typeof Octree !== 'undefined') {
  globalThis.Octree = Octree;
  global.window.Octree = Octree;
  global.Octree = Octree;
}
if (typeof SoundSystem !== 'undefined') {
  globalThis.SoundSystem = SoundSystem;
  global.window.SoundSystem = SoundSystem;
  global.SoundSystem = SoundSystem;
}

// HTMLCanvasElement getContext mock
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function(type) {
    if (type === '2d') {
      return {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        fillRect() {},
        strokeRect() {},
        clearRect() {},
        beginPath() {},
        moveTo() {},
        lineTo() {},
        stroke() {},
        arc() {},
        fill() {}
      };
    }
    return {};
  };
}

// requestAnimationFrame / cancelAnimationFrame mocks
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// localStorage mock
const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key) { return store[key] || null; },
    setItem(key, value) { store[key] = value.toString(); },
    clear() { store = {}; },
    removeItem(key) { delete store[key]; }
  };
})();
global.localStorage = global.localStorage || localStorageMock;
global.window = global.window || {};
global.window.localStorage = global.window.localStorage || localStorageMock;
