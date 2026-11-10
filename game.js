/**
 * CYBER STRIKE 3D - FPS Game
 * Engine: Three.js + Web Audio API Synthesis
 */

// Global audio synthesizer using Web Audio API
class SoundSystem {
  constructor() {
    this.ctx = null;
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
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playEnemyDeath() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playPlayerHurt() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playReload() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.15);
    osc.frequency.linearRampToValueAtTime(500, now + 0.3);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  playJump() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playPickup() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const startTime = now + index * 0.06;
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.12);
    });
  }

  playShotgun() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    noise.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playRailgun() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  playLaser() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playPulseSMG() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.05);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playDash() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playPowerup() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const startTime = now + idx * 0.05;
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
  }

  playBossSpawn() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.linearRampToValueAtTime(220, now + 0.6);
    osc.frequency.exponentialRampToValueAtTime(40, now + 1.2);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.2);
  }

  playKill() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [587.33, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const startTime = now + idx * 0.05;
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.1);
    });
  }

  playWeaponSwitch() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playLanding() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  startBGM() {
===
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
    this.projectiles = [];
    this.obstacles = []; // AABBs for collisions

    this.clock = new THREE.Clock();
    this.lastShotTime = 0;
    this.screenShake = 0;

    // Movement physics
    this.moveState = { forward: false, backward: false, left: false, right: false, sprint: false };
    this.velocity = new THREE.Vector3();
    this.isGrounded = true;
    this.playerHeight = 1.6;
    this.playerRadius = 0.5;

    // Raycaster for shooting
    this.raycaster = new THREE.Raycaster();

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
    this.scene.background = new THREE.Color(0x050a14);
    this.scene.fog = new THREE.FogExp2(0x050a14, 0.025);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
    this.camera.position.set(0, this.playerHeight, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x223344, 1.2);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f0ff, 1.5);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    const d = 40;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    this.scene.add(dirLight);

    // Secondary warm rim light
    const rimLight = new THREE.DirectionalLight(0xff0055, 0.8);
    rimLight.position.set(-20, 20, -20);
    this.scene.add(rimLight);
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
      roughness: 0.4,
      metalness: 0.6
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
      this.scene.add(mesh);

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
      this.scene.add(mesh);

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
          if (this.isGrounded) {
            this.velocity.y = 8.5;
            this.isGrounded = false;
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

    this.enemies.forEach(e => this.scene.remove(e.mesh));
    this.enemies = [];
    this.pickups.forEach(p => this.scene.remove(p.mesh));
    this.pickups = [];
    this.particles.forEach(p => this.scene.remove(p.mesh));
    this.particles = [];
    this.projectiles.forEach(pr => this.scene.remove(pr.mesh));
    this.projectiles = [];
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
    this.scene.add(group);

    const bossObj = {
      mesh: group,
      head: eyeHead,
      ring: armorRing,
      type: 'boss',
      hp: hp,
      maxHp: hp,
      speed: 2.5,
      lastAttack: 0,
      attackCooldown: 1200
    };

    this.enemies.push(bossObj);
    state.boss = bossObj;

    document.getElementById('boss-name').textContent = `CYBER DREADNOUGHT - WAVE ${state.wave}`;
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
    let hp = 50 + state.wave * 15;
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

    // Glowing Head / Core
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
    this.scene.add(group);

    this.enemies.push({
      mesh: group,
      head: head,
      ring: ring,
      type: type,
      hp: hp,
      maxHp: hp,
      speed: speed,
      lastAttack: 0,
      attackCooldown: type === 'shooter' ? 2200 : 1000
    });
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
    state.dashDuration = 0.18;

    const dashDir = new THREE.Vector3();
    this.camera.getWorldDirection(dashDir);
    dashDir.y = 0;
    dashDir.normalize();

    this.velocity.add(dashDir.multiplyScalar(32));
    this.createSparks(this.camera.position, 0x00f0ff);
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

    if (state.currentWeapon === 0) sounds.playGunshot();
    else if (state.currentWeapon === 1) sounds.playShotgun();
    else if (state.currentWeapon === 2) sounds.playRailgun();
    else sounds.playPulseSMG();

    this.muzzleFlashLight.color.setHex(weapon.color);
    this.muzzleFlashLight.intensity = 4;
    this.muzzleFlashMesh.material.opacity = 1;
    setTimeout(() => {
      this.muzzleFlashLight.intensity = 0;
      this.muzzleFlashMesh.material.opacity = 0;
    }, 50);

    this.weaponRecoil.z = weapon.recoilZ;
    this.weaponRecoil.rotX = weapon.recoilRot;
    this.screenShake = weapon.recoilZ * 0.4;

    for (let p = 0; p < weapon.pellets; p++) {
      const spreadX = (Math.random() - 0.5) * weapon.spread;
      const spreadY = (Math.random() - 0.5) * weapon.spread;
      this.raycaster.setFromCamera(new THREE.Vector2(spreadX, spreadY), this.camera);

      const enemyMeshes = this.enemies.map(e => e.mesh);
      const intersects = this.raycaster.intersectObjects(enemyMeshes, true);

      if (intersects.length > 0) {
        const hit = intersects[0];
        let obj = hit.object;
        const isHeadshot = obj.name === 'head';
        while (obj.parent && !this.enemies.some(e => e.mesh === obj)) {
          obj = obj.parent;
        }
        const enemy = this.enemies.find(e => e.mesh === obj);
        if (enemy) {
          const mult = (isHeadshot ? 2.0 : 1.0) * (state.powerup.type === 'damage' ? 2.0 : 1.0);
          const dmg = Math.round(weapon.damage * mult * (0.9 + Math.random() * 0.2));
          enemy.hp -= dmg;
          sounds.playHit();
          this.triggerHitMarker();
          this.showDamagePopup(hit.point, dmg, isHeadshot);
          this.createSparks(hit.point, weapon.color);

          if (state.currentWeapon === 2) {
            this.createRailgunBeam(this.camera.position.clone().add(new THREE.Vector3(0.2, -0.2, -0.4)), hit.point);
          } else {
            this.createTracerLine(this.weaponGroup.position, hit.point, weapon.color);
          }

          if (enemy === state.boss) {
            const fill = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
            document.getElementById('boss-bar-fill').style.width = `${fill}%`;
          }

          if (enemy.hp <= 0) {
            this.destroyEnemy(enemy);
          }
        }
      } else {
        const wallIntersects = this.raycaster.intersectObjects(this.scene.children, false);
        if (wallIntersects.length > 0) {
          this.createSparks(wallIntersects[0].point, 0xffaa00);
          if (state.currentWeapon === 2) {
            this.createRailgunBeam(this.camera.position.clone().add(new THREE.Vector3(0.2, -0.2, -0.4)), wallIntersects[0].point);
          }
        }
      }
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

    const pop = document.createElement('div');
    pop.className = `damage-popup ${isHeadshot ? 'headshot' : ''}`;
    pop.textContent = isHeadshot ? `CRIT ${damage}` : damage;
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), 600);
  }

  createTracerLine(start, end, colorHex) {
    const geo = new THREE.BufferGeometry().setFromPoints([start, end]);
    const mat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.7 });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    setTimeout(() => this.scene.remove(line), 40);
  }

  createRailgunBeam(startPos, endPos) {
    const dir = new THREE.Vector3().subVectors(endPos, startPos);
    const dist = dir.length();
    const geo = new THREE.CylinderGeometry(0.07, 0.07, dist, 8);
    geo.rotateX(Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff0055, transparent: true, opacity: 0.9 });
    const beam = new THREE.Mesh(geo, mat);
    beam.position.copy(startPos).add(endPos).multiplyScalar(0.5);
    beam.lookAt(endPos);
    this.scene.add(beam);

    const startTime = performance.now();
    const animateBeam = () => {
      const elapsed = (performance.now() - startTime) / 180;
      if (elapsed >= 1) {
        this.scene.remove(beam);
      } else {
        mat.opacity = (1 - elapsed) * 0.9;
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

    if (enemy === state.boss) {
      state.boss = null;
      document.getElementById('boss-bar-container').classList.add('hidden');
      for (let k = 0; k < 3; k++) this.spawnPickup(enemy.mesh.position);
    } else if (Math.random() < 0.5) {
      this.spawnPickup(enemy.mesh.position);
    }

    this.scene.remove(enemy.mesh);
    this.enemies = this.enemies.filter(e => e !== enemy);

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

  createSparks(pos, colorHex) {
    for (let i = 0; i < 8; i++) {
      const geo = new THREE.SphereGeometry(0.04, 4, 4);
      const mat = new THREE.MeshBasicMaterial({ color: colorHex });
      const p = new THREE.Mesh(geo, mat);
      p.position.copy(pos);
      this.scene.add(p);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      );

      this.particles.push({ mesh: p, vel: vel, life: 0.25 });
    }
  }

  createExplosion(pos) {
    for (let i = 0; i < 24; i++) {
      const size = 0.08 + Math.random() * 0.12;
      const geo = new THREE.BoxGeometry(size, size, size);
      const mat = new THREE.MeshBasicMaterial({ color: Math.random() < 0.5 ? 0xff0044 : 0x00f0ff });
      const p = new THREE.Mesh(geo, mat);
      p.position.copy(pos);
      p.position.y += 1.0;
      this.scene.add(p);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        Math.random() * 8 + 2,
        (Math.random() - 0.5) * 10
      );

      this.particles.push({ mesh: p, vel: vel, life: 0.6 });
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

    let moveSpeed = this.moveState.sprint ? 14 : 9;
    if (state.powerup.type === 'speed') moveSpeed *= 1.4;

    const friction = 10;

    // Friction decay
    this.velocity.x -= this.velocity.x * friction * delta;
    this.velocity.z -= this.velocity.z * friction * delta;

    // Gravity
    this.velocity.y -= 25 * delta;

    // Direct vectors relative to camera orientation
    const forwardVec = new THREE.Vector3();
    this.camera.getWorldDirection(forwardVec);
    forwardVec.y = 0;
    forwardVec.normalize();

    const sideVec = new THREE.Vector3();
    sideVec.crossVectors(this.camera.up, forwardVec).normalize();

    if (this.moveState.forward) this.velocity.add(forwardVec.clone().multiplyScalar(moveSpeed * delta * 40));
    if (this.moveState.backward) this.velocity.add(forwardVec.clone().multiplyScalar(-moveSpeed * delta * 40));
    if (this.moveState.left) this.velocity.add(sideVec.clone().multiplyScalar(moveSpeed * delta * 40));
    if (this.moveState.right) this.velocity.add(sideVec.clone().multiplyScalar(-moveSpeed * delta * 40));

    // Head Bobbing & Strafe Tilt
    const isMoving = this.moveState.forward || this.moveState.backward || this.moveState.left || this.moveState.right;
    if (isMoving && this.isGrounded) {
      this.bobTimer += delta * (this.moveState.sprint ? 14 : 10);
      this.camera.position.y = this.playerHeight + Math.sin(this.bobTimer) * 0.04;
    } else {
      this.bobTimer = 0;
    }

    let targetTilt = 0;
    if (this.moveState.left) targetTilt = 0.02;
    if (this.moveState.right) targetTilt = -0.02;
    this.cameraTilt = THREE.MathUtils.lerp(this.cameraTilt, targetTilt, delta * 10);
    this.camera.rotation.z = this.cameraTilt;

    // Check Landing Impact
    if (!this.wasGrounded && this.isGrounded) {
      sounds.playLanding();
      this.screenShake = 0.12;
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

    this.enemies.forEach(enemy => {
      enemy.ring.rotation.z += delta * 2;

      const ePos = enemy.mesh.position;
      const dir = new THREE.Vector3().subVectors(playerPos, ePos);
      dir.y = 0;
      const dist = dir.length();
      dir.normalize();

      if (enemy.type === 'boss') {
        enemy.mesh.lookAt(playerPos.x, enemy.mesh.position.y, playerPos.z);
        if (dist > 10) {
          ePos.add(dir.multiplyScalar(enemy.speed * delta));
        }
        if (now - enemy.lastAttack > enemy.attackCooldown) {
          enemy.lastAttack = now;
          this.fireEnemyLaser(ePos);
        }
      } else if (enemy.type === 'shooter' && dist < 16 && dist > 7) {
        enemy.mesh.lookAt(playerPos.x, enemy.mesh.position.y, playerPos.z);
        if (now - enemy.lastAttack > enemy.attackCooldown) {
          enemy.lastAttack = now;
          this.fireEnemyLaser(ePos);
        }
      } else if (dist > 1.8) {
        ePos.add(dir.multiplyScalar(enemy.speed * delta));
        enemy.mesh.lookAt(playerPos.x, enemy.mesh.position.y, playerPos.z);
      } else {
        if (now - enemy.lastAttack > enemy.attackCooldown) {
          enemy.lastAttack = now;
          this.takeDamage(enemy.type === 'tank' ? 25 : 12);
        }
      }
    });

    // Update enemy projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const pr = this.projectiles[i];
      pr.mesh.position.addScaledVector(pr.dir, pr.speed * delta);
      if (pr.mesh.position.distanceTo(playerPos) < 1.2) {
        this.takeDamage(16);
        this.scene.remove(pr.mesh);
        this.projectiles.splice(i, 1);
      } else if (pr.mesh.position.length() > 120) {
        this.scene.remove(pr.mesh);
        this.projectiles.splice(i, 1);
      }
    }
  }

  fireEnemyLaser(fromPos) {
    sounds.playLaser();
    const geo = new THREE.SphereGeometry(0.2, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(fromPos);
    mesh.position.y += 1.0;

    const dir = new THREE.Vector3().subVectors(this.camera.position, mesh.position).normalize();
    this.scene.add(mesh);
    this.projectiles.push({ mesh: mesh, dir: dir, speed: 20 });
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
      p.mesh.scale.multiplyScalar(0.95);

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.particles.splice(i, 1);
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

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});