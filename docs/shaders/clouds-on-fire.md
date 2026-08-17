---
layout: shader
title: Clouds on Fire
---

## Clouds on Fire

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/clouds-on-fire/clouds-on-fire.png" style="width:100%;border-radius:8px;">
  <source src="https://github.com/user-attachments/assets/d3440a56-ee85-4122-9e83-679a07caf1b4" type="video/mp4">
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

