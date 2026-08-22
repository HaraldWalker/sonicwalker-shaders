---
layout: shader
title: Triakis Gem
---

## Triakis Gem

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/triakis-gem/triakis-gem.png" style="width:100%;border-radius:8px;">
  <source src="https://github.com/user-attachments/assets/1c797220-77f6-4f5a-919c-437770050cc4" type="video/mp4">
</video>

A raymarched octahedron gem with faceted ridges, a green-to-amber gradient, and dark edge lines. The shape rotates slowly with a gentle bob, and light sweeps across the faces.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `offsetX` | Offset X | 0.0 | -1.0–1.0 | Horizontal shift of the gem in view space. |
| `offsetY` | Offset Y | 0.0 | -1.0–1.0 | Vertical shift of the gem in view space. |
| `size` | Size | 0.85 | 0.2–1.5 | Scale of the gem. |
| `ridgeHeight` | Ridge Height | 0.9 | 0.3–1.5 | How far the ridge points protrude from each face. |
| `edgeWidth` | Edge Width | 0.5 | 0.0–1.0 | Thickness of the dark edge lines between faces. |
| `lightIntensity` | Light Intensity | 0.75 | 0.0–1.5 | Brightness of the directional light. |
| `lightAngle` | Light Angle | 180° | 0–360° | Direction of the directional light. |

### Downloads

- [triakis-gem.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/triakis-gem/triakis-gem.frag) — VS2 version
- [triakis-gem.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/triakis-gem/triakis-gem.fs) — ISF version
