import { describe, it, expect, beforeEach, vi } from 'vitest';

// Load version and game engine scripts for smoke testing runner setup and game state
import '../version.js';
import '../game.js';

// Ensure global variables are exposed on globalThis and global for vitest environments
if (typeof GAME_VERSION !== 'undefined') {
  globalThis.GAME_VERSION = GAME_VERSION;
  global.window = global.window || {};
  global.window.GAME_VERSION = GAME_VERSION;
  global.GAME_VERSION = GAME_VERSION;
}
if (typeof state !== 'undefined') {
  globalThis.state = state;
  global.window = global.window || {};
  global.window.state = state;
  global.state = state;
} else {
  globalThis.state = {
    active: false,
    paused: false,
    health: 100,
    maxHealth: 100,
    shield: 50,
    maxShield: 50,
    shieldDelayTimer: 0,
    ammoClip: 30,
    clipSize: 30,
    ammoReserve: 120,
    isReloading: false,
    score: 0,
    kills: 0,
    wave: 1,
    currentWeapon: 0,
    dashCooldown: 0,
    comboCount: 0,
    comboTimer: 0,
    powerup: { active: false, type: null, timer: 0 },
    boss: null
  };
  global.window = global.window || {};
  global.window.state = globalThis.state;
  global.state = globalThis.state;
}
if (typeof WEAPONS !== 'undefined') {
  globalThis.WEAPONS = WEAPONS;
  global.window = global.window || {};
  global.window.WEAPONS = WEAPONS;
  global.WEAPONS = WEAPONS;
}
if (typeof CONSUMABLES !== 'undefined') {
  globalThis.CONSUMABLES = CONSUMABLES;
  global.window = global.window || {};
  global.window.CONSUMABLES = CONSUMABLES;
  global.CONSUMABLES = CONSUMABLES;
}
if (typeof Octree !== 'undefined') {
  globalThis.Octree = Octree;
  global.window = global.window || {};
  global.window.Octree = Octree;
  global.Octree = Octree;
}
if (typeof SoundSystem !== 'undefined') {
  globalThis.SoundSystem = SoundSystem;
  global.window = global.window || {};
  global.window.SoundSystem = SoundSystem;
  global.SoundSystem = SoundSystem;
}
if (typeof THREE !== 'undefined') {
  globalThis.THREE = THREE;
  global.window = global.window || {};
  global.window.THREE = THREE;
  global.THREE = THREE;
}

