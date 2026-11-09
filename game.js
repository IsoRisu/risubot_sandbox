/**
 * CYBER STRIKER 3D - Full FPS Engine
 * Built using Three.js & Web Audio API
 */

// --- WEBAUDIO SYNTHESIZER ---
class SoundSynth {
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

    playShoot(weaponType) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        if (weaponType === 'PISTOL') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
        } else if (weaponType === 'SHOTGUN') {
            const noise = this.createNoiseBuffer(0.25);
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, now);
            filter.frequency.exponentialRampToValueAtTime(100, now + 0.25);
            
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.6, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start(now);
        } else if (weaponType === 'RIFLE') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.08);
        }
    }

    playHit() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(1800, now + 0.06);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
    }

    playDamage() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.25);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
    }

    playJump() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(360, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    playPickup() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
    }

    playReload() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        // Two click sounds
        [now, now + 0.18].forEach(time => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, time);
            osc.frequency.exponentialRampToValueAtTime(200, time + 0.04);
            gain.gain.setValueAtTime(0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.04);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(time);
            osc.stop(time + 0.04);
        });
    }

    playExplosion() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const noise = this.createNoiseBuffer(0.5);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(60, now + 0.5);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
    }

    createNoiseBuffer(duration) {
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        return noise;
    }
}

// --- PROCEDURAL TEXTURES ---
function createFloorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 512);

    // Cyber grid lines
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 512, 512);

    ctx.strokeStyle = '#004466';
    ctx.lineWidth = 2;
    for (let i = 64; i < 512; i += 64) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, 512);
        ctx.moveTo(0, i); ctx.lineTo(512, i);
        ctx.stroke();
    }

    // Glowing accents on corners
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillRect(496, 0, 16, 16);
    ctx.fillRect(0, 496, 16, 16);
    ctx.fillRect(496, 496, 16, 16);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

function createWallTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 512, 512);

    // Sci-fi metallic paneling
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, 512, 512);
    ctx.strokeRect(32, 32, 448, 448);

    // Glowing strip
    ctx.fillStyle = '#ff9900';
    ctx.fillRect(0, 240, 512, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

// --- WEAPONS CONFIGURATION ---
const WEAPONS = {
    PISTOL: {
        name: 'PISTOL',
        damage: 28,
        fireRate: 0.22,
        clipSize: 12,
        maxReserve: 96,
        spread: 0.012,
        pellets: 1,
        recoilKick: 0.06,
        auto: false
    },
    SHOTGUN: {
        name: 'SHOTGUN',
        damage: 14, // per pellet (8 pellets = 112 max point blank)
        fireRate: 0.75,
        clipSize: 6,
        maxReserve: 36,
        spread: 0.075,
        pellets: 8,
        recoilKick: 0.18,
        auto: false
    },
    RIFLE: {
        name: 'RIFLE',
        damage: 18,
        fireRate: 0.1,
        clipSize: 30,
        maxReserve: 180,
        spread: 0.028,
        pellets: 1,
        recoilKick: 0.04,
        auto: true
    }
};

// --- MAIN GAME CLASS ---
class Game {
    constructor() {
        this.container = document.getElementById('game-container');
        this.sound = new SoundSynth();

        // Game state variables
        this.isPlaying = false;
        this.score = 0;
        this.kills = 0;
        this.wave = 1;
        this.enemiesRemainingInWave = 0;
        this.waveTransitioning = false;

        // Player Stats & Physics
        this.player = {
            position: new THREE.Vector3(0, 1.6, 0),
            velocity: new THREE.Vector3(),
            health: 100,
            maxHealth: 100,
            speed: 9.0,
            sprintMultiplier: 1.5,
            jumpImpulse: 10.0,
            isGrounded: true,
            pitch: 0,
            yaw: 0
        };

        // Weapon States
        this.currentWeaponKey = 'PISTOL';
        this.ammo = {
            PISTOL: { clip: WEAPONS.PISTOL.clipSize, reserve: WEAPONS.PISTOL.maxReserve },
            SHOTGUN: { clip: WEAPONS.SHOTGUN.clipSize, reserve: WEAPONS.SHOTGUN.maxReserve },
            RIFLE: { clip: WEAPONS.RIFLE.clipSize, reserve: WEAPONS.RIFLE.maxReserve }
        };
        this.lastShotTime = 0;
        this.isReloading = false;
        this.isMouseDown = false;

        // Input Tracking
        this.keys = {};
        this.isPointerLocked = false;

        // Entities & Collections
        this.enemies = [];
        this.projectiles = [];
        this.pickups = [];
        this.particles = [];
        this.obstacles = [];

        // Setup THREE.js Scene
        this.initThree();
        this.buildWorld();
        this.createGunMesh();
        this.bindEvents();

        // Animation Frame loop
        this.clock = new THREE.Clock();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    initThree() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x060913);
        this.scene.fog = new THREE.FogExp2(0x060913, 0.018);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
        this.camera.position.copy(this.player.position);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0x00f0ff, 0.8);
        dirLight.position.set(30, 50, 20);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        this.scene.add(dirLight);

        // Center Gun Container
        this.gunContainer = new THREE.Group();
        this.camera.add(this.gunContainer);
        this.scene.add(this.camera);

        // Raycaster for shooting
        this.raycaster = new THREE.Raycaster();
    }

    buildWorld() {
        const floorTex = createFloorTexture();
        floorTex.repeat.set(20, 20);

        // Floor Plane
        const floorGeo = new THREE.PlaneGeometry(120, 120);
        const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.4, metalness: 0.6 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Boundary Walls
        const wallTex = createWallTexture();
        wallTex.repeat.set(10, 2);

        const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.5, metalness: 0.5 });
        const wallGeo = new THREE.BoxGeometry(120, 16, 2);

        const walls = [
            { pos: [0, 8, -60], rot: [0, 0, 0] },
            { pos: [0, 8, 60], rot: [0, 0, 0] },
            { pos: [-60, 8, 0], rot: [0, Math.PI / 2, 0] },
            { pos: [60, 8, 0], rot: [0, Math.PI / 2, 0] }
        ];

        walls.forEach(w => {
            const wall = new THREE.Mesh(wallGeo, wallMat);
            wall.position.set(...w.pos);
            wall.rotation.set(...w.rot);
            wall.receiveShadow = true;
            wall.castShadow = true;
            this.scene.add(wall);
            this.obstacles.push(new THREE.Box3().setFromObject(wall));
        });

        // Cover Obstacles / Pillars
        const boxGeo = new THREE.BoxGeometry(4, 8, 4);
        const boxMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.8 });

        const obstaclePositions = [
            [-20, 4, -20], [20, 4, -20], [-20, 4, 20], [20, 4, 20],
            [0, 4, -35], [0, 4, 35], [-35, 4, 0], [35, 4, 0]
        ];

        obstaclePositions.forEach(pos => {
            const pillar = new THREE.Mesh(boxGeo, boxMat);
            pillar.position.set(...pos);
            pillar.castShadow = true;
            pillar.receiveShadow = true;
            this.scene.add(pillar);

            // Add glowing trim around pillars
            const trimGeo = new THREE.BoxGeometry(4.2, 0.4, 4.2);
            const trimMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
            const trim = new THREE.Mesh(trimGeo, trimMat);
            trim.position.set(pos[0], 4, pos[2]);
            this.scene.add(trim);

            this.obstacles.push(new THREE.Box3().setFromObject(pillar));
        });
    }

    createGunMesh() {
        // Procedural Sci-Fi Rifle Mesh
        this.gunGroup = new THREE.Group();

        // Main Body
        const bodyGeo = new THREE.BoxGeometry(0.12, 0.16, 0.6);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.9, roughness: 0.2 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.set(0, 0, 0);
        this.gunGroup.add(body);

        // Barrel
        const barrelGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 16);
        const barrelMat = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.95, roughness: 0.1 });
        const barrel = new THREE.Mesh(barrelGeo, barrelMat);
        barrel.rotation.x = Math.PI / 2;
        barrel.position.set(0, 0.04, -0.45);
        this.gunGroup.add(barrel);

        // Glowing Core Strip
        const stripGeo = new THREE.BoxGeometry(0.13, 0.03, 0.4);
        this.gunStripMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
        const strip = new THREE.Mesh(stripGeo, this.gunStripMat);
        strip.position.set(0, 0.06, -0.05);
        this.gunGroup.add(strip);

        // Scope / Sight
        const scopeGeo = new THREE.BoxGeometry(0.06, 0.06, 0.15);
        const scopeMat = new THREE.MeshStandardMaterial({ color: 0x1f2937 });
        const scope = new THREE.Mesh(scopeGeo, scopeMat);
        scope.position.set(0, 0.12, -0.1);
        this.gunGroup.add(scope);

        // Muzzle Flash Light
        this.muzzleLight = new THREE.PointLight(0x00ffff, 0, 8);
        this.muzzleLight.position.set(0, 0.04, -0.7);
        this.gunGroup.add(this.muzzleLight);

        // Default position in FPS view
        this.gunGroup.position.set(0.24, -0.22, -0.45);
        this.gunContainer.add(this.gunGroup);

        this.gunBasePos = this.gunGroup.position.clone();
        this.recoilOffset = 0;
    }

    bindEvents() {
        // Click Start Button
        document.getElementById('start-btn').addEventListener('click', () => {
            this.sound.init();
            this.requestLock();
        });

        // Click Restart Button
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
            this.requestLock();
        });

        // Pointer Lock Listener
        document.addEventListener('pointerlockchange', () => {
            this.isPointerLocked = (document.pointerLockElement === document.body);
            if (this.isPointerLocked) {
                document.getElementById('start-screen').classList.add('hidden');
                document.getElementById('game-over-screen').classList.add('hidden');
                if (!this.isPlaying) this.startGame();
            }
        });

        // Mouse Look
        document.addEventListener('mousemove', (e) => {
            if (!this.isPointerLocked) return;

            const sensitivity = 0.0022;
            this.player.yaw -= e.movementX * sensitivity;
            this.player.pitch -= e.movementY * sensitivity;

            // Clamp pitch looking up/down
            const maxPitch = Math.PI / 2 - 0.05;
            this.player.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.player.pitch));
        });

        // Mouse Down / Up for Shooting
        document.addEventListener('mousedown', (e) => {
            if (e.button === 0 && this.isPointerLocked) {
                this.isMouseDown = true;
                this.shoot();
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.isMouseDown = false;
        });

        // Keyboard Inputs
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;

            if (this.isPointerLocked) {
                if (e.code === 'KeyR') this.reloadWeapon();
                if (e.code === 'Digit1') this.switchWeapon('PISTOL');
                if (e.code === 'Digit2') this.switchWeapon('SHOTGUN');
                if (e.code === 'Digit3') this.switchWeapon('RIFLE');
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Mouse Wheel Weapon Switch
        document.addEventListener('wheel', (e) => {
            if (!this.isPointerLocked) return;
            const keys = Object.keys(WEAPONS);
            let idx = keys.indexOf(this.currentWeaponKey);
            if (e.deltaY > 0) idx = (idx + 1) % keys.length;
            else idx = (idx - 1 + keys.length) % keys.length;
            this.switchWeapon(keys[idx]);
        });

        // Window Resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    requestLock() {
        document.body.requestPointerLock();
    }

    startGame() {
        this.isPlaying = true;
        this.score = 0;
        this.kills = 0;
        this.wave = 1;
        this.player.health = 100;
        
        // Reset ammo
        Object.keys(WEAPONS).forEach(w => {
            this.ammo[w].clip = WEAPONS[w].clipSize;
            this.ammo[w].reserve = WEAPONS[w].maxReserve;
        });

        this.clearEnemies();
        this.startWave(1);
        this.updateHUD();
    }

    restartGame() {
        this.player.position.set(0, 1.6, 0);
        this.player.velocity.set(0, 0, 0);
        this.player.pitch = 0;
        this.player.yaw = 0;
        this.startGame();
    }

    switchWeapon(weaponKey) {
        if (this.currentWeaponKey === weaponKey || this.isReloading) return;
        this.currentWeaponKey = weaponKey;
        this.sound.playReload();

        // Highlight active hotbar slot
        document.querySelectorAll('.slot').forEach(s => s.classList.remove('active'));
        if (weaponKey === 'PISTOL') document.getElementById('slot-1').classList.add('active');
        if (weaponKey === 'SHOTGUN') document.getElementById('slot-2').classList.add('active');
        if (weaponKey === 'RIFLE') document.getElementById('slot-3').classList.add('active');

        // Gun color accent update
        const colors = { PISTOL: 0x00f0ff, SHOTGUN: 0xffaa00, RIFLE: 0xff0055 };
        this.gunStripMat.color.setHex(colors[weaponKey]);

        this.updateHUD();
    }

    reloadWeapon() {
        const w = WEAPONS[this.currentWeaponKey];
        const ammo = this.ammo[this.currentWeaponKey];

        if (this.isReloading || ammo.clip === w.clipSize || ammo.reserve <= 0) return;

        this.isReloading = true;
        this.sound.playReload();
        document.getElementById('reload-prompt').classList.add('hidden');

        setTimeout(() => {
            const needed = w.clipSize - ammo.clip;
            const added = Math.min(needed, ammo.reserve);
            ammo.clip += added;
            ammo.reserve -= added;
            this.isReloading = false;
            this.updateHUD();
        }, 1200);
    }

    shoot() {
        if (!this.isPlaying || this.isReloading) return;

        const w = WEAPONS[this.currentWeaponKey];
        const ammo = this.ammo[this.currentWeaponKey];
        const now = this.clock.getElapsedTime();

        if (now - this.lastShotTime < w.fireRate) return;
        if (ammo.clip <= 0) {
            this.reloadWeapon();
            return;
        }

        ammo.clip--;
        this.lastShotTime = now;
        this.sound.playShoot(this.currentWeaponKey);

        // Recoil Kickback
        this.recoilOffset += w.recoilKick;
        this.muzzleLight.intensity = 3;
        setTimeout(() => { this.muzzleLight.intensity = 0; }, 40);

        // Raycasting pellets
        for (let i = 0; i < w.pellets; i++) {
            const rayDir = new THREE.Vector3(0, 0, -1);

            // Apply spread offset
            const spreadX = (Math.random() - 0.5) * w.spread;
            const spreadY = (Math.random() - 0.5) * w.spread;
            rayDir.x += spreadX;
            rayDir.y += spreadY;

            rayDir.applyQuaternion(this.camera.quaternion);
            this.raycaster.set(this.camera.position, rayDir);

            // Check hit against enemies
            const enemyMeshes = this.enemies.map(e => e.mesh);
            const intersects = this.raycaster.intersectObjects(enemyMeshes, true);

            if (intersects.length > 0) {
                const hit = intersects[0];
                let hitEnemy = null;

                // Find parent enemy instance
                this.enemies.forEach(e => {
                    e.mesh.traverse(child => {
                        if (child === hit.object) hitEnemy = e;
                    });
                });

                if (hitEnemy) {
                    hitEnemy.takeDamage(w.damage, hit.point);
                    this.triggerHitMarker();
                    this.spawnSparks(hit.point, hit.face.normal);
                    this.spawnDamageNumber(hit.point, w.damage);
                }
            } else {
                // Environment impact
                const wallIntersects = this.raycaster.intersectObjects(this.scene.children, false);
                if (wallIntersects.length > 0) {
                    const hit = wallIntersects[0];
                    if (hit.distance < 100) {
                        this.spawnSparks(hit.point, hit.face ? hit.face.normal : new THREE.Vector3(0,1,0));
                    }
                }
            }

            // Bullet Tracer line
            this.createTracer(this.camera.position, rayDir);
        }

        this.updateHUD();
    }

    createTracer(origin, direction) {
        const points = [
            origin.clone().add(new THREE.Vector3(0.2, -0.2, -0.4).applyQuaternion(this.camera.quaternion)),
            origin.clone().add(direction.clone().multiplyScalar(40))
        ];
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color: 0xffddaa, transparent: true, opacity: 0.8 });
        const line = new THREE.Line(geo, mat);
        this.scene.add(line);

        setTimeout(() => {
            this.scene.remove(line);
            geo.dispose();
            mat.dispose();
        }, 40);
    }

    spawnSparks(position, normal) {
        for (let i = 0; i < 8; i++) {
            const geo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
            const mat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
            const p = new THREE.Mesh(geo, mat);
            p.position.copy(position);

            const vel = normal.clone().add(new THREE.Vector3(
                (Math.random() - 0.5) * 1.5,
                (Math.random() - 0.5) * 1.5,
                (Math.random() - 0.5) * 1.5
            )).normalize().multiplyScalar(Math.random() * 8 + 2);

            this.particles.push({ mesh: p, velocity: vel, life: 0.25, maxLife: 0.25 });
            this.scene.add(p);
        }
    }

    spawnExplosion(position) {
        this.sound.playExplosion();
        for (let i = 0; i < 24; i++) {
            const geo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const mat = new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? 0xff3300 : 0x00f0ff });
            const p = new THREE.Mesh(geo, mat);
            p.position.copy(position);

            const vel = new THREE.Vector3(
                (Math.random() - 0.5) * 12,
                Math.random() * 8 + 3,
                (Math.random() - 0.5) * 12
            );

            this.particles.push({ mesh: p, velocity: vel, life: 0.7, maxLife: 0.7, gravity: -18 });
            this.scene.add(p);
        }
    }

    spawnDamageNumber(position3D, damageVal) {
        const container = document.getElementById('damage-texts');
        const elem = document.createElement('div');
        elem.className = 'dmg-num';
        elem.innerText = damageVal;
        container.appendChild(elem);

        const updatePos = () => {
            const proj = position3D.clone().project(this.camera);
            const x = (proj.x * .5 + .5) * window.innerWidth;
            const y = (-(proj.y * .5) + .5) * window.innerHeight;
            elem.style.left = `${x}px`;
            elem.style.top = `${y}px`;
        };

        updatePos();
        setTimeout(() => { elem.remove(); }, 700);
    }

    triggerHitMarker() {
        this.sound.playHit();
        const hm = document.getElementById('hit-marker');
        hm.classList.add('active');
        setTimeout(() => hm.classList.remove('active'), 100);
    }

    takePlayerDamage(amount) {
        if (!this.isPlaying) return;
        this.player.health -= amount;
        this.sound.playDamage();

        const df = document.getElementById('damage-flash');
        df.style.opacity = '1';
        setTimeout(() => df.style.opacity = '0', 180);

        this.updateHUD();

        if (this.player.health <= 0) {
            this.player.health = 0;
            this.gameOver();
        }
    }

    // --- ENEMY & WAVE SYSTEM ---
    startWave(waveNum) {
        this.wave = waveNum;
        this.waveTransitioning = true;

        const banner = document.getElementById('wave-banner');
        document.getElementById('wave-title').innerText = `WAVE ${waveNum}`;
        document.getElementById('wave-subtitle').innerText = waveNum === 1 ? 'PREPARE FOR COMBAT' : 'MORE HOSTILES DETECTED';
        banner.classList.remove('hidden');

        setTimeout(() => {
            banner.classList.add('hidden');
            this.waveTransitioning = false;
            this.spawnWaveEnemies(waveNum);
        }, 2200);
    }

    spawnWaveEnemies(waveNum) {
        const count = 4 + waveNum * 3;
        this.enemiesRemainingInWave = count;

        for (let i = 0; i < count; i++) {
            // Determine type
            let type = 'CHASER';
            const rand = Math.random();
            if (waveNum >= 2 && rand > 0.6) type = 'SHOOTER';
            if (waveNum >= 3 && rand > 0.85) type = 'TANK';

            // Random position away from player
            let pos;
            do {
                pos = new THREE.Vector3(
                    (Math.random() - 0.5) * 90,
                    1,
                    (Math.random() - 0.5) * 90
                );
            } while (pos.distanceTo(this.player.position) < 18);

            const enemy = new Enemy(type, pos, this);
            this.enemies.push(enemy);
            this.scene.add(enemy.mesh);
        }

        this.updateHUD();
    }

    onEnemyDefeated(enemy) {
        this.kills++;
        this.score += enemy.scoreValue;
        this.enemiesRemainingInWave--;

        // Chance to spawn pickup
        if (Math.random() < 0.35) {
            const pickupType = Math.random() > 0.5 ? 'HEALTH' : 'AMMO';
            const pickup = new Pickup(pickupType, enemy.mesh.position.clone(), this);
            this.pickups.push(pickup);
            this.scene.add(pickup.mesh);
        }

        this.spawnExplosion(enemy.mesh.position);
        this.scene.remove(enemy.mesh);
        this.enemies = this.enemies.filter(e => e !== enemy);

        this.updateHUD();

        if (this.enemies.length === 0 && this.enemiesRemainingInWave <= 0 && !this.waveTransitioning) {
            this.startWave(this.wave + 1);
        }
    }

    clearEnemies() {
        this.enemies.forEach(e => this.scene.remove(e.mesh));
        this.enemies = [];
        this.pickups.forEach(p => this.scene.remove(p.mesh));
        this.pickups = [];
        this.projectiles.forEach(p => this.scene.remove(p.mesh));
        this.projectiles = [];
    }

    gameOver() {
        this.isPlaying = false;
        document.exitPointerLock();

        document.getElementById('final-wave').innerText = this.wave;
        document.getElementById('final-kills').innerText = this.kills;
        document.getElementById('final-score').innerText = this.score;

        document.getElementById('game-over-screen').classList.remove('hidden');
    }

    updateHUD() {
        document.getElementById('score-val').innerText = this.score;
        document.getElementById('wave-val').innerText = this.wave;
        document.getElementById('enemies-val').innerText = this.enemies.length;

        // Health UI
        const healthPct = Math.max(0, (this.player.health / this.player.maxHealth) * 100);
        const healthBar = document.getElementById('health-bar-inner');
        healthBar.style.width = `${healthPct}%`;
        document.getElementById('health-val').innerText = `${Math.ceil(this.player.health)} / 100`;

        if (healthPct < 30) healthBar.classList.add('low');
        else healthBar.classList.remove('low');

        // Ammo UI
        const w = WEAPONS[this.currentWeaponKey];
        const ammo = this.ammo[this.currentWeaponKey];
        document.getElementById('weapon-name').innerText = w.name;
        document.getElementById('ammo-clip').innerText = ammo.clip;
        document.getElementById('ammo-reserve').innerText = ammo.reserve;

        if (ammo.clip === 0 && ammo.reserve > 0 && !this.isReloading) {
            document.getElementById('reload-prompt').classList.remove('hidden');
        } else {
            document.getElementById('reload-prompt').classList.add('hidden');
        }
    }

    // --- GAME LOOP & UPDATES ---
    updatePlayer(delta) {
        if (!this.isPlaying) return;

        // Auto Fire for automatic weapons (Assault Rifle)
        if (this.isMouseDown && WEAPONS[this.currentWeaponKey].auto) {
            this.shoot();
        }

        // Camera Orientation from Pitch/Yaw
        const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.player.yaw);
        const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.player.pitch);
        this.camera.quaternion.copy(qYaw).multiply(qPitch);

        // Movement Vector Setup
        const moveDir = new THREE.Vector3();
        if (this.keys['KeyW']) moveDir.z -= 1;
        if (this.keys['KeyS']) moveDir.z += 1;
        if (this.keys['KeyA']) moveDir.x -= 1;
        if (this.keys['KeyD']) moveDir.x += 1;
        moveDir.normalize();

        // Apply yaw rotation to movement direction
        moveDir.applyQuaternion(qYaw);

        const currentSpeed = (this.keys['ShiftLeft'] || this.keys['ShiftRight'])
            ? this.player.speed * this.player.sprintMultiplier
            : this.player.speed;

        // Horizontal velocity smoothing
        this.player.velocity.x = moveDir.x * currentSpeed;
        this.player.velocity.z = moveDir.z * currentSpeed;

        // Jump physics
        if (this.keys['Space'] && this.player.isGrounded) {
            this.player.velocity.y = this.player.jumpImpulse;
            this.player.isGrounded = false;
            this.sound.playJump();
        }

        // Apply Gravity
        this.player.velocity.y -= 26.0 * delta;

        // Move Player Position
        const newPos = this.player.position.clone().addScaledVector(this.player.velocity, delta);

        // Ground Collision Check
        if (newPos.y <= 1.6) {
            newPos.y = 1.6;
            this.player.velocity.y = 0;
            this.player.isGrounded = true;
        }

        // Wall & Obstacle Bounds Check
        const playerRadius = 0.6;
        newPos.x = Math.max(-58, Math.min(58, newPos.x));
        newPos.z = Math.max(-58, Math.min(58, newPos.z));

        // Pillar Obstacle Collisions
        this.obstacles.forEach(box => {
            if (box.containsPoint(newPos)) {
                // Push back to previous position
                newPos.x = this.player.position.x;
                newPos.z = this.player.position.z;
            }
        });

        this.player.position.copy(newPos);
        this.camera.position.copy(this.player.position);

        // Weapon Bobbing & Recoil Return
        const isMoving = (this.keys['KeyW'] || this.keys['KeyS'] || this.keys['KeyA'] || this.keys['KeyD']) && this.player.isGrounded;
        const time = this.clock.getElapsedTime();

        this.recoilOffset = THREE.MathUtils.lerp(this.recoilOffset, 0, delta * 12);
        
        const bobX = isMoving ? Math.sin(time * 12) * 0.025 : 0;
        const bobY = isMoving ? Math.abs(Math.cos(time * 12)) * 0.02 : 0;

        this.gunGroup.position.x = this.gunBasePos.x + bobX;
        this.gunGroup.position.y = this.gunBasePos.y - bobY;
        this.gunGroup.position.z = this.gunBasePos.z + this.recoilOffset;
    }

    updateParticles(delta) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= delta;
            if (p.gravity) p.velocity.y += p.gravity * delta;
            p.mesh.position.addScaledVector(p.velocity, delta);

            const opacity = Math.max(0, p.life / p.maxLife);
            p.mesh.scale.setScalar(opacity);

            if (p.life <= 0) {
                this.scene.remove(p.mesh);
                p.mesh.geometry.dispose();
                p.mesh.material.dispose();
                this.particles.splice(i, 1);
            }
        }
    }

    animate() {
        requestAnimationFrame(this.animate);
        const delta = Math.min(this.clock.getDelta(), 0.1);

        if (this.isPlaying) {
            this.updatePlayer(delta);

            // Update Enemies
            this.enemies.forEach(enemy => enemy.update(delta, this.player.position));

            // Update Projectiles
            for (let i = this.projectiles.length - 1; i >= 0; i--) {
                const proj = this.projectiles[i];
                proj.mesh.position.addScaledVector(proj.velocity, delta);

                // Hit Player check
                if (proj.mesh.position.distanceTo(this.player.position) < 1.0) {
                    this.takePlayerDamage(proj.damage);
                    this.scene.remove(proj.mesh);
                    this.projectiles.splice(i, 1);
                    continue;
                }

                // Lifetime check
                proj.life -= delta;
                if (proj.life <= 0) {
                    this.scene.remove(proj.mesh);
                    this.projectiles.splice(i, 1);
                }
            }

            // Update Pickups
            for (let i = this.pickups.length - 1; i >= 0; i--) {
                const p = this.pickups[i];
                p.update(delta);
                if (p.mesh.position.distanceTo(this.player.position) < 1.6) {
                    p.collect();
                    this.scene.remove(p.mesh);
                    this.pickups.splice(i, 1);
                }
            }
        }

        this.updateParticles(delta);
        this.renderer.render(this.scene, this.camera);
    }
}

