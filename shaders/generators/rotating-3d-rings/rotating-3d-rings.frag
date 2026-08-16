/*
{
    "author": "Harald Walker",
    "color": "#00ccff",
    "movement": true,
    "parameters": [
        {
            "default": 0.5,
            "max": 2.0,
            "min": 0.1,
            "name": "camera",
            "label": "Camera"
        },
        {
            "default": 0.34,
            "max": 4,
            "min": 1,
            "name": "rings",
            "label": "Rings"
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
            "max": 1.0,
            "min": 0.1,
            "name": "wireframe",
            "label": "Wireframe"
        },
        {
            "default": 0.5,
            "max": 3.0,
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
    "uuid": "2a7e9b3c-4f81-4d5a-b6e3-1c9f0a82d7e5",
    "version": "1.2.0"
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
#define MARCH_STEPS 80
#define MAX_DIST 15.0
#define HIT_DIST 0.001

mat3 rotX(float a) {
    float c = cos(a), s = sin(a);
    return mat3(1,0,0, 0,c,s, 0,-s,c);
}

mat3 rotY(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c,0,-s, 0,1,0, s,0,c);
}

float sdTorus(vec3 p, float R, float r) {
    vec2 q = vec2(length(p.xz) - R, p.y);
    return length(q) - r;
}

void main() {
    float div = resolution.y / resolution.x;
    vec2 aspect = vec2(1.0, div);
    vec2 uv = texCoord * aspect - vec2(0.5, 0.5 * div);

    int numRings = int(rings + 0.5);
    if (numRings < 1) numRings = 1;
    if (numRings > 4) numRings = 4;

    float baseTubeR = mix(0.02, 0.10, thickness);
    float gridDensity = mix(8.0, 40.0, wireframe);
    float camDist = mix(1.8, 3.5, camera);
    float glowFalloff = mix(50.0, 5.0, glow);
    float glowBright = mix(0.02, 1.5, glow);

    vec3 ro = vec3(0.0, 0.0, -camDist);
    vec3 rd = normalize(vec3(uv, 1.8));

    float camYaw = time * 0.08;
    float camPitch = sin(time * 0.05) * 0.15;
    ro = rotY(camYaw) * rotX(camPitch) * ro;
    rd = rotY(camYaw) * rotX(camPitch) * rd;

    float t = 0.0;
    float glowAccum = 0.0;
    float hitIdx = -1.0;
    vec3 hitP = vec3(0.0);
    bool didHit = false;

    for (int s = 0; s < MARCH_STEPS; s++) {
        vec3 p = ro + rd * t;
        float minD = 1e10;
        float bestIdx = -1.0;

        for (int i = 0; i < 4; i++) {
            if (i >= numRings) continue;

            float fi = float(i);
            float nr = float(numRings);

            float majorR = 0.55 - fi * 0.13;
            float tubeR = baseTubeR / (0.5 + 0.5 * nr);

            float tilt = PI * 0.12 + fi * PI / nr;
            tilt += sin(time * 0.3 + fi * 1.5) * intensity * 0.5;
            tilt += sin(time * 0.7 + fi * 2.3) * intensity * 0.2;

            float spd = 0.8 * (1.0 + fi * 0.4);
            float dir = mod(fi, 2.0) * 2.0 - 1.0;
            float wobble = sin(time * (0.8 + fi * 0.5) + fi * 1.5) * intensity * 0.3;
            float spin = time * spd * dir + wobble;

            vec3 lp = rotY(-spin) * rotX(-tilt) * p;
            float d = sdTorus(lp, majorR, tubeR);

            if (d < minD) {
                minD = d;
                bestIdx = fi;
            }
        }

        glowAccum += exp(-minD * minD * glowFalloff) * 0.04;

        if (minD < HIT_DIST) {
            didHit = true;
            hitIdx = bestIdx;
            hitP = p;
            break;
        }

        t += minD * 0.75;
        if (t > MAX_DIST) break;
    }

    vec3 surf = vec3(0.0);

    if (didHit && hitIdx >= 0.0) {
        float fi = hitIdx;
        float nr = float(numRings);

        float majorR = 0.55 - fi * 0.13;
        float tubeR = baseTubeR / (0.5 + 0.5 * nr);

        float tilt = PI * 0.12 + fi * PI / nr;
        tilt += sin(time * 0.3 + fi * 1.5) * intensity * 0.5;
        tilt += sin(time * 0.7 + fi * 2.3) * intensity * 0.2;

        float spd = 0.8 * (1.0 + fi * 0.4);
        float dir = mod(fi, 2.0) * 2.0 - 1.0;
        float wobble = sin(time * (0.8 + fi * 0.5) + fi * 1.5) * intensity * 0.3;
        float spin = time * spd * dir + wobble;

        mat3 w2l = rotY(-spin) * rotX(-tilt);
        vec3 lp = w2l * hitP;

        float lenXZ = max(length(lp.xz), 0.001);
        float qDist = max(length(vec2(lenXZ - majorR, lp.y)), 0.001);
        float factor = (lenXZ - majorR) / qDist;
        vec3 localN = normalize(vec3(
            lp.x / lenXZ * factor,
            lp.y / qDist,
            lp.z / lenXZ * factor
        ));

        mat3 l2w = rotX(tilt) * rotY(spin);
        vec3 worldN = l2w * localN;

        vec3 lightDir = normalize(vec3(0.5, 0.8, -0.3));
        float diff = 0.5 + 0.5 * max(0.0, dot(worldN, lightDir));

        float theta = atan(lp.z, lp.x);
        float phi = atan(lp.y, lenXZ - majorR);

        float thetaCoord = (theta / TAU + 0.5) * gridDensity;
        float phiCoord = (phi / TAU + 0.5) * gridDensity;

        float lw = 0.07;
        float thetaDist = min(fract(thetaCoord), 1.0 - fract(thetaCoord));
        float phiDist = min(fract(phiCoord), 1.0 - fract(phiCoord));

        float thetaLine = 1.0 - smoothstep(lw * 0.3, lw, thetaDist);
        float phiLine = 1.0 - smoothstep(lw * 0.3, lw, phiDist);

        float wire = max(thetaLine, phiLine);

        surf = vec3(wire * diff);
    }

    vec3 glowCol = vec3(glowAccum * glowBright);
    vec3 finalColor = surf + glowCol;

    float coloredPixels = dot(clamp(finalColor, 0.0, 1.0), vec3(1.0));
    fragColor = vec4(finalColor * color.rgb, alpha * coloredPixels);
}
