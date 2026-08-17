---
layout: shader
title: Fuzzy Cubes
---

## Fuzzy Cubes

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/fuzzy-cubes/fuzzy-cubes.png" style="width:100%;border-radius:8px;">
  <source src="https://github.com/user-attachments/assets/ea5a64b2-9203-4b33-ae1e-05bdaa9b28b8" type="video/mp4">
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

