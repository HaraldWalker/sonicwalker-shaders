---
layout: default
title: Rotating 3D Rings
---

<a href="{{ site.baseurl }}/" class="back">&larr; All shaders</a>

## Rotating 3D Rings

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/rotating-3d-rings/Image.png" style="width:100%;border-radius:8px;">
  <source src="https://github.com/user-attachments/assets/d857441e-f9ba-4263-883c-29e4299f096d" type="video/mp4">
</video>

Raymarched rotating torus rings with wireframe shading and glow. Up to 4 concentric rings tilt and spin independently, each with its own speed and direction. In VS2, map audio or MIDI to the parameters to make it reactive.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `camera` | Camera | 0.5 | 0.1–2.0 | Camera distance from the ring assembly. |
| `rings` | Rings | 0.34 | 1–4 | Number of concentric torus rings. |
| `thickness` | Thickness | 0.5 | 0.1–1.0 | Tube radius of each ring. |
| `wireframe` | Wireframe | 0.5 | 0.1–1.0 | Density of the wireframe grid lines on the ring surface. |
| `intensity` | Intensity | 0.5 | 0.0–3.0 | Amount of tilt wobble and spin variation over time. |
| `glow` | Glow | 0.5 | 0.0–1.0 | Brightness and spread of the volumetric glow around the rings. |

### Downloads

- [rotating-3d-rings.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/rotating-3d-rings/rotating-3d-rings.frag) — VS2 version
- [rotating-3d-rings.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/rotating-3d-rings/rotating-3d-rings.fs) — ISF version

Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Visual output is free to use — see [README](https://github.com/HaraldWalker/sonicwalker-shaders#using-the-output).

<style>
  .back { display: inline-block; margin-bottom: 1rem; font-size: 0.875rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); }
  th { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
  td code { font-size: 0.85em; }
</style>
