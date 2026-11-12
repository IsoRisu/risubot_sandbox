# Hello

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

Building upon the robust foundation of **CYBER STRIKE 3D** (v1.2.0), the improvement and optimization roadmap is structured to continuously elevate performance, tactical depth, and immersion.

---

### 1. Implemented Enhancements (v1.0 - v1.2)
- **Audio & Sound Engine**: Synthesized Web Audio API sound effects and cyberpunk synth background music with independent volume controls and concurrency management.
- **Post-Processing & Visual Fidelity**: Three.js `EffectComposer` pipeline integrating `UnrealBloomPass`, `FilmPass`, and dynamic tone mapping for neon cyberpunk aesthetics.
- **UI/UX & QoL Systems**:
  - Pause menu and comprehensive Settings Modal (`ESC`) supporting mouse sensitivity, FOV adjustment, graphics quality toggles, and customizable keybinds.
  - Real-time combat statistics tracking (accuracy, headshots, wave clear times) and unlockable achievement badges.
  - Semantic Versioning (`version.js`) integrated into the main menu and HUD badge.

---

### 2. Ongoing Performance & Architecture Optimization
- **Garbage Collection (GC) Reduction**: 
  - *Status*: Initial object pooling applied to particles and floating damage popups.
  - *Next Steps*: Expand pooling to bullet tracer meshes, weapon projectile instances, and enemy debris to minimize transient object churn during intense firefights.
- **Spatial Acceleration & Raycasting**: 
  - *Status*: Layer-based and group-based filtering currently used for collision detection.
  - *Next Steps*: Implement BVH (Bounding Volume Hierarchy) or Octree spatial partitioning to accelerate high-frequency raycasting against dense enemy swarms.

---

### 3. Future Gameplay Expansion & AI
- **Advanced Enemy Behaviors**:
  - Introduce dynamic flanking, squad coordination, cover-seeking routines, and variable speed scaling based on active wave threats.
  - Implement boss-specific phase transitions, minion summoning mechanics, and reactive dodge maneuvers against high-velocity projectiles.
- **Weapons & Tactical Depth**:
  - Add alternative fire modes, heat buildup/overheat mechanics for energy weapons, and between-wave tactical upgrade stations.
  - Introduce consumable utility items (e.g., EMP grenades, nano-shields, tactical stims) and weapon mod attachments.
- **Environment Interactivity**:
  - Expand destructible cover, dynamic bullet decals, and reactive environmental lighting shifts as higher waves progress.
  - Add hazard zones (laser grids, toxic acid pools, electrical conduits) that can be triggered against both players and enemies.
- **Multiplayer & Co-op Prototyping (WebRTC P2P Architecture)**:
  - Designed a robust 2-4 player cooperative P2P network architecture, state synchronization protocol, and synchronized wave scaling strategy for CYBER STRIKE 3D.

### 4. Technical Debt, Bugs & Quality Assurance Fixes
- **Audio Concurrency & Clipping Fixes**:
  - *Issue*: Rapid firing high-rate-of-fire weapons (Pulse SMG) can occasionally cause Web Audio buffer node saturation and minor audio crackling.
  - *Fix*: Implement a dedicated voice allocation pool and compressor node limiter in the synth audio engine.
- **Shadow Map Flickering**:
  - *Issue*: Directional shadow maps artifact or cascade-shift during rapid camera rotations and high FOV adjustments.
  - *Fix*: Optimize shadow camera frustums, bias values, and implement PCF soft shadow filtering tuned for dynamic performance modes.
- **Mobile Touch Controls & Responsive UI**:
  - *Issue*: Current control scheme relies strictly on desktop keyboard/mouse and `ESC` menu toggles.
  - *Fix*: Develop virtual dual-joystick touch controls and adaptive HUD layout for tablet and mobile browser compatibility.
- **Memory Leak Diagnostics**:
  - *Issue*: Extended survival sessions (>30 waves) show gradual memory creep due to disposed material/geometry caching in Three.js renderer.
  - *Fix*: Implement strict cleanup hooks and explicit `dispose()` routines for all procedural geometries and texture atlases upon wave resets or level unloads.