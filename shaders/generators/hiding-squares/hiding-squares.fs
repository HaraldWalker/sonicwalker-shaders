/*{
    "CREDIT": "by Harald Walker",
    "CATEGORIES": [
        "Generator"
    ],
    "DESCRIPTION": "Grid of squares animated with noise-driven rotation, translation, and scale",
    "INPUTS": [
        {
            "NAME": "rotIntensity",
            "TYPE": "float",
            "DEFAULT": 0.0,
            "MIN": 0.0,
            "MAX": 90.0,
            "LABEL": "Rotation Intensity"
        },
        {
            "NAME": "transIntensity",
            "TYPE": "float",
            "DEFAULT": 18.0,
            "MIN": 0.0,
            "MAX": 100.0,
            "LABEL": "Translation Intensity"
        },
        {
            "NAME": "scaleIntensity",
            "TYPE": "float",
            "DEFAULT": 0.5,
            "MIN": 0.0,
            "MAX": 1.4,
            "LABEL": "Scale Intensity"
        },
        {
            "NAME": "cols",
            "TYPE": "float",
            "DEFAULT": 35.0,
            "MIN": 4.0,
            "MAX": 40.0,
            "LABEL": "Columns"
        },
        {
            "NAME": "noiseScale",
            "TYPE": "float",
            "DEFAULT": 4.132,
            "MIN": 1.0,
            "MAX": 10.0,
            "LABEL": "Noise Scale"
        },
        {
            "NAME": "seed",
            "TYPE": "float",
            "DEFAULT": 3100.0,
            "MIN": 0.0,
            "MAX": 5000.0,
            "LABEL": "Seed"
        }
    ],
    "ISFVSN": 2.0
}
*/

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
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

mat2 rot2(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

void main() {
    float div = RENDERSIZE.y / RENDERSIZE.x;
    vec2 aspect = vec2(1.0, div);
    vec2 uv = (gl_FragCoord.xy / RENDERSIZE) * aspect - vec2(0.5, 0.5 * div);

    float cellSize = 1.0 / cols;
    vec2 gridId = floor(uv / cellSize);
    vec2 fuv = fract(uv / cellSize);

    vec2 npos = gridId * noiseScale * 0.15 + vec2(seed * 0.013, seed * 0.019);
    float n = noise(npos) * 2.0 - 1.0;
    float factor = 1.0 - n * 0.5;

    float rot = factor * rotIntensity * 3.14159265 / 180.0;
    float td = factor * transIntensity * 0.02;
    float sc = 1.0 - factor * scaleIntensity;

    vec2 p = fuv - 0.5 - vec2(td, td);
    p = rot2(rot) * p;

    float hs = 0.5 * sc;
    float aa = 1.5 / (RENDERSIZE.y * cellSize);

    vec2 edge = 1.0 - smoothstep(vec2(hs - aa), vec2(hs + aa), abs(p));
    float sq = edge.x * edge.y;

    vec3 finalColor = vec3(sq);
    gl_FragColor = vec4(finalColor, 1.0);
}