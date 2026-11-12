# Precise Fix Prompt: Resolving Test Environment Setup & Globals (Vitest/JSDOM)

Copy and use the following prompt or fix instructions to resolve test execution failures caused by missing JSDOM environment configuration, Three.js, `Octree`, `CONSUMABLES`, `SoundSystem`, and other global variables in Vitest:

```markdown
Please update the test runner configuration and environment setup (`package.json` / Vitest configuration and `test/setup.js`) so that:
1. Vitest is configured to use `jsdom` environment (`environment: 'jsdom'`), providing `document`, `window`, and DOM APIs natively without throwing `ReferenceError: document is not defined`.
2. Three.js is correctly installed/imported and globally exposed (`global.THREE = THREE` or imported in setup).
3. Core game classes/structures (`Octree`, `SoundSystem`, `CONSUMABLES`, `WEAPONS`, `state`, etc.) are either correctly loaded or exported/exposed globally so smoke tests in `test/smoke.test.js` can access them without `ReferenceError`.
```