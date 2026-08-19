---
layout: shader
title: Reactive Voxel Tunnel
---

## Reactive Voxel Tunnel

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/reactive-voxel-tunnel/reactive-voxel-tunnel.png" style="width:100%;border-radius:8px;">
  <source src="" type="video/mp4">
</video>

Audio-reactive first-person flight through a raymarched voxel tunnel driven by FFT frequency bands. Bass pulses the octahedron voxel size, mids breathe the tunnel width and weave, and highs add shimmer to the glow trails, with a cool-to-warm colour shift palette.

Adapted from "[Voxel tunnel](https://www.shadertoy.com/view/MscBRs)" by lsdlive.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `octahedronSize` | Octahedron Size | 0.68 | 0.2–1.8 | Size of the octahedron voxels forming the tunnel. |
| `density` | Tunnel Width | 3.6 | 2–6 | Width of the tunnel. |
| `fog` | Fog | 0.0001 | 0.0001–0.001 | Fog density, fading distant tunnel walls. |
| `glow` | Glow | 0.0053 | 0.005–0.025 | Volumetric glow intensity around voxel edges. |
| `pathAmount` | Weave | 0.4 | 0–2 | Amplitude of the tunnel's S-curve path. |
| `colorShift` | Color Shift | 0.0 | 0–1 | Blends between the cool blue palette and a warm alternate palette. |

### Downloads

- [reactive-voxel-tunnel.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/reactive-voxel-tunnel/reactive-voxel-tunnel.frag) — VS2 version

This shader relies on VS2's built-in FFT texture and cannot be converted to ISF.
