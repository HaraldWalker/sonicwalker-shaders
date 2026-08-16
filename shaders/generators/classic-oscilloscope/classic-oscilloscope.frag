/*
{
    "author": "Harald Walker",
    "color": "#33ff33",
    "movement": false,
    "parameters": [
        {
            "default": 0.3,
            "max": 1,
            "min": 0,
            "name": "offsetX",
            "label": "Offset X"
        },
        {
            "default": 0.5,
            "max": 1,
            "min": 0,
            "name": "offsetY",
            "label": "Offset Y"
        },
        {
            "default": 0.5,
            "max": 2,
            "min": 0.1,
            "name": "scale",
            "label": "Scale"
        },
        {
            "default": 0.5,
            "max": 1,
            "min": 0,
            "name": "rotation",
            "label": "Rotation"
        },
        {
            "default": 0.5,
            "max": 1,
            "min": 0,
            "name": "thickness",
            "label": "Thickness"
        },
        {
            "default": 0.3,
            "max": 3.0,
            "min": 0,
            "name": "gridOpacity",
            "label": "Grid Opacity"
        },
        {
            "default": 0.8,
            "max": 1,
            "min": 0,
            "name": "glow",
            "label": "Glow"
        }
    ],
    "url": "https://github.com/HaraldWalker/sonicwalker-shaders",
    "uuid": "a8f3c21d-4e5b-4f7a-9c2d-1b8e6a5f3c4d",
    "version": "1.2.0"
}
*/

/*
 * Copyright (c) Harald Walker / Sonic Walker
 * https://github.com/HaraldWalker/sonicwalker-shaders
 *
 * Licensed under CC BY-NC-SA 4.0
 * https://creativecommons.org/licenses/by-nc-sa/4.0/
 *
 * You may use the visual output of this shader freely.
 * If you profit from it, consider supporting the artist:
 * https://www.sonicwalker.com
 */

#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265358979323846

// Rotation matrix
vec2 rotate(vec2 p, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

// Draw grid lines
float grid(vec2 p, float size, float thickness) {
    vec2 grid = abs(fract(p / size - 0.5) - 0.5) * size;
    float line = min(grid.x, grid.y);
    return 1.0 - smoothstep(0.0, thickness, line);
}

// Draw a point on the waveform
float waveformPoint(vec2 p, vec2 pos, float thickness) {
    float d = length(p - pos);
    return smoothstep(thickness, thickness * 0.3, d);
}

void main() {
    float div = resolution.y / resolution.x;
    vec2 aspect = vec2(1.0, div);
    
    // Center and apply scale
    vec2 center = vec2(offsetX, offsetY);
    vec2 uv = texCoord * aspect;
    
    // Scale Y only — keeps full width, adjusts waveform height
    vec2 p = uv - center;
    p.y /= scale;
    
    // Apply rotation
    float angle = (rotation - 0.5) * PI * 2.0;
    p = rotate(p, angle);
    
    // Draw grid (oscilloscope graticule)
    float gridLines = grid(p, 0.1, 0.002);
    float gridLines2 = grid(p, 0.02, 0.001);
    float gridPattern = max(gridLines * 0.3, gridLines2 * 0.15) * gridOpacity;
    
    // Draw waveform from audio input
    float wave = 0.0;
    float waveThickness = 0.008 * thickness;
    
    for(float i = -1.0; i <= 1.0; i += 0.003) {
        float texX = (i + 1.0) * 0.5;
        float waveform = texture(waveformTex, vec2(texX, 0.0)).r;
        float wy = (waveform - 0.5) * 0.8;
        
        wave += waveformPoint(p, vec2(i, wy), waveThickness);
        wave += waveformPoint(p, vec2(i, wy), waveThickness * 3.0) * 0.3 * glow;
    }
    
    // Draw center crosshair
    float crosshairX = 1.0 - smoothstep(0.0, 0.003, abs(p.y));
    float crosshairY = 1.0 - smoothstep(0.0, 0.003, abs(p.x));
    float crosshair = max(crosshairX * step(abs(p.x), 0.9), crosshairY * step(abs(p.y), 0.9)) * 0.2;
    
    // Combine elements
    float pattern = max(gridPattern, wave);
    pattern = max(pattern, crosshair);
    
    // CRT screen effect - slight vignette
    float vignette = 1.0 - length(p) * 0.3;
    pattern *= vignette;
    
    // Scanline effect
    float scanline = sin(p.y * 200.0) * 0.05 + 0.95;
    pattern *= scanline;
    
    // Green phosphor color
    vec3 finalColor = vec3(pattern * 0.2, pattern, pattern * 0.2);
    float coloredPixels = dot(clamp(finalColor, 0.0, 1.0), vec3(1.0));
    
    fragColor = vec4(finalColor * color.rgb, alpha * coloredPixels);
}
