---
layout: shader
title: Psycho Space Acid
---

## Psycho Space Acid

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/psycho-space-acid/psycho-space-acid.png" style="width:100%;border-radius:8px;">
  <source src="" type="video/mp4">
</video>

A pixelated psychedelic scene with a floating cube inside a patterned room. Camera angles, cube proportions, and per-surface acid patterns are re-rolled in stepped cuts, with random stutter freezes and a kick flash that washes the image white.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `speed` | Speed | 1.0 | 0–4 | Time scale driving the cuts and animation (ISF version only; VS2 uses the layer Speed control). |
| `sceneScale` | Scene Scale | 1.0 | 0.5–2 | Zoom of the scene — larger values zoom in. |
| `patternScale` | Pattern Scale | 2.0 | 0.5–8 | Pattern density on the cube and room surfaces. |
| `pixelSize` | Pixel Size | 4.0 | 1–32 | Pixelation block size in screen pixels. |
| `rotationSpeed` | Cube Rotation | 0.5 | 0–3 | Rotation speed of the cube. |
| `scrollSpeed` | Pattern Scroll | 0.5 | 0–4 | Scroll speed of the surface patterns. |
| `stutter` | Stutter | 0.25 | 0–1 | Probability of freezing the animation in random half-second segments. |
| `kick` | Kick | 0.0 | 0–1 | Flash to white — map to an audio kick or bass envelope. |

### Downloads

- [psycho-space-acid.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/psycho-space-acid/psycho-space-acid.frag) — VS2 version
- [psycho-space-acid.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/psycho-space-acid/psycho-space-acid.fs) — ISF version
