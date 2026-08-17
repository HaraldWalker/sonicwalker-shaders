---
layout: shader
title: Fire Tunnel
---

## Fire Tunnel

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/fire-tunnel/fire-tunnel.png" style="width:100%;border-radius:8px;">
  <source src="https://github.com/user-attachments/assets/1cead94c-cb8a-439a-bafc-fd5a1d8936f5" type="video/mp4">
</video>

A first-person flight through a twisting fire tunnel with procedural flame walls. The camera follows a curved path while layered noise generates flickering fire along the tunnel walls. In VS2, map audio or MIDI to the parameters to make it reactive.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `offsetX` | Offset X | 0.0 | -1–1 | Horizontal camera offset. |
| `offsetY` | Offset Y | 0.0 | -1–1 | Vertical camera offset. |
| `intensity` | Intensity | 1.5 | 0–3 | Brightness and flame intensity. |
| `turbulence` | Turbulence | 1.05 | 0.1–2.0 | Amount of flame detail and distortion. |

### Downloads

- [fire-tunnel.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/fire-tunnel/fire-tunnel.frag) — VS2 version
- [fire-tunnel.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/fire-tunnel/fire-tunnel.fs) — ISF version

