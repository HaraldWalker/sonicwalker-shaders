/*
{
    "author": "Harald Walker",
    "color": "#ff6633",
    "movement": true,
    "parameters": [
        {
            "default": 0.5,
            "max": 3.0,
            "min": 0.0,
            "name": "camera",
            "label": "Camera"
        },
        {
            "default": 0.045,
            "max": 360,
            "min": 0,
            "name": "rotation",
            "label": "Rotation"
        },
        {
            "default": 0.5,
            "max": 45,
            "min": -45,
            "name": "tilt",
            "label": "Tilt"
        },
        {
            "default": 0.5,
            "max": 2.5,
            "min": 0.1,
            "name": "height",
            "label": "Height"
        },
        {
            "default": 0.4,
            "max": 1.0,
            "min": 0.0,
            "name": "glow",
            "label": "Glow"
        },
        {
            "default": 0.4,
            "max": 1.0,
            "min": 0.0,
            "name": "fog",
            "label": "Fog"
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
    "uuid": "d72b5d41-8407-4bd5-b2c3-b1fa46f90569",
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

// fftTex is auto-injected by VS2 (like time/resolution/texCoord) - do NOT
// declare it.

#define MARCH_STEPS 80
#define MAX_DIST 15.0
// Grid line tuning - no free parameter slots left (7/7 used), so these are
// compile-time constants. Edit directly to change line spacing/thickness.
#define GRID_SCALE_X 10.0
#define GRID_SCALE_Z 2.5
#define GRID_LINE_SHARPNESS 1.0
// Line thickness in screen pixels. Thin (~1px) anti-aliased diagonal lines
// are close to worst-case content for video encoders - the exact sub-pixel
// line position shifts every frame as geometry/audio moves, leaving little
// stable low-frequency area to reuse between frames, which shows up as
// dithered/grainy compression artifacts. Thicker lines with a softer edge
// give the encoder bigger, gentler gradients to work with.
#define GRID_LINE_WIDTH_PX 2.5
// World-space x range mapped across the full spectrum/hue width. The
// visible terrain spans several world units at these camera distances, but
// the old code normalized as if it spanned exactly 1 - so only a narrow
// central strip ever sampled real spectrum variation, and the flanks
// clamped to a single edge bin/hue. Trade-off: too high and the full
// spectrum needs more world-x space than the camera's FOV shows, so you
// only see a slice of it (zoomed-in look) instead of the whole range.
#define FREQ_WORLD_WIDTH 2.5
// Crop the sampled spectrum to [FREQ_MIN, FREQ_MAX] (0 = lowest bin,
// 1 = highest/Nyquist) and stretch whatever's inside that range across the
// full visible width. VS2 doesn't document fftTex's exact bin-to-Hz layout,
// so these are starting guesses, not a precise "20Hz-20kHz" crop - tune by
// eye until the width feels evenly populated for your material.
#define FREQ_MIN 0.0
#define FREQ_MAX 0.55
// Perceptual spread within the cropped range: 1.0 = linear/even. <1.0 gives
// more visual width to the low end of the range (closer to how a classic
// log-frequency spectrum analyzer looks), >1.0 gives more width to the
// high end instead.
#define FREQ_GAMMA 1.0

float xNorm(float x) {
    return clamp(x / FREQ_WORLD_WIDTH + 0.5, 0.0, 1.0);
}

// Maps a visual 0-1 position to the cropped+stretched+shaped spectrum range.
float freqU(float u) {
    return mix(FREQ_MIN, FREQ_MAX, pow(clamp(u, 0.0, 1.0), FREQ_GAMMA));
}

// Cheap single-texel read, used inside terrain() which runs up to
// MARCH_STEPS times per pixel - an 8-tap average there would mean ~640
// texture reads per pixel just for audio. This is the dominant cost in
// the shader, more than the noise octaves below.
float fftSingle(float u) {
    return texture(fftTex, vec2(clamp(u, 0.0, 1.0), 0.0)).r;
}

// 8-tap averaged band read - only used once per pixel now (the energy
// accent at the end of main), so the extra smoothing cost is negligible.
float fftBand(float center, float width) {
    float sum = 0.0;
    for (int i = 0; i < 8; i++) {
        float t = float(i) / 7.0 - 0.5;
        sum += texture(fftTex, vec2(clamp(center + t * width, 0.0, 1.0), 0.0)).r;
    }
    return sum / 8.0;
}

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

// NOTE: this terrain is shaped by the LIVE spectrum only - VS2 has no
// persistent/feedback buffer, so there is no way to store and scroll past
// frames of audio data. What gives this its sense of depth and motion is
// domain-warped noise, not a memory of the song's recent past. The
// spectrum sets tonight's skyline; the noise makes it feel alive.
float terrain(vec2 xz) {
    float z = xz.y + time;

    // live spectrum envelope across x - always reflects right-now audio.
    // Single-tap read (see fftSingle above) since this runs every march step.
    float f = fftSingle(freqU(xNorm(xz.x)));
    f = f * f;

    // domain-warp the noise sampling so ridges swell and twist with depth
    // instead of running as straight parallel corrugations
    float warp = noise(vec2(xz.x * 1.5, z * 0.1)) * 0.6;
    vec2 np = vec2(xz.x * 3.0 + warp, z * 0.2 - warp);

    // 2 octaves instead of 3 - fine detail doesn't read once we're only
    // drawing grid lines rather than a lit solid surface
    float n = noise(np) * 0.65 + noise(np * 2.3 + 4.0) * 0.35;

    float base = noise(vec2(xz.x * 2.0, z * 0.15)) * 0.08;

    // blend (not multiply) so quiet frequencies still leave organic
    // surface detail instead of flattening to a hard, dead trench
    float envelope = mix(0.25, 1.0, f * reactivity);
    return base + envelope * n * mix(0.3, 2.5, height);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    float div = resolution.y / resolution.x;
    vec2 aspect = vec2(1.0, div);
    vec2 uv = texCoord * aspect - vec2(0.5, 0.5 * div);

    float camH = mix(1.5, 4.0, camera);
    float camD = mix(2.0, 6.0, camera);
    vec3 ta = vec3(0.5, 0.0, 3.0);

    // Orbit the camera around ta at a fixed horizontal radius. horizDist
    // matches the original ro-to-ta z-offset (camD + 3.0) so rotation=0
    // reproduces the original fixed view exactly.
    float horizDist = camD + 3.0;
    float rot = radians(rotation);
    vec3 ro = ta + vec3(sin(rot) * horizDist, camH, -cos(rot) * horizDist);

    vec3 fwd0 = normalize(ta - ro);

    // Pitch the look direction up/down around the horizontal right axis,
    // independent of the yaw orbit above - tilt=0 reproduces the original
    // fixed downward-looking angle exactly.
    vec3 rgt0 = normalize(cross(fwd0, vec3(0.0, 1.0, 0.0)));
    float tiltRad = radians(tilt);
    vec3 fwd = normalize(fwd0 * cos(tiltRad) + vec3(0.0, 1.0, 0.0) * sin(tiltRad));
    vec3 rgt = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(rgt, fwd);
    vec3 rd = normalize(fwd * 1.5 + rgt * uv.x + up * uv.y);

    float t = 0.0;
    float tPrev = 0.0;
    bool didHit = false;
    vec3 hitP = vec3(0.0);

    for (int i = 0; i < MARCH_STEPS; i++) {
        vec3 p = ro + rd * t;
        if (p.y < -0.1) break;
        float h = terrain(p.xz);
        if (p.y <= h) {
            // The coarse step above can overshoot the real surface by a
            // visible amount - refine the crossing with bisection so the
            // hit point (and therefore grid line position) is accurate to
            // sub-step precision. Without this, hit position varies
            // unpredictably step-to-step and pixel-to-pixel, which shows up
            // as small stair-stepped kinks breaking otherwise smooth lines.
            float tLo = tPrev, tHi = t;
            for (int j = 0; j < 6; j++) {
                float tm = 0.5 * (tLo + tHi);
                vec3 pm = ro + rd * tm;
                float hm = terrain(pm.xz);
                if (pm.y <= hm) { tHi = tm; } else { tLo = tm; }
            }
            t = 0.5 * (tLo + tHi);
            hitP = ro + rd * t;
            didHit = true;
            break;
        }
        tPrev = t;
        t += max(0.02, (p.y - h) * 0.3);
        if (t > MAX_DIST) break;
    }

    vec3 col = vec3(0.0);

    if (didHit) {
        // Anti-aliased grid lines via screen-space derivatives (fwidth) -
        // standard technique, no raymarch-normal or lighting math needed.
        vec2 gp = vec2(hitP.x * GRID_SCALE_X, hitP.z * GRID_SCALE_Z);
        vec2 gridD = max(fwidth(gp), vec2(1e-4)) * GRID_LINE_WIDTH_PX;
        vec2 gridF = abs(fract(gp - 0.5) - 0.5) / gridD;
        float lineDist = min(gridF.x, gridF.y);
        float lineCore = pow(1.0 - smoothstep(0.0, 1.0, lineDist), GRID_LINE_SHARPNESS);
        // Soft halo around each line, same idea as the earlier line-width
        // fix: a wider, gentler gradient gives the video encoder less fine
        // high-frequency detail to fight, on top of just looking nicer.
        // glow=0 collapses to a negligible falloff; glow=1 gives a wide,
        // slow-decaying halo.
        float glowSpread = mix(4.0, 0.08, glow);
        float glowMask = exp(-lineDist * lineDist * glowSpread) * glow;
        float lineMask = lineCore + glowMask * 0.8;

        float freq = xNorm(hitP.x);
        float hue = mix(0.0, 0.72, freq);
        // brightness param removed (redundant with VS2's own layer
        // controls) - baked in here at its old max value.
        vec3 base = hsv2rgb(vec3(hue, 0.85, mix(0.4, 1.8, 2.0)));
        col = base * lineMask;

        float fogAmt = 1.0 - exp(-t * t * mix(0.005, 0.08, fog));
        col = mix(col, vec3(0.02, 0.01, 0.04), fogAmt);
    }

    float energy = fftBand(0.0, 1.0);
    col += vec3(0.08, 0.04, 0.12) * energy * reactivity * (1.0 - smoothstep(0.0, MAX_DIST, t));

    float coloredPixels = dot(clamp(col, 0.0, 1.0), vec3(1.0));
    fragColor = vec4(col * color.rgb, alpha * coloredPixels);
}
