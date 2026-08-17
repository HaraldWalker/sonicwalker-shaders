/*
{
    "author": "Harald Walker",
    "color": "#ff3366",
    "movement": true,
    "parameters": [
        {
            "default": 0.5,
            "max": 1.0,
            "min": 0.0,
            "name": "perspective",
            "label": "Perspective"
        },
        {
            "default": 0.5,
            "max": 2.0,
            "min": 0.2,
            "name": "brightness",
            "label": "Brightness"
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
            "min": 0.1,
            "name": "thickness",
            "label": "Thickness"
        },
        {
            "default": 0.5,
            "max": 2.0,
            "min": 0.0,
            "name": "glow",
            "label": "Glow"
        }
    ],
    "url": "https://github.com/HaraldWalker/sonicwalker-shaders",
    "uuid": "f7a3b2c1-d4e5-6f78-9a0b-c1d2e3f4a5b6",
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

#define TAU 6.28318530718
#define MARCH_STEPS 80
#define MAX_DIST 12.0
#define HIT_DIST 0.002

float g_bass, g_lowMid, g_mid, g_highMid, g_high, g_energy;

float fftBand(float center, float width) {
    float sum = 0.0;
    for (int i = 0; i < 8; i++) {
        float t = float(i) / 7.0 - 0.5;
        sum += texture(fftTex, vec2(clamp(center + t * width, 0.0, 1.0), 0.0)).r;
    }
    return sum / 8.0;
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 manifoldPos(float z, float phaseOff) {
    float t = time + phaseOff;
    float x = sin(z * 1.8 + t) * g_bass * intensity * 0.8
            + cos(z * 3.2 + t * 1.3) * g_mid * intensity * 0.5
            + sin(z * 5.1 + t * 0.7) * g_high * intensity * 0.2;
    float y = cos(z * 2.2 + t * 0.8) * g_high * intensity * 0.7
            + sin(z * 2.9 + t * 1.5) * g_bass * intensity * 0.4
            + cos(z * 4.5 + t * 1.1) * g_lowMid * intensity * 0.3;
    return vec2(x, y);
}

float sdRibbon(vec3 p, float phaseOff, float wScale, float hScale) {
    vec2 center = manifoldPos(p.z, phaseOff);
    vec2 d = p.xy - center;
    float w = (0.10 + g_bass * 0.06) * wScale;
    float h = (0.005 + thickness * 0.02) * hScale;
    vec2 q = d / vec2(w, h);
    return (length(q) - 1.0) * min(w, h);
}

float sdWaveField(vec3 p) {
    float h = sin(p.x * 3.0 + time) * g_bass * 0.06
            + sin(p.z * 2.0 + time * 1.3) * g_mid * 0.04
            + sin((p.x + p.z) * 5.0 + time * 0.7) * g_high * 0.02;
    return p.y - h + 0.45;
}

float map(vec3 p) {
    float d1 = sdRibbon(p, 0.0, 1.0, 1.0);
    float d2 = sdRibbon(p, 2.1, 0.7, 0.8);
    float d3 = sdWaveField(p);
    return min(min(d1, d2), d3);
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
    ));
}

void main() {
    float div = resolution.y / resolution.x;
    vec2 aspect = vec2(1.0, div);
    vec2 uv = texCoord * aspect - vec2(0.5, 0.5 * div);

    g_bass = fftBand(0.08, 0.12);
    g_lowMid = fftBand(0.22, 0.12);
    g_mid = fftBand(0.38, 0.15);
    g_highMid = fftBand(0.58, 0.15);
    g_high = fftBand(0.78, 0.18);
    g_energy = (g_bass * 2.0 + g_lowMid + g_mid + g_highMid + g_high) * 0.2;

    float camDist = mix(4.0, 2.0, perspective);
    float camAngle = time * 0.06;
    vec3 ro = vec3(sin(camAngle) * 0.4, 0.4, -camDist);
    vec3 target = vec3(0.0, 0.0, 3.0);
    vec3 fwd = normalize(target - ro);
    vec3 rgt = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(rgt, fwd);
    vec3 rd = normalize(fwd * 1.5 + rgt * uv.x + up * uv.y);

    float t = 0.0;
    float glowAccum = 0.0;
    vec3 hitP = vec3(0.0);
    bool didHit = false;

    for (int i = 0; i < MARCH_STEPS; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        glowAccum += exp(-d * d * 300.0) * 0.025;
        if (d < HIT_DIST) {
            didHit = true;
            hitP = p;
            break;
        }
        t += d * 0.7;
        if (t > MAX_DIST) break;
    }

    vec3 surf = vec3(0.0);

    if (didHit) {
        vec3 n = calcNormal(hitP);
        vec3 ld = normalize(vec3(0.5, 0.8, -0.3));
        float diff = 0.4 + 0.6 * max(0.0, dot(n, ld));
        vec3 vd = normalize(ro - hitP);
        float rim = pow(1.0 - max(0.0, dot(n, vd)), 3.0);
        vec3 hd = normalize(ld + vd);
        float spec = pow(max(0.0, dot(n, hd)), 32.0);
        float sss = max(0.0, dot(n, -ld)) * 0.3;

        float depth = clamp(hitP.z / 8.0, 0.0, 1.0);
        float hue = mix(0.65, 0.0, depth) + g_bass * 0.1;
        float sat = 0.7 + g_energy * 0.3;
        float val = 0.5 + g_energy * 0.5;
        vec3 baseCol = hsv2rgb(vec3(hue, sat, val));

        surf = baseCol * (diff + sss) + spec * vec3(0.8) + rim * vec3(0.4, 0.6, 1.0) * 0.6;
    }

    vec3 glowCol = glowAccum * mix(vec3(0.2, 0.4, 1.0), vec3(1.0, 0.3, 0.5), g_bass) * glow * 2.0;
    vec3 finalColor = (surf + glowCol) * mix(0.5, 2.0, brightness);

    float coloredPixels = dot(clamp(finalColor, 0.0, 1.0), vec3(1.0));
    fragColor = vec4(finalColor * color.rgb, alpha * coloredPixels);
}
