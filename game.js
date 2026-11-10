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
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
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
}

const sounds = new SoundSystem();

// Game State Definition
const state = {
  active: false,
  paused: false,
  health: 100,
  maxHealth: 100,
  ammoClip: 30,
  clipSize: 30,
  ammoReserve: 120,
  isReloading: false,
  score: 0,
  kills: 0,
  wave: 1,
  enemiesLeft: 0
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
    this.bullets = [];
    this.obstacles = []; // AABBs for collisions

    this.clock = new THREE.Clock();
    this.lastShotTime = 0;
    this.fireRate = 120; // ms between shots

    // Movement physics
    this.moveState = { forward: false, backward: false, left: false, right: false, sprint: false };
    this.velocity = new THREE.Vector3();
    this.isGrounded = true;
    this.playerHeight = 1.6;
    this.playerRadius = 0.5;

    // Raycaster for shooting
    this.raycaster = new THREE.Raycaster();

    // Weapon Animation Spring
    this.weaponRecoil = { x: 0, y: 0, z: 0, rotX: 0 };
    this.weaponSway = { x: 0, y: 0 };

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

    // Gun body components
    const bodyGeo = new THREE.BoxGeometry(0.12, 0.16, 0.6);
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.3, metalness: 0.8 });
    const cyanGlowMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.6 });

    const body = new THREE.Mesh(bodyGeo, darkMat);
    body.position.set(0, 0, 0);
    this.weaponGroup.add(body);

    const barrelGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 16);
    barrelGeo.rotateX(Math.PI / 2);
    const barrel = new THREE.Mesh(barrelGeo, darkMat);
    barrel.position.set(0, 0.03, -0.4);
    this.weaponGroup.add(barrel);

    // Glowing energy stripe
    const stripeGeo = new THREE.BoxGeometry(0.13, 0.02, 0.4);
    const stripe = new THREE.Mesh(stripeGeo, cyanGlowMat);
    stripe.position.set(0, 0.04, -0.05);
    this.weaponGroup.add(stripe);

    // Magazine
    const magGeo = new THREE.BoxGeometry(0.08, 0.25, 0.12);
    magGeo.rotateX(-0.2);
    const mag = new THREE.Mesh(magGeo, darkMat);
    mag.position.set(0, -0.15, -0.05);
    this.weaponGroup.add(mag);

    // Muzzle Flash light & star mesh
    this.muzzleFlashLight = new THREE.PointLight(0x00f0ff, 0, 8);
    this.muzzleFlashLight.position.set(0, 0.03, -0.7);
    this.weaponGroup.add(this.muzzleFlashLight);

    const flashGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    this.muzzleFlashMesh = new THREE.Mesh(flashGeo, flashMat);
    this.muzzleFlashMesh.position.set(0, 0.03, -0.7);
    this.weaponGroup.add(this.muzzleFlashMesh);

    // Attach weapon relative to camera view
    this.weaponGroup.position.set(0.22, -0.2, -0.45);
    this.camera.add(this.weaponGroup);
    this.scene.add(this.camera);
  }

  setupListeners() {
    // Keyboard inputs
    document.addEventListener('keydown', (e) => {
      if (!state.active || state.paused) return;
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.moveState.forward = true; break;
        case 'KeyS': case 'ArrowDown': this.moveState.backward = true; break;
        case 'KeyA': case 'ArrowLeft': this.moveState.left = true; break;
        case 'KeyD': case 'ArrowRight': this.moveState.right = true; break;
        case 'ShiftLeft': case 'ShiftRight': this.moveState.sprint = true; break;
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

    // Mouse click shooting
    document.addEventListener('mousedown', (e) => {
      if (!state.active || state.paused) return;
      if (e.button === 0) {
        this.shoot();
      }
    });
  }

  startNewGame() {
    // Reset State
    state.active = true;
    state.paused = false;
    state.health = 100;
    state.ammoClip = 30;
    state.ammoReserve = 120;
    state.isReloading = false;
    state.score = 0;
    state.kills = 0;
    state.wave = 1;

    // Clear entities
    this.enemies.forEach(e => this.scene.remove(e.mesh));
    this.enemies = [];
    this.pickups.forEach(p => this.scene.remove(p.mesh));
    this.pickups = [];
    this.particles.forEach(p => this.scene.remove(p.mesh));
    this.particles = [];

    // Reset Player Position
    this.camera.position.set(0, this.playerHeight, 0);
    this.velocity.set(0, 0, 0);

    // Hide overlays
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('pause-screen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');

    this.updateHUD();
    this.controls.lock();

    // Spawn first wave
    this.startWave(state.wave);

    if (!this.loopStarted) {
      this.loopStarted = true;
      this.animate();
    }
  }

  startWave(waveNumber) {
    state.wave = waveNumber;
    const count = 4 + waveNumber * 3;
    state.enemiesLeft = count;
    this.updateHUD();

    // Show wave banner
    const banner = document.getElementById('wave-banner');
    banner.textContent = `WAVE ${waveNumber}`;
    banner.classList.remove('hidden');
    setTimeout(() => banner.classList.add('hidden'), 2500);

    // Spawn Enemies
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (state.active) this.spawnEnemy();
      }, i * 600);
    }
  }

  spawnEnemy() {
    // Generate spawn position away from player
    const dist = 20 + Math.random() * 20;
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    // Robot Enemy Mesh Group
    const group = new THREE.Group();
    
    // Body Core
    const coreGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 0.3, metalness: 0.8 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 1.0;
    core.castShadow = true;
    group.add(core);

    // Glowing Eye
    const eyeGeo = new THREE.SphereGeometry(0.25, 12, 12);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xff0044, emissiveIntensity: 1.0 });
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(0, 1.1, 0.55);
    group.add(eye);

    // Floating Ring
    const ringGeo = new THREE.TorusGeometry(1.0, 0.06, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff0044, wireframe: true });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.0;
    group.add(ring);

    group.position.set(x, 0, z);
    this.scene.add(group);

    const speed = 3.5 + Math.min(state.wave * 0.3, 3.5);
    const hp = 60 + state.wave * 15;

    this.enemies.push({
      mesh: group,
      ring: ring,
      hp: hp,
      maxHp: hp,
      speed: speed,
      lastAttack: 0,
      attackCooldown: 1000 // ms
    });
  }

  spawnPickup(position) {
    const isHealth = Math.random() < 0.5;
    const geo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const mat = new THREE.MeshStandardMaterial({
      color: isHealth ? 0x00ff88 : 0x00f0ff,
      emissive: isHealth ? 0x00ff88 : 0x00f0ff,
      emissiveIntensity: 0.6
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(position);
    mesh.position.y = 0.6;
    this.scene.add(mesh);

    this.pickups.push({
      mesh: mesh,
      type: isHealth ? 'health' : 'ammo'
    });
  }

  shoot() {
    const now = performance.now();
    if (now - this.lastShotTime < this.fireRate) return;
    if (state.isReloading) return;

    if (state.ammoClip <= 0) {
      this.reloadWeapon();
      return;
    }

    this.lastShotTime = now;
    state.ammoClip--;
    this.updateHUD();

    sounds.playGunshot();

    // Muzzle Flash & Recoil
    this.muzzleFlashLight.intensity = 3;
    this.muzzleFlashMesh.material.opacity = 1;
    setTimeout(() => {
      this.muzzleFlashLight.intensity = 0;
      this.muzzleFlashMesh.material.opacity = 0;
    }, 45);

    this.weaponRecoil.z = 0.12;
    this.weaponRecoil.rotX = 0.15;

    // Raycast center screen
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const enemyMeshes = this.enemies.map(e => e.mesh);
    const intersects = this.raycaster.intersectObjects(enemyMeshes, true);

    if (intersects.length > 0) {
      const hit = intersects[0];
      // Find top group
      let obj = hit.object;
      while (obj.parent && !this.enemies.some(e => e.mesh === obj)) {
        obj = obj.parent;
      }
      const enemy = this.enemies.find(e => e.mesh === obj);
      if (enemy) {
        const damage = 35 + Math.random() * 15;
        enemy.hp -= damage;
        sounds.playHit();
        this.triggerHitMarker();
        this.createSparks(hit.point, 0x00f0ff);

        if (enemy.hp <= 0) {
          this.destroyEnemy(enemy);
        }
      }
    } else {
      // Check wall hit for sparks
      const wallIntersects = this.raycaster.intersectObjects(this.scene.children, false);
      if (wallIntersects.length > 0) {
        this.createSparks(wallIntersects[0].point, 0xffaa00);
      }
    }

    if (state.ammoClip === 0) {
      this.reloadWeapon();
    }
  }

  destroyEnemy(enemy) {
    sounds.playEnemyDeath();
    this.createExplosion(enemy.mesh.position);

    // Chance to drop pickup
    if (Math.random() < 0.45) {
      this.spawnPickup(enemy.mesh.position);
    }

    this.scene.remove(enemy.mesh);
    this.enemies = this.enemies.filter(e => e !== enemy);

    state.score += 150;
    state.kills++;
    state.enemiesLeft--;
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

  triggerHitMarker() {
    const marker = document.getElementById('hit-marker');
    marker.classList.add('active');
    setTimeout(() => marker.classList.remove('active'), 100);
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

    state.health = Math.max(0, state.health - amount);
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

    document.getElementById('hud').classList.add('hidden');
    document.getElementById('final-score').textContent = state.score;
    document.getElementById('final-wave').textContent = state.wave;
    document.getElementById('final-kills').textContent = state.kills;
    document.getElementById('game-over-screen').classList.remove('hidden');
  }

  updateHUD() {
    document.getElementById('health-bar-fill').style.width = `${(state.health / state.maxHealth) * 100}%`;
    document.getElementById('health-text').textContent = `${Math.ceil(state.health)} / ${state.maxHealth}`;
    document.getElementById('ammo-clip').textContent = state.ammoClip;
    document.getElementById('ammo-reserve').textContent = state.ammoReserve;
    document.getElementById('wave-num').textContent = state.wave;
    document.getElementById('enemy-count').textContent = state.enemiesLeft;
    document.getElementById('score-val').textContent = state.score;

    // Reload prompt warning
    const reloadWarn = document.getElementById('reload-warning');
    if (state.ammoClip <= 5 && !state.isReloading && state.ammoReserve > 0) {
      reloadWarn.textContent = "PRESS [R] TO RELOAD";
      reloadWarn.classList.remove('hidden');
    } else if (!state.isReloading) {
      reloadWarn.classList.add('hidden');
    }

    // Health warning
    const lowHealth = document.getElementById('low-health-warning');
    if (state.health <= 30) {
      lowHealth.classList.remove('hidden');
    } else {
      lowHealth.classList.add('hidden');
    }
  }

  updatePlayer(delta) {
    if (!state.active || state.paused) return;

    const moveSpeed = this.moveState.sprint ? 14 : 9;
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
      // Rotate inner ring for visual effect
      enemy.ring.rotation.z += delta * 2;

      const ePos = enemy.mesh.position;
      const dir = new THREE.Vector3().subVectors(playerPos, ePos);
      dir.y = 0;
      const dist = dir.length();
      dir.normalize();

      // Move toward player
      if (dist > 1.8) {
        ePos.add(dir.multiplyScalar(enemy.speed * delta));
        enemy.mesh.lookAt(playerPos.x, enemy.mesh.position.y, playerPos.z);
      } else {
        // Attack player
        if (now - enemy.lastAttack > enemy.attackCooldown) {
          enemy.lastAttack = now;
          this.takeDamage(15);
        }
      }
    });
  }

  updatePickups() {
    const playerPos = this.camera.position;
    this.pickups.forEach((pickup, index) => {
      pickup.mesh.rotation.y += 0.03;
      const dist = playerPos.distanceTo(pickup.mesh.position);

      if (dist < 1.8) {
        sounds.playPickup();
        if (pickup.type === 'health') {
          state.health = Math.min(state.maxHealth, state.health + 35);
        } else {
          state.ammoReserve += 45;
        }
        this.updateHUD();
        this.scene.remove(pickup.mesh);
        this.pickups.splice(index, 1);
      }
    });
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
    // Weapon Recoil recovery spring
    this.weaponRecoil.z = THREE.MathUtils.lerp(this.weaponRecoil.z, 0, delta * 12);
    this.weaponRecoil.rotX = THREE.MathUtils.lerp(this.weaponRecoil.rotX, 0, delta * 10);

    // Breathing sway
    const isMoving = this.moveState.forward || this.moveState.backward || this.moveState.left || this.moveState.right;
    const swayFreq = isMoving ? 10 : 3;
    const swayAmp = isMoving ? 0.015 : 0.003;
    const time = performance.now() * 0.001;

    this.weaponSway.x = Math.sin(time * swayFreq) * swayAmp;
    this.weaponSway.y = Math.cos(time * swayFreq * 2) * swayAmp;

    this.weaponGroup.position.set(
      0.22 + this.weaponSway.x,
      -0.2 + this.weaponSway.y,
      -0.45 + this.weaponRecoil.z
    );

    this.weaponGroup.rotation.x = this.weaponRecoil.rotX;
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
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});