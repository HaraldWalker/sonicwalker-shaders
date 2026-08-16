---
layout: default
title: Spectral Terrain Grid
---

<a href="{{ site.baseurl }}/" class="back">&larr; All shaders</a>

## Spectral Terrain Grid

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/spectral-terrain-grid/spectral-terrain-grid.png" style="width:100%;border-radius:8px;">
  <source src="" type="video/mp4">
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

Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Visual output is free to use — see [README](https://github.com/HaraldWalker/sonicwalker-shaders#using-the-output).

<style>
  .back { display: inline-block; margin-bottom: 1rem; font-size: 0.875rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); }
  th { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
  td code { font-size: 0.85em; }
</style>