// --- ENEMY CLASS ---
class Enemy {
    constructor(type, position, game) {
        this.type = type;
        this.game = game;

        if (type === 'CHASER') {
            this.hp = 45;
            this.speed = 7.5;
            this.damage = 15;
            this.scoreValue = 100;
            this.mesh = this.createChaserMesh();
        } else if (type === 'TANK') {
            this.hp = 180;
            this.speed = 4.0;
            this.damage = 35;
            this.scoreValue = 300;
            this.mesh = this.createTankMesh();
        } else if (type === 'SHOOTER') {
            this.hp = 60;
            this.speed = 5.0;
            this.damage = 18;
            this.scoreValue = 200;
            this.lastShootTime = 0;
            this.mesh = this.createShooterMesh();
        }

        this.mesh.position.copy(position);
        this.attackCooldown = 0;
    }

    createChaserMesh() {
        const group = new THREE.Group();
        const bodyGeo = new THREE.ConeGeometry(0.7, 1.4, 6);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff2200, roughness: 0.3, metalness: 0.8 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.rotation.x = Math.PI / 2;
        group.add(body);

        // Glowing Eye
        const eyeGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const eye = new THREE.Mesh(eyeGeo, eyeMat);
        eye.position.set(0, 0.2, -0.6);
        group.add(eye);

        return group;
    }

