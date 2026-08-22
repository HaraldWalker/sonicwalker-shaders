---
layout: default
title: Shaders
---

## Generators

<div class="shader-grid">
  <a href="{{ site.baseurl }}/shaders/eclectic-cubes" class="shader-card">
    <img src="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/eclectic-cubes/eclectic-cubes.png" alt="Eclectic Cubes" loading="lazy">
    <h3>Eclectic Cubes</h3>
    <p>A 3×3×3 grid of cubes rendered with raymarching</p>
  </a>
  <a href="{{ site.baseurl }}/shaders/xor-panes" class="shader-card">
    <img src="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/xor-panes/xor-panes.png" alt="Xor Panes" loading="lazy">
    <h3>Xor Panes</h3>
    <p>Layers of animated rectangles and circles with quantized overlap brightness</p>
  </a>
  <a href="{{ site.baseurl }}/shaders/rotating-3d-rings" class="shader-card">
    <img src="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/rotating-3d-rings/rotating-3d-rings.png" alt="Rotating 3D Rings" loading="lazy">
    <h3>Rotating 3D Rings</h3>
    <p>Raymarched rotating torus rings with wireframe shading and glow</p>
  </a>
  <a href="{{ site.baseurl }}/shaders/talking-robot" class="shader-card">
    <img src="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/talking-robot/talking-robot.png" alt="Talking Robot" loading="lazy">
    <h3>Talking Robot</h3>
    <p>Animated robot face with blinking eyes, reactive eyebrows, and morphing mouth</p>
  </a>
  <a href="{{ site.baseurl }}/shaders/spiral-vortex" class="shader-card">
    <img src="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/spiral-vortex/spiral-vortex.png" alt="Spiral Vortex" loading="lazy">
    <h3>Spiral Vortex</h3>
    <p>Fiery spiral vortex with logarithmic arms and layered noise flames</p>
  </a>
  <a href="{{ site.baseurl }}/shaders/fuzzy-cubes" class="shader-card">
    <img src="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/fuzzy-cubes/fuzzy-cubes.png" alt="Fuzzy Cubes" loading="lazy">
    <h3>Fuzzy Cubes</h3>
    <p>A grid of pulsing cubes with volumetric glow rendered with raymarching</p>
  </a>
<a href="{{ site.baseurl }}/shaders/classic-oscilloscope" class="shader-card">
  <img src="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/classic-oscilloscope/classic-oscilloscope.png" alt="Classic Oscilloscope" loading="lazy">
  <h3>Classic Oscilloscope</h3>
  <p>Retro CRT oscilloscope displaying audio waveform with green phosphor glow</p>
</a>
<a href="{{ site.baseurl }}/shaders/spectral-terrain-grid" class="shader-card">
  <img src="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/spectral-terrain-grid/spectral-terrain-grid.png" alt="Spectral Terrain Grid" loading="lazy">
  <h3>Spectral Terrain Grid</h3>
    <p>Wireframe terrain shaped by the live audio spectrum with frequency-coloured grid lines</p>
  </a>
  <a href="{{ site.baseurl }}/shaders/smiley-face" class="shader-card">
    <img src="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/smiley-face/smiley-face.png" alt="Smiley Face" loading="lazy">
    <h3>Smiley Face</h3>
    <p>Simple smiley face with animated smile and rotation</p>
  </a>
  <a href="{{ site.baseurl }}/shaders/clouds-on-fire" class="shader-card">
    <img src="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/clouds-on-fire/clouds-on-fire.png" alt="Clouds on Fire" loading="lazy">
    <h3>Clouds on Fire</h3>
    <p>Spiral fire clouds with layered fractal noise and glowing ember core</p>
  </a>
  <a href="{{ site.baseurl }}/shaders/fire-tunnel" class="shader-card">
    <img src="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/fire-tunnel/fire-tunnel.png" alt="Fire Tunnel" loading="lazy">
    <h3>Fire Tunnel</h3>
    <p>First-person flight through a twisting fire tunnel with procedural flame walls</p>
  </a>
  <a href="{{ site.baseurl }}/shaders/spectral-cosmic-bands" class="shader-card">
    <img src="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/spectral-cosmic-bands/spectral-cosmic-bands.png" alt="Spectral Cosmic Bands" loading="lazy">
    <h3>Spectral Cosmic Bands</h3>
    <p>Audio-reactive raymarched ribbons and wave field driven by FFT frequency bands</p>
  </a>
  <a href="{{ site.baseurl }}/shaders/reactive-voxel-tunnel" class="shader-card">
    <img src="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/reactive-voxel-tunnel/reactive-voxel-tunnel.png" alt="Reactive Voxel Tunnel" loading="lazy">
    <h3>Reactive Voxel Tunnel</h3>
    <p>Audio-reactive raymarched voxel tunnel with bass-pulsing octahedrons and FFT-driven glow</p>
  </a>
  <a href="{{ site.baseurl }}/shaders/spectral-sheet" class="shader-card">
    <img src="https://raw.githubusercontent.com/HaraldWalker/sonicwalker-shaders/main/shaders/generators/spectral-sheet/spectral-sheet.png" alt="Spectral Sheet" loading="lazy">
    <h3>Spectral Sheet</h3>
    <p>FFT-driven undulating sheet with wind-blown waves and helical twist</p>
  </a>
</div>

<style>
  .shader-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }
  .shader-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.2s;
    color: var(--text);
  }
  .shader-card:hover {
    border-color: var(--accent);
    text-decoration: none;
  }
  .shader-card img {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
  }
  .shader-card h3 {
    padding: 0.75rem 1rem 0;
    font-size: 1rem;
  }
  .shader-card p {
    padding: 0.25rem 1rem 1rem;
    color: var(--text-muted);
    font-size: 0.875rem;
  }
</style>
