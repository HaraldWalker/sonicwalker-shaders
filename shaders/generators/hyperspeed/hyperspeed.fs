/*{
    "CREDIT": "by Harald Walker",
    "CATEGORIES": [
        "Generator"
    ],
    "DESCRIPTION": "Warp-speed streaks flying past like a hyperspace jump, with glowing walls and a luminous central seam",
    "INPUTS": [
        {
            "NAME": "speed",
            "LABEL": "Speed",
            "TYPE": "float",
            "DEFAULT": 1.0,
            "MIN": 0.0,
            "MAX": 4.0
        },
        {
            "NAME": "density",
            "LABEL": "Density",
            "TYPE": "float",
            "DEFAULT": 2.0,
            "MIN": 0.3,
            "MAX": 8.0
        },
        {
            "NAME": "streakLength",
            "LABEL": "Streak Length",
            "TYPE": "float",
            "DEFAULT": 1.0,
            "MIN": 0.2,
            "MAX": 4.0
        },
        {
            "NAME": "glow",
            "LABEL": "Glow",
            "TYPE": "float",
            "DEFAULT": 1.0,
            "MIN": 0.0,
            "MAX": 3.0
        },
        {
            "NAME": "distortion",
            "LABEL": "Distortion",
            "TYPE": "float",
            "DEFAULT": 0.5,
            "MIN": 0.0,
            "MAX": 2.0
        },
        {
            "NAME": "colorShift",
            "LABEL": "Color Shift",
            "TYPE": "float",
            "DEFAULT": 0.0,
            "MIN": -0.5,
            "MAX": 0.5
        },
        {
            "NAME": "contrast",
            "LABEL": "Contrast",
            "TYPE": "float",
            "DEFAULT": 1.0,
            "MIN": 0.2,
            "MAX": 3.0
        },
        {
            "NAME": "aperture",
            "LABEL": "Aperture",
            "TYPE": "float",
            "DEFAULT": 1.2,
            "MIN": 0.3,
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
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Cosine palette: h=-0.1 orange, h=0.17 magenta, other values reach yellow/green/blue
vec3 pal(float h) {
    return 0.5 + 0.5 * cos(6.28318 * (h + vec3(0.0, 0.33, 0.67)));
}

// One perspective "wall" of streaks.
// z = depth (1/distance), v = lateral coordinate that fans out from the vanishing point
vec3 streakLayer(float z, float v, float side, float seed, float t) {
    float stretch = 1.0 / (streakLength * 3.0);
    vec2 q = vec2(v * density * 0.8 + seed * 17.0, (z + t * 1.5) * stretch);

    // multi-octave noise, stretched along the direction of travel
    float n = vnoise(q) * 0.55
            + vnoise(q * vec2(2.3, 1.7) + 5.0) * 0.30
            + vnoise(q * vec2(5.1, 2.9) + 9.0) * 0.15;

    float inten = pow(clamp(n * 1.5 - 0.15, 0.0, 1.0), 1.0 + 2.0 * contrast) * 4.0;

    // thin, hot filaments like the fine lines in the film frames
    float fine = vnoise(vec2(v * density * 3.1 + seed * 5.0, (z + t * 2.0) * stretch * 0.4));
    inten += pow(fine, 14.0) * 6.0;

    float h = mix(-0.08, 0.18, side) + colorShift + n * 0.30
            + 0.20 * sin(TIME * speed * 0.13 + side * 2.0 + seed);
    vec3 c = pal(h) * inten;

    // blow the brightest streaks out toward white
    c = mix(c, vec3(1.0), smoothstep(0.8, 2.0, inten) * 0.7);
    return c;
}

void main() {
    vec2 p = (gl_FragCoord.xy / RENDERSIZE - 0.5) * vec2(RENDERSIZE.x / RENDERSIZE.y, 1.0) * 2.0;
    float t = TIME * speed;

    // slow organic wobble
    p.y += distortion * 0.12 * sin(p.x * 2.5 + t * 0.4);
    p.x += distortion * 0.05 * sin(p.y * 3.0 + t * 0.7);

    float ax = abs(p.x);
    float ay = abs(p.y);
    float side = step(0.0, p.x);

    // side walls (fan from the central vertical seam)
    float d  = ax + 0.015;
    vec3 cw = streakLayer(1.0 / d, p.y / d, side, 1.0, t);
    cw *= smoothstep(0.0, 0.10, ax);

    // ceiling / floor (adds the corridor feel of the second frame)
    float d2 = ay + 0.03;
    vec3 cf = streakLayer(1.0 / d2, p.x / d2, side, 7.0, t * 0.8);
    cf *= smoothstep(0.0, 0.10, ay);

    float wWall = ax / (ax + ay + 1e-4);
    wWall = wWall * wWall * (3.0 - 2.0 * wWall);
    vec3 col = cw * wWall + cf * (1.0 - wWall) * 0.6;

    // drifting black voids around the edges
    float r = length(p);
    float ap = aperture * (0.75 + 0.5 * vnoise(vec2(p.y * 1.2 + side * 9.0, t * 0.15)));
    col *= exp(-pow(r / ap, 2.0));

    // luminous central seam and vanishing-point core
    float flick = 0.7 + 0.3 * vnoise(vec2(p.y * 8.0, t * 3.0));
    float seam = exp(-ax * 7.0) * exp(-ay * 0.6) * flick;
    float core = exp(-r * r * 28.0);
    vec3 seamCol = mix(pal(-0.05 + colorShift), pal(0.18 + colorShift), 0.5 + 0.5 * sin(t * 0.2));
    col += glow * (seam * mix(seamCol, vec3(1.0), 0.6) * 0.9 + core * vec3(1.0, 0.95, 1.0) * 1.6);

    // soft filmic roll-off
    col = 1.0 - exp(-col * 1.3);
    col = pow(col, vec3(0.9));

    vec3 finalColor = col;
    gl_FragColor = vec4(finalColor, 1.0);
}
