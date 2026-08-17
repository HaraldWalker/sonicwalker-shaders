---
layout: default
title: Fire Tunnel
---

<a href="{{ site.baseurl }}/" class="back">&larr; All shaders</a>

## Fire Tunnel

<img src="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/fire-tunnel/fire-tunnel.png" alt="Fire Tunnel" style="width:100%;border-radius:8px;">

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

Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Visual output is free to use — see [README](https://github.com/HaraldWalker/sonicwalker-shaders#using-the-output).

<style>
  .back { display: inline-block; margin-bottom: 1rem; font-size: 0.875rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); }
  th { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
  td code { font-size: 0.85em; }
</style>
