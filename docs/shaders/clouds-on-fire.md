---
layout: default
title: Clouds on Fire
---

<a href="{{ site.baseurl }}/" class="back">&larr; All shaders</a>

## Clouds on Fire

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/clouds-on-fire/clouds-on-fire.png" style="width:100%;border-radius:8px;">
  <source src="" type="video/mp4">
</video>

Spiral fire clouds with layered fractal noise and a glowing ember core. The spiral arm pattern blends with fbm noise to create flame-like clouds that radiate outward from the center.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `offsetX` | Offset X | 0.0 | -1–1 | Horizontal position of the fire center. |
| `offsetY` | Offset Y | 0.0 | -1–1 | Vertical position of the fire center. |
| `size` | Size | 1.62 | 0.1–2.0 | Overall scale of the fire clouds. |
| `intensity` | Intensity | 0.6 | 0–3 | Brightness and flame intensity. |

### Downloads

- [clouds-on-fire.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/clouds-on-fire/clouds-on-fire.frag) — VS2 version
- [clouds-on-fire.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/clouds-on-fire/clouds-on-fire.fs) — ISF version

Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Visual output is free to use — see [README](https://github.com/HaraldWalker/sonicwalker-shaders#using-the-output).

<style>
  .back { display: inline-block; margin-bottom: 1rem; font-size: 0.875rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); }
  th { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
  td code { font-size: 0.85em; }
</style>
