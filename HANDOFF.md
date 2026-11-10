# Handoff from the previous run

## What this run did

- Included Three
- js postprocessing addon scripts in index
- html for EffectComposer, RenderPass, UnrealBloomPass, and FilmPass to enable high-end cyber strike neon bloom and visual effects

## What the next run should do

- Initialize EffectComposer, RenderPass, and UnrealBloomPass in game.js setup/renderer creation
- Configure film grain and dynamic depth-of-field (or custom post-processing passes) for ADS states
- Update animation/render loop to use composer.render() instead of renderer.render() and handle window resizing correctly

## Caveats

- `game.js`: exists but is NOT shown (128808 chars, over the 120000-char per-file limit). Do not edit or re-create it.

## How to verify

- `python -m unittest discover -v`
- Expected: all green
