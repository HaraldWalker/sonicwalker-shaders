/*
{
    "author": "harald",
    "color": "#E74C3C",
    "movement": true,
    "parameters": [
        {
            "name": "sliceSize",
            "label": "Slice Size",
            "min": 0,
            "max": 1,
            "default": 0.35
        },
        {
            "name": "glitchAmount",
            "label": "Glitch Amount",
            "min": 0,
            "max": 1,
            "default": 0.55
        },
        {
            "name": "shiftAmount",
            "label": "Shift",
            "min": 0,
            "max": 1,
            "default": 0.55
        },
        {
            "name": "rgbShift",
            "label": "RGB Shift",
            "min": 0,
            "max": 1,
            "default": 0.5
        },
        {
            "name": "blockCorrupt",
            "label": "Block Corruption",
            "min": 0,
            "max": 1,
            "default": 0.5
        },
        {
            "name": "scanlines",
            "label": "Scanlines",
            "min": 0,
            "max": 1,
            "default": 0.35
        }
    ],
    "url": "",
    "uuid": "bb3f7446-b196-406d-bdad-324344eaef59"
}
*/

#ifdef GL_ES
precision highp float;
#endif

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 signalColor(vec2 uv, float t) {
    float bands = sin(uv.y * 60.0 + t * 1.5) * 0.5 + 0.5;
    float hueBase = uv.x * 0.4 + uv.y * 0.15 + t * 0.04;
    float ramp = 0.5 + 0.5 * sin(uv.x * 3.0 - t * 0.8 + uv.y * 0.5);
    float v = 0.4 + 0.6 * bands * ramp;
    return hsv2rgb(vec3(hueBase, 0.75, v));
}

void main() {
    float div = resolution.y / resolution.x;
    vec2 aspect = vec2(1.0, div);
    vec2 uv = texCoord * aspect - vec2(0.5, 0.5 * div);
    float t = time;

    float sliceH = mix(0.003, 0.18, sliceSize);
    float glitchStrength = glitchAmount;
    float shiftAmp = mix(0.0, 0.6, shiftAmount);
    float chroma = mix(0.0, 0.2, rgbShift);
    float corruptAmt = blockCorrupt;
    float scanAmt = scanlines;

    float seedA = floor(t * 9.0);
    float seedB = floor(t * 5.3 + 17.0);
    float seedC = floor(t * 14.7 + 3.1);

    float row = floor(texCoord.y / sliceH);
    float rowRand = hash(vec2(row * 13.0, seedA));
    float hTrigger = step(1.0 - shiftAmount * glitchStrength, rowRand);
    float hAmp = (rowRand - 0.5) * 2.0;

    float colRow = floor(texCoord.x / sliceH);
    float colRand = hash(vec2(colRow * 17.0 + 4.0, seedB));
    float vTrigger = step(1.0 - shiftAmount * 0.4 * glitchStrength, colRand);
    float vAmp = (colRand - 0.5) * 2.0;

    float bigRow = floor(texCoord.y / (sliceH * 4.0));
    float bigRand = hash(vec2(bigRow * 7.0, seedC));
    float bigTrigger = step(1.0 - glitchStrength * 0.6, bigRand);

    vec2 shiftedCoord = texCoord;
    shiftedCoord.x = fract(shiftedCoord.x + hTrigger * hAmp * shiftAmp);
    shiftedCoord.y = fract(shiftedCoord.y + vTrigger * vAmp * shiftAmp * 0.5);

    float megaShift = (bigRand - 0.5) * bigTrigger * shiftAmp * 1.2;
    shiftedCoord.x = fract(shiftedCoord.x + megaShift);

    vec2 suv = shiftedCoord * aspect - vec2(0.5, 0.5 * div);
    vec3 col = signalColor(suv * 2.0, t);

    if (chroma > 0.001) {
        float chromaAmt = chroma * (hTrigger + bigTrigger * 0.5);
        vec2 dir = vec2(hAmp, vAmp) * chromaAmt;
        vec2 suvR = (shiftedCoord + dir) * aspect - vec2(0.5, 0.5 * div);
        vec2 suvB = (shiftedCoord - dir) * aspect - vec2(0.5, 0.5 * div);
        col = mix(col, vec3(
            signalColor(suvR * 2.0, t).r,
            col.g,
            signalColor(suvB * 2.0, t).b
        ), 1.0);
    }

    float blockScale = mix(20.0, 120.0, sliceSize);
    float blockSeed = hash(vec3(floor(shiftedCoord.x * blockScale), floor(shiftedCoord.y * blockScale), seedC));
    float blockMask = step(1.0 - corruptAmt * glitchStrength * 0.5, blockSeed)
                    * max(hTrigger, bigTrigger);
    if (blockMask > 0.5) {
        col = mix(col, vec3(blockSeed, hash(vec3(blockSeed, seedA, 0.0)), 1.0 - blockSeed), 0.6);
    }

    float scan = 0.5 + 0.5 * sin(shiftedCoord.y * resolution.y * 1.4 + t * 4.0);
    scan = mix(1.0, scan, scanAmt);
    col *= scan;

    float jitter = (hash(vec2(texCoord.x * resolution.x, seedC)) - 0.5) * 0.08 * glitchStrength;
    col += jitter;

    float vignette = 1.0 - dot(uv * 0.7, uv * 0.7) * 0.9;
    col *= clamp(vignette, 0.0, 1.0);

    col = clamp(col, 0.0, 1.0);

    vec3 finalColor = col;
    float coloredPixels = dot(finalColor, vec3(1.0));
    fragColor = vec4(finalColor * color.rgb, alpha * coloredPixels);
}
