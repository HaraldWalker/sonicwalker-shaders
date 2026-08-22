---
layout: shader
title: Spectral Sheet
---

## Spectral Sheet

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/spectral-sheet/spectral-sheet.png" style="width:100%;border-radius:8px;">
  <source src="" type="video/mp4">
</video>

A continuous undulating sheet whose height is driven by the FFT spectrum. Waves travel along the surface creating a wind-blown fabric effect, with twist spiraling the spectrum pattern into a helical ribbon — bass on the left, treble on the right.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `rotation` | Rotation | 144° | 0–360° | Orbit angle around the sheet. |
| `tilt` | Tilt | 9° | -45–45° | Vertical tilt of the camera. |
| `camera` | Camera | 3.65 | 0.5–4.0 | Distance from the sheet surface. |
| `amplitude` | Amplitude | 1.43 | 0.1–2.0 | Height of the spectrum-driven displacement. |
| `waveFreq` | Wave Frequency | 4.3 | 1.0–12.0 | Frequency of the traveling wind waves. |
| `twist` | Twist | 0.38 | 0.1–1.5 | How much the spectrum pattern spirals along the sheet. |
| `reactivity` | Audio Reactivity | 0.6 | 0.0–1.0 | How strongly the audio drives the surface and glow. |

### Downloads

- [spectral-sheet.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/spectral-sheet/spectral-sheet.frag) — VS2 version

This shader relies on VS2's built-in FFT texture and cannot be converted to ISF.
