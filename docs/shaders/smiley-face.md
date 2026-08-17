---
layout: shader
title: Smiley Face
---

## Smiley Face

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/smiley-face/smiley-face.png" style="width:100%;border-radius:8px;">
  <source src="https://github.com/user-attachments/assets/eba1bdff-7dc7-4060-8d26-81f0a90f094b" type="video/mp4">
</video>

A simple smiley face with a circle head, filled oval eyes that stretch with the smile parameter, and a mouth that curves from a flat line into a half-moon U-shape. The face rotates gently over time. In VS2, map audio or MIDI to the smile parameter to animate it.

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

