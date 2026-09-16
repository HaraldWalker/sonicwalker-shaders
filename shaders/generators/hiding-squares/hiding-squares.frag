/*
{
    "author": "Harald Walker",
    "color": "#cccccc",
    "movement": true,
    "parameters": [
        {
            "default": 0.0,
            "max": 90.0,
            "min": 0.0,
            "name": "rotIntensity",
            "label": "Rotation Intensity"
        },
        {
            "default": 0.18,
            "max": 100.0,
            "min": 0.0,
            "name": "transIntensity",
            "label": "Translation Intensity"
        },
        {
            "default": 0.6,
            "max": 1.4,
            "min": 0.0,
            "name": "scaleIntensity",
            "label": "Scale Intensity"
        },
        {
            "default": 0.8,
            "max": 40,
            "min": 4,
            "name": "cols",
            "label": "Columns"
        },
        {
            "default": 0.348,
            "max": 10.0,
            "min": 1.0,
            "name": "noiseScale",
            "label": "Noise Scale"
        },
        {
            "default": 0.62,
            "max": 5000.0,
            "min": 0.0,
            "name": "seed",
            "label": "Seed"
        }
    ],
    "url": "https://github.com/HaraldWalker/sonicwalker-shaders",
    "uuid": "b4e0ada0-5bd2-439b-9404-71c38d26f3a7",
    "version": "1.0.0"
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

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

mat2 rot2(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

void main() {
    float div = resolution.y / resolution.x;
    vec2 aspect = vec2(1.0, div);
    vec2 uv = texCoord * aspect - vec2(0.5, 0.5 * div);

    float cellSize = 1.0 / cols;
    vec2 gridId = floor(uv / cellSize);
    vec2 fuv = fract(uv / cellSize);

    vec2 npos = gridId * noiseScale * 0.15 + vec2(seed * 0.013, seed * 0.019);
    float n = noise(npos) * 2.0 - 1.0;
    float factor = 1.0 - n * 0.5;

    float rot = factor * rotIntensity * 3.14159265 / 180.0;
    float td = factor * transIntensity * 0.02;
    float sc = 1.0 - factor * scaleIntensity;

    vec2 p = fuv - 0.5 - vec2(td, td);
    p = rot2(rot) * p;

    float hs = 0.5 * sc;
    float aa = 1.5 / (resolution.y * cellSize);

    vec2 edge = 1.0 - smoothstep(vec2(hs - aa), vec2(hs + aa), abs(p));
    float sq = edge.x * edge.y;

    vec3 finalColor = vec3(sq);
    float coloredPixels = dot(clamp(finalColor, 0.0, 1.0), vec3(1.0));
    fragColor = vec4(finalColor * color.rgb, alpha * coloredPixels);
}