    createTankMesh() {
        const group = new THREE.Group();
        const bodyGeo = new THREE.BoxGeometry(1.8, 2.2, 1.8);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4c1d95, roughness: 0.2, metalness: 0.9 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 1.1;
        group.add(body);

        // Glowing Core
        const coreGeo = new THREE.SphereGeometry(0.5, 12, 12);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xff00cc });
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.position.set(0, 1.3, -0.8);
        group.add(core);

        return group;
    }

    createShooterMesh() {
        const group = new THREE.Group();
        const coreGeo = new THREE.IcosahedronGeometry(0.8, 1);
        const coreMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.7 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.position.y = 2.0;
        group.add(core);

        // Hover Ring
        const ringGeo = new THREE.TorusGeometry(1.2, 0.08, 8, 24);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 2.0;
        group.add(ring);

        this.hoverRing = ring;
        return group;
    }

    takeDamage(amount, hitPoint) {
        this.hp -= amount;

        // Flash Red visual feedback
        this.mesh.traverse(child => {
            if (child.material && child.material.color) {
                const orig = child.material.color.getHex();
                child.material.color.setHex(0xffffff);
                setTimeout(() => child.material.color.setHex(orig), 70);
            }
        });

        if (this.hp <= 0) {
            this.game.onEnemyDefeated(this);
        }
    }

    update(delta, playerPos) {
        this.attackCooldown -= delta;

        if (this.type === 'CHASER' || this.type === 'TANK') {
            // Chase Player
            const dir = new THREE.Vector3().subVectors(playerPos, this.mesh.position);
            dir.y = 0;
            const dist = dir.length();
            dir.normalize();

            this.mesh.position.addScaledVector(dir, this.speed * delta);
            this.mesh.lookAt(playerPos.x, this.mesh.position.y, playerPos.z);

            // Attack on close proximity
            if (dist < 1.6 && this.attackCooldown <= 0) {
                this.game.takePlayerDamage(this.damage);
                this.attackCooldown = 1.0;
            }
        } else if (this.type === 'SHOOTER') {
            // Maintain Range
            const dir = new THREE.Vector3().subVectors(playerPos, this.mesh.position);
            const dist = dir.length();
            dir.y = 0;
            dir.normalize();

            this.mesh.lookAt(playerPos);
            if (this.hoverRing) this.hoverRing.rotation.z += delta * 4;

            if (dist > 18) {
                this.mesh.position.addScaledVector(dir, this.speed * delta);
            } else if (dist < 10) {
                this.mesh.position.addScaledVector(dir, -this.speed * delta);
            }

            // Shoot glowing plasma fireball
            const now = this.game.clock.getElapsedTime();
            if (dist < 28 && now - this.lastShootTime > 2.2) {
                this.lastShootTime = now;
                this.shootPlasma(playerPos);
            }
        }
    }

    shootPlasma(playerPos) {
        const geo = new THREE.SphereGeometry(0.35, 8, 8);
        const mat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(this.mesh.position).add(new THREE.Vector3(0, 2.0, 0));

        const target = playerPos.clone().add(new THREE.Vector3(0, -0.2, 0));
        const vel = new THREE.Vector3().subVectors(target, mesh.position).normalize().multiplyScalar(18);

        this.game.scene.add(mesh);
        this.game.projectiles.push({ mesh, velocity: vel, damage: this.damage, life: 4.0 });
    }
}

// --- PICKUP CLASS ---
class Pickup {
    constructor(type, position, game) {
        this.type = type; // 'HEALTH' or 'AMMO'
        this.game = game;

        const group = new THREE.Group();
        const geo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const color = type === 'HEALTH' ? 0x00ff88 : 0xffcc00;
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.8 });
        const mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);

        const light = new THREE.PointLight(color, 1.5, 4);
        group.add(light);

        group.position.copy(position);
        group.position.y = 0.8;
        this.mesh = group;
        this.baseY = 0.8;
    }

    update(delta) {
        const time = this.game.clock.getElapsedTime();
        this.mesh.rotation.y += delta * 2;
        this.mesh.position.y = this.baseY + Math.sin(time * 4) * 0.15;
    }

    collect() {
        this.game.sound.playPickup();
        if (this.type === 'HEALTH') {
            this.game.player.health = Math.min(this.game.player.maxHealth, this.game.player.health + 35);
        } else if (this.type === 'AMMO') {
            Object.keys(WEAPONS).forEach(w => {
                this.game.ammo[w].reserve += WEAPONS[w].maxReserve * 0.5;
            });
        }
        this.game.updateHUD();
    }
}

// --- BOOTSTRAP GAME ---
window.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new Game();
});