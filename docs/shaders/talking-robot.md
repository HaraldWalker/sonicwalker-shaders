---
layout: default
title: Talking Robot
---

<a href="{{ site.baseurl }}/" class="back">&larr; All shaders</a>

## Talking Robot

<video controls preload="none" poster="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/talking-robot/talking-robot.png" style="width:100%;border-radius:8px;">
  <source src="https://private-user-images.githubusercontent.com/2520109/636650931-9bc04c61-de62-41b2-a487-75ec36575816.mp4?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODY4OTEwODMsIm5iZiI6MTc4Njg5MDc4MywicGF0aCI6Ii8yNTIwMTA5LzYzNjY1MDkzMS05YmMwNGM2MS1kZTYyLTQxYjItYTQ4Ny03NWVjMzY1NzU4MTYubXA0P1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI2MDgxNiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNjA4MTZUMTQzMzAzWiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9MGZmZDQ1ZDhmZTZmMTU3NDhjZTc4YmQ4NDg0OWEzYzdmNTI2NTZmMDFiODZlYzNhZGJiNzU1OGEyZWUwYzg2NCZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmcmVzcG9uc2UtY29udGVudC10eXBlPXZpZGVvJTJGbXA0In0.6lsOPJyVrG-UgiRG0YagEz6emo6oPdCakCfy_UHwECs" type="video/mp4">
</video>

A robot face built from 2D signed distance functions — rounded box head, circle eyes, animated pupils that blink, eyebrows that react to the talk parameter, and a mouth that morphs from a closed line to an open shape. An antenna ball glows on top. In VS2, map audio or MIDI to the talk parameter to make it speak.

### Parameters

| Parameter | Label | Default | Range | Description                               |
|-----------|-------|---------|-------|-------------------------------------------|
| `offsetX` | Offset X | 0.5 | 0–1 | Horizontal position of the face.          |
| `offsetY` | Offset Y | 0.5 | 0–1 | Vertical position of the face.            |
| `zoom` | Zoom | 1.05 | 0.1–2.0 | Camera zoom level.                        |
| `talk` | Talk | 0.0 | 0–1 | Controls mouth opening and eyebrow raise. |

### Downloads

- [talking-robot.frag](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/talking-robot/talking-robot.frag) — VS2 version
- [talking-robot.fs](https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/talking-robot/talking-robot.fs) — ISF version

Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Visual output is free to use — see [README](https://github.com/HaraldWalker/sonicwalker-shaders#using-the-output).

<style>
  .back { display: inline-block; margin-bottom: 1rem; font-size: 0.875rem; }
  table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); }
  th { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
  td code { font-size: 0.85em; }
</style>
