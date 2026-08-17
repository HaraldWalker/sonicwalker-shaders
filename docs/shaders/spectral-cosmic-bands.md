---
layout: default
title: Spectral Cosmic Bands
---

<a href="{{ site.baseurl }}/" class="back">&larr; All shaders</a>

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

Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Visual output is free to use — see [README](https://github.com/HaraldWalker/sonicwalker-shaders#using-the-output).

<style>
  .back { display: inline-block; margin-bottom: 1rem; font-size: 0.875rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); }
  th { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
  td code { font-size: 0.85em; }
</style>
