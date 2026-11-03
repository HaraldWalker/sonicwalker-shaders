---
layout: shader
title: Binary Helix
---

## Binary Helix

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/binary-helix/binary-helix.png" style="width:100%;border-radius:8px;">
  <source src="" type="video/mp4">
</video>

A rotating double helix of glowing binary digits connected by luminous strands, with depth blur that softens elements toward the camera and drifting binary particles at three depths. Digits occasionally flip bits and the rungs fade as they turn toward the viewer.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `tilt` | Tilt | 22.91 | -90–90 | Leans the helix axis left or right in degrees. |
| `stretch` | Stretch | 1.0 | 0.5–2.0 | Stretches the helix along its own axis. |
| `radius` | Helix Radius | 0.27 | 0.1–0.45 | Radius of the helix. |
| `digitDensity` | Digits Per Rung | 22 | 8–40 | Number of binary digits along each rung. |
| `particles` | Particles | 0.6 | 0–1 | Amount of drifting binary particles in the background. |
| `depthBlur` | Depth Blur | 0.8 | 0–2 | Blur strength for elements in front of the focus plane. |
| `glow` | Glow | 1.0 | 0–3 | Glow intensity of strands and digit halos. |

### Downloads

- [binary-helix.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/binary-helix/binary-helix.frag) — VS2 version
- [binary-helix.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/binary-helix/binary-helix.fs) — ISF version
