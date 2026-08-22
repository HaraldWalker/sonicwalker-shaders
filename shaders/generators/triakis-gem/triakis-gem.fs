/*{
    "CREDIT": "by Harald Walker",
    "CATEGORIES": [
        "Generator"
    ],
    "DESCRIPTION": "A raymarched octahedron gem with faceted ridges, green-to-amber gradient, and dark edge lines",
    "INPUTS": [
        {
            "NAME": "offsetX",
            "TYPE": "float",
            "DEFAULT": 0.0,
            "MIN": -1.0,
            "MAX": 1.0
        },
        {
            "NAME": "offsetY",
            "TYPE": "float",
            "DEFAULT": 0.0,
            "MIN": -1.0,
            "MAX": 1.0
        },
        {
            "NAME": "size",
            "TYPE": "float",
            "DEFAULT": 0.36,
            "MIN": 0.2,
            "MAX": 1.5
        },
        {
            "NAME": "ridgeHeight",
            "TYPE": "float",
            "DEFAULT": 0.61,
            "MIN": 0.3,
            "MAX": 1.5
        },
        {
            "NAME": "edgeWidth",
            "TYPE": "float",
            "DEFAULT": 0.5,
            "MIN": 0.0,
            "MAX": 1.0
        },
        {
            "NAME": "lightIntensity",
            "TYPE": "float",
            "DEFAULT": 0.75,
            "MIN": 0.0,
            "MAX": 1.5
        },
        {
            "NAME": "lightAngle",
            "TYPE": "float",
            "DEFAULT": 180.0,
            "MIN": 0.0,
            "MAX": 360.0
        }
    ],
    "ISFVSN": 2.0
}
*/

#define MAX_STEPS 120
#define MAX_DIST 25.0
#define SURF_DIST 0.0012

mat3 rotateY(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
}

mat3 rotateX(float a) {
    float c = cos(a), s = sin(a);
    return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
}

float gH = 0.38;

float map(vec3 p, out int faceIdx) {
    float maxD = -1e10;
    faceIdx = 0;

    for (int sx = 0; sx < 2; sx++) {
        for (int sy = 0; sy < 2; sy++) {
            for (int sz = 0; sz < 2; sz++) {
                float fx = sx == 0 ? -1.0 : 1.0;
                float fy = sy == 0 ? -1.0 : 1.0;
                float fz = sz == 0 ? -1.0 : 1.0;

                vec3 ridge = vec3(fx * gH, fy * gH, fz * gH);
                vec3 v0 = vec3(fx, 0.0, 0.0);
                vec3 v1 = vec3(0.0, fy, 0.0);
                vec3 v2 = vec3(0.0, 0.0, fz);

                vec3 octCenter = vec3(fx, fy, fz) / sqrt(3.0);

                vec3 n0 = normalize(cross(v0 - ridge, v1 - ridge));
                if (dot(n0, octCenter) < 0.0) n0 = -n0;
                float dist0 = dot(n0, p) - dot(n0, ridge);
                if (dist0 > maxD) { maxD = dist0; faceIdx = sx * 4 + sy * 2 + sz; }

                vec3 n1 = normalize(cross(v1 - ridge, v2 - ridge));
                if (dot(n1, octCenter) < 0.0) n1 = -n1;
                float dist1 = dot(n1, p) - dot(n1, ridge);
                if (dist1 > maxD) { maxD = dist1; faceIdx = sx * 4 + sy * 2 + sz + 8; }

                vec3 n2 = normalize(cross(v2 - ridge, v0 - ridge));
                if (dot(n2, octCenter) < 0.0) n2 = -n2;
                float dist2 = dot(n2, p) - dot(n2, ridge);
                if (dist2 > maxD) { maxD = dist2; faceIdx = sx * 4 + sy * 2 + sz + 16; }
            }
        }
    }

    return maxD;
}

float mapSimple(vec3 p) {
    int dummy;
    return map(p, dummy);
}

vec3 getFaceNormal(vec3 p, out int faceIdx) {
    float maxD = -1e10;
    faceIdx = 0;
    vec3 bestN = vec3(0.0);

    for (int sx = 0; sx < 2; sx++) {
        for (int sy = 0; sy < 2; sy++) {
            for (int sz = 0; sz < 2; sz++) {
                float fx = sx == 0 ? -1.0 : 1.0;
                float fy = sy == 0 ? -1.0 : 1.0;
                float fz = sz == 0 ? -1.0 : 1.0;

                vec3 ridge = vec3(fx * gH, fy * gH, fz * gH);
                vec3 v0 = vec3(fx, 0.0, 0.0);
                vec3 v1 = vec3(0.0, fy, 0.0);
                vec3 v2 = vec3(0.0, 0.0, fz);
                vec3 octCenter = vec3(fx, fy, fz) / sqrt(3.0);

                vec3 n0 = normalize(cross(v0 - ridge, v1 - ridge));
                if (dot(n0, octCenter) < 0.0) n0 = -n0;
                float dist0 = dot(n0, p) - dot(n0, ridge);
                if (dist0 > maxD) { maxD = dist0; faceIdx = sx * 4 + sy * 2 + sz; bestN = n0; }

                vec3 n1 = normalize(cross(v1 - ridge, v2 - ridge));
                if (dot(n1, octCenter) < 0.0) n1 = -n1;
                float dist1 = dot(n1, p) - dot(n1, ridge);
                if (dist1 > maxD) { maxD = dist1; faceIdx = sx * 4 + sy * 2 + sz + 8; bestN = n1; }

                vec3 n2 = normalize(cross(v2 - ridge, v0 - ridge));
                if (dot(n2, octCenter) < 0.0) n2 = -n2;
                float dist2 = dot(n2, p) - dot(n2, ridge);
                if (dist2 > maxD) { maxD = dist2; faceIdx = sx * 4 + sy * 2 + sz + 16; bestN = n2; }
            }
        }
    }

    return bestN;
}

