import { describe, it, expect, beforeEach } from 'vitest';

// Load version script
import '../version.js';

describe('Cyber Strike 3D Smoke Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="game-version-badge"></div>
      <div id="menu-version"></div>
      <canvas id="game-canvas"></canvas>
    `;
  });

  it('verifies game version object and DOM injection', () => {
    expect(window.GAME_VERSION).toBeDefined();
    expect(window.GAME_VERSION.major).toBe(1);
    expect(window.GAME_VERSION.toString()).toContain('v1.2.4');
  });

  it('verifies test runner environment and global mocks', () => {
    expect(window.AudioContext).toBeDefined();
    const audioCtx = new window.AudioContext();
    expect(audioCtx.currentTime).toBe(0);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    expect(ctx).toBeDefined();
    expect(typeof ctx.fillRect).toBe('function');
  });
});
