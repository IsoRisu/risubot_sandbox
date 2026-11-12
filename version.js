/**
 * CYBER STRIKE 3D - Version Management System (Semantic Versioning)
 * Version: 1.6.0
 */

const GAME_VERSION = {
  major: 1,
  minor: 7,
  patch: 0,
  tag: 'CYBER_STRIKE_HUD_UI_EXPANDED',
  toString() {
    return `v${this.major}.${this.minor}.${this.patch}-${this.tag}`;
  }
};

if (typeof window !== 'undefined') {
  window.GAME_VERSION = GAME_VERSION;
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const badge = document.getElementById('game-version-badge');
    if (badge) badge.textContent = GAME_VERSION.toString();

    const menuVersion = document.getElementById('menu-version');
    if (menuVersion) menuVersion.textContent = `CYBER STRIKE ENGINE ${GAME_VERSION.toString()}`;
  });
}

console.log(`[Cyber Strike 3D] Loaded Engine Version: ${GAME_VERSION.toString()}`);