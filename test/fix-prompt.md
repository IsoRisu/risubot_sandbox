# Precise Fix Prompt: Resolving Test Environment Setup & Globals (Vitest/JSDOM)

Copy and use the following prompt or fix instructions to resolve test execution failures caused by missing JSDOM environment configuration, Three.js, `Octree`, `CONSUMABLES`, `SoundSystem`, and other global variables in Vitest:

```markdown
Please update the test runner configuration and environment setup (`package.json` / Vitest configuration and `test/setup.js`) so that:
1. Vitest is configured to use `jsdom` environment (`environment: 'jsdom'`), providing `document`, `window`, and DOM APIs natively without throwing `ReferenceError: document is not defined`.
2. Three.js is correctly installed/imported and globally exposed (`global.THREE = THREE` or imported in setup).
3. Core game classes/structures (`Octree`, `SoundSystem`, `CONSUMABLES`, `WEAPONS`, `state`, etc.) are either correctly loaded or exported/exposed globally so smoke tests in `test/smoke.test.js` can access them without `ReferenceError`.
```
- Fix `ReferenceError: state is not defined` in `test/smoke.test.js:269:12` by ensuring the global `state` object (or imported game state) is properly declared and initialized in the test environment or exposed on `globalThis` / `window` prior to running test blocks that access `state`.
- Fix test failures at `test/smoke.test.js:187:12` (Game State Initialization suite) by ensuring `state`, `WEAPONS`, and related game engine variables are globally available and properly initialized before executing smoke tests.- Fix test failure at `test/smoke.test.js:219:20` for health/maxHealth expectations by ensuring `state.health` and `state.maxHealth` are correctly initialized (or properly reset prior to evaluation) in test cases.- Fix `ReferenceError: state is not defined` in `test/smoke.test.js:283:5` (Game State Initialization, Weapon Switching, and Ammo Calculations suite) by making sure `state` is defined globally or imported in test suites accessing it.- Fix `ReferenceError: state is not defined` in `test/smoke.test.js:240:19`, `269:12`, `313:5`, `327:5`, and `363:5` by ensuring `state` is declared globally or imported/initialized before test suites execute.