---
layout: default
title: Smiley Face
---

<a href="{{ site.baseurl }}/" class="back">&larr; All shaders</a>

## Smiley Face

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/smiley-face/smiley-face.png" style="width:100%;border-radius:8px;">
  <source src="" type="video/mp4">
</video>

A smiley face drawn with signed distance functions — a circle head, filled oval eyes that stretch with the smile parameter, and a mouth that curves from a flat line into a half-moon U-shape. The face rotates gently over time. In VS2, map audio or MIDI to the smile parameter to animate it.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `offsetX` | Offset X | 0.5 | 0–1 | Horizontal position of the face. |
| `offsetY` | Offset Y | 0.5 | 0–1 | Vertical position of the face. |
| `zoom` | Zoom | 0.575 | 0.1–2.0 | Camera zoom level. |
| `smile` | Smile | 0.4 | 0–1 | Controls mouth curve and eye stretch. |

### Downloads

- [smiley-face.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/smiley-face/smiley-face.frag) — VS2 version
- [smiley-face.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/smiley-face/smiley-face.fs) — ISF version

Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Visual output is free to use — see [README](https://github.com/HaraldWalker/sonicwalker-shaders#using-the-output).

<style>
  .back { display: inline-block; margin-bottom: 1rem; font-size: 0.875rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); }
  th { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
  td code { font-size: 0.85em; }
</style>
