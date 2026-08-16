---
layout: default
title: Xor Panes
---

<a href="{{ site.baseurl }}/" class="back">&larr; All shaders</a>

## Xor Panes

![Xor Panes](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/xor-panes/xor-panes.png)

Multiple layers of animated rectangles and circles. Each pane has a distinct hue and contains randomly placed shapes that move along sinusoidal paths. Brightness is quantized based on how many panes overlap at each pixel. In VS2, map audio or MIDI to the parameters to make it reactive.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `zoom` | Zoom | 0.8 | 0.2–3.0 | Camera zoom level. |
| `panes` | Panes | 7 | 2–15 | Number of layers, each with its own hue and set of shapes. |
| `density` | Density | 4 | 1–6 | Number of shapes per pane. |
| `intensity` | Intensity | 2 | 2–8 | Controls the number of brightness steps. Lower values give more contrast. |
| `monochrome` | Monochrome | 0.0 | 0–1 | When enabled, renders in grayscale using the layer tint color. |

### Downloads

- [xor-panes.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/xor-panes/xor-panes.frag) — VS2 version
- [xor-panes.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/xor-panes/xor-panes.fs) — ISF version

Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Visual output is free to use — see [README](https://github.com/HaraldWalker/sonicwalker-shaders#using-the-output).

<style>
  .back { display: inline-block; margin-bottom: 1rem; font-size: 0.875rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); }
  th { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
  td code { font-size: 0.85em; }
</style>
