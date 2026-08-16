/*
{
    "author": "Harald Walker",
    "color": "#44aaff",
    "movement": true,
    "parameters": [
        {
            "default": 0.15,
            "max": 360,
            "min": 0,
            "name": "rotationAngle",
            "label": "Rotation"
        },
        {
            "default": 0.4,
            "max": 0.6,
            "min": 0.1,
            "name": "cubeSize",
            "label": "Cube Size"
        },
        {
            "default": 0.35,
            "max": 1.0,
            "min": 0.05,
            "name": "spacing",
            "label": "Spacing"
        },
        {
            "default": 0.0,
            "max": 1.0,
            "min": 0.0,
            "name": "expansion",
            "label": "Expansion"
        },
        {
            "default": 0.5,
            "max": 1.0,
            "min": 0.0,
            "name": "intensity",
            "label": "Light Intensity"
        },
        {
            "default": 0.35,
            "max": 360,
            "min": 0,
            "name": "lightAngle",
            "label": "Light Angle"
        }
    ],
    "url": "https://github.com/HaraldWalker/sonicwalker-shaders",
    "uuid": "9cdfff73-0451-467b-8240-ffa041a03e38",
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
#define MAX_STEPS 80
#define MAX_DIST 20.0
#define SURF_DIST 0.001

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

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float map(vec3 p) {
    float a = rotationAngle / 360.0;
    float yAmt = smoothstep(0.0, 0.25, a) * (1.0 - smoothstep(0.6, 0.85, a));
    float xAmt = smoothstep(0.2, 0.5, a) * (1.0 - smoothstep(0.8, 1.0, a));
    float zAmt = smoothstep(0.5, 0.75, a);

    mat3 rot = rotateZ(time * 0.1 * zAmt)
             * rotateX(time * 0.15 * xAmt)
             * rotateY(time * 0.2 * yAmt);
    vec3 rp = rot * p;

    float s = mix(0.1, 0.6, cubeSize);
    float sp = mix(0.15, 1.2, spacing);
    float ex = expansion * 1.5;

    float d = MAX_DIST;

    for (int i = 0; i < 27; i++) {
        int ix = i / 9 - 1;
        int iy = (i / 3) % 3 - 1;
        int iz = i % 3 - 1;

        vec3 g = vec3(float(ix), float(iy), float(iz));
        float distC = length(g);

        vec3 pos = g * (sp + ex * distC * 0.4);

        float cube = sdBox(rp - pos, vec3(s));
        d = min(d, cube);
    }

    return d;
}

vec3 getNormal(vec3 p) {
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

    vec3 ro = vec3(0.0, 0.3, -5.5);
    vec3 rd = normalize(vec3(uv, 1.5));

    float t = 0.0;
    bool hit = false;
    float minSDF = MAX_DIST;

    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        minSDF = min(minSDF, max(d, 0.0));
        if (d < SURF_DIST) { hit = true; break; }
        if (t > MAX_DIST) break;
        t += d * 0.8;
    }

    vec3 finalColor = vec3(0.0);

    float depthRamp = exp(-min(t, MAX_DIST) * 0.08);
    depthRamp = clamp(depthRamp, 0.1, 1.0);

    float glow = exp(-minSDF * 10.0) * 0.3 * depthRamp;

    if (hit) {
        vec3 p = ro + rd * t;
        vec3 n = getNormal(p);
        vec3 viewDir = normalize(-rd);

        float la = lightAngle * PI / 180.0;
        vec3 lightDir = normalize(vec3(cos(la), 0.6, sin(la)));
        float li = mix(0.5, 3.0, intensity);

        float diff = max(dot(n, lightDir), 0.0);
        float lighting = 0.2 + diff * li;

        float fresnel = 1.0 - max(dot(n, viewDir), 0.0);
        fresnel = pow(fresnel, 3.0);
        lighting += fresnel * li * 0.35;

        lighting *= depthRamp;
        lighting += glow * 0.4;

        finalColor = vec3(clamp(lighting, 0.0, 1.0));
    } else {
        finalColor = vec3(clamp(glow * 0.6, 0.0, 1.0));
    }

    float coloredPixels = dot(clamp(finalColor, 0.0, 1.0), vec3(1.0));
    fragColor = vec4(finalColor * color.rgb, alpha * coloredPixels);
}
