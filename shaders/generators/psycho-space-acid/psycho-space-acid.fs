/*{
    "CREDIT": "by Harald Walker",
    "CATEGORIES": [
        "Generator"
    ],
    "DESCRIPTION": "Acid-style pixelated cube in a patterned room with stepped camera cuts, rolling patterns and stutter",
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
            "NAME": "sceneScale",
            "LABEL": "Scene Scale",
            "TYPE": "float",
            "DEFAULT": 1.0,
            "MIN": 0.5,
            "MAX": 2.0
        },
        {
            "NAME": "patternScale",
            "LABEL": "Pattern Scale",
            "TYPE": "float",
            "DEFAULT": 2.0,
            "MIN": 0.5,
            "MAX": 8.0
        },
        {
            "NAME": "pixelSize",
            "LABEL": "Pixel Size",
            "TYPE": "float",
            "DEFAULT": 4.0,
            "MIN": 1.0,
            "MAX": 32.0
        },
        {
            "NAME": "rotationSpeed",
            "LABEL": "Cube Rotation",
            "TYPE": "float",
            "DEFAULT": 0.5,
            "MIN": 0.0,
            "MAX": 3.0
        },
        {
            "NAME": "scrollSpeed",
            "LABEL": "Pattern Scroll",
            "TYPE": "float",
            "DEFAULT": 0.5,
            "MIN": 0.0,
            "MAX": 4.0
        },
        {
            "NAME": "stutter",
            "LABEL": "Stutter",
            "TYPE": "float",
            "DEFAULT": 0.25,
            "MIN": 0.0,
            "MAX": 1.0
        },
        {
            "NAME": "kick",
            "LABEL": "Kick",
            "TYPE": "float",
            "DEFAULT": 0.0,
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

// ---------- helpers ----------
float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

vec3 rotY(vec3 v, float a) {
  float c = cos(a), s = sin(a);
  return vec3(c*v.x + s*v.z, v.y, -s*v.x + c*v.z);
}

vec3 rotX(vec3 v, float a) {
  float c = cos(a), s = sin(a);
  return vec3(v.x, c*v.y - s*v.z, s*v.y + c*v.z);
}

// k = 0..3 (3 is the dark colour)
vec3 palCol(float k) {
  if (k < 0.5) return vec3(1.0, 0.0, 0.6);
  if (k < 1.5) return vec3(0.0, 0.9, 1.0);
  if (k < 2.5) return vec3(1.0, 0.9, 0.0);
  return vec3(0.05, 0.0, 0.2);
}

// returns 0 or 1
float pat(vec2 q, float type, float sc, float scroll) {
  q *= sc;
  if (type < 0.5) {
    return step(0.5, fract(q.x + scroll));
  } else if (type < 1.5) {
    return mod(floor(q.x + scroll) + floor(q.y), 2.0);
  } else if (type < 2.5) {
    return step(0.5, fract(length(q) - scroll));
  } else if (type < 3.5) {
    vec2 g = abs(fract(q + vec2(scroll, 0.0)) - 0.5);
    return step(0.42, max(g.x, g.y));
  }
  return step(0.5, fract((q.x + q.y) * 0.7071 + scroll));
}

void main() {
  // pixelated coordinates
  vec2 fc = gl_FragCoord.xy;
  float px = max(pixelSize, 1.0);
  vec2 sc = (floor(fc / px) + 0.5) * px;
  vec2 p = (sc - 0.5 * RENDERSIZE) / RENDERSIZE.y;

  // timing - speed scales time; a new cut is rolled every time unit
  float t = TIME * speed;
  float seed = floor(t);

  float r1 = hash11(seed * 1.31 + 1.0);
  float r2 = hash11(seed * 2.17 + 2.0);
  float r3 = hash11(seed * 3.49 + 3.0);
  float r4 = hash11(seed * 4.73 + 4.0);
  float r5 = hash11(seed * 5.91 + 5.0);
  float r6 = hash11(seed * 7.07 + 6.0);

  // stutter: freeze animation for random segments
  float seg = floor(t * 2.0);
  float tAnim = mix(t, seg * 0.5, step(hash11(seg * 1.7 + 3.0), stutter));

  // camera (stepped angles)
  float yaw = (floor(r1 * 8.0) / 8.0 - 0.5) * 2.4;
  float pitch = (floor(r2 * 5.0) / 5.0 - 0.3) * 0.9;
  float camD = 2.6 + r3 * 1.8;
  vec3 ro = rotY(rotX(vec3(0.0, 0.0, -camD), pitch), yaw);
  vec3 rd = normalize(vec3(p / sceneScale, 0.9));
  rd = rotY(rotX(rd, pitch), yaw);

  // cube orientation, stepped every eighth of a cut
  float dir = (r4 > 0.5) ? 1.0 : -1.0;
  float ang = floor(tAnim * 8.0) / 8.0 * rotationSpeed * dir;
  float a = ang + r5 * 6.2831;
  float b = ang * 0.6 + r6 * 6.2831;
  vec3 lro = rotX(rotY(ro, -a), -b);
  vec3 lrd = rotX(rotY(rd, -a), -b);
  vec3 hb = vec3(0.6) + 0.5 * vec3(hash11(seed + 11.0), hash11(seed + 12.0), hash11(seed + 13.0));

  // ray vs cube (slab method)
  vec3 inv = 1.0 / (lrd + vec3(1e-6));
  vec3 t1 = (-hb - lro) * inv;
  vec3 t2 = (hb - lro) * inv;
  vec3 tmin = min(t1, t2);
  vec3 tmax = max(t1, t2);
  float tN = max(max(tmin.x, tmin.y), tmin.z);
  float tF = min(min(tmax.x, tmax.y), tmax.z);

  bool isCube = false;
  vec2 uv = vec2(0.0);
  float id = 0.0;
  float edgeLine = 0.0;

  if (tF > tN && tN > 0.0) {
    isCube = true;
    vec3 m = step(tmin.yzx, tmin.xyz) * step(tmin.zxy, tmin.xyz);
    vec3 lp = lro + lrd * tN;
    float sgn = step(0.0, dot(lrd, m));
    id = (m.y + 2.0 * m.z) * 2.0 + sgn;
    vec2 ext;
    if (m.x > 0.5) { uv = lp.yz; ext = hb.yz; }
    else if (m.y > 0.5) { uv = lp.xz; ext = hb.xz; }
    else { uv = lp.xy; ext = hb.xy; }
    edgeLine = step(0.93, max(abs(uv.x) / ext.x, abs(uv.y) / ext.y));
  } else {
    // inside of a big room (box, half size 5)
    vec3 rinv = 1.0 / (rd + vec3(1e-6));
    vec3 rt1 = (-vec3(5.0) - ro) * rinv;
    vec3 rt2 = (vec3(5.0) - ro) * rinv;
    vec3 rtmax = max(rt1, rt2);
    float rF = min(min(rtmax.x, rtmax.y), rtmax.z);
    vec3 m = step(rtmax.xyz, rtmax.yzx) * step(rtmax.xyz, rtmax.zxy);
    vec3 hp = ro + rd * rF;
    float sgn = step(0.0, dot(rd, m));
    id = 6.0 + (m.y + 2.0 * m.z) * 2.0 + sgn;
    if (m.x > 0.5) uv = hp.yz;
    else if (m.y > 0.5) uv = hp.xz;
    else uv = hp.xy;
  }

  // per-surface style, re-rolled every cut
  float hS = hash11(seed * 3.7 + id * 11.3 + 0.5);
  float ptype = floor(hS * 5.0);
  float ia = floor(hash11(hS * 91.7 + 1.0) * 3.0);
  float ib = mod(ia + 1.0 + floor(hash11(hS * 37.1 + 2.0) * 3.0), 4.0);
  float sdir = (hash11(hS * 13.0) > 0.5) ? 1.0 : -1.0;
  float scroll = floor(tAnim * 16.0) / 16.0 * scrollSpeed * sdir;
  float v = pat(uv, ptype, patternScale, scroll);
  vec3 col = mix(palCol(ia), palCol(ib), v);
  if (isCube) col = mix(col, vec3(0.0), edgeLine);

  // external kick (map to audio)
  col = mix(col, vec3(1.0), clamp(kick, 0.0, 1.0));

  gl_FragColor = vec4(col, 1.0);
}