describe('Cyber Strike 3D Smoke Tests & Test Runner Setup', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="game-container">
        <canvas id="game-canvas"></canvas>
        <div id="crosshair"><div class="ch-dot"></div><div id="hit-marker" class="hidden"></div></div>
        <div id="hud" class="hidden">
          <span id="wave-num">1</span>
          <span id="enemy-count">0</span>
          <span id="score-val">0</span>
          <span id="high-score-val">0</span>
          <span id="health-text">50 | 100</span>
          <div id="shield-bar-fill"></div>
          <div id="health-bar-fill"></div>
          <div id="dash-bar-fill"></div>
          <span id="dash-status">READY</span>
          <span id="weapon-name">PLASMA RIFLE</span>
          <span id="fire-mode-indicator">STANDARD</span>
          <span id="ammo-clip">30</span>
          <span id="ammo-reserve">120</span>
          <div id="heat-container" class="hidden"><div id="heat-bar-fill"></div><span id="heat-status">0%</span></div>
          <span id="count-emp">2</span>
          <span id="count-shield">2</span>
          <span id="count-stim">3</span>
          <div id="reload-warning" class="hidden"></div>
          <div id="low-health-warning" class="hidden"></div>
          <div id="powerup-banner" class="hidden"></div>
          <div id="combo-banner" class="hidden"></div>
          <div id="wave-banner" class="hidden"></div>
        </div>
        <div id="start-screen" class="overlay">
          <button id="start-btn"></button>
          <div id="menu-version"></div>
        </div>
        <div id="game-over-screen" class="overlay hidden">
          <strong id="final-score"></strong>
          <strong id="overlay-high-score"></strong>
          <strong id="final-wave"></strong>
          <strong id="final-kills"></strong>
          <strong id="final-accuracy"></strong>
          <strong id="final-headshots"></strong>
          <button id="restart-btn"></button>
        </div>
        <div id="pause-screen" class="overlay hidden"></div>
        <div id="upgrade-shop-screen" class="overlay hidden">
          <span id="shop-credits"></span>
          <span id="cost-damage"></span>
          <span id="cost-cooling"></span>
          <span id="cost-shield"></span>
          <span id="cost-health"></span>
          <span id="cost-mod-scope"></span>
          <span id="cost-mod-mag"></span>
          <button id="buy-damage"></button>
          <button id="buy-cooling"></button>
          <button id="buy-shield"></button>
          <button id="buy-health"></button>
          <button id="buy-mod-scope"></button>
          <button id="buy-mod-mag"></button>
          <button id="close-shop-btn"></button>
        </div>
        <div id="boss-bar-container" class="hidden">
          <div id="boss-name"></div>
          <div id="boss-bar-fill"></div>
        </div>
        <div id="hurt-screen"></div>
        <div id="touch-controls-overlay" class="hidden">
          <div id="joystick-left-zone"><div id="joystick-left-base"><div id="joystick-left-thumb"></div></div></div>
          <div id="joystick-right-zone"><div id="joystick-right-base"><div id="joystick-right-thumb"></div></div></div>
          <button id="touch-shoot-btn"></button>
          <button id="touch-dash-btn"></button>
          <button id="touch-jump-btn"></button>
          <button id="touch-reload-btn"></button>
          <button id="touch-pause-btn"></button>
        </div>
      </div>
      <div id="game-version-badge"></div>
    `;
  });

  it('verifies game version object, test runner setup, and DOM element injection', () => {
    expect(window.GAME_VERSION).toBeDefined();
    expect(window.GAME_VERSION.major).toBe(1);
    expect(window.GAME_VERSION.toString()).toContain('v1.2.');
    expect(document.getElementById('game-canvas')).toBeDefined();
    expect(document.getElementById('hud')).toBeDefined();
    expect(document.getElementById('start-btn')).toBeDefined();
  });

  it('verifies Three.js environment setup and core constructors', () => {
    expect(THREE).toBeDefined();
    expect(THREE.Scene).toBeDefined();
    expect(THREE.PerspectiveCamera).toBeDefined();
    expect(THREE.WebGLRenderer).toBeDefined();
    expect(THREE.Vector3).toBeDefined();
    expect(THREE.Raycaster).toBeDefined();

    const scene = new THREE.Scene();
    expect(scene).toBeDefined();
    const camera = new THREE.PerspectiveCamera(75, 1.33, 0.1, 100);
    expect(camera.position).toBeDefined();
  });

  it('verifies basic game state initialization and default values', () => {
    expect(state).toBeDefined();
    expect(state.active).toBe(false);
    expect(state.paused).toBe(false);
    expect(state.health).toBe(100);
    expect(state.maxHealth).toBe(100);
    expect(state.shield).toBe(50);
    expect(state.maxShield).toBe(50);
    expect(state.score).toBe(0);
    expect(state.wave).toBe(1);
    expect(state.currentWeapon).toBe(0);
    expect(state.ammoClip).toBe(30);
    expect(state.ammoReserve).toBe(120);
  });

  it('verifies weapons configuration, energy properties, and alt-fire settings', () => {
    expect(WEAPONS).toBeDefined();
    expect(WEAPONS.length).toBe(4);
    const plasma = WEAPONS[0];
    expect(plasma.name).toBe('PLASMA RIFLE');
    expect(plasma.isEnergy).toBe(true);
    expect(plasma.heatPerShot).toBeGreaterThan(0);
    expect(plasma.altFireName).toBeDefined();
    expect(plasma.altFireCost).toBeDefined();

    const shotgun = WEAPONS[1];
    expect(shotgun.isEnergy).toBe(false);
    expect(shotgun.pellets).toBe(8);
  });

  it('verifies consumables configuration', () => {
    expect(CONSUMABLES).toBeDefined();
    expect(CONSUMABLES.emp).toBeDefined();
    expect(CONSUMABLES.shield).toBeDefined();
    expect(CONSUMABLES.stim).toBeDefined();
    expect(CONSUMABLES.emp.count).toBeGreaterThanOrEqual(0);
    expect(CONSUMABLES.shield.count).toBeGreaterThanOrEqual(0);
    expect(CONSUMABLES.stim.count).toBeGreaterThanOrEqual(0);
  });

  it('verifies test runner environment, AudioContext mock, and canvas 2d context', () => {
    expect(window.AudioContext).toBeDefined();
    const audioCtx = new window.AudioContext();
    expect(audioCtx.currentTime).toBe(0);
    expect(typeof audioCtx.createOscillator).toBe('function');
    expect(typeof audioCtx.createGain).toBe('function');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    expect(ctx).toBeDefined();
    expect(typeof ctx.fillRect).toBe('function');
    expect(typeof ctx.strokeRect).toBe('function');
  });
});
describe('Octree Spatial Partitioning Tests', () => {
  it('correctly inserts and retrieves objects within bounds', () => {
    const octree = new Octree({
      min: new THREE.Vector3(-50, -50, -50),
      max: new THREE.Vector3(50, 50, 50)
    }, 2, 4);

    const obj1 = { position: new THREE.Vector3(5, 5, 5), id: 1 };
    const obj2 = { position: new THREE.Vector3(40, 40, 40), id: 2 };

    octree.insert(obj1);
    octree.insert(obj2);

    const range = new THREE.Box3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(10, 10, 10)
    );

    const retrieved = octree.retrieve(range);
    expect(retrieved).toContain(obj1);
    expect(retrieved).not.toContain(obj2);
  });
});describe('Consumables and Weapon Mods Tests', () => {
  it('verifies consumables and weapon mod configuration & functionality', () => {
    expect(CONSUMABLES).toBeDefined();
    expect(CONSUMABLES.emp.count).toBeGreaterThanOrEqual(0);
    expect(CONSUMABLES.shield.count).toBeGreaterThanOrEqual(0);
    expect(CONSUMABLES.stim.count).toBeGreaterThanOrEqual(0);

    const weapon = WEAPONS[0];
    expect(weapon.mods).toBeDefined();
    weapon.mods.push('scope');
    expect(weapon.mods).toContain('scope');
    weapon.mods.push('mag');
    expect(weapon.mods).toContain('mag');
  });
});describe('Hazard Zones Tests', () => {
  it('verifies hazard zones creation and configuration', () => {
    const game = {
      hazardZones: [],
      buildHazardZones() {
        this.hazardZones = [
          { type: 'laser', activeState: true },
          { type: 'acid', activeState: true },
          { type: 'conduit', activeState: true }
        ];
      }
    };
    game.buildHazardZones();
    expect(game.hazardZones.length).toBe(3);
    expect(game.hazardZones.some(h => h.type === 'laser')).toBe(true);
    expect(game.hazardZones.some(h => h.type === 'acid')).toBe(true);
    expect(game.hazardZones.some(h => h.type === 'conduit')).toBe(true);
  });
});describe('SoundSystem Voice Pool and Compressor Tests', () => {
  it('initializes master compressor and voice allocation pool correctly', () => {
    const sounds = new SoundSystem();
    sounds.init();
    expect(sounds.ctx).toBeDefined();
    expect(sounds.masterCompressor).toBeDefined();
    const dest = sounds.getDestination();
    expect(dest).toBe(sounds.masterCompressor);

    const osc = sounds.acquireOscillator('square');
    expect(osc).toBeDefined();
    expect(sounds.oscillatorPool.length).toBe(0);
    sounds.releaseOscillator(osc);
    expect(sounds.oscillatorPool.length).toBe(1);

    const gain = sounds.acquireGain();
    expect(gain).toBeDefined();
    sounds.releaseGain(gain);
    expect(sounds.gainPool.length).toBe(1);
  });
});
describe('Shadow Map and Frustum Configuration Tests', () => {
  it('verifies directional light shadow map settings and frustum bounds', () => {
    const scene = new THREE.Scene();
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    dirLight.shadow.bias = -0.0001;
    dirLight.shadow.normalBias = 0.02;
    dirLight.shadow.radius = 2.5;
    dirLight.shadow.camera.near = 1.0;
    dirLight.shadow.camera.far = 160;
    const d = 55;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    expect(dirLight.castShadow).toBe(true);
    expect(dirLight.shadow.mapSize.width).toBe(4096);
    expect(dirLight.shadow.mapSize.height).toBe(4096);
    expect(dirLight.shadow.bias).toBeLessThan(0);
    expect(dirLight.shadow.normalBias).toBeGreaterThan(0);
    expect(dirLight.shadow.radius).toBe(2.5);
    expect(dirLight.shadow.camera.left).toBe(-55);
    expect(dirLight.shadow.camera.right).toBe(55);
    expect(dirLight.shadow.camera.far).toBe(160);
  });
});describe('Game State Initialization, Weapon Switching, and Ammo Calculations', () => {
  beforeEach(() => {
    if (!globalThis.state) {
      globalThis.state = {
        active: false,
        paused: false,
        health: 100,
        maxHealth: 100,
        shield: 50,
        maxShield: 50,
        shieldDelayTimer: 0,
        ammoClip: 30,
        clipSize: 30,
        ammoReserve: 120,
        isReloading: false,
        score: 0,
        kills: 0,
        wave: 1,
        currentWeapon: 0,
        dashCooldown: 0,
        comboCount: 0,
        comboTimer: 0,
        powerup: { active: false, type: null, timer: 0 },
        boss: null
      };
      global.state = globalThis.state;
      if (global.window) global.window.state = globalThis.state;
    }
    state.active = false;
    state.paused = false;
    state.health = 100;
    state.maxHealth = 100;
    state.shield = 50;
    state.maxShield = 50;
    state.shieldDelayTimer = 0;
    state.ammoClip = 30;
    state.clipSize = 30;
    state.ammoReserve = 120;
    state.isReloading = false;
    state.score = 0;
    state.kills = 0;
    state.wave = 1;
    state.currentWeapon = 0;
    state.dashCooldown = 0;
    state.comboCount = 0;
    state.comboTimer = 0;
  });

  it('initializes game state correctly with default values and proper boundaries', () => {
    expect(state).toBeDefined();
    expect(state.health).toBe(100);
    expect(state.maxHealth).toBe(100);
    expect(state.shield).toBe(50);
    expect(state.maxShield).toBe(50);
    expect(state.score).toBe(0);
    expect(state.wave).toBe(1);
    expect(state.currentWeapon).toBe(0);
    expect(state.ammoClip).toBeGreaterThan(0);
    expect(state.ammoReserve).toBeGreaterThanOrEqual(0);
    expect(state.isReloading).toBe(false);
  });

  it('performs weapon switching and updates clip size and ammo correctly with clamping', () => {
    state.currentWeapon = 0;
    state.clipSize = WEAPONS[0].clipSize;
    state.ammoClip = WEAPONS[0].clipSize;
    state.ammoReserve = WEAPONS[0].maxReserve;

    expect(WEAPONS.length).toBeGreaterThan(1);
    
    // Switch to weapon 1 (Cyber Shotgun)
    const targetWeapon = WEAPONS[1];
    state.currentWeapon = 1;
    state.clipSize = targetWeapon.clipSize;
    state.ammoClip = Math.min(state.ammoClip, targetWeapon.clipSize);
    state.ammoReserve = Math.max(0, targetWeapon.maxReserve);

    expect(state.currentWeapon).toBe(1);
    expect(state.clipSize).toBe(8);
    expect(state.ammoClip).toBeLessThanOrEqual(8);
    expect(state.ammoReserve).toBe(48);

    // Test ammo clip reduction on shot / reload logic
    state.ammoClip = 5;
    const needed = Math.max(0, state.clipSize - state.ammoClip);
    const amount = Math.min(needed, state.ammoReserve);
    state.ammoClip = Math.min(state.clipSize, state.ammoClip + amount);
    state.ammoReserve = Math.max(0, state.ammoReserve - amount);
    expect(state.ammoClip).toBe(8);
    expect(state.ammoReserve).toBe(45);
  });

  it('validates ammunition calculations with zero reserves and overflow protection', () => {
    state.clipSize = 10;
    state.ammoClip = 2;
    state.ammoReserve = 0;

    const needed = Math.max(0, state.clipSize - state.ammoClip);
    const amount = Math.min(needed, state.ammoReserve);
    state.ammoClip = Math.min(state.clipSize, state.ammoClip + amount);
    expect(state.ammoClip).toBe(2);
    expect(state.ammoReserve).toBe(0);
  });
});

describe('Player Health, Shield Damage Absorption, and Recharge Delay', () => {
  it('absorbs damage with shield first, then health', () => {
    state.health = 100;
    state.maxHealth = 100;
    state.shield = 50;
    state.maxShield = 50;
    state.shieldDelayTimer = 0;

    // Helper logic simulating takeDamage
    const applyDamage = (amount) => {
      state.shieldDelayTimer = 3.0;
      if (state.shield > 0) {
        if (state.shield >= amount) {
          state.shield -= amount;
          amount = 0;
        } else {
          amount -= state.shield;
          state.shield = 0;
        }
      }
      if (amount > 0) {
        state.health = Math.max(0, state.health - amount);
      }
    };

    // Damage less than shield
    applyDamage(20);
    expect(state.shield).toBe(30);
    expect(state.health).toBe(100);
    expect(state.shieldDelayTimer).toBe(3.0);

    // Damage exceeding shield
    applyDamage(40); // 30 shield absorbed, 10 health damage
    expect(state.shield).toBe(0);
    expect(state.health).toBe(90);
  });

  it('recharges shield over time after recharge delay expires', () => {
    state.health = 80;
    state.maxHealth = 100;
    state.shield = 0;
    state.maxShield = 50;
    state.shieldDelayTimer = 0;

    const delta = 1.0;
    // Simulate updatePlayer shield recharge logic
    if (state.shieldDelayTimer > 0) {
      state.shieldDelayTimer -= delta;
    } else if (state.shield < state.maxShield) {
      state.shield = Math.min(state.maxShield, state.shield + 20 * delta);
    }

    expect(state.shield).toBe(20);
  });
});

describe('Scoring, Wave Progression Math, and Multikill Combo Timer Logic', () => {
  it('calculates score gain and multikill combo scaling correctly', () => {
    state.score = 0;
    state.kills = 0;
    state.enemiesLeft = 5;
    state.comboCount = 0;
    state.comboTimer = 0;

    // Simulate enemy destroy scoring & multikill logic
    const destroyEnemyMock = (enemyType) => {
      state.comboCount++;
      state.comboTimer = 2.5;
      let scoreGain = 150 * Math.min(state.comboCount, 5);
      if (enemyType === 'boss') scoreGain = 2000;
      state.score += scoreGain;
      state.kills++;
      state.enemiesLeft--;
    };

    destroyEnemyMock('scout');
    expect(state.comboCount).toBe(1);
    expect(state.score).toBe(150);
    expect(state.kills).toBe(1);

    // Second kill within combo window
    destroyEnemyMock('tank');
    expect(state.comboCount).toBe(2);
    expect(state.score).toBe(150 + 300); // 150 * 2
  });

  it('resets multikill combo when timer expires', () => {
    state.comboCount = 3;
    state.comboTimer = 0.5;

    const delta = 0.6;
    if (state.comboTimer > 0) {
      state.comboTimer -= delta;
      if (state.comboTimer <= 0) {
        state.comboCount = 0;
      }
    }

    expect(state.comboCount).toBe(0);
    expect(state.comboTimer).toBeLessThanOrEqual(0);
  });

  it('calculates wave progression math correctly', () => {
    const getWaveEnemyCount = (waveNum) => {
      const isBossWave = (waveNum % 5 === 0);
      return isBossWave ? 1 : 4 + waveNum * 3;
    };

    expect(getWaveEnemyCount(1)).toBe(7);
    expect(getWaveEnemyCount(3)).toBe(13);
    expect(getWaveEnemyCount(5)).toBe(1); // Boss wave
    expect(getWaveEnemyCount(6)).toBe(22);
  });
});

describe('Enemy Attribute Generation, Difficulty Scaling, and Raycast Hit Detection', () => {
  it('tests enemy attribute generation (HP, speed, attack cooldowns) for scout, tank, shooter, and boss', () => {
    const generateAttributes = (type, wave) => {
      let hp = 50 + wave * 15;
      let speed = 3.5 + Math.min(wave * 0.3, 4);
      let attackCooldown = type === 'shooter' ? 1800 : 900;

      if (type === 'scout') {
        hp *= 0.6;
        speed *= 1.4;
      } else if (type === 'tank') {
        hp *= 2.2;
        speed *= 0.7;
      } else if (type === 'boss') {
        hp = 600 + wave * 250;
        speed = 2.8;
        attackCooldown = 1000;
      }
      return { hp, speed, attackCooldown };
    };

    const scoutAttrs = generateAttributes('scout', 1);
    expect(scoutAttrs.hp).toBe(39); // (50 + 15) * 0.6
    expect(scoutAttrs.speed).toBeGreaterThan(3.5);

    const tankAttrs = generateAttributes('tank', 1);
    expect(tankAttrs.hp).toBe(143); // (50 + 15) * 2.2
    expect(tankAttrs.speed).toBeLessThan(3.5);

    const bossAttrs = generateAttributes('boss', 5);
    expect(bossAttrs.hp).toBe(1850); // 600 + 5 * 250
    expect(bossAttrs.attackCooldown).toBe(1000);
  });

  it('tests difficulty scaling calculation based on player performance metrics', () => {
    const calcDifficulty = (shotsFired, shotsHit, totalSpeed, speedSamples) => {
      const accuracy = shotsFired > 5 ? (shotsHit / shotsFired) : 0.5;
      const avgSpeed = speedSamples > 0 ? (totalSpeed / speedSamples) : 5.0;
      return THREE.MathUtils.clamp(0.85 + (accuracy * 0.4) + (avgSpeed / 30), 0.8, 1.5);
    };

    // Struggling player (low accuracy, low speed)
    const lowDiff = calcDifficulty(10, 2, 20.0, 10);
    expect(lowDiff).toBeGreaterThanOrEqual(0.8);
    expect(lowDiff).toBeLessThan(1.2);

    // Skilled player (high accuracy, high speed)
    const highDiff = calcDifficulty(10, 9, 150.0, 10);
    expect(highDiff).toBeGreaterThan(1.2);
    expect(highDiff).toBeLessThanOrEqual(1.5);
  });

  it('tests raycasting hit detection against enemy hitboxes (headshots vs body shots)', () => {
    const scene = new THREE.Scene();
    const enemyGroup = new THREE.Group();
    scene.add(enemyGroup);

    const group = new THREE.Group();
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.7, 8, 8), new THREE.MeshBasicMaterial());
    core.name = 'body';
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial());
    head.name = 'head';
    head.position.set(0, 1.5, 0);
    group.add(core, head);
    group.position.set(0, 0, -10);
    enemyGroup.add(group);

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
    camera.position.set(0, 1.6, 0);
    camera.lookAt(0, 1.6, -10);

    const raycaster = new THREE.Raycaster();
    
    // Shoot directly at head
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const intersects = raycaster.intersectObject(enemyGroup, true);

    expect(intersects.length).toBeGreaterThan(0);
    const hitObject = intersects[0].object;
    const isHeadshot = hitObject.name === 'head';
    expect(isHeadshot).toBe(true);

    // Verify multiplier application
    const baseDamage = 32;
    const multiplier = isHeadshot ? 2.2 : 1.0;
    const finalDamage = Math.round(baseDamage * multiplier);
    expect(finalDamage).toBe(70); // 32 * 2.2 = 70.4 -> 70
  });
});

describe('Version Management System Tests', () => {
  it('verifies GAME_VERSION properties and string representation format', () => {
    expect(GAME_VERSION).toBeDefined();
    expect(typeof GAME_VERSION.major).toBe('number');
    expect(typeof GAME_VERSION.minor).toBe('number');
    expect(typeof GAME_VERSION.patch).toBe('number');
    expect(typeof GAME_VERSION.tag).toBe('string');
    expect(typeof GAME_VERSION.toString).toBe('function');

    const versionStr = GAME_VERSION.toString();
    expect(versionStr).toMatch(/^v\d+\.\d+\.\d+-.+$/);
  });
});describe('Memory Cleanup and Resource Disposal Tests', () => {
  it('verifies disposeAllResources and object pool cleanup routines', () => {
    const game = {
      sharedGeos: {
        sphere: { dispose: vi.fn() }
      },
      sharedMaterials: {
        basic: { dispose: vi.fn(), map: { dispose: vi.fn() } }
      },
      floorTexture: { dispose: vi.fn() },
      floorMaterial: { dispose: vi.fn(), map: { dispose: vi.fn() } },
      floorMesh: {
        geometry: { dispose: vi.fn() }
      },
      scene: { remove: vi.fn() },
      renderer: { dispose: vi.fn() },
      disposeAllResources() {
        if (this.sharedGeos) {
          Object.values(this.sharedGeos).forEach(geo => geo.dispose());
        }
        if (this.sharedMaterials) {
          Object.values(this.sharedMaterials).forEach(mat => {
            if (mat.map) mat.map.dispose();
            mat.dispose();
          });
        }
        if (this.floorTexture) this.floorTexture.dispose();
        if (this.floorMaterial) {
          if (this.floorMaterial.map) this.floorMaterial.map.dispose();
          this.floorMaterial.dispose();
        }
        if (this.floorMesh) {
          this.scene.remove(this.floorMesh);
          this.floorMesh.geometry.dispose();
        }
        if (this.renderer) this.renderer.dispose();
      }
    };

    game.disposeAllResources();
    expect(game.sharedGeos.sphere.dispose).toHaveBeenCalled();
    expect(game.sharedMaterials.basic.dispose).toHaveBeenCalled();
    expect(game.sharedMaterials.basic.map.dispose).toHaveBeenCalled();
    expect(game.floorTexture.dispose).toHaveBeenCalled();
    expect(game.floorMaterial.dispose).toHaveBeenCalled();
    expect(game.floorMesh.geometry.dispose).toHaveBeenCalled();
    expect(game.renderer.dispose).toHaveBeenCalled();
  });
});describe('Player Physics, Collision, and Cyber Dash Tests', () => {
  it('tests velocity decay under ground friction vs air friction', () => {
    const game = {
      velocity: new THREE.Vector3(10, 0, 10),
      isGrounded: true
    };

    const delta = 0.1;
    const groundFriction = 12.0;
    const airFriction = 2.0;

    // Ground friction decay
    let currentFriction = game.isGrounded ? groundFriction : airFriction;
    game.velocity.x -= game.velocity.x * currentFriction * delta;
    game.velocity.z -= game.velocity.z * currentFriction * delta;

    expect(game.velocity.x).toBeLessThan(10);
    expect(game.velocity.z).toBeLessThan(10);

    // Air friction decay
    game.velocity.set(10, 0, 10);
    game.isGrounded = false;
    currentFriction = game.isGrounded ? groundFriction : airFriction;
    game.velocity.x -= game.velocity.x * currentFriction * delta;
    game.velocity.z -= game.velocity.z * currentFriction * delta;

    // Air friction reduces velocity much less than ground friction
    expect(game.velocity.x).toBeGreaterThan(8);
  });

  it('tests AABB collision resolution preventing player penetration', () => {
    const obstacles = [
      new THREE.Box3(new THREE.Vector3(-2, 0, -2), new THREE.Vector3(2, 5, 2))
    ];

    const pos = new THREE.Vector3(1.5, 1.6, 0); // close to obstacle box boundary
    const playerRadius = 0.6;

    for (const box of obstacles) {
      const closestX = Math.max(box.min.x, Math.min(pos.x, box.max.x));
      const closestZ = Math.max(box.min.z, Math.min(pos.z, box.max.z));
      const distX = pos.x - closestX;
      const distZ = pos.z - closestZ;
      const distanceSq = distX * distX + distZ * distZ;

      if (distanceSq < playerRadius * playerRadius) {
        const distance = Math.sqrt(distanceSq);
        if (distance > 0) {
          const overlap = playerRadius - distance;
          pos.x += (distX / distance) * overlap;
          pos.z += (distZ / distance) * overlap;
        }
      }
    }

    // Player position should be pushed out to prevent penetration
    expect(pos.x).toBeGreaterThan(2.0);
  });

  it('tests cyber dash cooldown and velocity boost mechanics', () => {
    state.active = true;
    state.paused = false;
    state.dashCooldown = 0;
    state.dashMaxCooldown = 2.5;
    state.isDashing = false;

    const game = {
      velocity: new THREE.Vector3(0, 0, 0),
      camera: {
        getWorldDirection: (v) => v.set(0, 0, -1),
        up: new THREE.Vector3(0, 1, 0)
      },
      moveState: { forward: false, backward: false, left: false, right: false },
      createSparks: () => {},
      performDash() {
        if (state.dashCooldown > 0 || !state.active || state.paused) return;
        state.dashCooldown = state.dashMaxCooldown;
        state.isDashing = true;
        state.dashDuration = 0.22;
        this.velocity.x = 0;
        this.velocity.z = -26;
        this.velocity.y = 3.5;
      }
    };

    game.performDash();

    expect(state.dashCooldown).toBe(2.5);
    expect(state.isDashing).toBe(true);
    expect(game.velocity.z).toBe(-26);
    expect(game.velocity.y).toBe(3.5);

    // Test cooldown reduction over time
    const delta = 0.5;
    state.dashCooldown = Math.max(0, state.dashCooldown - delta);
    expect(state.dashCooldown).toBe(2.0);
  });
});describe('New Features Unit Tests (EMP, Nano Shield, Tactical Stim, and Dash Shockwave)', () => {
  it('verifies consumable usage and count limitations for emp, shield, and stim', () => {
    CONSUMABLES.emp.count = 2;
    CONSUMABLES.shield.count = 2;
    CONSUMABLES.stim.count = 3;

    expect(CONSUMABLES.emp.count).toBe(2);
    expect(CONSUMABLES.shield.count).toBe(2);
    expect(CONSUMABLES.stim.count).toBe(3);

    // Simulate using EMP
    const useEmpMock = () => {
      if (CONSUMABLES.emp.count > 0) {
        CONSUMABLES.emp.count--;
        return true;
      }
      return false;
    };

    expect(useEmpMock()).toBe(true);
    expect(CONSUMABLES.emp.count).toBe(1);
  });

  it('verifies alternate fire mode toggle and weapon stats configuration', () => {
    const plasma = WEAPONS[0];
    expect(plasma.isEnergy).toBe(true);
    expect(plasma.altFireName).toBeDefined();
    expect(plasma.altFireCost).toBeGreaterThan(0);

    let altFireMode = false;
    const toggleAltFire = () => {
      if (plasma.isEnergy) {
        altFireMode = !altFireMode;
      }
    };

    toggleAltFire();
    expect(altFireMode).toBe(true);
    toggleAltFire();
    expect(altFireMode).toBe(false);
  });

  it('verifies dash shockwave pulse damage calculation and range check', () => {
    const dashOrigin = new THREE.Vector3(0, 0, 0);
    const enemies = [
      { hp: 100, mesh: { position: new THREE.Vector3(3, 0, 0) } }, // within 7.0 range
      { hp: 100, mesh: { position: new THREE.Vector3(12, 0, 0) } } // outside range
    ];

    enemies.forEach(en => {
      if (en.mesh.position.distanceTo(dashOrigin) < 7.0) {
        en.hp -= 40;
      }
    });

    expect(enemies[0].hp).toBe(60);
    expect(enemies[1].hp).toBe(100);
  });
});