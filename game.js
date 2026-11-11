/**
 * CYBER STRIKE 3D - FPS Game
 * Engine: Three.js + Web Audio API Synthesis
 */

// Global audio synthesizer using Web Audio API
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.activeVoices = 0;
    this.maxConcurrentVoices = 16;
    this.oscillatorPool = [];
    this.gainPool = [];
    this.bgmTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  acquireOscillator(type = 'sine') {
    if (this.oscillatorPool.length > 0) {
      const osc = this.oscillatorPool.pop();
      osc.type = type;
      return osc;
    }
    return this.ctx.createOscillator();
  }

  releaseOscillator(osc) {
    try {
      osc.disconnect();
      if (this.oscillatorPool.length < 32) {
        this.oscillatorPool.push(osc);
      }
    } catch (e) {}
  }

  acquireGain() {
    if (this.gainPool.length > 0) {
      return this.gainPool.pop();
    }
    return this.ctx.createGain();
  }

  releaseGain(gain) {
    try {
      gain.disconnect();
      if (this.gainPool.length < 32) {
        this.gainPool.push(gain);
      }
    } catch (e) {}
  }

  playSynthSound(configFn, duration) {
    if (!this.ctx) return;
    if (this.activeVoices >= this.maxConcurrentVoices) return;

    this.activeVoices++;
    const now = this.ctx.currentTime;

    try {
      configFn(now);
    } catch (e) {
      this.activeVoices = Math.max(0, this.activeVoices - 1);
      return;
    }

    setTimeout(() => {
      this.activeVoices = Math.max(0, this.activeVoices - 1);
    }, duration * 1000 + 50);
  }

  playGunshot() {


    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Noise buffer for blast
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1200;
    noiseFilter.Q.value = 1.5;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    // Low punch synth
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);

    oscGain.gain.setValueAtTime(0.5, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    whiteNoise.start(now);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playHit() {
    this.playSynthSound(now => {
      const osc = this.acquireOscillator('sine');
      const gain = this.acquireGain();
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);

      setTimeout(() => {
        this.releaseOscillator(osc);
        this.releaseGain(gain);
      }, 100);
    }, 0.08);
  }

  playEnemyDeath() {
    this.playSynthSound(now => {
      const osc = this.acquireOscillator('sawtooth');
      const gain = this.acquireGain();
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);

      setTimeout(() => {
        this.releaseOscillator(osc);
        this.releaseGain(gain);
      }, 300);
    }, 0.25);
  }

  playPlayerHurt() {
    this.playSynthSound(now => {
      const osc = this.acquireOscillator('triangle');
      const gain = this.acquireGain();
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);

      setTimeout(() => {
        this.releaseOscillator(osc);
        this.releaseGain(gain);
      }, 250);
    }, 0.2);
  }

  playReload() {
    this.playSynthSound(now => {
      const osc = this.acquireOscillator('sine');
      const gain = this.acquireGain();
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.15);
      osc.frequency.linearRampToValueAtTime(500, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);

      setTimeout(() => {
        this.releaseOscillator(osc);
        this.releaseGain(gain);
      }, 400);
    }, 0.35);
  }

  playJump() {
    this.playSynthSound(now => {
      const osc = this.acquireOscillator('sine');
      const gain = this.acquireGain();
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);

      setTimeout(() => {
        this.releaseOscillator(osc);
        this.releaseGain(gain);
      }, 150);
    }, 0.12);
  }

  playPickup() {
    this.playSynthSound(now => {
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, index) => {
        const osc = this.acquireOscillator('sine');
        const gain = this.acquireGain();
        osc.frequency.value = freq;
        const startTime = now + index * 0.06;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.12);

        setTimeout(() => {
          this.releaseOscillator(osc);
          this.releaseGain(gain);
        }, (index * 0.06 + 0.15) * 1000);
      });
    }, 0.3);
  }

  playShotgun() {
    this.playSynthSound(now => {
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = this.acquireGain();
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      noise.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);

      setTimeout(() => {
        try { noise.disconnect(); } catch (e) {}
        this.releaseGain(gain);
      }, 300);
    }, 0.25);
  }

  playRailgun() {
    this.playSynthSound(now => {
      const osc = this.acquireOscillator('sawtooth');
      const gain = this.acquireGain();
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);

      setTimeout(() => {
        this.releaseOscillator(osc);
        this.releaseGain(gain);
      }, 450);
    }, 0.4);
  }

  playLaser() {
    this.playSynthSound(now => {
      const osc = this.acquireOscillator('sine');
      const gain = this.acquireGain();
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);

      setTimeout(() => {
        this.releaseOscillator(osc);
        this.releaseGain(gain);
      }, 150);
    }, 0.1);
  }

  playPulseSMG() {
    this.playSynthSound(now => {
      const osc = this.acquireOscillator('square');
      const gain = this.acquireGain();
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.05);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);

      setTimeout(() => {
        this.releaseOscillator(osc);
        this.releaseGain(gain);
      }, 100);
    }, 0.05);
  }

  playDash() {
    this.playSynthSound(now => {
      const osc = this.acquireOscillator('sawtooth');
      const gain = this.acquireGain();
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);

      setTimeout(() => {
        this.releaseOscillator(osc);
        this.releaseGain(gain);
      }, 200);
    }, 0.15);
  }

  playPowerup() {
    this.playSynthSound(now => {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = this.acquireOscillator('sine');
        const gain = this.acquireGain();
        osc.frequency.value = freq;
        const startTime = now + idx * 0.05;
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.15);

        setTimeout(() => {
          this.releaseOscillator(osc);
          this.releaseGain(gain);
        }, (idx * 0.05 + 0.2) * 1000);
      });
    }, 0.35);
  }

  playBossSpawn() {
    this.playSynthSound(now => {
      const osc = this.acquireOscillator('sawtooth');
      const gain = this.acquireGain();
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.6);
      osc.frequency.exponentialRampToValueAtTime(40, now + 1.2);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);

      setTimeout(() => {
        this.releaseOscillator(osc);
        this.releaseGain(gain);
      }, 1300);
    }, 1.2);
  }

  playKill() {
    this.playSynthSound(now => {
      const notes = [587.33, 880];
      notes.forEach((freq, idx) => {
        const osc = this.acquireOscillator('triangle');
        const gain = this.acquireGain();
        osc.frequency.value = freq;
        const startTime = now + idx * 0.05;
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.1);

        setTimeout(() => {
          this.releaseOscillator(osc);
          this.releaseGain(gain);
        }, (idx * 0.05 + 0.15) * 1000);
      });
    }, 0.2);
  }

  playWeaponSwitch() {
    this.playSynthSound(now => {
      const osc = this.acquireOscillator('square');
      const gain = this.acquireGain();
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);

      setTimeout(() => {
        this.releaseOscillator(osc);
        this.releaseGain(gain);
      }, 100);
    }, 0.05);
  }

  playLanding() {
    this.playSynthSound(now => {
      const osc = this.acquireOscillator('sine');
      const gain = this.acquireGain();
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);

      setTimeout(() => {
        this.releaseOscillator(osc);
        this.releaseGain(gain);
      }, 150);
    }, 0.1);
  }

  startBGM() {
    if (this.bgmTimer) return;
    let step = 0;
    this.bgmTimer = setInterval(() => {
      const toggle = document.getElementById('bgm-toggle');
      if (!toggle || !toggle.checked || !state.active || state.paused || !this.ctx) return;
      const now = this.ctx.currentTime;
      if (step % 4 === 0) {
        // Kick synth
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      }
      if (step % 2 === 1) {
        // Cyber synth bass note
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const freq = [110, 123.47, 98, 130.81][Math.floor(step / 4) % 4];
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      }
      step = (step + 1) % 16;
    }, 130);
  }
}

const sounds = new SoundSystem();

const WEAPONS = [
  {
    name: 'PLASMA RIFLE',
    clipSize: 30,
    maxReserve: 180,
    fireRate: 110,
    damage: 32,
    pellets: 1,
    spread: 0.02,
    recoilZ: 0.1,
    recoilRot: 0.12,
    color: 0x00f0ff
  },
  {
    name: 'CYBER SHOTGUN',
    clipSize: 8,
    maxReserve: 48,
    fireRate: 750,
    damage: 22,
    pellets: 8,
    spread: 0.09,
    recoilZ: 0.3,
    recoilRot: 0.35,
    color: 0xffa000
  },
  {
    name: 'RAIL CANNON',
    clipSize: 4,
    maxReserve: 24,
    fireRate: 1100,
    damage: 180,
    pellets: 1,
    spread: 0.001,
    recoilZ: 0.45,
    recoilRot: 0.5,
    color: 0xff0055
  },
  {
    name: 'PULSE SMG',
    clipSize: 45,
    maxReserve: 270,
    fireRate: 65,
    damage: 18,
    pellets: 1,
    spread: 0.035,
    recoilZ: 0.06,
    recoilRot: 0.07,
    color: 0x33ff00
  }
];

// Game State Definition
const state = {
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
  highScore: parseInt(localStorage.getItem('cyber_strike_highscore') || '0', 10),
  kills: 0,
  wave: 1,
  enemiesLeft: 0,
  currentWeapon: 0,
  isAiming: false,
  dashCooldown: 0,
  dashMaxCooldown: 2.5,
  isDashing: false,
  dashDuration: 0,
  comboCount: 0,
  comboTimer: 0,
  powerup: { active: false, type: null, timer: 0 },
  boss: null
};

