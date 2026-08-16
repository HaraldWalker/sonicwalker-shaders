---
layout: default
title: Eclectic Cubes
---

<a href="{{ site.baseurl }}/" class="back">&larr; All shaders</a>

## Eclectic Cubes

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/eclectic-cubes/eclectic-cubes.png" style="width:100%;border-radius:8px;">
  <source src="https://github.com/user-attachments/assets/9396e65f-1d90-4461-b4e6-ba19310b2248" type="video/mp4">
</video>

A 3×3×3 grid of cubes rendered with raymarching. Make it reactive by mapping LFOs, EGs, audio or MIDI to the parameters below.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `rotationAngle` | Rotation | 0.15 | 0–360 | Controls which axes are rotating and at what speed. Low values rotate on Y only, mid values add X, high values add Z. |
| `cubeSize` | Cube Size | 0.4 | 0.1–0.6 | Size of each individual cube. |
| `spacing` | Spacing | 0.35 | 0.05–1.0 | Distance between cube centers in the grid. |
| `expansion` | Expansion | 0.0 | 0.0–1.0 | Pushes outer cubes further from the center based on their distance from the grid origin. |
| `intensity` | Light Intensity | 0.5 | 0.0–1.0 | Brightness of the directional light and fresnel edge glow. |
| `lightAngle` | Light Angle | 0.35 | 0–360 | Angle of the directional light source in degrees. |

### Downloads

- [eclectic-cubes.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/eclectic-cubes/eclectic-cubes.frag) — VS2 version
- [eclectic-cubes.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/eclectic-cubes/eclectic-cubes.fs) — ISF version

Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Visual output is free to use — see [README](https://github.com/HaraldWalker/sonicwalker-shaders#using-the-output).

<style>
  .back { display: inline-block; margin-bottom: 1rem; font-size: 0.875rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); }
  th { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
  td code { font-size: 0.85em; }
</style>
