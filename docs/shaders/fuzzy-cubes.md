---
layout: default
title: Fuzzy Cubes
---

<a href="{{ site.baseurl }}/" class="back">&larr; All shaders</a>

## Fuzzy Cubes

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/fuzzy-cubes/fuzzy-cubes.png" style="width:100%;border-radius:8px;">
  <source src="" type="video/mp4">
</video>

A grid of cubes rendered with raymarching, each pulsing at its own speed and phase. The grid rotates slowly on all three axes while volumetric glow accumulates along the ray march. In VS2, map audio or MIDI to the parameters to make it reactive.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `offsetX` | Offset X | 0.5 | 0–1 | Horizontal position of the grid. |
| `offsetY` | Offset Y | 0.5 | 0–1 | Vertical position of the grid. |
| `offsetZ` | Offset Z | 0.5 | 0–1 | Depth position of the grid. |
| `zoom` | Zoom | 0.5 | 0–1 | Camera distance. |
| `density` | Density | 0.33 | 0–1 | Number of cubes per axis (1–5). |
| `intensity` | Intensity | 0.5 | 0–1 | Amount of pulsing animation. |
| `glow` | Glow | 0.5 | 0–1 | Brightness of the volumetric glow. |

### Downloads

- [fuzzy-cubes.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/fuzzy-cubes/fuzzy-cubes.frag) — VS2 version
- [fuzzy-cubes.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/fuzzy-cubes/fuzzy-cubes.fs) — ISF version

Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Visual output is free to use — see [README](https://github.com/HaraldWalker/sonicwalker-shaders#using-the-output).

<style>
  .back { display: inline-block; margin-bottom: 1rem; font-size: 0.875rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); }
  th { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
  td code { font-size: 0.85em; }
</style>