// Main Game Engine Class
class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.initThree();
    this.initControls();
    this.buildEnvironment();
    this.buildWeapon();
    this.setupListeners();

    this.enemies = [];
    this.pickups = [];
    this.particles = [];
    this.particlePool = [];
    this.maxPoolSize = 150;

    this.damagePopups = [];
    this.damagePopupPool = [];
    this.maxPopupPoolSize = 40;

    // Object Pooling for Tracers, Projectiles, and Debris
    this.tracerPool = [];
    this.maxTracerPoolSize = 60;

    this.projectilePool = [];
    this.maxProjectilePoolSize = 50;

    this.debrisPool = [];
    this.maxDebrisPoolSize = 60;

    // Reusable Geometries and Materials to eliminate per-frame/shot allocations
    this.sharedGeos = {
      sphereSmall: new THREE.SphereGeometry(0.04, 4, 4),
      sphereMedium: new THREE.SphereGeometry(0.06, 6, 6),
      boxSmall: new THREE.BoxGeometry(0.08, 0.08, 0.08),
      boxMedium: new THREE.BoxGeometry(0.12, 0.12, 0.12)
    };

    this.sharedMaterials = {
      sparkRed: new THREE.MeshBasicMaterial({ color: 0xff0044 }),
      sparkCyan: new THREE.MeshBasicMaterial({ color: 0x00f0ff }),
      sparkOrange: new THREE.MeshBasicMaterial({ color: 0xffaa00 }),
      sparkWhite: new THREE.MeshBasicMaterial({ color: 0xffffff })
    };

    this.projectiles = [];
    this.obstacles = []; // AABBs for collisions

    // Dedicated groups for optimized raycasting without full scene traversal
    this.enemyGroup = new THREE.Group();
    this.scene.add(this.enemyGroup);

    this.obstacleGroup = new THREE.Group();
    this.scene.add(this.obstacleGroup);

    this.clock = new THREE.Clock();














    this.lastShotTime = 0;
    this.screenShake = 0;







    // Movement physics & controls configuration
    this.moveState = { forward: false, backward: false, left: false, right: false, sprint: false };
    this.velocity = new THREE.Vector3();
    this.isGrounded = true;
    this.playerHeight = 1.6;
    this.playerRadius = 0.5;
    this.coyoteTime = 0;
    this.jumpRequested = false;







    // Raycaster for shooting
    this.raycaster = new THREE.Raycaster();

    // Spatial Partitioning (Octree) for accelerating enemy swarms collision/raycasting
    this.octree = new Octree({
      min: new THREE.Vector3(-60, -10, -60),
      max: new THREE.Vector3(60, 30, 60),
      maxObjects: 8,
      maxLevels: 6
    });

    // Weapon Animation Spring & Controls State
    this.weaponRecoil = { x: 0, y: 0, z: 0, rotX: 0 };
    this.weaponSway = { x: 0, y: 0 };
    this.isMouseDown = false;
    this.bobTimer = 0;
    this.cameraTilt = 0;
    this.wasGrounded = true;

    window.addEventListener('resize', () => this.onWindowResize());
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x02050a);
    this.scene.fog = new THREE.FogExp2(0x02050a, 0.022);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
    this.camera.position.set(0, this.playerHeight, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Enhanced Multi-Point Neon Lighting
    const ambientLight = new THREE.AmbientLight(0x0f1d38, 1.5);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f0ff, 2.2);
    dirLight.position.set(30, 50, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 120;
    const d = 45;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    this.scene.add(dirLight);

    // Cyber Rim Lights for vivid neon highlights
    const rimLight1 = new THREE.DirectionalLight(0xff0055, 1.8);
    rimLight1.position.set(-30, 25, -30);
    this.scene.add(rimLight1);

    const rimLight2 = new THREE.DirectionalLight(0x00ff88, 1.2);
    rimLight2.position.set(30, 20, -30);
    this.scene.add(rimLight2);

    // Dynamic Atmospheric Point Lights around arena
    const pointLightsData = [
      { pos: [-35, 10, -35], color: 0x00f0ff, intensity: 2.0, dist: 50 },
      { pos: [35, 10, -35], color: 0xff0055, intensity: 2.0, dist: 50 },
      { pos: [-35, 10, 35], color: 0x00ff88, intensity: 2.0, dist: 50 },
      { pos: [35, 10, 35], color: 0xffaa00, intensity: 2.0, dist: 50 },
      { pos: [0, 12, 0], color: 0x00f0ff, intensity: 3.0, dist: 65 }
    ];

    pointLightsData.forEach(pl => {
      const light = new THREE.PointLight(pl.color, pl.intensity, pl.dist);
      light.position.set(...pl.pos);
      this.scene.add(light);
    });
  }







  initControls() {
    this.controls = new THREE.PointerLockControls(this.camera, document.body);

    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');

    startBtn.addEventListener('click', () => {
      sounds.init();
      this.startNewGame();
    });

    restartBtn.addEventListener('click', () => {
      sounds.init();
      this.startNewGame();
    });

    this.controls.addEventListener('lock', () => {
      if (state.active) {
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('hud').classList.remove('hidden');
        state.paused = false;
      }
    });

    this.controls.addEventListener('unlock', () => {
      this.isMouseDown = false;
      if (state.active && state.health > 0) {
        document.getElementById('pause-screen').classList.remove('hidden');
        document.getElementById('hud').classList.add('hidden');
        state.paused = true;
      }
    });

    document.getElementById('pause-screen').addEventListener('click', () => {
      if (state.active && state.paused) {
        this.controls.lock();
      }
    });
  }

  buildEnvironment() {
    // Floor Grid Texture
    const floorSize = 100;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a101d';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 512, 512);
    ctx.strokeStyle = '#003355';
    ctx.lineWidth = 1;
    for (let i = 0; i < 512; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0); ctx.lineTo(i, 512);
      ctx.moveTo(0, i); ctx.lineTo(512, i);
      ctx.stroke();
    }
    const floorTexture = new THREE.CanvasTexture(canvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(25, 25);

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.25,
      metalness: 0.85,
      emissive: 0x001133,
      emissiveIntensity: 0.2
    });

    const floorGeo = new THREE.PlaneGeometry(floorSize, floorSize);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Outer Perimeter Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0e1b2e,
      roughness: 0.5,
      metalness: 0.7
    });

    const wallThickness = 2;
    const wallHeight = 12;
    const halfSize = floorSize / 2;

    const wallsData = [
      { size: [floorSize, wallHeight, wallThickness], pos: [0, wallHeight/2, -halfSize] },
      { size: [floorSize, wallHeight, wallThickness], pos: [0, wallHeight/2, halfSize] },
      { size: [wallThickness, wallHeight, floorSize], pos: [-halfSize, wallHeight/2, 0] },
      { size: [wallThickness, wallHeight, floorSize], pos: [halfSize, wallHeight/2, 0] }
    ];

    wallsData.forEach(w => {
      const geo = new THREE.BoxGeometry(...w.size);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.position.set(...w.pos);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.obstacleGroup.add(mesh);

      const box = new THREE.Box3().setFromObject(mesh);
      this.obstacles.push(box);
    });

    // Top Perimeter Neon Strips & Center Light
    const neonMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const stripTop1 = new THREE.Mesh(new THREE.BoxGeometry(floorSize, 0.2, 0.2), neonMat);
    stripTop1.position.set(0, wallHeight, -halfSize + 0.1);
    const stripTop2 = new THREE.Mesh(new THREE.BoxGeometry(floorSize, 0.2, 0.2), neonMat);
    stripTop2.position.set(0, wallHeight, halfSize - 0.1);
    const stripTop3 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, floorSize), neonMat);
    stripTop3.position.set(-halfSize + 0.1, wallHeight, 0);
    const stripTop4 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, floorSize), neonMat);
    stripTop4.position.set(halfSize - 0.1, wallHeight, 0);
    this.scene.add(stripTop1, stripTop2, stripTop3, stripTop4);

    const centerPointLight = new THREE.PointLight(0x00f0ff, 1.2, 35);
    centerPointLight.position.set(0, 8, 0);
    this.scene.add(centerPointLight);

    // Procedural Obstacles / Cover Crates / Pillars
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x182a45, roughness: 0.3, metalness: 0.8 });
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.2, metalness: 0.9, wireframe: false });

    const obstacleConfigs = [
      // Central pillars
      { geo: new THREE.BoxGeometry(4, 10, 4), pos: [-15, 5, -15], mat: boxMat },
      { geo: new THREE.BoxGeometry(4, 10, 4), pos: [15, 5, -15], mat: boxMat },
      { geo: new THREE.BoxGeometry(4, 10, 4), pos: [-15, 5, 15], mat: boxMat },
      { geo: new THREE.BoxGeometry(4, 10, 4), pos: [15, 5, 15], mat: boxMat },
      // Cover crates
      { geo: new THREE.BoxGeometry(3, 3, 3), pos: [0, 1.5, -10], mat: boxMat },
      { geo: new THREE.BoxGeometry(3, 3, 3), pos: [-8, 1.5, 0], mat: boxMat },
      { geo: new THREE.BoxGeometry(3, 3, 3), pos: [8, 1.5, 0], mat: boxMat },
      { geo: new THREE.BoxGeometry(4, 2, 8), pos: [0, 1, 15], mat: boxMat },
      { geo: new THREE.BoxGeometry(8, 2, 4), pos: [-25, 1, 0], mat: boxMat },
      { geo: new THREE.BoxGeometry(8, 2, 4), pos: [25, 1, 0], mat: boxMat },
    ];

    obstacleConfigs.forEach(cfg => {
      const mesh = new THREE.Mesh(cfg.geo, cfg.mat);
      mesh.position.set(...cfg.pos);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.obstacleGroup.add(mesh);

      const box = new THREE.Box3().setFromObject(mesh);
      this.obstacles.push(box);
    });
  }

  buildWeapon() {
    this.weaponGroup = new THREE.Group();
    this.weaponMeshes = [];

    const darkMat = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.3, metalness: 0.8 });

    // 0: Plasma Rifle
    const rifleGroup = new THREE.Group();
    const rBody = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.6), darkMat);
    const rBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 16).rotateX(Math.PI / 2), darkMat);
    rBarrel.position.set(0, 0.03, -0.4);
    const rStripe = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.02, 0.4), new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.6 }));
    rStripe.position.set(0, 0.04, -0.05);
    rifleGroup.add(rBody, rBarrel, rStripe);

    // 1: Shotgun
    const sgGroup = new THREE.Group();
    const sgBody = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 0.55), darkMat);
    const sgBarrel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 16).rotateX(Math.PI / 2), darkMat);
    sgBarrel1.position.set(-0.04, 0.03, -0.4);
    const sgBarrel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 16).rotateX(Math.PI / 2), darkMat);
    sgBarrel2.position.set(0.04, 0.03, -0.4);
    const sgStripe = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.02, 0.35), new THREE.MeshStandardMaterial({ color: 0xffa000, emissive: 0xffa000, emissiveIntensity: 0.6 }));
    sgStripe.position.set(0, 0.05, -0.05);
    sgGroup.add(sgBody, sgBarrel1, sgBarrel2, sgStripe);

    // 2: Rail Cannon
    const railGroup = new THREE.Group();
    const railBody = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.2, 0.75), darkMat);
    const railCore = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 16).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0055, emissiveIntensity: 0.8 }));
    railCore.position.set(0, 0, -0.2);
    railGroup.add(railBody, railCore);

    // 3: Pulse SMG
    const smgGroup = new THREE.Group();
    const smgBody = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.45), darkMat);
    const smgBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.4, 16).rotateX(Math.PI / 2), darkMat);
    smgBarrel.position.set(0, 0.02, -0.3);
    const smgStripe = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.02, 0.3), new THREE.MeshStandardMaterial({ color: 0x33ff00, emissive: 0x33ff00, emissiveIntensity: 0.7 }));
    smgStripe.position.set(0, 0.03, -0.05);
    smgGroup.add(smgBody, smgBarrel, smgStripe);

    this.weaponMeshes.push(rifleGroup, sgGroup, railGroup, smgGroup);
    this.weaponMeshes.forEach((m, idx) => {
      m.visible = idx === 0;
      this.weaponGroup.add(m);
    });

    // Muzzle Flash
    this.muzzleFlashLight = new THREE.PointLight(0x00f0ff, 0, 8);
    this.muzzleFlashLight.position.set(0, 0.03, -0.7);
    this.weaponGroup.add(this.muzzleFlashLight);

    const flashGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    this.muzzleFlashMesh = new THREE.Mesh(flashGeo, flashMat);
    this.muzzleFlashMesh.position.set(0, 0.03, -0.7);
    this.weaponGroup.add(this.muzzleFlashMesh);

    this.weaponGroup.position.set(0.22, -0.2, -0.45);
    this.camera.add(this.weaponGroup);
    this.scene.add(this.camera);
  }

  setupListeners() {
    document.addEventListener('keydown', (e) => {
      if (!state.active || state.paused) return;
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.moveState.forward = true; break;
        case 'KeyS': case 'ArrowDown': this.moveState.backward = true; break;
        case 'KeyA': case 'ArrowLeft': this.moveState.left = true; break;
        case 'KeyD': case 'ArrowRight': this.moveState.right = true; break;
        case 'ShiftLeft': case 'ShiftRight': this.moveState.sprint = true; break;
        case 'Digit1': this.switchWeapon(0); break;
        case 'Digit2': this.switchWeapon(1); break;
        case 'Digit3': this.switchWeapon(2); break;
        case 'Digit4': this.switchWeapon(3); break;
        case 'KeyE':
          this.performDash();
          break;
        case 'Space':
          this.jumpRequested = true;
          if (this.isGrounded || this.coyoteTime > 0) {
            this.velocity.y = 9.8;
            this.isGrounded = false;
            this.coyoteTime = 0;
            sounds.playJump();
          }
          break;
        case 'KeyR':
          this.reloadWeapon();
          break;
      }
    });

    document.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.moveState.forward = false; break;
        case 'KeyS': case 'ArrowDown': this.moveState.backward = false; break;
        case 'KeyA': case 'ArrowLeft': this.moveState.left = false; break;
        case 'KeyD': case 'ArrowRight': this.moveState.right = false; break;
        case 'ShiftLeft': case 'ShiftRight': this.moveState.sprint = false; break;
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (!state.active || state.paused) return;
      if (e.button === 0) {
        this.isMouseDown = true;
        this.shoot();
      } else if (e.button === 2) {
        state.isAiming = true;
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.isMouseDown = false;
      } else if (e.button === 2) {
        state.isAiming = false;
      }
    });

    document.addEventListener('wheel', (e) => {
      if (!state.active || state.paused) return;
      let nextW = state.currentWeapon + (e.deltaY > 0 ? 1 : -1);
      if (nextW < 0) nextW = WEAPONS.length - 1;
      if (nextW >= WEAPONS.length) nextW = 0;
      this.switchWeapon(nextW);
    });

    document.addEventListener('contextmenu', e => e.preventDefault());
  }

  switchWeapon(index) {
    if (state.isReloading || index === state.currentWeapon) return;
    sounds.playWeaponSwitch();
    state.currentWeapon = index;
    const w = WEAPONS[index];
    state.clipSize = w.clipSize;
    state.ammoClip = w.clipSize;

    this.weaponMeshes.forEach((m, idx) => {
      m.visible = idx === index;
    });

    // Update active weapon UI
    document.querySelectorAll('.weapon-slot').forEach((slot, idx) => {
      slot.classList.toggle('active', idx === index);
    });
    document.getElementById('weapon-name').textContent = w.name;
    this.updateHUD();
  }

  startNewGame() {
    sounds.startBGM();

    state.active = true;
    state.paused = false;
    state.health = 100;
    state.shield = 50;
    state.shieldDelayTimer = 0;
    state.dashCooldown = 0;
    state.comboCount = 0;
    state.comboTimer = 0;
    state.powerup = { active: false, type: null, timer: 0 };
    state.boss = null;
    state.currentWeapon = 0;
    state.clipSize = WEAPONS[0].clipSize;
    state.ammoClip = WEAPONS[0].clipSize;
    state.ammoReserve = WEAPONS[0].maxReserve;
    state.isReloading = false;
    state.score = 0;
    state.kills = 0;
    state.wave = 1;

    this.enemies.forEach(e => this.enemyGroup.remove(e.mesh));
    this.enemies = [];
    if (this.octree) {
      this.octree.clear();
    }
    this.pickups.forEach(p => this.scene.remove(p.mesh));
    this.pickups = [];
    this.particles.forEach(p => this.scene.remove(p.mesh));
    this.particles = [];
    this.projectiles.forEach(pr => {
      this.scene.remove(pr.mesh);
      if (pr.mesh.geometry) pr.mesh.geometry.dispose();
    });
    this.projectiles = [];
    this.tracerPool.forEach(t => {
      this.scene.remove(t);
      if (t.geometry) t.geometry.dispose();
      if (t.material) t.material.dispose();
    });
    this.tracerPool = [];
    this.projectilePool.forEach(pr => {
      this.scene.remove(pr.mesh);
      if (pr.mesh.geometry) pr.mesh.geometry.dispose();
    });
    this.projectilePool = [];
    this.debrisPool.forEach(d => {
      this.scene.remove(d);
      if (d.geometry) d.geometry.dispose();
    });
    this.debrisPool = [];
    document.getElementById('boss-bar-container').classList.add('hidden');
    document.getElementById('powerup-banner').classList.add('hidden');
    document.getElementById('combo-banner').classList.add('hidden');

    this.camera.position.set(0, this.playerHeight, 0);
    this.velocity.set(0, 0, 0);

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('pause-screen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');

    this.switchWeapon(0);
    this.updateHUD();
    this.controls.lock();

    this.startWave(state.wave);

    if (!this.loopStarted) {
      this.loopStarted = true;
      this.animate();
    }
  }

  startWave(waveNumber) {
    state.wave = waveNumber;
    const isBossWave = (waveNumber % 5 === 0);
    const count = isBossWave ? 1 : 4 + waveNumber * 3;
    state.enemiesLeft = count;
    this.updateHUD();

    // Show wave banner
    const banner = document.getElementById('wave-banner');
    banner.textContent = isBossWave ? `BOSS WAVE ${waveNumber}` : `WAVE ${waveNumber}`;
    banner.classList.remove('hidden');
    setTimeout(() => banner.classList.add('hidden'), 2500);

    if (isBossWave) {
      sounds.playBossSpawn();
      setTimeout(() => {
        if (state.active) this.spawnBoss();
      }, 1000);
    } else {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          if (state.active) this.spawnEnemy();
        }, i * 500);
      }
    }
  }

  spawnBoss() {
    const dist = 30;
    const group = new THREE.Group();
    const radius = 2.5;
    const hp = 600 + state.wave * 250;

    const coreMat = new THREE.MeshStandardMaterial({ color: 0x11111a, roughness: 0.2, metalness: 0.9 });
    const core = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 24), coreMat);
    core.position.y = radius + 0.5;
    group.add(core);

    const eyeHead = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0055, emissiveIntensity: 2.0 })
    );
    eyeHead.position.set(0, radius + 0.5, radius * 0.85);
    eyeHead.name = 'head';
    group.add(eyeHead);

    const armorRing = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 1.5, 0.2, 16, 32),
      new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff3300, emissiveIntensity: 0.8 })
    );
    armorRing.rotation.x = Math.PI / 2;
    armorRing.position.y = radius + 0.5;
    group.add(armorRing);

    group.position.set(0, 0, -dist);
    this.enemyGroup.add(group);

    const bossObj = {
      mesh: group,
      head: eyeHead,
      ring: armorRing,
      type: 'boss',
      hp: hp,
      maxHp: hp,
      speed: 2.8,
      lastAttack: 0,
      lastSummon: performance.now(),
      attackCooldown: 1000,
      phase: 1,
      stateTimer: 0,
      strafeDir: Math.random() < 0.5 ? 1 : -1,
      flankAngle: Math.random() * Math.PI * 2
    };

    this.enemies.push(bossObj);
    state.boss = bossObj;

    document.getElementById('boss-name').textContent = `CYBER DREADNOUGHT - WAVE ${state.wave} [PHASE 1]`;
    document.getElementById('boss-bar-container').classList.remove('hidden');
    document.getElementById('boss-bar-fill').style.width = '100%';
  }







  spawnEnemy() {
    const dist = 22 + Math.random() * 20;
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    const types = ['scout', 'tank', 'shooter'];
    const type = types[Math.floor(Math.random() * types.length)];
    const group = new THREE.Group();

    let colorHex = 0xff0044;
    let radius = 0.7;
    let hp = (50 + state.wave * 15);
    let speed = 3.5 + Math.min(state.wave * 0.3, 4);

    if (type === 'scout') {
      colorHex = 0xff00bb;
      radius = 0.5;
      hp *= 0.6;
      speed *= 1.4;
    } else if (type === 'tank') {
      colorHex = 0xffaa00;
      radius = 1.1;
      hp *= 2.2;
      speed *= 0.7;
    } else if (type === 'shooter') {
      colorHex = 0x00f0ff;
      radius = 0.8;
    }

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x1a1a24, roughness: 0.3, metalness: 0.8 })
    );
    core.position.y = radius + 0.3;
    core.castShadow = true;
    group.add(core);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.4, 12, 12),
      new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 1.2 })
    );
    head.position.set(0, radius + 0.4, radius * 0.75);
    head.name = 'head';
    group.add(head);

    const ringGeo = new THREE.TorusGeometry(radius * 1.4, 0.05, 8, 24);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: colorHex, wireframe: true }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = radius + 0.3;
    group.add(ring);

    group.position.set(x, 0, z);
    this.enemyGroup.add(group);

    const enemyObj = {
      mesh: group,
      head: head,
      ring: ring,
      type: type,
      hp: hp,
      maxHp: hp,
      speed: speed,
      lastAttack: 0,
      attackCooldown: type === 'shooter' ? 1800 : 900,
      stateTimer: Math.random() * 3,
      strafeDir: Math.random() < 0.5 ? 1 : -1,
      flankOffset: (Math.random() - 0.5) * 6,
      seekingCover: false
    };

    this.enemies.push(enemyObj);
    if (this.octree) {
      this.octree.insert(enemyObj);
    }
  }

  spawnPickup(position) {
    const rand = Math.random();
    let type = 'ammo';
    let colorHex = 0x00f0ff;

    if (rand < 0.25) {
      type = 'health';
      colorHex = 0x00ff88;
    } else if (rand < 0.45) {
      type = 'shield';
      colorHex = 0x00bfff;
    } else if (rand < 0.65) {
      type = 'damage';
      colorHex = 0xff0055;
    } else if (rand < 0.85) {
      type = 'speed';
      colorHex = 0xffff00;
    }

    const geo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.8
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(position);
    mesh.position.y = 0.6;
    this.scene.add(mesh);

    this.pickups.push({ mesh: mesh, type: type });
  }

  performDash() {
    if (state.dashCooldown > 0 || !state.active || state.paused) return;

    sounds.playDash();
    state.dashCooldown = state.dashMaxCooldown;
    state.isDashing = true;
    state.dashDuration = 0.22;

    const dashDir = new THREE.Vector3();
    const forwardVec = new THREE.Vector3();
    this.camera.getWorldDirection(forwardVec);
    forwardVec.y = 0;
    forwardVec.normalize();

    const sideVec = new THREE.Vector3();
    sideVec.crossVectors(this.camera.up, forwardVec).normalize();

    let moveX = 0;
    let moveZ = 0;
    if (this.moveState.forward) moveZ += 1;
    if (this.moveState.backward) moveZ -= 1;
    if (this.moveState.left) moveX += 1;
    if (this.moveState.right) moveX -= 1;

    if (moveX !== 0 || moveZ !== 0) {
      dashDir.set(0, 0, 0);
      dashDir.add(forwardVec.clone().multiplyScalar(moveZ));
      dashDir.add(sideVec.clone().multiplyScalar(moveX));
      dashDir.normalize();
    } else {
      dashDir.copy(forwardVec);
    }

    // Preserve and boost momentum seamlessly
    this.velocity.x = dashDir.x * 26;
    this.velocity.z = dashDir.z * 26;
    this.velocity.y = Math.max(this.velocity.y, 3.5); // Slight upward pop for fluid mobility

    this.createSparks(this.camera.position, 0x00f0ff);
    this.screenShake = 0.18;
  }

  shoot() {
    const now = performance.now();
    const weapon = WEAPONS[state.currentWeapon];

    if (now - this.lastShotTime < weapon.fireRate) return;
    if (state.isReloading) return;

    if (state.ammoClip <= 0) {
      this.reloadWeapon();
      return;
    }

    this.lastShotTime = now;
    state.ammoClip--;
    this.updateHUD();

    // Track dynamic accuracy stats
    if (!state.playerStats) {
      state.playerStats = { shotsFired: 0, shotsHit: 0, totalSpeed: 0, speedSamples: 0 };
    }
    state.playerStats.shotsFired++;

    if (state.currentWeapon === 0) sounds.playGunshot();
    else if (state.currentWeapon === 1) sounds.playShotgun();
    else if (state.currentWeapon === 2) sounds.playRailgun();
    else sounds.playPulseSMG();

    this.muzzleFlashLight.color.setHex(weapon.color);
    this.muzzleFlashLight.intensity = 5;
    this.muzzleFlashMesh.material.opacity = 1;
    setTimeout(() => {
      this.muzzleFlashLight.intensity = 0;
      this.muzzleFlashMesh.material.opacity = 0;
    }, 45);

    const aimMultiplier = state.isAiming ? 0.5 : 1.0;

    this.weaponRecoil.z = weapon.recoilZ * aimMultiplier;
    this.weaponRecoil.rotX = weapon.recoilRot * aimMultiplier;
    this.screenShake = weapon.recoilZ * 0.45 * aimMultiplier;

    const muzzleWorldPos = new THREE.Vector3();
    this.muzzleFlashMesh.getWorldPosition(muzzleWorldPos);

    let shotLandedAny = false;

    for (let p = 0; p < weapon.pellets; p++) {
      const spreadX = (Math.random() - 0.5) * weapon.spread * aimMultiplier;
      const spreadY = (Math.random() - 0.5) * weapon.spread * aimMultiplier;
      this.raycaster.setFromCamera(new THREE.Vector2(spreadX, spreadY), this.camera);

      const enemyIntersects = this.raycaster.intersectObject(this.enemyGroup, true);
      const obstacleIntersects = this.raycaster.intersectObject(this.obstacleGroup, true);

      let hitPoint = null;
      let hitEnemy = null;
      let isHeadshot = false;
      let closestDistance = Infinity;

      // Use octree broadphase to narrow down potential hit enemies if available
      let candidateEnemies = this.enemies;
      if (this.octree) {
        // Build ray bounding box or query along ray
        const rayOrigin = this.raycaster.ray.origin;
        const rayDir = this.raycaster.ray.direction;
        const queryBox = new THREE.Box3(
          new THREE.Vector3().copy(rayOrigin).addScaledVector(rayDir, 0),
          new THREE.Vector3().copy(rayOrigin).addScaledVector(rayDir, 100)
        ).expandByScalar(2);
        candidateEnemies = this.octree.retrieve(queryBox);
      }

      const meshesToCheck = candidateEnemies.map(e => e.mesh);
      const optimizedIntersects = meshesToCheck.length > 0 ? this.raycaster.intersectObjects(meshesToCheck, true) : enemyIntersects;

      if (optimizedIntersects.length > 0) {
        closestDistance = optimizedIntersects[0].distance;
        hitPoint = optimizedIntersects[0].point;
        let obj = optimizedIntersects[0].object;
        isHeadshot = obj.name === 'head';
        while (obj.parent && obj !== this.enemyGroup) {
          obj = obj.parent;
        }
        hitEnemy = this.enemies.find(e => e.mesh === obj);
      } else if (enemyIntersects.length > 0) {
        closestDistance = enemyIntersects[0].distance;
        hitPoint = enemyIntersects[0].point;
        let obj = enemyIntersects[0].object;
        isHeadshot = obj.name === 'head';
        while (obj.parent && obj !== this.enemyGroup) {
          obj = obj.parent;
        }
        hitEnemy = this.enemies.find(e => e.mesh === obj);
      }

      if (obstacleIntersects.length > 0 && obstacleIntersects[0].distance < closestDistance) {
        hitPoint = obstacleIntersects[0].point;
        hitEnemy = null;
        isHeadshot = false;
      } else if (!hitPoint && obstacleIntersects.length > 0) {
        hitPoint = obstacleIntersects[0].point;
      }

      if (hitPoint) {
    if (hitEnemy) {
      shotLandedAny = true;
      const mult = (isHeadshot ? 2.2 : 1.0) * (state.powerup.type === 'damage' ? 2.0 : 1.0);
      const dmg = Math.round(weapon.damage * mult * (0.95 + Math.random() * 0.1));
      hitEnemy.hp -= dmg;
      sounds.playHit();
      this.triggerHitMarker(isHeadshot);
      this.showDamagePopup(hitPoint, dmg, isHeadshot);
      this.createSparks(hitPoint, weapon.color);

      if (state.currentWeapon === 2) {
        this.createRailgunBeam(muzzleWorldPos, hitPoint);
      } else {
        this.createTracerLine(muzzleWorldPos, hitPoint, weapon.color);
      }

          if (hitEnemy === state.boss) {
            const fill = Math.max(0, (hitEnemy.hp / hitEnemy.maxHp) * 100);
            document.getElementById('boss-bar-fill').style.width = `${fill}%`;
          }

          if (hitEnemy.hp <= 0) {
            this.destroyEnemy(hitEnemy);
          }
        } else {
          this.createSparks(hitPoint, 0xffaa00);
          if (state.currentWeapon === 2) {
            this.createRailgunBeam(muzzleWorldPos, hitPoint);
          } else {
            this.createTracerLine(muzzleWorldPos, hitPoint, weapon.color);
          }
        }
      }
    }

    if (shotLandedAny) {
      state.playerStats.shotsHit++;
    }

    if (state.ammoClip === 0) {
      this.reloadWeapon();
    }
  }

  showDamagePopup(worldPos, damage, isHeadshot) {
    const screenVec = worldPos.clone().project(this.camera);
    if (screenVec.z > 1) return;
    const x = (screenVec.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(screenVec.y * 0.5) + 0.5) * window.innerHeight;

    let pop;
    if (this.damagePopupPool.length > 0) {
      pop = this.damagePopupPool.pop();
      pop.className = `damage-popup ${isHeadshot ? 'headshot' : ''}`;
      pop.textContent = isHeadshot ? `CRIT ${damage}` : damage;
      pop.style.display = 'block';
      pop.style.left = `${x}px`;
      pop.style.top = `${y}px`;
    } else {
      pop = document.createElement('div');
      pop.className = `damage-popup ${isHeadshot ? 'headshot' : ''}`;
      pop.textContent = isHeadshot ? `CRIT ${damage}` : damage;
      pop.style.left = `${x}px`;
      pop.style.top = `${y}px`;
      document.body.appendChild(pop);
    }

    const popupObj = { el: pop, life: 0.6 };
    this.damagePopups.push(popupObj);
  }

  createTracerLine(start, end, colorHex) {
    let line;
    if (this.tracerPool.length > 0) {
      line = this.tracerPool.pop();
      line.geometry.setFromPoints([start, end]);
      line.material.color.setHex(colorHex);
      line.material.opacity = 0.7;
      line.visible = true;
    } else {
      const geo = new THREE.BufferGeometry().setFromPoints([start, end]);
      const mat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.7 });
      line = new THREE.Line(geo, mat);
      this.scene.add(line);
    }

    setTimeout(() => {
      line.visible = false;
      if (this.tracerPool.length < this.maxTracerPoolSize) {
        this.tracerPool.push(line);
      } else {
        this.scene.remove(line);
        if (line.geometry) line.geometry.dispose();
        if (line.material) line.material.dispose();
      }
    }, 40);
  }

  createRailgunBeam(startPos, endPos) {
    const dir = new THREE.Vector3().subVectors(endPos, startPos);
    const dist = dir.length();
    let beam;
    if (this.projectilePool.length > 0) {
      const prObj = this.projectilePool.pop();
      beam = prObj.mesh;
      beam.geometry.dispose();
      beam.geometry = new THREE.CylinderGeometry(0.07, 0.07, dist, 8);
      beam.geometry.rotateX(Math.PI / 2);
      beam.material.color.setHex(0xff0055);
      beam.material.opacity = 0.9;
      beam.position.copy(startPos).add(endPos).multiplyScalar(0.5);
      beam.lookAt(endPos);
      beam.scale.set(1, 1, 1);
      beam.visible = true;
    } else {
      const geo = new THREE.CylinderGeometry(0.07, 0.07, dist, 8);
      geo.rotateX(Math.PI / 2);
      const mat = new THREE.MeshBasicMaterial({ color: 0xff0055, transparent: true, opacity: 0.9 });
      beam = new THREE.Mesh(geo, mat);
      beam.position.copy(startPos).add(endPos).multiplyScalar(0.5);
      beam.lookAt(endPos);
      this.scene.add(beam);
    }

    const startTime = performance.now();
    const animateBeam = () => {
      const elapsed = (performance.now() - startTime) / 180;
      if (elapsed >= 1) {
        beam.visible = false;
        if (this.projectilePool.length < this.maxProjectilePoolSize) {
          this.projectilePool.push({ mesh: beam });
        } else {
          this.scene.remove(beam);
          if (beam.geometry) beam.geometry.dispose();
        }
      } else {
        beam.material.opacity = (1 - elapsed) * 0.9;
        beam.scale.set(1 - elapsed * 0.5, 1, 1 - elapsed * 0.5);
        requestAnimationFrame(animateBeam);
      }
    };
    animateBeam();
  }

  destroyEnemy(enemy) {
    sounds.playEnemyDeath();
    sounds.playKill();
    this.triggerHitMarker(true);
    this.createExplosion(enemy.mesh.position);
    this.spawnDebris(enemy.mesh.position);

    if (enemy === state.boss) {
      state.boss = null;
      document.getElementById('boss-bar-container').classList.add('hidden');
      for (let k = 0; k < 3; k++) this.spawnPickup(enemy.mesh.position);
      // Spawn extra debris for boss
      for (let k = 0; k < 5; k++) this.spawnDebris(enemy.mesh.position);
    } else if (Math.random() < 0.5) {
      this.spawnPickup(enemy.mesh.position);
    }

    this.enemyGroup.remove(enemy.mesh);
    this.enemies = this.enemies.filter(e => e !== enemy);
    if (this.octree) {
      this.octree.remove(enemy);
    }

    // Multikill combo handling
    state.comboCount++;
    state.comboTimer = 2.5;

    let scoreGain = 150 * Math.min(state.comboCount, 5);
    if (enemy.type === 'boss') scoreGain = 2000;

    state.score += scoreGain;
    state.kills++;
    state.enemiesLeft--;

    if (state.comboCount >= 2) {
      const comboBanner = document.getElementById('combo-banner');
      comboBanner.textContent = `${state.comboCount}x MULTIKILL! +${scoreGain}`;
      comboBanner.classList.remove('hidden');
    }

    this.updateHUD();

    if (state.enemiesLeft <= 0 && this.enemies.length === 0) {
      setTimeout(() => {
        if (state.active) this.startWave(state.wave + 1);
      }, 1500);
    }
  }

  reloadWeapon() {
    if (state.isReloading || state.ammoClip === state.clipSize || state.ammoReserve <= 0) return;

    state.isReloading = true;
    sounds.playReload();
    const warning = document.getElementById('reload-warning');
    warning.textContent = 'RELOADING...';
    warning.classList.remove('hidden');

    // Reload rotation animation
    this.weaponRecoil.rotX = -0.4;

    setTimeout(() => {
      const needed = state.clipSize - state.ammoClip;
      const amount = Math.min(needed, state.ammoReserve);
      state.ammoClip += amount;
      state.ammoReserve -= amount;
      state.isReloading = false;
      warning.classList.add('hidden');
      this.updateHUD();
    }, 1200);
  }

  triggerHitMarker(isKill = false) {
    const marker = document.getElementById('hit-marker');
    marker.classList.remove('active', 'kill');
    void marker.offsetWidth; // force reflow
    marker.classList.add('active');
    if (isKill) marker.classList.add('kill');
    setTimeout(() => marker.classList.remove('active', 'kill'), 120);
  }

  obtainParticle(geo, mat, pos, vel, life) {
    let pObj;
    if (this.particlePool.length > 0) {
      pObj = this.particlePool.pop();
      pObj.mesh.geometry = geo;
      pObj.mesh.material = mat;
      pObj.mesh.position.copy(pos);
      pObj.mesh.visible = true;
      pObj.vel.copy(vel);
      pObj.life = life;
      pObj.maxLife = life;
    } else {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      this.scene.add(mesh);
      pObj = { mesh: mesh, vel: vel.clone(), life: life, maxLife: life };
    }
    this.particles.push(pObj);
  }

  createSparks(pos, colorHex) {
    const mat = new THREE.MeshBasicMaterial({ color: colorHex });
    for (let i = 0; i < 10; i++) {
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8 + 2,
        (Math.random() - 0.5) * 8
      );
      this.obtainParticle(this.sharedGeos.sphereSmall, mat, pos, vel, 0.3);
    }
  }

  createExplosion(pos) {
    const expLight = new THREE.PointLight(0xff0055, 5.0, 15);
    expLight.position.copy(pos);
    expLight.position.y += 1.0;
    this.scene.add(expLight);
    setTimeout(() => this.scene.remove(expLight), 100);

    const mats = [this.sharedMaterials.sparkRed, this.sharedMaterials.sparkCyan, this.sharedMaterials.sparkOrange];
    const geos = [this.sharedGeos.boxSmall, this.sharedGeos.sphereMedium];

    for (let i = 0; i < 24; i++) {
      const geo = geos[Math.floor(Math.random() * geos.length)];
      const mat = mats[Math.floor(Math.random() * mats.length)];
      const spawnPos = pos.clone().add(new THREE.Vector3(0, 1.0, 0));
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 14,
        Math.random() * 10 + 2,
        (Math.random() - 0.5) * 14
      );
      this.obtainParticle(geo, mat, spawnPos, vel, 0.6);
    }
  }

  takeDamage(amount) {
    if (!state.active || state.health <= 0) return;

    state.shieldDelayTimer = 3.0; // Reset shield recharge delay

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

    sounds.playPlayerHurt();
    this.updateHUD();

    // Damage flash
    const flash = document.getElementById('hurt-screen');
    flash.style.opacity = '1';
    setTimeout(() => flash.style.opacity = '0', 200);

    if (state.health <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    state.active = false;
    this.controls.unlock();

    if (state.score > state.highScore) {
      state.highScore = state.score;
      localStorage.setItem('cyber_strike_highscore', state.highScore.toString());
    }

    document.getElementById('hud').classList.add('hidden');
    document.getElementById('final-score').textContent = state.score;
    document.getElementById('overlay-high-score').textContent = state.highScore;
    document.getElementById('final-wave').textContent = state.wave;
    document.getElementById('final-kills').textContent = state.kills;
    document.getElementById('game-over-screen').classList.remove('hidden');
  }

  updateHUD() {
    document.getElementById('health-bar-fill').style.width = `${(state.health / state.maxHealth) * 100}%`;
    document.getElementById('shield-bar-fill').style.width = `${(state.shield / state.maxShield) * 100}%`;
    document.getElementById('health-text').textContent = `${Math.ceil(state.shield)} | ${Math.ceil(state.health)}`;

    const dashPercent = Math.max(0, Math.min(100, ((state.dashMaxCooldown - state.dashCooldown) / state.dashMaxCooldown) * 100));
    document.getElementById('dash-bar-fill').style.width = `${dashPercent}%`;
    document.getElementById('dash-status').textContent = state.dashCooldown <= 0 ? 'READY' : 'CHARGING';

    document.getElementById('ammo-clip').textContent = state.ammoClip;
    document.getElementById('ammo-reserve').textContent = state.ammoReserve;
    document.getElementById('wave-num').textContent = state.wave;
    document.getElementById('enemy-count').textContent = state.enemiesLeft;
    document.getElementById('score-val').textContent = state.score;
    document.getElementById('high-score-val').textContent = state.highScore;

    const reloadWarn = document.getElementById('reload-warning');
    if (state.ammoClip <= 3 && !state.isReloading && state.ammoReserve > 0) {
      reloadWarn.textContent = "PRESS [R] TO RELOAD";
      reloadWarn.classList.remove('hidden');
    } else if (!state.isReloading) {
      reloadWarn.classList.add('hidden');
    }

    const lowHealth = document.getElementById('low-health-warning');
    if (state.health <= 30) {
      lowHealth.classList.remove('hidden');
    } else {
      lowHealth.classList.add('hidden');
    }
  }

  updatePlayer(delta) {
    if (!state.active || state.paused) return;

    // Shield Recharge logic
    if (state.shieldDelayTimer > 0) {
      state.shieldDelayTimer -= delta;
    } else if (state.shield < state.maxShield) {
      state.shield = Math.min(state.maxShield, state.shield + 20 * delta);
      this.updateHUD();
    }

    // Dash Cooldown logic
    if (state.dashCooldown > 0) {
      state.dashCooldown = Math.max(0, state.dashCooldown - delta);
      this.updateHUD();
    }

    // Combo Timer logic
    if (state.comboTimer > 0) {
      state.comboTimer -= delta;
      if (state.comboTimer <= 0) {
        state.comboCount = 0;
        document.getElementById('combo-banner').classList.add('hidden');
      }
    }

    // Powerup Timer logic
    if (state.powerup.active) {
      state.powerup.timer -= delta;
      if (state.powerup.timer <= 0) {
        state.powerup.active = false;
        state.powerup.type = null;
        document.getElementById('powerup-banner').classList.add('hidden');
      }
    }

    let baseSpeed = this.moveState.sprint ? 15.5 : 9.8;
    if (state.powerup.type === 'speed') baseSpeed *= 1.4;

    // Responsive ground vs air friction and acceleration tuning
    const groundFriction = 12.0;
    const airFriction = 2.0;
    const currentFriction = this.isGrounded ? groundFriction : airFriction;

    // Apply friction decay
    this.velocity.x -= this.velocity.x * currentFriction * delta;
    this.velocity.z -= this.velocity.z * currentFriction * delta;

    // Gravity (with snappy apex acceleration for crisp jump feel)
    const gravity = this.velocity.y < 0 ? 32 : 26;
    this.velocity.y -= gravity * delta;

    // Coyote time tracking
    if (this.isGrounded) {
      this.coyoteTime = 0.12;
    } else {
      this.coyoteTime = Math.max(0, this.coyoteTime - delta);
    }

    // Buffer jump handle
    if (this.jumpRequested && (this.isGrounded || this.coyoteTime > 0)) {
      this.velocity.y = 9.8;
      this.isGrounded = false;
      this.coyoteTime = 0;
      sounds.playJump();
    }
    this.jumpRequested = false;

    // Direct vectors relative to camera orientation
    const forwardVec = new THREE.Vector3();
    this.camera.getWorldDirection(forwardVec);
    forwardVec.y = 0;
    forwardVec.normalize();

    const sideVec = new THREE.Vector3();
    sideVec.crossVectors(this.camera.up, forwardVec).normalize();

    const inputDir = new THREE.Vector3();
    if (this.moveState.forward) inputDir.add(forwardVec);
    if (this.moveState.backward) inputDir.add(forwardVec.clone().negate());
    if (this.moveState.left) inputDir.add(sideVec);
    if (this.moveState.right) inputDir.add(sideVec.clone().negate());

    if (inputDir.lengthSq() > 0) {
      inputDir.normalize();
      const accelRate = this.isGrounded ? 55.0 : 18.0;
      this.velocity.add(inputDir.multiplyScalar(baseSpeed * accelRate * delta));

      // Clamp horizontal speed for precise handling
      const horizVel = new THREE.Vector3(this.velocity.x, 0, this.velocity.z);
      const maxAllowedSpeed = baseSpeed * (state.isDashing ? 1.8 : 1.25);
      if (horizVel.length() > maxAllowedSpeed) {
        horizVel.normalize().multiplyScalar(maxAllowedSpeed);
        this.velocity.x = horizVel.x;
        this.velocity.z = horizVel.z;
      }
    }

    // Dynamic Head Bobbing & Responsive Strafe Tilt
    const isMoving = this.moveState.forward || this.moveState.backward || this.moveState.left || this.moveState.right;
    if (isMoving && this.isGrounded) {
      this.bobTimer += delta * (this.moveState.sprint ? 16 : 11);
      this.camera.position.y = this.playerHeight + Math.sin(this.bobTimer) * 0.05;
    } else {
      this.bobTimer = 0;
    }

    let targetTilt = 0;
    if (this.moveState.left) targetTilt = 0.032;
    if (this.moveState.right) targetTilt = -0.032;
    this.cameraTilt = THREE.MathUtils.lerp(this.cameraTilt, targetTilt, delta * 12);
    this.camera.rotation.z = this.cameraTilt;

    // Check Landing Impact & Dash state expiration
    if (state.isDashing) {
      state.dashDuration -= delta;
      if (state.dashDuration <= 0) {
        state.isDashing = false;
      }
    }

    if (!this.wasGrounded && this.isGrounded) {
      sounds.playLanding();
      this.screenShake = 0.14;
    }
    this.wasGrounded = this.isGrounded;

    // Proposed movement step
    const pos = this.camera.position.clone();
    pos.x += this.velocity.x * delta;
    pos.z += this.velocity.z * delta;

    // Collision detection against AABBs
    const playerRadius = 0.6;
    for (const box of this.obstacles) {
      const closestX = Math.max(box.min.x, Math.min(pos.x, box.max.x));
      const closestZ = Math.max(box.min.z, Math.min(pos.z, box.max.z));
      const distX = pos.x - closestX;
      const distZ = pos.z - closestZ;
      const distanceSq = distX * distX + distZ * distZ;

      if (distanceSq < playerRadius * playerRadius) {
        // Simple sphere resolution
        const distance = Math.sqrt(distanceSq);
        if (distance > 0) {
          const overlap = playerRadius - distance;
          pos.x += (distX / distance) * overlap;
          pos.z += (distZ / distance) * overlap;
        }
      }
    }

    this.camera.position.x = pos.x;
    this.camera.position.z = pos.z;

    // Vertical Jump & Floor Floor Collision
    this.camera.position.y += this.velocity.y * delta;
    if (this.camera.position.y <= this.playerHeight) {
      this.camera.position.y = this.playerHeight;
      this.velocity.y = 0;
      this.isGrounded = true;
    }
  }

  updateEnemies(delta) {
    const playerPos = this.camera.position;
    const now = performance.now();

    if (this.octree) {
      this.octree.clear();
      this.enemies.forEach(e => this.octree.insert(e));
    }

    // Dynamic Difficulty Scaling calculation based on player performance & movement speed
    if (!state.playerStats) {
      state.playerStats = { shotsFired: 0, shotsHit: 0, totalSpeed: 0, speedSamples: 0 };
    }
    const currentSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    state.playerStats.totalSpeed += currentSpeed;
    state.playerStats.speedSamples++;

    const accuracy = state.playerStats.shotsFired > 5 ? (state.playerStats.shotsHit / state.playerStats.shotsFired) : 0.5;
    const avgSpeed = state.playerStats.speedSamples > 0 ? (state.playerStats.totalSpeed / state.playerStats.speedSamples) : 5.0;

    // Difficulty multiplier ranges from 0.85 (struggling player) to 1.45 (highly skilled player)
    const diffMultiplier = THREE.MathUtils.clamp(0.85 + (accuracy * 0.4) + (avgSpeed / 30), 0.8, 1.5);

    // Wave threat factor based on active enemy count and wave tier
    const activeThreatCount = this.enemies.length;
    const waveThreatScale = 1.0 + Math.min(activeThreatCount * 0.04, 0.8) + (state.wave * 0.03);

    // Compute squad center of mass for coordinated maneuvers
    const squadCenter = new THREE.Vector3();
    if (activeThreatCount > 0) {
      this.enemies.forEach(e => squadCenter.add(e.mesh.position));
      squadCenter.divideScalar(activeThreatCount);
    }

    this.enemies.forEach((enemy, idx) => {
      enemy.ring.rotation.z += delta * 2;
      enemy.stateTimer -= delta;

      const ePos = enemy.mesh.position;
      const toPlayer = new THREE.Vector3().subVectors(playerPos, ePos);
      toPlayer.y = 0;
      const dist = toPlayer.length();
      const dir = toPlayer.clone().normalize();

      // Flanking vector calculation with dynamic offset based on squad index
      const sideDir = new THREE.Vector3(-dir.z, 0, dir.x);
      const flankSign = (idx % 2 === 0) ? 1 : -1;
      const dynamicFlankOffset = sideDir.clone().multiplyScalar(flankSign * (3.5 + (idx % 3) * 2.0));

      // Squad cohesion force (steer slightly towards squad center of mass to prevent scattered isolation)
      const cohesionVec = new THREE.Vector3().subVectors(squadCenter, ePos);
      cohesionVec.y = 0;
      if (cohesionVec.lengthSq() > 0.001) cohesionVec.normalize();

      // Variable speed scaling based on active wave threats and player proximity
      const threatSpeedMultiplier = diffMultiplier * waveThreatScale * (dist < 10 ? 1.15 : 0.95);

      if (enemy.type === 'boss') {
        enemy.mesh.lookAt(playerPos.x, enemy.mesh.position.y, playerPos.z);

        // Boss Phase Transitions based on health thresholds
        const hpRatio = enemy.hp / enemy.maxHp;
        if (hpRatio <= 0.35 && enemy.phase < 3) {
          enemy.phase = 3;
          enemy.speed *= 1.4;
          enemy.attackCooldown *= 0.6;
          document.getElementById('boss-name').textContent = `CYBER DREADNOUGHT - WAVE ${state.wave} [PHASE 3: OVERDRIVE]`;
          this.createExplosion(ePos);
          sounds.playBossSpawn();
        } else if (hpRatio <= 0.7 && enemy.phase < 2) {
          enemy.phase = 2;
          enemy.speed *= 1.25;
          enemy.attackCooldown *= 0.8;
          document.getElementById('boss-name').textContent = `CYBER DREADNOUGHT - WAVE ${state.wave} [PHASE 2: RAMPAGE]`;
          this.createExplosion(ePos);
          sounds.playBossSpawn();
        }

        // Minion Summoning Mechanics in Phases 2 and 3
        if (enemy.phase >= 2 && now - enemy.lastSummon > (enemy.phase === 3 ? 8000 : 14000)) {
          enemy.lastSummon = now;
          sounds.playBossSpawn();
          for (let s = 0; s < (enemy.phase === 3 ? 3 : 2); s++) {
            const summonOffset = new THREE.Vector3((Math.random() - 0.5) * 8, 0, (Math.random() - 0.5) * 8);
            this.spawnMinionAt(ePos.clone().add(summonOffset));
          }
        }
        
        if (enemy.stateTimer <= 0) {
          enemy.stateTimer = (enemy.phase === 3 ? 1.0 : 2.0) + Math.random() * 2;
          enemy.strafeDir *= -1;
        }

        const effectiveSpeed = enemy.speed * threatSpeedMultiplier;
        const strafeMovement = sideDir.clone().multiplyScalar(enemy.strafeDir * effectiveSpeed * 0.9 * delta);
        ePos.add(strafeMovement);

        const targetBossDist = enemy.phase === 3 ? 10 : 14;
        if (dist > targetBossDist + 4) {
          ePos.add(dir.clone().multiplyScalar(effectiveSpeed * delta));
        } else if (dist < targetBossDist - 4) {
          ePos.add(dir.clone().multiplyScalar(-effectiveSpeed * delta));
        }

        const currentCooldown = (enemy.attackCooldown / diffMultiplier);
        if (now - enemy.lastAttack > currentCooldown) {
          enemy.lastAttack = now;
          this.fireEnemyLaser(ePos);
          const burstCount = enemy.phase === 3 ? 3 : (enemy.phase === 2 ? 2 : 1);
          for (let b = 1; b < burstCount; b++) {
            setTimeout(() => this.fireEnemyLaser(ePos), b * 180);
          }
        }
      } else if (enemy.type === 'shooter') {
        enemy.mesh.lookAt(playerPos.x, enemy.mesh.position.y, playerPos.z);

        // Advanced Cover-Seeking Routine: Check obstacles or retreat when threatened or low HP
        if ((enemy.hp < enemy.maxHp * 0.4 || activeThreatCount > 8) && !enemy.seekingCover) {
          enemy.seekingCover = true;
          enemy.stateTimer = 3.5;
        }

        if (enemy.seekingCover) {
          // Retreat backward and blend with squad cohesion
          const retreatDir = dir.clone().negate().add(cohesionVec.clone().multiplyScalar(0.3)).normalize();
          ePos.add(retreatDir.multiplyScalar(enemy.speed * threatSpeedMultiplier * delta));
          if (enemy.stateTimer <= 0) enemy.seekingCover = false;
        } else {
          // Dynamic Flanking & Strafing pattern
          if (enemy.stateTimer <= 0) {
            enemy.stateTimer = 1.8 + Math.random() * 2;
            enemy.strafeDir = Math.random() < 0.5 ? 1 : -1;
          }

          const flankVector = dir.clone().multiplyScalar(0.5).add(dynamicFlankOffset.clone().multiplyScalar(0.4)).normalize();
          const approachVel = flankVector.multiplyScalar(enemy.speed * threatSpeedMultiplier * delta);
          ePos.add(approachVel);

          if (dist > 16) {
            ePos.add(dir.clone().multiplyScalar(enemy.speed * threatSpeedMultiplier * delta));
          } else if (dist < 9) {
            ePos.add(dir.clone().multiplyScalar(-enemy.speed * threatSpeedMultiplier * delta));
          }
        }

        if (now - enemy.lastAttack > (enemy.attackCooldown / threatSpeedMultiplier)) {
          enemy.lastAttack = now;
          this.fireEnemyLaser(ePos);
        }
      } else if (enemy.type === 'scout') {
        // Aggressive Wide Flanking Scout behavior
        enemy.mesh.lookAt(playerPos.x, enemy.mesh.position.y, playerPos.z);

        if (enemy.stateTimer <= 0) {
          enemy.stateTimer = 1.5;
          enemy.strafeDir *= -1;
        }

        const wideFlank = sideDir.clone().multiplyScalar(enemy.strafeDir * enemy.speed * 1.5 * delta);
        const forwardPush = dir.clone().multiplyScalar(enemy.speed * threatSpeedMultiplier * delta);
        ePos.add(wideFlank).add(forwardPush);

        if (dist <= 4.0 && now - enemy.lastAttack > (enemy.attackCooldown / threatSpeedMultiplier)) {
          enemy.lastAttack = now;
          this.takeDamage(12 * diffMultiplier);
        }
      } else {
        // Tank Enemy behavior: Coordinated heavy vanguard advance with squad pull
        enemy.mesh.lookAt(playerPos.x, enemy.mesh.position.y, playerPos.z);
        const tankDir = dir.clone().add(cohesionVec.clone().multiplyScalar(0.25)).normalize();

        if (dist > 2.5) {
          ePos.add(tankDir.multiplyScalar(enemy.speed * threatSpeedMultiplier * delta));
        } else if (now - enemy.lastAttack > (enemy.attackCooldown / threatSpeedMultiplier)) {
          enemy.lastAttack = now;
          this.takeDamage(24 * diffMultiplier);
        }
      }
    });

    // Reactive Dodge Maneuvers for enemies against high-velocity projectiles (Railgun / high-speed fire)
    if (state.currentWeapon === 2 && this.isMouseDown && state.ammoClip > 0) {
      // Check if any enemies are close to the camera ray / crosshair and dodge sideways
      this.enemies.forEach(en => {
        if (en.mesh.position.distanceTo(playerPos) < 25 && (!en.dodgeCooldown || now - en.dodgeCooldown > 1200)) {
          en.dodgeCooldown = now;
          const dodgeDir = Math.random() < 0.5 ? 1 : -1;
          const evadeVec = new THREE.Vector3(-toPlayer.z, 0, toPlayer.x).normalize().multiplyScalar(dodgeDir * 4.5);
          en.mesh.position.add(evadeVec);
          this.createSparks(en.mesh.position, 0x00f0ff);
        }
      });
    }

    // Update enemy projectiles with difficulty-scaled projectile speed
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projPr = this.projectiles[i];
      const projSpeed = (projPr.speed || 20) * diffMultiplier;
      projPr.mesh.position.addScaledVector(projPr.dir, projSpeed * delta);
      if (projPr.mesh.position.distanceTo(playerPos) < 1.2) {
        this.takeDamage(16 * diffMultiplier);
        this.recycleProjectile(projPr);
        this.projectiles.splice(i, 1);
      } else if (projPr.mesh.position.length() > 120) {
        this.recycleProjectile(projPr);
        this.projectiles.splice(i, 1);
      }
    }
  }

  spawnMinionAt(pos) {
    const group = new THREE.Group();
    const radius = 0.5;
    const hp = 45;
    const speed = 4.0;
    const colorHex = 0xff00bb;

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x1a1a24, roughness: 0.3, metalness: 0.8 })
    );
    core.position.y = radius + 0.2;
    core.castShadow = true;
    group.add(core);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.4, 8, 8),
      new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 1.5 })
    );
    head.position.set(0, radius + 0.3, radius * 0.75);
    head.name = 'head';
    group.add(head);

    group.position.copy(pos);
    this.enemyGroup.add(group);

    const enemyObj = {
      mesh: group,
      head: head,
      ring: core,
      type: 'scout',
      hp: hp,
      maxHp: hp,
      speed: speed,
      lastAttack: 0,
      attackCooldown: 1200,
      stateTimer: 1.0,
      strafeDir: 1,
      flankOffset: 0,
      seekingCover: false
    };

    this.enemies.push(enemyObj);
    if (this.octree) {
      this.octree.insert(enemyObj);
    }
  }

  fireEnemyLaser(fromPos) {
    sounds.playLaser();
    let mesh;
    if (this.projectilePool.length > 0) {
      const prObj = this.projectilePool.pop();
      mesh = prObj.mesh;
      if (!mesh.geometry || mesh.geometry.type !== 'SphereGeometry') {
        if (mesh.geometry) mesh.geometry.dispose();
        mesh.geometry = this.sharedGeos.sphereMedium || new THREE.SphereGeometry(0.2, 8, 8);
      }
      if (!mesh.material) {
        mesh.material = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      } else {
        mesh.material.color.setHex(0x00f0ff);
        mesh.material.opacity = 1.0;
      }
      mesh.position.copy(fromPos);
      mesh.position.y += 1.0;
      mesh.scale.set(1, 1, 1);
      mesh.visible = true;
    } else {
      const geo = new THREE.SphereGeometry(0.2, 8, 8);
      const mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(fromPos);
      mesh.position.y += 1.0;
      this.scene.add(mesh);
    }

    const dir = new THREE.Vector3().subVectors(this.camera.position, mesh.position).normalize();
    this.projectiles.push({ mesh: mesh, dir: dir, speed: 20 });
  }

  recycleProjectile(pr) {
    pr.mesh.visible = false;
    if (this.projectilePool.length < this.maxProjectilePoolSize) {
      this.projectilePool.push(pr);
    } else {
      this.scene.remove(pr.mesh);
      if (pr.mesh.geometry) pr.mesh.geometry.dispose();
      if (pr.mesh.material) pr.mesh.material.dispose();
    }
  }

  spawnDebris(pos) {
    const mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    for (let i = 0; i < 4; i++) {
      let mesh;
      if (this.debrisPool.length > 0) {
        mesh = this.debrisPool.pop();
        mesh.material = mat;
        mesh.position.copy(pos).add(new THREE.Vector3((Math.random()-0.5)*0.5, Math.random()*0.5, (Math.random()-0.5)*0.5));
        mesh.scale.set(1, 1, 1);
        mesh.visible = true;
      } else {
        const geo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(pos);
        this.scene.add(mesh);
      }

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        Math.random() * 6 + 1,
        (Math.random() - 0.5) * 6
      );

      const debrisObj = { mesh: mesh, vel: vel, life: 1.2 };
      if (!this.activeDebris) this.activeDebris = [];
      this.activeDebris.push(debrisObj);
    }
  }

  updatePickups() {
    const playerPos = this.camera.position;
    this.pickups.forEach((pickup, index) => {
      pickup.mesh.rotation.y += 0.03;
      const dist = playerPos.distanceTo(pickup.mesh.position);

      if (dist < 1.8) {
        sounds.playPickup();
        if (pickup.type === 'health') {
          state.health = Math.min(state.maxHealth, state.health + 40);
        } else if (pickup.type === 'shield') {
          state.shield = state.maxShield;
        } else if (pickup.type === 'damage') {
          sounds.playPowerup();
          state.powerup.active = true;
          state.powerup.type = 'damage';
          state.powerup.timer = 10;
          const pBanner = document.getElementById('powerup-banner');
          pBanner.textContent = 'OVERCHARGE 2X DAMAGE ACTIVE!';
          pBanner.classList.remove('hidden');
        } else if (pickup.type === 'speed') {
          sounds.playPowerup();
          state.powerup.active = true;
          state.powerup.type = 'speed';
          state.powerup.timer = 8;
          const pBanner = document.getElementById('powerup-banner');
          pBanner.textContent = 'HYPERSPEED BOOST ACTIVE!';
          pBanner.classList.remove('hidden');
        } else {
          state.ammoReserve += 60;
        }
        this.updateHUD();
        this.scene.remove(pickup.mesh);
        this.pickups.splice(index, 1);
      }
    });
  }

  updateRadar() {
    const canvas = document.getElementById('radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const center = width / 2;
    const radarScale = 1.8;

    ctx.clearRect(0, 0, width, height);

    // Background circle & rings
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.beginPath();
    ctx.arc(center, center, center - 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(center, center, center * 0.5, 0, Math.PI * 2);
    ctx.arc(center, center, center * 0.85, 0, Math.PI * 2);
    ctx.stroke();

    // Player Direction vector
    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    const pAngle = Math.atan2(forward.x, forward.z);

    // Render Enemies as Dots
    const playerPos = this.camera.position;
    this.enemies.forEach(enemy => {
      const relX = enemy.mesh.position.x - playerPos.x;
      const relZ = enemy.mesh.position.z - playerPos.z;

      // Rotate relative to player view angle
      const rotX = relX * Math.cos(-pAngle) - relZ * Math.sin(-pAngle);
      const rotZ = relX * Math.sin(-pAngle) + relZ * Math.cos(-pAngle);

      const mapX = center + rotX * radarScale;
      const mapY = center - rotZ * radarScale;

      const distFromCenter = Math.hypot(mapX - center, mapY - center);
      if (distFromCenter < center - 4) {
        ctx.fillStyle = enemy.type === 'boss' ? '#ff0055' : (enemy.type === 'tank' ? '#ffaa00' : '#ff00bb');
        ctx.beginPath();
        ctx.arc(mapX, mapY, enemy.type === 'boss' ? 4.5 : 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Player center marker arrow
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.moveTo(center, center - 5);
    ctx.lineTo(center - 4, center + 4);
    ctx.lineTo(center + 4, center + 4);
    ctx.closePath();
    ctx.fill();
  }

  updateParticles(delta) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= delta;
      p.mesh.position.addScaledVector(p.vel, delta);
      p.mesh.scale.multiplyScalar(0.96);

      if (p.life <= 0) {
        p.mesh.visible = false;
        p.mesh.scale.set(1, 1, 1);
        this.particles.splice(i, 1);
        if (this.particlePool.length < this.maxPoolSize) {
          this.particlePool.push(p);
        } else {
          this.scene.remove(p.mesh);
          p.mesh.geometry.dispose();
        }
      }
    }

    if (this.activeDebris) {
      for (let i = this.activeDebris.length - 1; i >= 0; i--) {
        const d = this.activeDebris[i];
        d.life -= delta;
        d.vel.y -= 9.8 * delta;
        d.mesh.position.addScaledVector(d.vel, delta);
        d.mesh.rotation.x += delta * 3;
        d.mesh.rotation.y += delta * 4;

        if (d.life <= 0 || d.mesh.position.y < 0) {
          d.mesh.visible = false;
          d.mesh.rotation.set(0, 0, 0);
          this.activeDebris.splice(i, 1);
          if (this.debrisPool.length < this.maxDebrisPoolSize) {
            this.debrisPool.push(d.mesh);
          } else {
            this.scene.remove(d.mesh);
            if (d.mesh.geometry) d.mesh.geometry.dispose();
          }
        }
      }
    }

    for (let i = this.damagePopups.length - 1; i >= 0; i--) {
      const pop = this.damagePopups[i];
      pop.life -= delta;
      if (pop.life <= 0) {
        pop.el.style.display = 'none';
        this.damagePopups.splice(i, 1);
        if (this.damagePopupPool.length < this.maxPopupPoolSize) {
          this.damagePopupPool.push(pop.el);
        } else {
          pop.el.remove();
        }
      }
    }
  }

  updateWeapon(delta) {
    if (this.isMouseDown && state.active && !state.paused) {
      this.shoot();
    }

    this.weaponRecoil.z = THREE.MathUtils.lerp(this.weaponRecoil.z, 0, delta * 12);
    this.weaponRecoil.rotX = THREE.MathUtils.lerp(this.weaponRecoil.rotX, 0, delta * 10);

    const crosshair = document.getElementById('crosshair');
    if (crosshair) {
      const isMoving = this.moveState.forward || this.moveState.backward || this.moveState.left || this.moveState.right;
      const scale = state.isAiming ? 0.75 : (isMoving ? 1.35 : 1.0);
      crosshair.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    // FOV Aim down sights
    const targetFov = state.isAiming ? 48 : 75;
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, delta * 14);
    this.camera.updateProjectionMatrix();

    const isMoving = this.moveState.forward || this.moveState.backward || this.moveState.left || this.moveState.right;
    const swayFreq = isMoving ? 10 : 3;
    const swayAmp = isMoving ? 0.015 : 0.003;
    const time = performance.now() * 0.001;

    this.weaponSway.x = Math.sin(time * swayFreq) * swayAmp;
    this.weaponSway.y = Math.cos(time * swayFreq * 2) * swayAmp;

    const targetPosX = state.isAiming ? 0 : 0.22 + this.weaponSway.x;
    const targetPosY = state.isAiming ? -0.12 : -0.2 + this.weaponSway.y;

    this.weaponGroup.position.x = THREE.MathUtils.lerp(this.weaponGroup.position.x, targetPosX, delta * 12);
    this.weaponGroup.position.y = THREE.MathUtils.lerp(this.weaponGroup.position.y, targetPosY, delta * 12);
    this.weaponGroup.position.z = -0.45 + this.weaponRecoil.z;

    this.weaponGroup.rotation.x = this.weaponRecoil.rotX;

    // Screen Shake effect
    if (this.screenShake > 0) {
      this.camera.position.x += (Math.random() - 0.5) * this.screenShake;
      this.camera.position.y += (Math.random() - 0.5) * this.screenShake;
      this.screenShake = Math.max(0, this.screenShake - delta * 2);
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1);

    if (state.active && !state.paused) {
      this.updatePlayer(delta);
      this.updateEnemies(delta);
      this.updatePickups();
      this.updateParticles(delta);
      this.updateWeapon(delta);
      this.updateRadar();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Octree Spatial Partitioning Class for Enemy Swarm Acceleration
class Octree {
  constructor(bounds, maxObjects = 10, maxLevels = 5, level = 0) {
    this.bounds = bounds; // { min: THREE.Vector3, max: THREE.Vector3 }
    this.maxObjects = maxObjects;
    this.maxLevels = maxLevels;
    this.level = level;
    this.objects = [];
    this.nodes = [];
  }

  clear() {
    this.objects = [];
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i]) {
        this.nodes[i].clear();
      }
    }
    this.nodes = [];
  }

  split() {
    const subWidth = (this.bounds.max.x - this.bounds.min.x) / 2;
    const subHeight = (this.bounds.max.y - this.bounds.min.y) / 2;
    const subDepth = (this.bounds.max.z - this.bounds.min.z) / 2;
    const x = this.bounds.min.x;
    const y = this.bounds.min.y;
    const z = this.bounds.min.z;

    this.nodes[0] = new Octree({ min: new THREE.Vector3(x + subWidth, y + subHeight, z + subDepth), max: new THREE.Vector3(this.bounds.max.x, this.bounds.max.y, this.bounds.max.z) }, this.maxObjects, this.maxLevels, this.level + 1);
    this.nodes[1] = new Octree({ min: new THREE.Vector3(x, y + subHeight, z + subDepth), max: new THREE.Vector3(x + subWidth, this.bounds.max.y, this.bounds.max.z) }, this.maxObjects, this.maxLevels, this.level + 1);
    this.nodes[2] = new Octree({ min: new THREE.Vector3(x, y + subHeight, z), max: new THREE.Vector3(x + subWidth, this.bounds.max.y, z + subDepth) }, this.maxObjects, this.maxLevels, this.level + 1);
    this.nodes[3] = new Octree({ min: new THREE.Vector3(x + subWidth, y + subHeight, z), max: new THREE.Vector3(this.bounds.max.x, this.bounds.max.y, z + subDepth) }, this.maxObjects, this.maxLevels, this.level + 1);
    this.nodes[4] = new Octree({ min: new THREE.Vector3(x + subWidth, y, z + subDepth), max: new THREE.Vector3(this.bounds.max.x, y + subHeight, this.bounds.max.z) }, this.maxObjects, this.maxLevels, this.level + 1);
    this.nodes[5] = new Octree({ min: new THREE.Vector3(x, y, z + subDepth), max: new THREE.Vector3(x + subWidth, y + subHeight, this.bounds.max.z) }, this.maxObjects, this.maxLevels, this.level + 1);
    this.nodes[6] = new Octree({ min: new THREE.Vector3(x, y, z), max: new THREE.Vector3(x + subWidth, y + subHeight, z + subDepth) }, this.maxObjects, this.maxLevels, this.level + 1);
    this.nodes[7] = new Octree({ min: new THREE.Vector3(x + subWidth, y, z), max: new THREE.Vector3(this.bounds.max.x, y + subHeight, z + subDepth) }, this.maxObjects, this.maxLevels, this.level + 1);
  }

  getIndex(pos) {
    let index = -1;
    const midX = (this.bounds.min.x + this.bounds.max.x) / 2;
    const midY = (this.bounds.min.y + this.bounds.max.y) / 2;
    const midZ = (this.bounds.min.z + this.bounds.max.z) / 2;

    const top = (pos.y > midY);
    const right = (pos.x > midX);
    const front = (pos.z > midZ);

    if (top) {
      if (right) {
        if (front) index = 0;
        else index = 3;
      } else {
        if (front) index = 1;
        else index = 2;
      }
    } else {
      if (right) {
        if (front) index = 4;
        else index = 7;
      } else {
        if (front) index = 5;
        else index = 6;
      }
    }
    return index;
  }

  insert(object) {
    const pos = object.mesh ? object.mesh.position : object.position;
    if (!pos) return;

    if (this.nodes.length > 0) {
      const index = this.getIndex(pos);
      if (index !== -1) {
        this.nodes[index].insert(object);
        return;
      }
    }

    this.objects.push(object);

    if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
      if (this.nodes.length === 0) {
        this.split();
      }
      let i = 0;
      while (i < this.objects.length) {
        const obj = this.objects[i];
        const objPos = obj.mesh ? obj.mesh.position : obj.position;
        const index = this.getIndex(objPos);
        if (index !== -1) {
          this.nodes[index].insert(obj);
          this.objects.splice(i, 1);
        } else {
          i++;
        }
      }
    }
  }

  remove(object) {
    const pos = object.mesh ? object.mesh.position : object.position;
    if (!pos) return false;

    const idx = this.objects.indexOf(object);
    if (idx !== -1) {
      this.objects.splice(idx, 1);
      return true;
    }

    if (this.nodes.length > 0) {
      const index = this.getIndex(pos);
      if (index !== -1) {
        return this.nodes[index].remove(object);
      }
    }
    return false;
  }

  retrieve(rangeBox) {
    let returnObjects = [];
    // Check intersection with bounds
    const box = new THREE.Box3(this.bounds.min, this.bounds.max);
    if (!box.intersectsBox(rangeBox)) {
      return returnObjects;
    }

    for (let i = 0; i < this.objects.length; i++) {
      const obj = this.objects[i];
      const pos = obj.mesh ? obj.mesh.position : obj.position;
      if (rangeBox.containsPoint(pos)) {
        returnObjects.push(obj);
      }
    }

    if (this.nodes.length > 0) {
      for (let i = 0; i < this.nodes.length; i++) {
        returnObjects = returnObjects.concat(this.nodes[i].retrieve(rangeBox));
      }
    }

    return returnObjects;
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});