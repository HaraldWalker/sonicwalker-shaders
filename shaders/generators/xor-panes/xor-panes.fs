/*
{
    "CREDIT": "by Harald Walker",
    "CATEGORIES": [
        "Generator"
    ],
    "DESCRIPTION": "Overlapping animated panes with XOR-style color mixing",
    "INPUTS": [
        {
            "NAME": "zoom",
            "TYPE": "float",
            "DEFAULT": 0.8,
            "MIN": 0.2,
            "MAX": 3.0
        },
        {
            "NAME": "panes",
            "TYPE": "float",
            "DEFAULT": 7,
            "MIN": 2,
            "MAX": 15
        },
        {
            "NAME": "density",
            "TYPE": "float",
            "DEFAULT": 4,
            "MIN": 1,
            "MAX": 6
        },
        {
            "NAME": "intensity",
            "TYPE": "float",
            "DEFAULT": 2,
            "MIN": 2,
            "MAX": 8
        },
        {
            "NAME": "monochrome",
            "TYPE": "float",
            "DEFAULT": 0,
            "MIN": 0,
            "MAX": 1
        },
        {
            "NAME": "tintColor",
            "TYPE": "color",
            "DEFAULT": [
                1.0,
                1.0,
                1.0,
                1.0
            ]
        }
    ],
    "ISFVSN": 2.0
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

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec3 hueColor(float h) {
    return 0.5 + 0.5 * cos(6.28318 * (h + vec3(0.0, 0.33, 0.67)));
}

void main() {
    float div = RENDERSIZE.y / RENDERSIZE.x;
    vec2 aspect = vec2(1.0, div);
    vec2 uv = ((gl_FragCoord.xy / RENDERSIZE) * aspect - vec2(0.5, 0.5 * div)) / zoom;

    float count = 0.0;
    vec3 colorAccum = vec3(0.0);
    float pixelWidth = 2.0 / (min(RENDERSIZE.x, RENDERSIZE.y) * zoom);

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
                baseX + ampX * sin(TIME * freqX + phaseX),
                baseY + ampY * cos(TIME * freqY + phaseY)
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
    float brightness = float(shadeIndex) / max(float(shadeCount - 1), 1.0);

    vec3 finalColor;
    if (monochrome < 0.5) {
        finalColor = colorAccum / max(count, 1.0) * brightness;
    } else {
        finalColor = vec3(brightness) * tintColor.rgb;
    }

    gl_FragColor = vec4(finalColor, 1.0);
}
