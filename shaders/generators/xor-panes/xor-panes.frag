/*
{
    "author": "Harald Walker",
    "color": "#ffffff",
    "movement": true,
    "parameters": [
        {
            "default": 0.8,
            "max": 3.0,
            "min": 0.2,
            "name": "zoom",
            "label": "Zoom"
        },
        {
            "default": 7,
            "max": 15,
            "min": 2,
            "name": "panes",
            "label": "Panes"
        },
        {
            "default": 4,
            "max": 6,
            "min": 1,
            "name": "density",
            "label": "Density"
        },
        {
            "default": 2,
            "max": 8,
            "min": 2,
            "name": "intensity",
            "label": "Intensity"
        },
        {
            "default": 0.0,
            "max": 1,
            "min": 0,
            "name": "monochrome",
            "label": "Monochrome"
        }
    ],
    "url": "https://github.com/HaraldWalker/sonicwalker-shaders",
    "uuid": "c7761242-21ca-4167-a58c-caf8c91f1b55",
    "version": "1.1.0"
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

vec3 hueColor(float h) {
    return 0.5 + 0.5 * cos(6.28318 * (h + vec3(0.0, 0.33, 0.67)));
}

void main() {
    float div = resolution.y / resolution.x;
    vec2 aspect = vec2(1.0, div);
    vec2 uv = (texCoord * aspect - vec2(0.5, 0.5 * div)) / zoom;

    float count = 0.0;
    vec3 colorAccum = vec3(0.0);
    float pixelWidth = 2.0 / (min(resolution.x, resolution.y) * zoom);

    for (float i = 0.0; i < 15.0; i++) {
        if (i >= panes) break;

        float paneHit = 0.0;
        vec3 paneColor = hueColor(i / max(panes, 1.0));

        for (float j = 0.0; j < 6.0; j++) {
            if (j >= density) break;

            vec2 seed = vec2(i * 7.13 + j * 3.71, i * 11.29 + j * 5.37);

            float isRect = step(0.5, hash(seed));

            float sx = hash(seed + vec2(1.0, 0.0)) * 0.2 + 0.05;
            float sy = hash(seed + vec2(2.0, 0.0)) * 0.2 + 0.05;

            float baseX = hash(seed + vec2(3.0, 0.0)) * 1.6 - 0.8;
            float baseY = hash(seed + vec2(4.0, 0.0)) * 1.6 - 0.8;
            float ampX = hash(seed + vec2(5.0, 0.0)) * 0.4;
            float ampY = hash(seed + vec2(6.0, 0.0)) * 0.4;
            float freqX = hash(seed + vec2(7.0, 0.0)) * 0.4 + 0.1;
            float freqY = hash(seed + vec2(8.0, 0.0)) * 0.4 + 0.1;
            float phaseX = hash(seed + vec2(9.0, 0.0)) * 6.28318;
            float phaseY = hash(seed + vec2(10.0, 0.0)) * 6.28318;

            vec2 center = vec2(
                baseX + ampX * sin(time * freqX + phaseX),
                baseY + ampY * cos(time * freqY + phaseY)
            );

            vec2 d = abs(uv - center);
            float dist;
            if (isRect > 0.5) {
                vec2 q = d - vec2(sx, sy);
                dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
            } else {
                dist = length(d) - min(sx, sy);
            }

            float hit = smoothstep(pixelWidth, 0.0, dist);
            paneHit = max(paneHit, hit);
        }

        count += paneHit;
        colorAccum += paneColor * paneHit;
    }

    int shadeCount = 10 - int(intensity);
    int shadeIndex = int(min(count, float(shadeCount - 1)));
    float brightness = float(shadeIndex) / float(max(shadeCount - 1, 1));

    vec3 finalColor;
    if (monochrome < 0.5) {
        finalColor = colorAccum / max(count, 1.0) * brightness;
    } else {
        finalColor = vec3(brightness) * color.rgb;
    }

    float coloredPixels = dot(clamp(finalColor, 0.0, 1.0), vec3(1.0));
    fragColor = vec4(finalColor, alpha * coloredPixels);
}
