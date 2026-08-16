/*
{
    "author": "Harald Walker",
    "color": "#ff6644",
    "movement": true,
    "parameters": [
        {
            "default": 0.5,
            "max": 1.0,
            "min": 0.0,
            "name": "offsetX",
            "label": "Offset X"
        },
        {
            "default": 0.5,
            "max": 1.0,
            "min": 0.0,
            "name": "offsetY",
            "label": "Offset Y"
        },
        {
            "default": 0.5,
            "max": 1.0,
            "min": 0.0,
            "name": "offsetZ",
            "label": "Offset Z"
        },
        {
            "default": 0.5,
            "max": 1.0,
            "min": 0.0,
            "name": "zoom",
            "label": "Zoom"
        },
        {
            "default": 0.33,
            "max": 1.0,
            "min": 0.0,
            "name": "density",
            "label": "Density"
        },
        {
            "default": 0.5,
            "max": 1.0,
            "min": 0.0,
            "name": "intensity",
            "label": "Intensity"
        },
        {
            "default": 0.5,
            "max": 1.0,
            "min": 0.0,
            "name": "glow",
            "label": "Glow"
        }
    ],
    "url": "https://github.com/HaraldWalker/sonicwalker-shaders",
    "uuid": "f7c3a1d8-9e24-4b5a-a6f1-3d8c7e9b5a21",
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

#define PI 3.14159265359
#define TAU 6.28318530718
#define MAX_STEPS 80
#define MAX_DIST 15.0
#define SURF_DIST 0.002

mat3 rotateX(float a) {
    float c = cos(a), s = sin(a);
    return mat3(1,0,0, 0,c,-s, 0,s,c);
}

mat3 rotateY(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c,0,s, 0,1,0, -s,0,c);
}

mat3 rotateZ(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c,-s,0, s,c,0, 0,0,1);
}

float hash(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195) + vec3(0.1, 0.2, 0.3));
    p += dot(p, p.yzx + 19.19);
    return fract(p.x * p.y + p.z);
}

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdGrid(vec3 p, float cellSize, float baseSize) {
    vec3 q = p + 0.5;
    vec3 cellId = floor(q / cellSize);
    vec3 cellLocal = q - (cellId + 0.5) * cellSize;

    float h = hash(cellId);
    float pulseSpeed = 1.5 + h * 3.0;
    float pulsePhase = h * TAU;
    float pulseAmt = intensity * 0.7;
    float scale = 1.0 + sin(time * pulseSpeed + pulsePhase) * pulseAmt;
    float cubeSize = baseSize * scale;

    return sdBox(cellLocal, vec3(cubeSize));
}

float map(vec3 p, float cellSize, float baseSize) {
    float gridSDF = sdGrid(p, cellSize, baseSize);
    float boundSDF = sdBox(p, vec3(0.5));
    return max(gridSDF, boundSDF);
}

vec3 getNormal(vec3 p, float cellSize, float baseSize) {
    vec2 e = vec2(0.002, 0.0);
    return normalize(vec3(
        map(p + e.xyy, cellSize, baseSize) - map(p - e.xyy, cellSize, baseSize),
        map(p + e.yxy, cellSize, baseSize) - map(p - e.yxy, cellSize, baseSize),
        map(p + e.yyx, cellSize, baseSize) - map(p - e.yyx, cellSize, baseSize)
    ));
}

void main() {
    float div = resolution.y / resolution.x;
    vec2 aspect = vec2(1.0, div);
    vec2 uv = texCoord * aspect - vec2(0.5, 0.5 * div);

    float n = max(1.0, floor(density * 4.0 + 1.0));
    n = min(n, 5.0);
    float cellSize = 1.0 / n;
    float gap = 0.12 * cellSize;
    float baseSize = (cellSize - gap) * 0.5;

    float camDist = mix(6.0, 1.5, zoom);
    vec3 ro = vec3(0.0, 0.0, -camDist);
    vec3 rd = normalize(vec3(uv, 1.5));

    vec3 offset = vec3(offsetX - 0.5, offsetY - 0.5, offsetZ - 0.5) * 2.0;

    float rx = time * 0.13 + sin(time * 0.21) * 0.5;
    float ry = time * 0.19 + cos(time * 0.15) * 0.4;
    float rz = time * 0.07 + sin(time * 0.27) * 0.3;
    mat3 rot = rotateZ(rz) * rotateX(rx) * rotateY(ry);
    mat3 invRot = rotateY(-ry) * rotateX(-rx) * rotateZ(-rz);

    float t = 0.0;
    float glowAccum = 0.0;
    bool hit = false;

    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * t;
        vec3 lp = rot * (p - offset);
        float dS = map(lp, cellSize, baseSize);

        glowAccum += exp(-dS * dS * 80.0) * (0.002 + glow * 0.025);

        if (dS < SURF_DIST) { hit = true; break; }
        if (t > MAX_DIST) break;
        t += max(abs(dS), 0.003) * 0.8;
    }

    vec3 finalColor = vec3(0.0);

    if (hit) {
        vec3 p = ro + rd * t;
        vec3 lp = rot * (p - offset);
        vec3 ln = getNormal(lp, cellSize, baseSize);
        vec3 wn = invRot * ln;

        vec3 lightDir = normalize(vec3(0.6, 0.9, -0.4));
        float diff = 0.5 + 0.7 * max(dot(wn, lightDir), 0.0);

        vec3 q = lp + 0.5;
        vec3 cellId = floor(q / cellSize);
        float h = hash(cellId);

        vec3 cubeColor = mix(vec3(1.2, 0.4, 0.2), vec3(0.2, 0.8, 1.3), h);

        vec3 absLocal = abs(q - (cellId + 0.5) * cellSize);
        float maxLocal = max(max(absLocal.x, absLocal.y), absLocal.z);
        float edgeFactor = smoothstep(baseSize * 0.7, baseSize, maxLocal);
        cubeColor = mix(cubeColor, vec3(1.4, 1.2, 0.9), edgeFactor * 0.6);

        finalColor = cubeColor * diff;

        float fog = exp(-t * 0.12);
        finalColor *= fog;
    }

    vec3 glowCol = vec3(0.7, 0.3, 0.5) * glowAccum;
    finalColor += glowCol;

    float coloredPixels = dot(clamp(finalColor, 0.0, 1.0), vec3(1.0));
    fragColor = vec4(finalColor * color.rgb, alpha * coloredPixels);
}
