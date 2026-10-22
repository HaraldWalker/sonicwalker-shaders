---
layout: shader
title: Cubic Tunnel
---

## Cubic Tunnel

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/cubic-tunnel/cubic-tunnel.png" style="width:100%;border-radius:8px;">
  <source src="https://github.com/user-attachments/assets/23b3f04e-0034-45e0-90e1-8590280328e3" type="video/mp4">
</video>

A raymarched tunnel of cubic cells flying toward the viewer. Each cell face gets a unique procedural color, and the tunnel path curves through space with controllable intensity and rotation.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `rotSpeed` | Rotation Speed | 0.5 | 0–1 | Speed and direction of camera roll rotation. |
| `cubeSize` | Cube Size | 0.5 | 0–1 | Scale of the cubic grid cells. |
| `tunnelSize` | Tunnel Size | 0.5 | 0–1 | Radius of the tunnel passage. |
| `curveIntensity` | Curve Intensity | 0.4 | 0–1 | How sharply the tunnel path curves through space. |

### Downloads

- [cubic-tunnel.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/cubic-tunnel/cubic-tunnel.frag) — VS2 version
- [cubic-tunnel.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/cubic-tunnel/cubic-tunnel.fs) — ISF version
