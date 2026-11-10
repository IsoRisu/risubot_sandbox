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
