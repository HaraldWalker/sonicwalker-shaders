/*
{
    "CREDIT": "by Harald Walker",
    "CATEGORIES": [
        "Generator"
    ],
    "DESCRIPTION": "Concentric Brockmann-style arc bands with quantized rotation, sweep, and ease",
    "INPUTS": [
        {
            "NAME": "bands",
            "LABEL": "Bands",
            "TYPE": "float",
            "DEFAULT": 6.6,
            "MIN": 3.0,
            "MAX": 12.0
        },
        {
            "NAME": "size",
            "LABEL": "Size",
            "TYPE": "float",
            "DEFAULT": 0.5,
            "MIN": 0.0,
            "MAX": 1.0
        },
        {
            "NAME": "thickness",
            "LABEL": "Thickness",
            "TYPE": "float",
            "DEFAULT": 0.5,
            "MIN": 0.0,
            "MAX": 1.0
        },
        {
            "NAME": "grid",
            "LABEL": "Grid Steps",
            "TYPE": "float",
            "DEFAULT": 0.525,
            "MIN": 0.05,
            "MAX": 1.0
        },
        {
            "NAME": "sweep",
            "LABEL": "Arc Sweep",
            "TYPE": "float",
            "DEFAULT": 0.5,
            "MIN": 0.0,
            "MAX": 1.0
        },
        {
            "NAME": "spin",
            "LABEL": "Spin",
            "TYPE": "float",
            "DEFAULT": 0.5,
            "MIN": 0.0,
            "MAX": 1.0
        },
        {
            "NAME": "ease",
            "LABEL": "Edge Ease",
            "TYPE": "float",
            "DEFAULT": 0.5,
            "MIN": 0.0,
            "MAX": 1.0
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

#define PI 3.14159265359
#define TAU 6.28318530718

float hash11(float n) {
    return fract(sin(n * 12.9898) * 43758.5453);
}

float quantize(float a, float step) {
    return floor(a / step + 0.5) * step;
}

void main() {
    float div = RENDERSIZE.y / RENDERSIZE.x;
    vec2 aspect = vec2(1.0, div);
    vec2 uv = (gl_FragCoord.xy / RENDERSIZE) * aspect - vec2(0.5, 0.5 * div);

    int numBands = int(bands + 0.5);
    if (numBands < 1) numBands = 1;
    if (numBands > 12) numBands = 12;

    float edgeEase = mix(0.0, 1.0, ease);
    float sizeScale = mix(0.4, 1.4, size);
    float baseStep = mix(PI * 2.0, PI / 12.0, grid);
    float sweepAmount = mix(0.05, 1.0, sweep);
    float thicknessScale = mix(0.5, 1.8, thickness);
    float spinSpeed = mix(-1.0, 1.0, spin);
    float maxRadius = 0.95 * sizeScale;
    float innerEdge = 0.05 * sizeScale;

    float r = length(uv);
    float theta = atan(uv.y, uv.x);

    float globalRot = TIME * 0.15 * spinSpeed;

    float accum = 0.0;

    for (int i = 0; i < 12; i++) {
        if (i >= numBands) break;

        float fi = float(i);
        float nb = float(numBands);

        float t01 = fi / max(nb - 1.0, 1.0);
        float eased = pow(t01, mix(3.0, 0.6, edgeEase));
        float rOuter = mix(innerEdge, maxRadius, eased);
        float tWidth = pow(t01, mix(0.4, 2.0, edgeEase));
        float rInner = rOuter - mix(0.03, 0.12, thicknessScale) * (0.4 + 0.6 * tWidth);
        rInner = max(rInner, 0.0);

        float rMid = (rOuter + rInner) * 0.5;
        float rHalf = (rOuter - rInner) * 0.5;

        float seed = fi * 7.31 + 1.7;
        float rotSeed = hash11(seed);
        float sweepSeed = hash11(seed + 13.0);

        float arcRot = quantize(rotSeed * TAU, baseStep);
        float arcSweep = mix(0.1, sweepAmount * TAU, sweepSeed);

        float biasDir = mix(-1.0, 1.0, hash11(seed + 27.0));
        float biasAmount = 0.4 * (0.5 + 0.5 * sin(TIME * 0.3 + fi * 0.9));
        float biased = mix(arcRot, biasDir * arcSweep * 0.5, biasAmount);
        arcRot = quantize(biased, baseStep);

        float animSpin = TIME * (0.2 + 0.08 * fi) * spinSpeed;
        float finalRot = arcRot + globalRot + animSpin;

        float angle = mod(theta - finalRot, TAU);
        if (angle > PI) angle -= TAU;
        float absAngle = abs(angle);

        float edgeSoft = 0.008;
        float arcEdge = smoothstep(arcSweep * 0.5, arcSweep * 0.5 - edgeSoft, absAngle);
        float bandEdge = smoothstep(rHalf, rHalf - edgeSoft * 0.5, abs(r - rMid));

        float mask = arcEdge * bandEdge;
        accum = max(accum, mask);
    }

    vec3 col = vec3(accum);

    gl_FragColor = vec4(col, 1.0);
}
