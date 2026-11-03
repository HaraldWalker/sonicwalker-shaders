/*
{
    "CREDIT": "by Harald Walker",
    "CATEGORIES": [
        "Generator"
    ],
    "DESCRIPTION": "Rotating double helix built from glowing binary digits with depth blur and drifting particles",
    "INPUTS": [
        {
            "NAME": "tilt",
            "LABEL": "Tilt",
            "TYPE": "float",
            "DEFAULT": 22.91,
            "MIN": -90.0,
            "MAX": 90.0
        },
        {
            "NAME": "stretch",
            "LABEL": "Stretch",
            "TYPE": "float",
            "DEFAULT": 1.0,
            "MIN": 0.5,
            "MAX": 2.0
        },
        {
            "NAME": "radius",
            "LABEL": "Helix Radius",
            "TYPE": "float",
            "DEFAULT": 0.27,
            "MIN": 0.1,
            "MAX": 0.45
        },
        {
            "NAME": "digitDensity",
            "LABEL": "Digits Per Rung",
            "TYPE": "float",
            "DEFAULT": 22.0,
            "MIN": 8.0,
            "MAX": 40.0
        },
        {
            "NAME": "particles",
            "LABEL": "Particles",
            "TYPE": "float",
            "DEFAULT": 0.6,
            "MIN": 0.0,
            "MAX": 1.0
        },
        {
            "NAME": "depthBlur",
            "LABEL": "Depth Blur",
            "TYPE": "float",
            "DEFAULT": 0.8,
            "MIN": 0.0,
            "MAX": 2.0
        },
        {
            "NAME": "glow",
            "LABEL": "Glow",
            "TYPE": "float",
            "DEFAULT": 1.0,
            "MIN": 0.0,
            "MAX": 3.0
        },
        {
            "NAME": "tintColor",
            "LABEL": "Tint Color",
            "TYPE": "color",
            "DEFAULT": [
                0.6,
                1.0,
                0.051,
                1.0
            ]
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

#define PI    3.14159265359
#define TWIST 1.0           // full turns of the helix per screen height
#define SP    0.38941834    // sin(camera pitch 0.40)
#define CP    0.92106099    // cos(camera pitch 0.40)
#define PERS  0.5           // perspective strength
#define MAXR  44            // max rungs considered per pixel
#define MAXS  80            // max strand samples per pixel
#define DYS   0.011         // strand sample spacing along the axis

float hash21(vec2 p) {
	p = fract(p * vec2(123.34, 456.21));
	p += dot(p, p + 45.32);
	return fract(p.x * p.y);
}

float sdSeg(vec2 p, vec2 a, vec2 b) {
	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
	return length(pa - ba * h);
}

// Soft-edged line coverage. More blur = wider edge and lower peak (keeps energy roughly constant).
float softEdge(float d, float r, float soft) {
	return (1.0 - smoothstep(r - 0.5 * soft, r + 1.5 * soft, d)) / (1.0 + soft * 6.0);
}

// c = position inside a cell (0..1), soft = blur amount in cell units. Returns vec2(core, halo).
vec2 glyph(vec2 c, float bit, float soft) {
	vec2 q = c - 0.5;
	float d;
	if (bit < 0.5) {
		float e = length(q / vec2(0.26, 0.36));
		d = abs(e - 1.0) * 0.26;
	} else {
		d = min(sdSeg(q, vec2(0.0, -0.36), vec2(0.0, 0.36)),
		        sdSeg(q, vec2(0.0, 0.36), vec2(-0.19, 0.22)));
	}
	float s = max(soft, 0.025);
	float core = softEdge(d, 0.06, s);
	float halo = exp(-d * 20.0 / (1.0 + s * 8.0)) * 0.22 / (1.0 + s * 4.0);
	return vec2(core, halo);
}

// Depth (-1 back .. 1 front) -> blur strength. Things in front of the focus plane go soft.
float blurOf(float zn) {
	return depthBlur * smoothstep(0.35, 1.0, zn * 0.5 + 0.5);
}

// Project a point on a rung / strand.
// t = -1..1 across the rung (t = +-1 are the two strands), y = height along axis, a = rotation angle.
// returns vec3(screenX, screenY, depth -1 (back) .. 1 (front))
vec3 proj(float t, float y, float a) {
	float x = t * radius * cos(a);
	float z = t * radius * sin(a);
	float s = 1.0 / (1.0 - PERS * z);
	return vec3(x * s, y * CP - z * SP * s, t * sin(a));
}

// Glowing tube segment between two projected points
vec3 strandSeg(vec2 px, vec3 A, vec3 B, inout float cover, inout float zs) {
	vec2 pa = px - A.xy;
	vec2 ba = B.xy - A.xy;
	float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-8), 0.0, 1.0);
	float d = length(pa - ba * h);
	float zn = mix(A.z, B.z, h);
	float z01 = zn * 0.5 + 0.5;
	float b = blurOf(zn);

	float th = 0.013 * (0.65 + 0.7 * z01);                 // front strand is thicker
	float sb = b * 0.012;
	float cv = (1.0 - smoothstep(th * 0.55 - 0.5 * sb, th + 1.5 * sb, d)) / (1.0 + b * 1.5);
	float halo = exp(-d / ((0.012 + 0.03 * glow) * (1.0 + b * 0.8))) * 0.55 * glow / (1.0 + b * 0.6);
	float depth = 0.35 + 0.65 * z01;                        // back strand is dimmer

	if (cv > cover) { cover = cv; zs = zn; }

	vec3 hot = mix(tintColor.rgb, vec3(1.0, 1.0, 0.55), 0.65);
	return (hot * cv * 1.4 + tintColor.rgb * halo) * depth;
}

// Sparse floating digits / dots in the background. soft = blur (bigger = closer to camera)
vec3 particleLayer(vec2 p, float scale, float spd, float seed, float amt, float weight, float soft) {
	vec2 g = p * scale;
	g.y += TIME * spd * scale;
	vec2 id = floor(g);
	vec2 f = fract(g);
	float h = hash21(id + seed);
	if (h > amt * 0.3 * weight) return vec3(0.0);

	// glyph is drawn at ~55% of the cell so a blurred glyph is not clipped by the cell edge
	vec2 c = (f - 0.5) * 1.8 + 0.5;
	float h2 = hash21(id + seed * 9.1);
	float val;
	if (h2 < 0.35) {
		float d = length(c - 0.5);
		val = softEdge(d, 0.2, soft * 1.5) * 1.3;
	} else {
		float bit = step(0.5, hash21(id + seed * 3.7 + floor(TIME * 0.7 + h * 10.0)));
		vec2 gv = glyph(c, bit, soft);
		val = gv.x + gv.y;
	}
	float tw = clamp(0.55 + 0.45 * sin(TIME * (1.0 + h * 40.0) + h * 60.0), 0.15, 1.0);
	return tintColor.rgb * val * tw;
}

void main() {
	vec2 tx = gl_FragCoord.xy / RENDERSIZE;
	vec2 p = (tx - 0.5) * (RENDERSIZE / RENDERSIZE.y);
	vec2 uvn = tx;

	// tilt the helix axis (positive leans the top right)
	float phi = tilt * PI / 180.0;
	vec2 px = vec2(cos(phi) * p.x - sin(phi) * p.y, sin(phi) * p.x + cos(phi) * p.y);

	// stretch the helix along its own axis, then the tilt above rotates it rigidly
	px.y /= stretch;

	float R = radius;
	float ang = TWIST * 2.0 * PI;
	float rot = TIME;

	float M = floor(digitDensity);
	float cw = 2.0 * R / M;                 // digit cell width (face-on)
	float cellH = 1.5 * cw;                 // digit cell height
	float rows = CP / (0.9 * cellH);        // rungs per unit of axis height

	float smax = 1.0 / (1.0 - PERS * R);
	float yc = px.y / CP;                                   // axis height under this pixel (approx)
	float yw = (R * SP * smax + 0.07) / CP;                 // how far from yc things can reach this pixel

	// ---------- strands (two glowing tubes) ----------
	vec3 strandCol = vec3(0.0);
	float cover = 0.0;
	float zs = -1.0;
	float ys0 = floor((yc - yw) / DYS) * DYS;
	vec3 p0 = vec3(0.0);
	vec3 p1 = vec3(0.0);
	for (int i = 0; i < MAXS; i++) {
		float y = ys0 + float(i) * DYS;
		float a = y * ang + rot;
		vec3 c0 = proj( 1.0, y, a);
		vec3 c1 = proj(-1.0, y, a);
		if (i > 0) {
			strandCol = max(strandCol, strandSeg(px, p0, c0, cover, zs));
			strandCol = max(strandCol, strandSeg(px, p1, c1, cover, zs));
		}
		p0 = c0;
		p1 = c1;
		if (y > yc + yw) break;
	}

	// ---------- rungs made of digits ----------
	vec3 dig = vec3(0.0);
	float j0 = floor((yc - yw) * rows);
	float j1 = floor((yc + yw) * rows);
	for (int i = 0; i < MAXR; i++) {
		float j = j0 + float(i);
		if (j > j1) break;

		float y = (j + 0.5) / rows;
		float a = y * ang + rot;
		float sa = sin(a);
		float ca = cos(a);

		vec3 A = proj(-1.0, y, a);
		vec3 B = proj( 1.0, y, a);
		vec2 BA = B.xy - A.xy;
		float tau = dot(px - A.xy, BA) / max(dot(BA, BA), 1e-6);
		float m0 = floor(tau * M);

		// rungs fade as they point toward the camera (digits would pile up)
		float ratio = length(BA) / (2.0 * R);
		float crowd = smoothstep(0.42, 0.85, ratio);

		for (int q = -1; q <= 1; q++) {
			float m = m0 + float(q);
			if (m < 0.0 || m >= M) continue;

			float t = (m + 0.5) / M * 2.0 - 1.0;
			float zD = t * sa;                               // depth of this digit (-1..1)
			float b = blurOf(zD);
			float soft = b * 0.2;

			float z = t * R * sa;
			float s = 1.0 / (1.0 - PERS * z);
			vec2 C = vec2(t * R * ca * s, y * CP - z * SP * s);
			vec2 cellSz = vec2(cw, cellH) * s;
			vec2 c = (px - C) / cellSz + 0.5;

			// blurred digits spill outside their cell, so allow a margin
			float mg = min(0.1 + 2.5 * soft, 1.0);
			if (c.x < -mg || c.x > 1.0 + mg || c.y < -mg || c.y > 1.0 + mg) continue;

			// random, occasionally flipping bit
			float fl = hash21(vec2(m, j) + 7.7);
			float tt = (fl > 0.8) ? floor(TIME * (1.0 + fl * 2.0) + fl * 20.0) : 0.0;
			float bit = step(0.5, hash21(vec2(m, j) + tt * 13.1));
			vec2 gv = glyph(c, bit, soft);

			float z01 = zD * 0.5 + 0.5;
			float bright = 0.3 + 0.7 * z01;

			// a strand in front of the digit hides it
			float occ = cover * smoothstep(-0.05, 0.12, zs - zD);

			vec3 dc = mix(tintColor.rgb, vec3(1.0, 1.0, 0.55), 0.35 * z01);
			dig += dc * (gv.x + gv.y * glow) * bright * crowd * (1.0 - occ) * 1.1;
		}
	}

	vec3 col = dig + strandCol;

	// ---------- drifting binary particles at three depths, denser on the right ----------
	// nearest layer is big and very soft (bokeh), farthest is small and sharp
	float weight = mix(0.15, 1.0, smoothstep(0.45, 0.85, uvn.x));
	col += particleLayer(p,  8.0, 0.020, 11.0, particles * 0.6, weight, 0.30 * depthBlur) * 0.7;
	col += particleLayer(p, 14.0, 0.030,  1.0, particles,       weight, 0.14 * depthBlur) * 0.9;
	col += particleLayer(p, 26.0, 0.060,  5.0, particles,       weight, 0.03)             * 0.55;

	col = 1.0 - exp(-col * 1.4);

	vec3 finalColor = col;
	gl_FragColor = vec4(finalColor, 1.0);
}
