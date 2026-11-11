/**
 * CYBER STRIKE 3D - Version Management System (Semantic Versioning)
 * Version: 1.2.0
 */

const GAME_VERSION = {
  major: 1,
  minor: 3,
  patch: 0,
  tag: 'UTILITIES_AND_MODS',
  toString() {
    return `v${this.major}.${this.minor}.${this.patch}-${this.tag}`;
  }
};

window.GAME_VERSION = GAME_VERSION;

document.addEventListener('DOMContentLoaded', () => {
  const badge = document.getElementById('game-version-badge');
  if (badge) badge.textContent = GAME_VERSION.toString();

  const menuVersion = document.getElementById('menu-version');
  if (menuVersion) menuVersion.textContent = `CYBER STRIKE ENGINE ${GAME_VERSION.toString()}`;
});

console.log(`[Cyber Strike 3D] Loaded Engine Version: ${GAME_VERSION.toString()}`);