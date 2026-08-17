/*{
    "CREDIT": "by Harald Walker",
    "CATEGORIES": [
        "Generator"
    ],
    "DESCRIPTION": "Spiral fire clouds with layered fractal noise and glowing ember core",
    "INPUTS": [
        {
            "NAME": "offsetX",
            "LABEL": "Offset X",
            "TYPE": "float",
            "DEFAULT": 0.0,
            "MIN": -1.0,
            "MAX": 1.0
        },
        {
            "NAME": "offsetY",
            "LABEL": "Offset Y",
            "TYPE": "float",
            "DEFAULT": 0.0,
            "MIN": -1.0,
            "MAX": 1.0
        },
        {
            "NAME": "size",
            "LABEL": "Size",
            "TYPE": "float",
            "DEFAULT": 1.62,
            "MIN": 0.1,
            "MAX": 2.0
        },
        {
            "NAME": "intensity",
            "LABEL": "Intensity",
            "TYPE": "float",
            "DEFAULT": 0.6,
            "MIN": 0.0,
            "MAX": 3.0
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
    return fract(cos(dot(p, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
    const vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    return mix(mix(hash(b), hash(b + d.yx), f.x), mix(hash(b + d.xy), hash(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
    float total = 0.0, amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
        total += noise(n) * amplitude;
        n += n;
        amplitude *= 0.5;
    }
    return total;
}

void main() {
    vec2 uv = (gl_FragCoord.xy / RENDERSIZE) - 0.5;
    uv.x *= RENDERSIZE.x / RENDERSIZE.y;
    uv -= vec2(offsetX, offsetY);

    float r = length(uv);
    float a = atan(uv.y, uv.x);

    float T = TIME;

    float spiral = a + r * (10.0 / size) - T * 2.0;
    float spiralPattern = sin(spiral) * 0.5 + 0.5;

    vec2 spiralUV = vec2(
        cos(a) * r - sin(a) * (r * spiralPattern * 0.3),
        sin(a) * r + cos(a) * (r * spiralPattern * 0.3)
    );

    float distFromCenter = r / (0.5 * size);

    vec2 noiseCoord = spiralUV * 6.0 + vec2(0.0, -T * 0.5);
    float n1 = fbm(noiseCoord);
    float n2 = fbm(noiseCoord * 1.5 + vec2(T * 0.3, -T * 0.7));
    float n3 = fbm(noiseCoord * 2.0 + vec2(-T * 0.2, -T * 0.4));

    float fireShape = spiralPattern * (1.0 - smoothstep(0.0, 0.8, distFromCenter));

    float flames = fireShape * n1 + (1.0 - fireShape) * n2 * 0.5;
    flames += n3 * 0.3 * intensity;
    flames *= intensity;

    vec3 c1 = vec3(0.1, 0.0, 0.0);
    vec3 c2 = vec3(0.8, 0.1, 0.0);
    vec3 c3 = vec3(1.0, 0.5, 0.0);
    vec3 c4 = vec3(1.0, 0.9, 0.2);

    float t = clamp(flames, 0.0, 1.0);
    vec3 col = mix(c1, c2, smoothstep(0.0, 0.3, t));
    col = mix(col, c3, smoothstep(0.3, 0.6, t));
    col = mix(col, c4, smoothstep(0.6, 1.0, t));

    float glow = exp(-distFromCenter * 3.0) * 0.5 * intensity;
    col += vec3(0.8, 0.2, 0.0) * glow;

    float fade = 1.0 - smoothstep(0.3, 0.5, distFromCenter);
    col *= fade;

    vec3 finalColor = clamp(col, 0.0, 1.0);
    gl_FragColor = vec4(finalColor, 1.0);
}
