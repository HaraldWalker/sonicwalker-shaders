/*
{
    "author": "Harald Walker",
    "color": "#ff4400",
    "movement": true,
    "parameters": [
        {
            "default": 0.5,
            "max": 1.0,
            "min": -1.0,
            "name": "offsetX",
            "label": "Offset X"
        },
        {
            "default": 0.5,
            "max": 1.0,
            "min": -1.0,
            "name": "offsetY",
            "label": "Offset Y"
        },
        {
            "default": 1.0,
            "max": 2.0,
            "min": 0.1,
            "name": "size",
            "label": "Size"
        },
        {
            "default": 0.5,
            "max": 8.0,
            "min": 1.0,
            "name": "arms",
            "label": "Arms"
        },
        {
            "default": 0.5,
            "max": 3.0,
            "min": 0.0,
            "name": "intensity",
            "label": "Intensity"
        }
    ],
    "url": "https://github.com/HaraldWalker/sonicwalker-shaders",
    "uuid": "4a5992bc-f965-4b3a-9be9-624ef8518fad",
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
    vec2 uv = texCoord - 0.5;
    uv.x *= resolution.x / resolution.y;
    uv -= vec2(offsetX, offsetY);

    float r = length(uv);
    float a = atan(uv.y, uv.x);

    float T = time;
    float invSize = 1.0 / size;

    float armAngle = a - log(r + 0.001) * (4.0 * invSize) + T * 2.0;

    float numArms = max(arms, 1.0);
    float armMask = 0.0;
    for (int i = 0; i < 8; i++) {
        if (float(i) >= numArms) break;
        float offset = float(i) * (6.2832 / numArms);
        float d = abs(mod(armAngle + offset, 6.2832) - 3.1416);
        armMask += exp(-d * d * (8.0 * invSize));
    }
    armMask = clamp(armMask, 0.0, 1.0);

    float diskFade = 1.0 - smoothstep(0.05, 0.45 * size, r);
    float innerGlow = exp(-r * 6.0 / size) * 0.8;

    vec2 fireUV = vec2(a * 2.0 - T * 0.5, r * 10.0 * invSize - T * 1.5);
    float n1 = fbm(fireUV * 2.0);
    float n2 = fbm(fireUV * 3.5 + vec2(T * 0.4, -T * 0.6));
    float n3 = fbm(fireUV * 5.0 + vec2(-T * 0.2, T * 0.3));

    float flames = armMask * (n1 * 0.6 + n2 * 0.3 + n3 * 0.1);
    flames = pow(flames, 0.8) * intensity;
    flames += innerGlow * intensity * 0.4;

    flames *= diskFade;

    vec3 c1 = vec3(0.15, 0.0, 0.0);
    vec3 c2 = vec3(0.7, 0.05, 0.0);
    vec3 c3 = vec3(1.0, 0.4, 0.0);
    vec3 c4 = vec3(1.0, 0.85, 0.15);

    float t = clamp(flames, 0.0, 1.0);
    vec3 col = mix(c1, c2, smoothstep(0.0, 0.25, t));
    col = mix(col, c3, smoothstep(0.25, 0.55, t));
    col = mix(col, c4, smoothstep(0.55, 0.9, t));

    float hotCore = smoothstep(0.7, 1.0, t) * intensity * 0.5;
    col += vec3(1.0, 0.95, 0.6) * hotCore;

    vec3 finalColor = clamp(col, 0.0, 1.0);
    float coloredPixels = dot(clamp(finalColor, 0.0, 1.0), vec3(1.0));
    fragColor = vec4(finalColor * color.rgb, alpha * coloredPixels);
}
