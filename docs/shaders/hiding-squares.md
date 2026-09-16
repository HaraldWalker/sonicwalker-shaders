---
layout: shader
title: Hiding Squares
---

## Hiding Squares

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/hiding-squares/hiding-squares.png" style="width:100%;border-radius:8px;">
  <source src="" type="video/mp4">
</video>

A grid of squares animated with noise-driven rotation, translation, and scale transformations. Each square's movement intensity is controlled by a noise field seeded from the grid position, creating an organic hiding/revealing effect.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `rotIntensity` | Rotation Intensity | 0.0 | 0–90 | Per-square rotation angle in degrees. |
| `transIntensity` | Translation Intensity | 18.0 | 0–100 | Per-square translation displacement. |
| `scaleIntensity` | Scale Intensity | 0.0 | 0–1.4 | Per-square scale variation. |
| `cols` | Columns | 17.0 | 4–40 | Number of grid columns. |
| `noiseScale` | Noise Scale | 4.132 | 1–10 | Scale of the noise field controlling movement. |
| `seed` | Seed | 3100 | 0–5000 | Random seed for noise offset. |

### Downloads

- [hiding-squares.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/hiding-squares/hiding-squares.frag) — VS2 version
- [hiding-squares.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/hiding-squares/hiding-squares.fs) — ISF version
