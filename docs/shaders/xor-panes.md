---
layout: shader
title: Xor Panes
---

## Xor Panes

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/xor-panes/xor-panes.png" style="width:100%;border-radius:8px;">
  <source src="https://github.com/user-attachments/assets/36cb2688-34ec-499a-ba48-f021932b02a9" type="video/mp4">
</video>

Multiple layers of animated rectangles and circles. Each pane has a distinct hue and contains randomly placed shapes that move along sinusoidal paths. Brightness is quantized based on how many panes overlap at each pixel. In VS2, map audio or MIDI to the parameters to make it reactive.

### Parameters

| Parameter | Label | Default | Range | Description |
|-----------|-------|---------|-------|-------------|
| `zoom` | Zoom | 0.8 | 0.2–3.0 | Camera zoom level. |
| `panes` | Panes | 7 | 2–15 | Number of layers, each with its own hue and set of shapes. |
| `density` | Density | 4 | 1–6 | Number of shapes per pane. |
| `intensity` | Intensity | 2 | 2–8 | Controls the number of brightness steps. Lower values give more contrast. |
| `monochrome` | Monochrome | 0.0 | 0–1 | When enabled, renders in grayscale using the layer tint color. |

### Downloads

- [xor-panes.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/xor-panes/xor-panes.frag) — VS2 version
- [xor-panes.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/xor-panes/xor-panes.fs) — ISF version

