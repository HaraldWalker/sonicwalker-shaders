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
