# CYBER STRIKE 3D

An action-packed 3D First Person Shooter game built with **Three.js** and Web Audio API synthesis. Fight off waves of cybernetic drones, bosses, collect power-ups, and survive!

## Features

- **Dynamic 3D Environment**: Built entirely with Three.js procedural geometry, lighting, shadows, and neon aesthetics.
- **Synthesized Audio Engine**: Procedural sound effects and cyberpunk synth background music via the Web Audio API (no external audio files required).
- **Multiple Weapons**: Plasma Rifle, Cyber Shotgun, Rail Cannon, and Pulse SMG with unique stats, recoil, and spread.
- **Advanced Movement**: Sprinting, jumping, head bobbing, strafe tilting, and a **Cyber Dash** ability with cooldown.
- **Combat Enhancements**: Hit markers, floating damage numbers (including critical headshots), multikill combos, mini-map radar, and bosses every 5 waves.
- **Version Management**: Integrated Semantic Versioning (SemVer v1.2.0) with automated version display in the HUD and menu.

---

## Setup & Running Instructions

Since this is a client-side WebGL game using ES modules/Three.js CDN, you can run it via any local static web server to avoid CORS issues with local file loading.

### Option 1: Python HTTP Server
1. Ensure Python is installed on your system.
2. Open a terminal in the project root directory.
3. Run the following command:
   ```bash
   # Python 3
   python -m http.server 8000
   ```
4. Open your browser and navigate to: `http://localhost:8000`

### Option 2: Node.js (http-server or npx)
1. Ensure Node.js is installed.
2. Run via npx without manual installation:
   ```bash
   npx http-server -p 8000
   ```
3. Open your browser and navigate to: `http://localhost:8000`

### Option 3: VS Code Live Server Extension
1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension by Ritwick Dey.
3. Right-click on `index.html` and select **Open with Live Server**.

---

## Version Management System

This project uses **Semantic Versioning (SemVer)** (`MAJOR.MINOR.PATCH`) tracked centrally via `version.js` and displayed in the main menu and HUD:

- **MAJOR version**: Incompatible API or structural game engine changes.
- **MINOR version**: Added functionality in a backwards-compatible manner (e.g., new weapons, enemy types, or sound effects).
- **PATCH version**: Backwards-compatible bug fixes, UI tweaks, or performance optimizations.

To bump versions for releases, update `version.js` and tag your Git commit accordingly:
```bash
git tag -a v1.2.0 -m "Release v1.2.0: Enhanced UI & Combat Polish"
git push origin v1.2.0
```

## Improvement & Optimization Plan

Based on a thorough review of `game.js`, `index.html`, `style.css`, and architectural patterns, the following comprehensive improvement plan has been formulated to elevate **CYBER STRIKE 3D** to production-grade quality.

---

### 1. Performance & Architecture Bottlenecks
- **Garbage Collection (GC) Pressure**: 
  - *Issue*: Spawning particles (`SphereGeometry`, `BoxGeometry`, `MeshBasicMaterial`) and rendering tracer lines / damage popups creates high transient object churn on every frame and gunshot.
  - *Plan*: Implement object pooling for particles, floating damage popups, and reusable geometry/material instances.
- **Raycasting & Collision Overhead**: 
  - *Issue*: `raycaster.intersectObjects(this.scene.children, true)` checks every scene node and child recursively on every shot.
  - *Plan*: Isolate enemy meshes and static obstacles into dedicated `THREE.Group` or BVH/Octree acceleration structures, bypassing full scene traversal.
- **Audio Context Management**:
  - *Issue*: Sound effects dynamically create oscillators and gain nodes without centralized recycling limits.
  - *Plan*: Add a sound concurrency limiter/pool to prevent audio stutter or resource leaks during chaotic multi-kill moments.

---

### 2. Gameplay Balance & Combat Mechanics
- **Enemy Variety & AI Behaviors**:
  - *Issue*: Current enemies (Scout, Tank, Shooter, Dreadnought Boss) follow simple direct-line tracking and stationary shooting loops.
  - *Plan*: Introduce flanking AI behaviors, strafing maneuvers, cover-seeking logic, and dynamic difficulty scaling based on player accuracy and movement speed.
- **Weapon Meta & Progression**:
  - *Issue*: Ammo economy is static across waves, and weapon switching lacks tactical depth (e.g. reload cancellation or alt-fire modes).
  - *Plan*: Add weapon upgrade stations between waves, thermal/energy heat buildup mechanics for energy weapons, and distinct clip/reserve scaling.

---

### 3. Visual Fidelity & Post-Processing
- **Post-Processing Pipeline**:
  - *Issue*: Relying solely on basic WebGL renderer tone mapping without bloom, chromatic aberration, or motion blur.
  - *Plan*: Integrate Three.js `EffectComposer` with `UnrealBloomPass` for neon glow highlights, film grain shaders, and dynamic depth-of-field during Aim Down Sights (ADS).
- **Environment Interactivity**:
  - *Issue*: Static walls and obstacles do not react to bullet impacts beyond spark particles.
  - *Plan*: Add scorch marks, dynamic decals, destructible cover crates, and volumetric lighting/fog density shifts as waves progress.

---

### 4. UI/UX & Quality of Life (QoL)
- **Settings Menu**:
  - *Issue*: Limited configuration options (only a BGM toggle exists).
  - *Plan*: Add an in-game settings modal (Press `ESC` to pause) allowing mouse sensitivity sliders, master volume controls, graphic quality toggles (shadow map resolution, anti-aliasing), and keybinding remapping.
- **Leaderboards & Progression**:
  - *Issue*: High scores are stored solely in `localStorage` without persistent online leaderboards or wave milestone unlocks.
  - *Plan*: Implement local stats tracking (accuracy percentage, total headshots, fastest wave clear time) and achievement badges.
>>>>