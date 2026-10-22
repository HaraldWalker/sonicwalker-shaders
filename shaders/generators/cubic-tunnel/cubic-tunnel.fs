/*{
    "CREDIT": "by Harald Walker",
    "CATEGORIES": [
        "Generator"
    ],
    "DESCRIPTION": "Raymarched cubic tunnel with colored faces and curved path",
    "INPUTS": [
        {
            "NAME": "rotSpeed",
            "TYPE": "float",
            "DEFAULT": 0.5,
            "MIN": 0,
            "MAX": 1
        },
        {
            "NAME": "cubeSize",
            "TYPE": "float",
            "DEFAULT": 0.5,
            "MIN": 0,
            "MAX": 1
        },
        {
            "NAME": "tunnelSize",
            "TYPE": "float",
            "DEFAULT": 0.5,
            "MIN": 0,
            "MAX": 1
        },
        {
            "NAME": "curveIntensity",
            "TYPE": "float",
            "DEFAULT": 0.4,
            "MIN": 0,
            "MAX": 1
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
#define TWO_PI 6.28318530718

float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

vec3 hash3(float n) {
    return fract(sin(vec3(n, n + 1.0, n + 2.0)) * vec3(43758.5453, 22578.1459, 19642.3490));
}

mat2 r2d(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, s, -s, c);
}

float curveAmt;

vec2 path(float t) {
    float a = sin(t * 0.2 + 1.5), b = sin(t * 0.2);
    return vec2(2.0 * a, a * b) * curveAmt;
}

float g = 0.0;
float tunnelR;
float cubeScale;
float speed = 6.0;

float de(vec3 p) {
    p /= cubeScale;
    p.xy -= path(p.z);

    float cellZ = floor(p.z);
    float sizeVar = 0.7 + hash(cellZ * 0.523) * 0.6;
    float r = tunnelR * sizeVar;
    float offset = hash(cellZ * 0.137) * TWO_PI;

    float angle = atan(p.y, p.x) - offset;
    float stepA = PI * 0.5;
    float localAngle = mod(angle, stepA) - stepA * 0.5;
    float faceR = r * cos(PI * 0.25) / cos(localAngle);

    float d = (-length(p.xy) + faceR) * cubeScale;

    g += 0.015 / (0.01 + d * d);
    return d;
}

void main() {
    float div = RENDERSIZE.y / RENDERSIZE.x;
    vec2 aspect = vec2(1.0, div);
    vec2 uv = (gl_FragCoord.xy / RENDERSIZE) * aspect - vec2(0.5, 0.5 * div);

    tunnelR = mix(1.5, 4.0, tunnelSize);
    curveAmt = mix(0.0, 1.5, curveIntensity);
    cubeScale = mix(0.5, 3.0, cubeSize);

    float dt = TIME * speed;
    vec3 ro = vec3(0, 0, -5.0 + dt);
    vec3 ta = vec3(0, 0, dt);

    ro.xy += path(ro.z);
    ta.xy += path(ta.z);

    vec3 fwd = normalize(ta - ro);
    vec3 right = cross(fwd, vec3(0, 1, 0));
    vec3 up = cross(right, fwd);
    vec3 rd = normalize(fwd + uv.x * right + uv.y * up);

    rd.xy *= r2d(sin(-ro.x / PI) * 0.3);
    rd.xy *= r2d(TIME * mix(-2.0, 2.0, rotSpeed));

    vec3 p = floor(ro / cubeScale) + 0.5;
    vec3 mask;
    vec3 drd = cubeScale / abs(rd);
    vec3 srd = sign(rd);
    vec3 side = drd * (srd * (p - ro / cubeScale) + 0.5);
    rd = srd;

    g = 0.0;
    for (int i = 0; i < 100; i++) {
        if (de(p * cubeScale) < 0.0) break;

        mask = step(side, side.yzx) * step(side, side.zxy);
        side += drd * mask;
        p += rd * mask;
    }
    float t = length(p * cubeScale - ro);

    vec2 centered = (p * cubeScale).xy - path((p * cubeScale).z);
    float cellZ = floor(p.z);
    float hitOffset = hash(cellZ * 0.137) * TWO_PI;
    float hitAngle = atan(centered.y, centered.x) - hitOffset;
    float faceIdx = floor((hitAngle / TWO_PI + 0.5) * 4.0);

    vec3 cellColor = hash3(cellZ * 137.0 + faceIdx * 311.0);
    cellColor = (cellColor + vec3(0.3)) * 0.8;

    float faceShade = length(mask * vec3(1.0, 0.6, 0.8));
    vec3 c = cellColor * faceShade;

    c += g * 0.3;
    c.r += sin(p.z * 0.5 - TIME * speed) * 0.1;

    c = mix(c, vec3(0.02, 0.01, 0.03), 1.0 - exp(-0.003 * t * t));

    gl_FragColor = vec4(c, 1.0);
}
