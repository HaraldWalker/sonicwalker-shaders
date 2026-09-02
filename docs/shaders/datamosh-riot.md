---
layout: shader
title: Datamosh Riot
---

## Datamosh Riot

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/datamosh-riot/datamosh-riot.png" style="width:100%;border-radius:8px;">
  <source src="https://github.com/user-attachments/assets/99761725-6e97-4ca2-aadc-b3b741261620" type="video/mp4">
</video>

A chunky color-band signal torn apart by row and column shifts, RGB channel split, scattered block corruption and rolling scanlines — a hard, broken-broadcast riot.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `sliceSize` | Slice Size | 0.35 | 0–1 | Thickness of the horizontal/vertical slices used for shifting and the block-corruption grid. |
| `glitchAmount` | Glitch Amount | 0.55 | 0–1 | Overall glitch intensity — scales triggers, block corruption and per-pixel jitter. |
| `shiftAmount` | Shift | 0.55 | 0–1 | How far triggered rows, columns and big-row bands tear sideways. |
| `rgbShift` | RGB Shift | 0.5 | 0–1 | Magnitude of red/blue channel split along the shift direction. |
| `blockCorrupt` | Block Corruption | 0.5 | 0–1 | Density of the random colored block corruption that overlays the signal. |
| `scanlines` | Scanlines | 0.35 | 0–1 | Strength of the vertical scanline modulation over the final image. |

### Downloads

- [datamosh-riot.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/datamosh-riot/datamosh-riot.frag) — VS2 version
- [datamosh-riot.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/datamosh-riot/datamosh-riot.fs) — ISF version
