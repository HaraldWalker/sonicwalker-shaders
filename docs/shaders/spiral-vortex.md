---
layout: shader
title: Spiral Vortex
---

## Spiral Vortex

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/spiral-vortex/spiral-vortex.png" style="width:100%;border-radius:8px;">
  <source src="https://github.com/user-attachments/assets/fabe4d60-8b26-4113-9d6c-efdf0d33d93f" type="video/mp4">
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

