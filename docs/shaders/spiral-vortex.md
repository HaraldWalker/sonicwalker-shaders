---
layout: default
title: Spiral Vortex
---

<a href="{{ site.baseurl }}/" class="back">&larr; All shaders</a>

## Spiral Vortex

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/spiral-vortex/spiral-vortex.png" style="width:100%;border-radius:8px;">
  <source src="" type="video/mp4">
</video>

A fiery spiral vortex with logarithmic arms driven by layered fractal noise. Multiple arms wrap around a glowing core, with flame-like detail that shifts over time. In VS2, map audio or MIDI to the parameters to make it reactive.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `offsetX` | Offset X | 0.0 | -1–1 | Horizontal position of the vortex center. |
| `offsetY` | Offset Y | 0.0 | -1–1 | Vertical position of the vortex center. |
| `size` | Size | 2.0 | 0.1–2.0 | Overall scale of the vortex. |
| `arms` | Arms | 4.5 | 1–8 | Number of spiral arms. |
| `intensity` | Intensity | 1.5 | 0–3 | Brightness and flame intensity. |

### Downloads

- [spiral-vortex.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/spiral-vortex/spiral-vortex.frag) — VS2 version
- [spiral-vortex.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/spiral-vortex/spiral-vortex.fs) — ISF version

Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Visual output is free to use — see [README](https://github.com/HaraldWalker/sonicwalker-shaders#using-the-output).

<style>
  .back { display: inline-block; margin-bottom: 1rem; font-size: 0.875rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); }
  th { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
  td code { font-size: 0.85em; }
</style>
