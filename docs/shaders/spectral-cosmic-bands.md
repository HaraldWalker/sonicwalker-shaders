---
layout: shader
title: Spectral Cosmic Bands
---

## Spectral Cosmic Bands

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/spectral-cosmic-bands/spectral-cosmic-bands.png" style="width:100%;border-radius:8px;">
  <source src="https://github.com/user-attachments/assets/753645ae-41fb-4b98-9bfa-12785fd790bc" type="video/mp4">
</video>

Audio-reactive raymarched ribbons and wave field driven by FFT frequency bands. Two twisting ribbon manifolds and a rippling ground plane respond to bass, mids, and highs, with volumetric glow and depth-based colour shifting.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `perspective` | Perspective | 0.5 | 0–1 | Camera distance — 0 is far, 1 is close. |
| `brightness` | Brightness | 1.1 | 0.2–2.0 | Overall scene brightness. |
| `intensity` | Intensity | 0.5 | 0–1 | How strongly audio drives ribbon motion. |
| `thickness` | Thickness | 0.55 | 0.1–1.0 | Ribbon cross-section thickness. |
| `glow` | Glow | 1.0 | 0–2 | Volumetric glow intensity around ribbons. |

### Downloads

- [spectral-cosmic-bands.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/spectral-cosmic-bands/spectral-cosmic-bands.frag) — VS2 version

This shader relies on VS2's built-in FFT texture and cannot be converted to ISF.

