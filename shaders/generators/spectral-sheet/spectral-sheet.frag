/*
{
    "author": "Harald Walker",
    "color": "#66ccff",
    "movement": true,
    "parameters": [
        {
            "default": 0.4,
            "max": 360,
            "min": 0,
            "name": "rotation",
            "label": "Rotation"
        },
        {
            "default": 0.6,
            "max": 45,
            "min": -45,
            "name": "tilt",
            "label": "Tilt"
        },
        {
            "default": 0.9,
            "max": 4.0,
            "min": 0.5,
            "name": "camera",
            "label": "Camera"
        },
        {
            "default": 0.7,
            "max": 2.0,
            "min": 0.1,
            "name": "amplitude",
            "label": "Amplitude"
        },
        {
            "default": 0.3,
            "max": 12.0,
            "min": 1.0,
            "name": "waveFreq",
            "label": "Wave Frequency"
        },
        {
            "default": 0.2,
            "max": 1.5,
            "min": 0.1,
            "name": "twist",
            "label": "Twist"
        },
        {
            "default": 0.6,
            "max": 1.0,
            "min": 0.0,
            "name": "reactivity",
            "label": "Audio Reactivity"
        }
    ],
    "url": "https://github.com/HaraldWalker/sonicwalker-shaders",
    "uuid": "cb0b5e80-61c5-454b-a16b-feb94dbfe219",
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
#define MARCH_STEPS 90
#define MAX_DIST 25.0

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

mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

float gBass, gMid, gHigh;

void computeBands() {
    gBass = fftBand(0.06, 0.10);
    gMid  = fftBand(0.30, 0.20);
    gHigh = fftBand(0.65, 0.30);
}

// The sheet height at a given point in 3D space.
// The FFT spectrum drives a continuous, wind-blown surface â the scalar
// field is the spectrum amplitude sampled along x, with waves traveling
// along z creating the wind-blown fabric effect. The result is a single
// continuous folded surface, not discrete bars.
float sheetHeight(vec3 p) {
    // Map x to FFT frequency coordinate (bass on left, treble on right)
    float u = clamp((p.x + 3.0) / 6.0, 0.0, 1.0);

    // Smooth spectrum value (averaged band, not single-texel)
    float spec = fftBand(u, 0.03);
    spec *= 1.0 + gBass * reactivity * 0.4;

    // Base height from spectrum amplitude
    float h = spec * amplitude;

    // Twist: rotate the sampling point around the y-axis by an angle
    // proportional to z. This makes the spectrum pattern spiral along the
    // ribbon's length â bass that starts on the left ends up on the right
    // further down the sheet. The cross-width tilt also rotates, creating
    // the physical look of a twisted ribbon.
    float twistAngle = p.z * twist * 0.5;
    float ca = cos(twistAngle);
    float sa = sin(twistAngle);
    float rotX = p.x * ca + p.z * sa;
    float u2 = clamp((rotX + 3.0) / 6.0, 0.0, 1.0);
    float spec2 = fftBand(u2, 0.03) * amplitude;
    h = mix(h, spec2, 0.5);
    // Cross-width tilt rotates with z â helical twist in the surface
    h += sa * p.x * 0.35;

    // Wind waves: traveling along z, frequency and amplitude modulated by
    // local spectrum value so loud frequencies ripple more
    float wavePhase = p.z * waveFreq + spec * 8.0;
    h += sin(wavePhase + time * 0.7) * 0.18 * (0.3 + spec);

    // Cross-waves for organic richness
    h += sin(p.z * waveFreq * 2.3 - time * 0.4 + p.x * 0.4) * 0.07 * spec;

    // Treble shimmer â fine fast ripples on the peaks
    h += gHigh * reactivity * 0.05 * sin(p.z * 14.0 + time * 2.5);

    return h;
}

vec3 calcNormal(vec3 p) {
    float e = 0.01;
    float h = sheetHeight(p);
    float hx = sheetHeight(p + vec3(e, 0.0, 0.0));
    float hz = sheetHeight(p + vec3(0.0, 0.0, e));
    return normalize(vec3(h - hx, e * 2.0, h - hz));
}

void main() {
    float div = resolution.y / resolution.x;
    vec2 aspect = vec2(1.0, div);
    vec2 uv = texCoord * aspect - vec2(0.5, 0.5 * div);

    computeBands();

    // Camera: elevated, looking down at the undulating sheet
    float camD = camera;
    vec3 ta = vec3(0.0, 0.2, 0.0);
    float rotA = radians(rotation);
    float elev = radians(tilt);
    vec3 ro = ta + camD * vec3(
        cos(elev) * sin(rotA),
        sin(elev) + 0.4,
        -cos(elev) * cos(rotA)
    );

    vec3 fwd = normalize(ta - ro);
    vec3 rgt = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(rgt, fwd);
    vec3 rd = normalize(fwd * 1.6 + rgt * uv.x + up * uv.y);

    // Raymarch the height field (implicit surface: y = sheetHeight(x,z))
    float t = 0.0;
    bool hit = false;
    float glowAccum = 0.0;

    for (int i = 0; i < MARCH_STEPS; i++) {
        vec3 p = ro + rd * t;
        float h = sheetHeight(p);
        float surfDist = p.y - h;

        // Glow accumulates near the surface
        glowAccum += exp(-surfDist * surfDist * 15.0) * 0.012;

        if (surfDist < 0.0) {
            hit = true;
            break;
        }

        // Adaptive step: larger when far from surface, smaller when close
        t += max(0.02, surfDist * 0.4);
        if (t > MAX_DIST) break;
    }

    vec3 col = vec3(0.0);

    if (hit) {
        vec3 p = ro + rd * t;
        vec3 n = calcNormal(p);
        vec3 viewDir = normalize(ro - p);

        // Two-light setup for dimensionality
        vec3 ld1 = normalize(vec3(0.5, 0.7, -0.3));
        vec3 ld2 = normalize(vec3(-0.3, 0.4, 0.6));
        float diff1 = max(0.0, dot(n, ld1));
        float diff2 = max(0.0, dot(n, ld2));
        float spec1 = pow(max(0.0, dot(reflect(-ld1, n), viewDir)), 48.0);
        float fresnel = pow(1.0 - max(0.0, dot(n, viewDir)), 2.5);

        // Color: hue varies across the spectrum (x position)
        float u = clamp((p.x + 3.0) / 6.0, 0.0, 1.0);
        float spec = fftBand(u, 0.03);
        float hue = fract(u * 0.65 + gBass * reactivity * 0.12 + time * 0.008);
        float sat = 0.65 + 0.35 * spec;
        float val = 0.5 + 0.5 * spec;
        vec3 baseCol = hsv2rgb(vec3(hue, sat, val));

        // Ambient occlusion approximation: darker in valleys
        float ao = smoothstep(-0.1, 0.5, sheetHeight(p) / max(amplitude, 0.01));
        ao = mix(0.4, 1.0, ao);

        col = baseCol * (0.15 + diff1 * 0.6 + diff2 * 0.25) * ao;
        col += spec1 * vec3(0.7, 0.85, 1.0) * (0.3 + gHigh * reactivity * 0.5);
        col += fresnel * mix(vec3(0.25, 0.45, 0.9), vec3(0.9, 0.35, 0.55), gMid * reactivity) * 0.45;

        // Emissive peaks: bright where spectrum is loud
        col += baseCol * smoothstep(0.25, 0.75, spec) * 0.25;
    }

    // Volumetric glow around the surface
    vec3 glowCol = mix(vec3(0.15, 0.35, 0.75), vec3(0.75, 0.25, 0.45), gBass * reactivity);
    col += glowAccum * glowCol * 1.8;

    // Subtle depth fog
    float fog = 1.0 - exp(-t * 0.04);
    col = mix(col, vec3(0.02, 0.03, 0.06), fog * 0.6);

    float coloredPixels = dot(clamp(col, 0.0, 1.0), vec3(1.0));
    fragColor = vec4(col * color.rgb, alpha * coloredPixels);
}
