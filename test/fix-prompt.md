# Precise Fix Prompt: ReferenceError: window is not defined

Copy and use the following prompt or fix instructions to resolve the `ReferenceError: window is not defined` error occurring at `game.js:3589:1` when loaded in Node.js/Vitest:

```markdown
Please modify `game.js` around line 3589 to safely check for the presence of `window` before adding the DOMContentLoaded event listener and initializing the `Game` instance. 

Specifically, change:
```javascript
// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
```

To:
```javascript
// Initialize on page load (safeguarded for test runner and SSR environments)
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    new Game();
  });
}
```
```