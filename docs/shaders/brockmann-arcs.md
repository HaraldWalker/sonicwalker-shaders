---
layout: shader
title: Brockmann Arcs
---

## Brockmann Arcs

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/brockmann-arcs/brockmann-arcs.png" style="width:100%;border-radius:8px;">
  <source src="" type="video/mp4">
</video>

Concentric arc bands inspired by Josef Müller-Brockmann's 1955 *Beethoven* concert poster. Each band is independently rotated, swept, and quantized to a pola
### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `bands` | Bands | 6.6 | 3–12 | Number of concentric arc bands. |
| `size` | Size | 0.5 | 0–1 | Overall scale of the arc pattern. |
| `thickness` | Thickness | 0.5 | 0–1 | Radial thickness of each band. |
| `grid` | Grid Steps | 0.525 | 0.05–1 | Polar grid resolution for quantized rotation. |
| `sweep` | Arc Sweep | 0.5 | 0–1 | Maximum angular extent of each arc. |
| `ease` | Edge Ease | 0.5 | 0–1 | Easing curve controlling how bands distribute outward. |
| `spin` | Spin | 0.5 | 0–1 | Global rotation speed and direction. |

### Downloads

- [brockmann-arcs.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/brockmann-arcs/brockmann-arcs.frag) — VS2 version
- [brockmann-arcs.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/brockmann-arcs/brockmann-arcs.fs) — ISF version
