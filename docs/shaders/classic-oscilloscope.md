---
layout: default
title: Classic Oscilloscope
---

<a href="{{ site.baseurl }}/" class="back">&larr; All shaders</a>

## Classic Oscilloscope

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/classic-oscilloscope/classic-oscilloscope.png" style="width:100%;border-radius:8px;">
  <source src="https://github.com/user-attachments/assets/1ca23792-b64d-4cb7-98fe-befbd7b29c39" type="video/mp4">
</video>

A retro CRT oscilloscope that displays the audio waveform with a green phosphor glow, graticule grid, scanlines, and crosshair. This shader uses VS2's built-in waveform texture and is only available for VS2.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `offsetX` | Offset X | 0.3 | 0–1 | Horizontal position of the waveform. |
| `offsetY` | Offset Y | 0.5 | 0–1 | Vertical position of the waveform. |
| `scale` | Scale | 1.05 | 0.1–2.0 | Vertical scale of the waveform. |
| `rotation` | Rotation | 0.5 | 0–1 | Rotation angle of the display. |
| `thickness` | Thickness | 0.5 | 0–1 | Line thickness of the waveform. |
| `gridOpacity` | Grid Opacity | 0.9 | 0–3 | Visibility of the oscilloscope graticule grid. |
| `glow` | Glow | 0.8 | 0–1 | Brightness of the phosphor glow around the waveform. |

### Downloads

- [classic-oscilloscope.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/classic-oscilloscope/classic-oscilloscope.frag) — VS2 version

This shader requires VS2's built-in audio waveform texture and has no ISF version.

Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Visual output is free to use — see [README](https://github.com/HaraldWalker/sonicwalker-shaders#using-the-output).

<style>
  .back { display: inline-block; margin-bottom: 1rem; font-size: 0.875rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); }
  th { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
  td code { font-size: 0.85em; }
</style>