void main() {
    float div = RENDERSIZE.y / RENDERSIZE.x;
    vec2 aspect = vec2(1.0, div);
    vec2 uv = (gl_FragCoord.xy / RENDERSIZE) * aspect - vec2(0.5, 0.5 * div);

    float sz = mix(0.2, 1.5, size);
    vec2 offset = vec2(offsetX, offsetY) * 0.35;

    gH = mix(0.15, 0.55, ridgeHeight);
    float edgeW = mix(0.003, 0.04, edgeWidth);
    float lightInt = mix(0.0, 1.5, lightIntensity);
    float lightAng = radians(mix(0.0, 360.0, lightAngle));

    vec3 ro = vec3(0.0, 0.0, 3.2);
    vec3 rd = normalize(vec3(uv - offset, -1.4));

    float angleY = TIME * 0.35;
    float angleX = sin(TIME * 0.12) * 0.35 + 0.25;
    mat3 rot = rotateY(angleY) * rotateX(angleX);
    mat3 invRot = mat3(rot[0][0], rot[1][0], rot[2][0], rot[0][1], rot[1][1], rot[2][1], rot[0][2], rot[1][2], rot[2][2]);

    vec3 rRo = invRot * ro / sz;
    vec3 rRd = normalize(invRot * rd);

    float t = 0.0;
    bool hit = false;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = rRo + rRd * t;
        float d = mapSimple(p);
        if (d < SURF_DIST) { hit = true; break; }
        if (t > MAX_DIST) break;
        t += max(d * 0.7, 0.001);
    }

    vec3 finalColor;

    if (hit) {
        vec3 p = rRo + rRd * t;
        int faceIdx;
        vec3 n = getFaceNormal(p, faceIdx);
        vec3 nWorld = normalize(rot * n);

        float gradT = dot(nWorld, normalize(vec3(0.3, 1.0, 0.2)));
        gradT = gradT * 0.5 + 0.5;

        vec3 green = vec3(0.15, 0.75, 0.35);
        vec3 amber = vec3(0.95, 0.6, 0.12);
        vec3 baseColor = mix(green, amber, smoothstep(0.25, 0.75, gradT));

        vec3 lightDir = normalize(vec3(cos(lightAng), sin(lightAng), 0.8));
        float diff = max(dot(nWorld, lightDir), 0.0);
        float ambient = 0.2;
        baseColor *= (ambient + lightInt * diff);

        float edgeDist = 1e10;
        for (int sx = 0; sx < 2; sx++) {
            for (int sy = 0; sy < 2; sy++) {
                for (int sz = 0; sz < 2; sz++) {
                    float fx = sx == 0 ? -1.0 : 1.0;
                    float fy = sy == 0 ? -1.0 : 1.0;
                    float fz = sz == 0 ? -1.0 : 1.0;

                    vec3 ridge = vec3(fx * gH, fy * gH, fz * gH);
                    vec3 v0 = vec3(fx, 0.0, 0.0);
                    vec3 v1 = vec3(0.0, fy, 0.0);
                    vec3 v2 = vec3(0.0, 0.0, fz);
                    vec3 octCenter = vec3(fx, fy, fz) / sqrt(3.0);

                    vec3 n0 = normalize(cross(v0 - ridge, v1 - ridge));
                    if (dot(n0, octCenter) < 0.0) n0 = -n0;
                    int fIdx0 = sx * 4 + sy * 2 + sz;
                    if (fIdx0 != faceIdx) edgeDist = min(edgeDist, abs(dot(n0, p) - dot(n0, ridge)));

                    vec3 n1 = normalize(cross(v1 - ridge, v2 - ridge));
                    if (dot(n1, octCenter) < 0.0) n1 = -n1;
                    int fIdx1 = sx * 4 + sy * 2 + sz + 8;
                    if (fIdx1 != faceIdx) edgeDist = min(edgeDist, abs(dot(n1, p) - dot(n1, ridge)));

                    vec3 n2 = normalize(cross(v2 - ridge, v0 - ridge));
                    if (dot(n2, octCenter) < 0.0) n2 = -n2;
                    int fIdx2 = sx * 4 + sy * 2 + sz + 16;
                    if (fIdx2 != faceIdx) edgeDist = min(edgeDist, abs(dot(n2, p) - dot(n2, ridge)));
                }
            }
        }

        float edge = 1.0 - smoothstep(edgeW * 0.5, edgeW, edgeDist);
        vec3 edgeColor = vec3(0.02, 0.03, 0.01);
        finalColor = mix(baseColor, edgeColor, edge * 0.85);

        vec3 viewDir = -rRd;
        float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 4.0);
        finalColor += rim * vec3(0.15, 0.25, 0.1) * (1.0 - edge);

    } else {
        float bgGrad = length(uv) * 0.5;
        finalColor = mix(vec3(0.04, 0.05, 0.06), vec3(0.01, 0.015, 0.02), bgGrad);
    }

    gl_FragColor = vec4(finalColor, 1.0);
}
