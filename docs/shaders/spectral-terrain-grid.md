---
layout: shader
title: Spectral Terrain Grid
---

## Spectral Terrain Grid

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/spectral-terrain-grid/spectral-terrain-grid.png" style="width:100%;border-radius:8px;">
  <source src="https://github.com/user-attachments/assets/e9182fee-8d17-4520-8869-5515668ae8d7" type="video/mp4">
</video>

A wireframe terrain whose height is shaped by the live audio spectrum. The grid is coloured by frequency using HSV mapping — low frequencies appear red, high frequencies shift toward blue/violet. Domain-warped noise adds organic ridges that swell and twist with depth. This shader uses VS2's built-in FFT texture and is only available for VS2.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `camera` | Camera | 1.5 | 0–3 | Camera distance and height. |
| `rotation` | Rotation | 16.2 | 0–360 | Orbit angle around the terrain in degrees. |
| `tilt` | Tilt | 0.0 | -45–45 | Pitch angle of the camera in degrees. |
| `height` | Height | 1.3 | 0.1–2.5 | Vertical scale of the terrain. |
| `glow` | Glow | 0.4 | 0–1 | Halo spread around grid lines. |
| `fog` | Fog | 0.4 | 0–1 | Depth fog intensity. |
| `reactivity` | Audio Reactivity | 0.6 | 0–1 | How much the audio spectrum affects terrain height. |

### Downloads

- [spectral-terrain-grid.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/spectral-terrain-grid/spectral-terrain-grid.frag) — VS2 version

This shader requires VS2's built-in FFT texture and has no ISF version.

