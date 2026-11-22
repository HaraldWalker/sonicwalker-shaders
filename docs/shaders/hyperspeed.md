---
layout: shader
title: Hyperspeed
---

## Hyperspeed

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/hyperspeed/hyperspeed.png" style="width:100%;border-radius:8px;">
  <source src="" type="video/mp4">
</video>

A warp-speed corridor of light streaks fanning out from a vanishing point like a hyperspace jump. Perspective side walls, ceiling and floor carry stretched noise filaments around a luminous central seam, with drifting black voids along the edges.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `speed` | Speed | 1.0 | 0–4 | Time scale driving the streak motion (ISF version only; VS2 uses the layer Speed control). |
| `density` | Density | 2.0 | 0.3–8 | Number of streaks packed across the walls. |
| `streakLength` | Streak Length | 1.0 | 0.2–4 | Elongation of the streaks along the direction of travel. |
| `glow` | Glow | 1.0 | 0–3 | Brightness of the central seam and vanishing-point core. |
| `distortion` | Distortion | 0.5 | 0–2 | Organic wobble warping the corridor. |
| `colorShift` | Color Shift | 0.0 | -0.5–0.5 | Shifts the palette hue between orange, magenta, yellow, green and blue. |
| `contrast` | Contrast | 1.0 | 0.2–3 | Contrast falloff of the streak intensity — higher values isolate the brightest filaments. |
| `aperture` | Aperture | 1.2 | 0.3–3 | Size of the dark vignette opening around the center. |

### Downloads

- [hyperspeed.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/hyperspeed/hyperspeed.frag) — VS2 version
- [hyperspeed.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/hyperspeed/hyperspeed.fs) — ISF version
