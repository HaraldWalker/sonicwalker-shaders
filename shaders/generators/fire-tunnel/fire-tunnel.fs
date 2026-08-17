/*{
    "CREDIT": "by Harald Walker",
    "CATEGORIES": [
        "Generator"
    ],
    "DESCRIPTION": "A first-person flight through a twisting fire tunnel with procedural flame walls",
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
            "NAME": "intensity",
            "LABEL": "Intensity",
            "TYPE": "float",
            "DEFAULT": 1.5,
            "MIN": 0.0,
            "MAX": 3.0
        },
        {
            "NAME": "turbulence",
            "LABEL": "Turbulence",
            "TYPE": "float",
            "DEFAULT": 1.05,
            "MIN": 0.1,
            "MAX": 2.0
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

vec2 tunnelPath(float z) {
    return vec2(
        sin(z * 0.1) * 0.6 + sin(cos(z * 0.031) * 4.0) * 0.3,
        cos(z * 0.1) * 0.5 + cos(cos(z * 0.031) * 4.0) * 0.25
    );
}

void main() {
    float div = RENDERSIZE.y / RENDERSIZE.x;
    vec2 aspect = vec2(1.0, div);
    vec2 p = (gl_FragCoord.xy / RENDERSIZE) * aspect - vec2(0.5, 0.5 * div);
    p -= vec2(offsetX, offsetY);

    float T = TIME;
    float camZ = T * 8.0;
    vec2 cam = tunnelPath(camZ);

    float dt = 0.5;
    vec2 cam2 = tunnelPath(camZ + dt);
    vec2 dcamdt = (cam2 - cam) / dt;

    vec3 f = vec3(0.0);

    for (int j = 1; j <= 80; j++) {
        float i = float(j);
        float realZ = floor(camZ) + i;
        float screenZ = realZ - camZ;
        float ringR = 1.0 / screenZ;
        vec2 c = (tunnelPath(realZ) - cam) * 5.0 / screenZ - dcamdt * 0.3;

        float d = length(p - c);
        float wallDist = abs(d - ringR);

        float angle = atan(p.y - c.y, p.x - c.x);

        float n1 = noise(vec2(angle * 3.0 + realZ * 0.3 - T * 2.0, realZ * 0.4 - T * 3.0) * turbulence);
        float n2 = noise(vec2(angle * 5.0 - realZ * 0.2 + T * 1.5, realZ * 0.6 - T * 2.0) * turbulence * 1.5);
        float flames = n1 * 0.6 + n2 * 0.4;
        flames = pow(flames, 0.6) * intensity;

        float wallGlow = flames * 0.2 / screenZ / (wallDist * 15.0 + 0.08);

        float t = clamp(flames, 0.0, 1.0);
        vec3 fireCol = mix(vec3(0.08, 0.01, 0.0), vec3(0.7, 0.1, 0.0), smoothstep(0.0, 0.3, t));
        fireCol = mix(fireCol, vec3(1.0, 0.5, 0.0), smoothstep(0.3, 0.6, t));
        fireCol = mix(fireCol, vec3(1.0, 0.9, 0.2), smoothstep(0.6, 1.0, t));

        f += fireCol * wallGlow;
    }

    vec3 finalColor = clamp(f, 0.0, 1.0);
    gl_FragColor = vec4(finalColor, 1.0);
}
