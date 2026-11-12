# Precise Fix Prompt: Resolving Test Environment Setup & Globals (Vitest/JSDOM)

Copy and use the following prompt or fix instructions to resolve test execution failures caused by missing JSDOM environment configuration, Three.js, `Octree`, `CONSUMABLES`, `SoundSystem`, and other global variables in Vitest:

```markdown
Please update the test runner configuration and environment setup (`package.json` / Vitest configuration and `test/setup.js`) so that:
1. Vitest is configured to use `jsdom` environment (`environment: 'jsdom'`), providing `document`, `window`, and DOM APIs natively without throwing `ReferenceError: document is not defined`.
2. Three.js is correctly installed/imported and globally exposed (`global.THREE = THREE` or imported in setup).
3. Core game classes/structures (`Octree`, `SoundSystem`, `CONSUMABLES`, `WEAPONS`, `state`, etc.) are either correctly loaded or exported/exposed globally so smoke tests in `test/smoke.test.js` can access them without `ReferenceError`.
```
- Fix `ReferenceError: state is not defined` in `test/smoke.test.js:269:12` by ensuring the global `state` object (or imported game state) is properly declared and initialized in the test environment or exposed on `globalThis` / `window` prior to running test blocks that access `state`.
- Fix test failures at `test/smoke.test.js:187:12` (Game State Initialization suite) by ensuring `state`, `WEAPONS`, and related game engine variables are globally available and properly initialized before executing smoke tests.