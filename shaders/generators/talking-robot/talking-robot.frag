/*
{
    "author": "Harald Walker",
    "color": "#cccccc",
    "movement": true,
    "parameters": [
        {
            "default": 0.5,
            "max": 1,
            "min": 0,
            "name": "offsetX",
            "label": "Offset X"
        },
        {
            "default": 0.5,
            "max": 1,
            "min": 0,
            "name": "offsetY",
            "label": "Offset Y"
        },
        {
            "default": 0.5,
            "max": 2,
            "min": 0.1,
            "name": "zoom",
            "label": "Zoom"
        },
        {
            "default": 0.0,
            "max": 1,
            "min": 0,
            "name": "talk",
            "label": "Talk"
        }
    ],
    "url": "https://github.com/HaraldWalker/sonicwalker-shaders",
    "uuid": "760193b0-9931-46b0-8b38-80e4ee737c11",
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

float sdRoundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

float sdSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

float sdTriangle(vec2 p, float size) {
    float k = sqrt(3.0);
    p.x = abs(p.x) - size;
    p.y = p.y + size / k;
    if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0 * size, 0.0);
    return -length(p) * sign(p.y);
}

float stroke(float d, float w) {
    return smoothstep(w, w * 0.5, abs(d));
}

void main() {
    float div = resolution.y / resolution.x;
    vec2 aspect = vec2(1.0, div);
    vec2 uv = texCoord * aspect - vec2(0.5, 0.5 * div);

    vec2 center = vec2(offsetX, offsetY) * 2.0 - 1.0;
    center.x *= aspect.x;
    uv = (uv - center * 0.5) / zoom;

    float t = time * 2.0;
    float talkAmount = clamp(talk, 0.0, 1.0);

    float headW = 0.3;
    float headH = 0.38;
    float headR = 0.06;
    float lineW = 0.012;

    float face = 0.0;

    // head outline
    float head = sdRoundedBox(uv, vec2(headW, headH), headR);
    face += stroke(head, lineW * 1.5);

    // antenna
    float antennaBase = sdSegment(uv, vec2(0.0, headH), vec2(0.0, headH + 0.1));
    face += stroke(antennaBase, lineW);
    float antennaBall = sdCircle(uv - vec2(0.0, headH + 0.12), 0.02);
    face += smoothstep(0.0, -0.005, antennaBall);

    // ear bolts
    float earL = sdCircle(uv - vec2(-headW - 0.01, 0.05), 0.025);
    float earR = sdCircle(uv - vec2(headW + 0.01, 0.05), 0.025);
    face += stroke(earL, lineW);
    face += stroke(earR, lineW);

    // eye sockets
    float eyeY = 0.1;
    float eyeSpacing = 0.12;
    float eyeRadius = 0.07;
    float eyeL = sdCircle(uv - vec2(-eyeSpacing, eyeY), eyeRadius);
    float eyeR = sdCircle(uv - vec2(eyeSpacing, eyeY), eyeRadius);
    face += smoothstep(0.0, -0.005, eyeL);
    face += smoothstep(0.0, -0.005, eyeR);

    // pupils
    float blink = smoothstep(0.0, 0.05, abs(sin(t * 0.7))) ;
    float pupilR = 0.025;
    float pupilL = sdCircle(uv - vec2(-eyeSpacing, eyeY), pupilR * blink);
    float pupilR2 = sdCircle(uv - vec2(eyeSpacing, eyeY), pupilR * blink);
    face += stroke(pupilL, lineW * 0.8);
    face += stroke(pupilR2, lineW * 0.8);

    // eyebrows — raise with talkAmount
    float browY = eyeY + 0.1 + talkAmount * 0.04;
    float browLen = 0.08;
    float browL = sdSegment(uv, vec2(-eyeSpacing - browLen, browY - 0.015 * talkAmount), vec2(-eyeSpacing + browLen, browY + 0.015 * talkAmount));
    float browR = sdSegment(uv, vec2(eyeSpacing - browLen, browY + 0.015 * talkAmount), vec2(eyeSpacing + browLen, browY - 0.015 * talkAmount));
    face += stroke(browL, lineW);
    face += stroke(browR, lineW);

    // nose — small inverted triangle
    float nose = sdTriangle((uv - vec2(0.0, 0.0)) * vec2(1.0, -1.0), 0.025);
    face += stroke(nose, lineW * 0.8);

    // mouth — morphs from closed line to open rounded rectangle
    float mouthY = -0.15;
    float mouthW = 0.1;
    float mouthClosedH = 0.005;
    float mouthOpenH = 0.055;
    float mouthH = mix(mouthClosedH, mouthOpenH, talkAmount);
    float mouthR = mix(0.002, 0.025, talkAmount);
    float mouth = sdRoundedBox(uv - vec2(0.0, mouthY), vec2(mouthW, mouthH), mouthR);

    if (talkAmount < 0.01) {
        // fully closed — thin line
        float mouthLine = sdSegment(uv, vec2(-mouthW, mouthY), vec2(mouthW, mouthY));
        face += stroke(mouthLine, lineW * 0.6);
    } else {
        // transition and open states
        float mouthStroke = mix(lineW * 0.6, lineW * 1.2, talkAmount);
        face += stroke(mouth, mouthStroke);

        // teeth line when partially/fully open
        float teethY = mouthY + mouthH * 0.3;
        float teethLine = abs(uv.y - teethY) - 0.002;
        float teethClip = step(-mouthW + 0.03, uv.x) * step(uv.x, mouthW - 0.03);
        float teethMask = smoothstep(0.005, 0.0, abs(mouth)) * teethClip;
        face += smoothstep(0.002, 0.0, teethLine) * teethMask * talkAmount * 0.5;
    }

    // neck
    float neck = sdRoundedBox(uv - vec2(0.0, -headH - 0.06), vec2(0.06, 0.04), 0.01);
    face += stroke(neck, lineW);

    // shoulder hints
    float shoulderL = sdSegment(uv, vec2(-0.06, -headH - 0.1), vec2(-0.2, -headH - 0.14));
    float shoulderR = sdSegment(uv, vec2(0.06, -headH - 0.1), vec2(0.2, -headH - 0.14));
    face += stroke(shoulderL, lineW);
    face += stroke(shoulderR, lineW);

    // subtle face plate fill
    float plateFill = smoothstep(0.005, -0.005, head) * 0.06;

    // antenna glow
    float antGlow = exp(-antennaBall * 30.0) * (0.5 + 0.5 * sin(t * 3.0));

    vec3 finalColor = vec3(clamp(face + plateFill + antGlow * 0.3, 0.0, 1.0));

    float coloredPixels = dot(clamp(finalColor, 0.0, 1.0), vec3(1.0));
    fragColor = vec4(finalColor * color.rgb, alpha * coloredPixels);
}
