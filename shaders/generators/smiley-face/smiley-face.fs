/*{
    "CREDIT": "by Harald Walker",
    "CATEGORIES": [
        "Generator"
    ],
    "DESCRIPTION": "A simple smiley face drawn with signed distance functions",
    "INPUTS": [
        {
            "NAME": "offsetX",
            "LABEL": "Offset X",
            "TYPE": "float",
            "DEFAULT": 0.5,
            "MIN": 0.0,
            "MAX": 1.0
        },
        {
            "NAME": "offsetY",
            "LABEL": "Offset Y",
            "TYPE": "float",
            "DEFAULT": 0.5,
            "MIN": 0.0,
            "MAX": 1.0
        },
        {
            "NAME": "zoom",
            "LABEL": "Zoom",
            "TYPE": "float",
            "DEFAULT": 0.575,
            "MIN": 0.1,
            "MAX": 2.0
        },
        {
            "NAME": "smile",
            "LABEL": "Smile",
            "TYPE": "float",
            "DEFAULT": 0.4,
            "MIN": 0.0,
            "MAX": 1.0
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

float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

void main() {
    float div = RENDERSIZE.y / RENDERSIZE.x;
    vec2 aspect = vec2(1.0, div);
    vec2 uv = (gl_FragCoord.xy / RENDERSIZE) * aspect - vec2(0.5, 0.5 * div);

    vec2 center = vec2(offsetX, offsetY) * 2.0 - 1.0;
    center.x *= aspect.x;
    uv = (uv - center * 0.5) / zoom;

    float angle = TIME;
    float ca = cos(angle);
    float sa = sin(angle);
    uv = vec2(ca * uv.x - sa * uv.y, sa * uv.x + ca * uv.y);

    float smileAmount = clamp(smile, 0.0, 1.0);
    float lineW = 0.012;
    float face = 0.0;

    // head circle
    float head = sdCircle(uv, 0.4);
    face += smoothstep(lineW * 1.5, lineW * 0.75, abs(head));

    // eyes — round when closed, oval (taller) when talking
    float eyeX = 0.13;
    float eyeY = 0.1;
    float eyeR = 0.04;
    float eyeStretch = mix(1.0, 1.5, smileAmount);
    vec2 eyeScale = vec2(1.0, 1.0 / eyeStretch);
    float eyeL = sdCircle((uv - vec2(-eyeX, eyeY)) * eyeScale, eyeR);
    float eyeR2 = sdCircle((uv - vec2(eyeX, eyeY)) * eyeScale, eyeR);
    face += smoothstep(0.0, -0.005, eyeL) + smoothstep(0.0, -0.005, eyeR2);

    // mouth — flat line at talk=0, half-moon U-shape at talk=1
    float mouthCY = -0.12;
    float mouthW = 0.18;
    float mouthOpen = mix(0.0, 0.13, smileAmount);

    vec2 mp = uv - vec2(0.0, mouthCY);
    float curveY = mouthOpen * (1.0 - (mp.x * mp.x) / (mouthW * mouthW));
    float mouthDist = abs(mp.y + curveY);
    float hClip = smoothstep(mouthW, mouthW - 0.005, abs(mp.x));
    face += smoothstep(lineW, lineW * 0.5, mouthDist) * hClip;

    vec3 finalColor = vec3(clamp(face, 0.0, 1.0));
    gl_FragColor = vec4(finalColor, 1.0);
}
