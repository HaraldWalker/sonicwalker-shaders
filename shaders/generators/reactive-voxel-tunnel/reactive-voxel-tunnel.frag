/*
{
    "author": "Harald Walker",
    "color": "#4466ff",
    "movement": true,
    "parameters": [
        {
            "default": 0.3,
            "max": 1.8,
            "min": 0.2,
            "name": "octahedronSize",
            "label": "Octahedron Size"
        },
        {
            "default": 0.4,
            "max": 6.0,
            "min": 2.0,
            "name": "density",
            "label": "Tunnel Width"
        },
        {
            "default": 0.001,
            "max": 0.001,
            "min": 0.0001,
            "name": "fog",
            "label": "Fog"
        },
        {
            "default": 0.015,
            "max": 0.025,
            "min": 0.005,
            "name": "glow",
            "label": "Glow"
        },
        {
            "default": 0.2,
            "max": 2.0,
            "min": 0.0,
            "name": "pathAmount",
            "label": "Weave"
        },
        {
            "default": 0.0,
            "max": 1.0,
            "min": 0.0,
            "name": "colorShift",
            "label": "Color Shift"
        }
    ],
    "url": "https://github.com/HaraldWalker/sonicwalker-shaders",
    "uuid": "6614bea7-5220-4e4a-b7d2-61f262bb04cd",
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

/*
 * Adapted from "Voxel tunnel" by lsdlive
 * https://www.shadertoy.com/view/MscBRs
 *
 * Voxel algorithm by fb39ca4
 * https://www.shadertoy.com/view/4dX3zl
 * Implementation by Shane
 * https://www.shadertoy.com/view/MdVSDh
 *
 * Original licensed under CC BY-NC-SA
 *
 * Audio-reactive modifications: fftTex-driven bass/mid/high bands added,
 * plus 3 new manual parameters (pathAmount, density, colorShift).
 */

#ifdef GL_ES
precision highp float;
#endif

// fftTex is auto-injected by VS2 (like time/resolution/texCoord) - do NOT
// declare it.

float fftBand(float center, float width) {
    float sum = 0.0;
    for (int i = 0; i < 8; i++) {
        float t = float(i) / 7.0 - 0.5;
        sum += texture(fftTex, vec2(clamp(center + t * width, 0.0, 1.0), 0.0)).r;
    }
    return sum / 8.0;
}

// Bands sampled once per pixel (in main, before the traversal loop) and
// reused as globals inside de() and path(), which both get called many
// times per pixel - avoids repeated texture reads in the hot loop.
float gBass, gMid, gHigh;

void computeBands() {
    gBass = fftBand(0.06, 0.10);
    gMid  = fftBand(0.30, 0.20);
    gHigh = fftBand(0.65, 0.30);
}

mat2 r2d(float a) {
	float c = cos(a), s = sin(a);
	return mat2(c, s, -s, c);
}

vec2 path(float t) {
	float a = sin(t*.2 + 1.5), b = sin(t*.2);
	// Weave amplitude is a spatial shape parameter, not a position/time
	// integration - safe to modulate live with mid energy without any
	// continuity issues (unlike speed, see note in main()).
	float amt = pathAmount * (1.0 + gMid * 0.3);
	return vec2(2.*a*amt, a*b*amt);
}

float g = 0.;
float speed = 4; // time amplification

float de(vec3 p) {
	p.xy -= path(p.z);

	// Tunnel width breathes gently with mid energy.
	float tunnelR = density + gMid * 0.6;
	float d = -length(p.xy) + tunnelR;

	p.xy += vec2(cos(p.z + time)*sin(time), cos(p.z + time));
	p.z -= 6. + time * speed;

	// Voxel size pulses with bass - a real structural surge, not just a
	// brightness change.
	float sizeMod = octahedronSize * (1.0 + gBass * 0.4);
	d = min(d, dot(p, normalize(sign(p))) - sizeMod);

	// High band adds treble shimmer to the glow trails.
	g += (glow + gHigh * glow * 0.5) / (.01 + d * d);
	return d;
}

void main() {
	float div = resolution.y / resolution.x;
	vec2 aspect = vec2(1.0, div);
	vec2 uv = texCoord * aspect - vec2(0.5, 0.5 * div);

	computeBands();

	// speed is deliberately NOT audio-modulated: tunnel position is
	// time * speed, and VS2 has no persistent buffer to properly integrate
	// a live-fluctuating velocity over time - if speed jumped around with
	// the beat, position would visibly jump/warp each time it changed.
	// Everything else below is safe to modulate per-frame because it's an
	// instantaneous shape/size/color effect, not a position calculation.
	float dt = time * speed;
	vec3 ro = vec3(0, 0, -5. + dt);
	vec3 ta = vec3(0, 0, dt);

	ro.xy += path(ro.z);
	ta.xy += path(ta.z);

	vec3 fwd = normalize(ta - ro);
	vec3 right = cross(fwd, vec3(0, 1, 0));
	vec3 up = cross(right, fwd);
	vec3 rd = normalize(fwd + uv.x*right + uv.y*up);

	rd.xy *= r2d(sin(-ro.x / 3.14)*.3);

	vec3 p = floor(ro) + .5;
	vec3 mask;
	vec3 drd = 1. / abs(rd);
	rd = sign(rd);
	vec3 side = drd * (rd * (p - ro) + .5);

	float t = 0.;
	g = 0.;
	for (int i = 0; i < 100; i++) {
		if (de(p) < 0.) break;

		mask = step(side, side.yzx) * step(side, side.zxy);

		side += drd * mask;
		p += rd * mask;
	}
	t = length(p - ro);

	vec3 c = vec3(1) * length(mask * vec3(1., .5, .75));
	c = mix(vec3(.2, .2, .7), vec3(.2, .1, .2), c);

	// Alternate warm palette (swapped R/B of the original cool tones),
	// blended in by colorShift plus a treble-driven shimmer on top.
	vec3 altC = mix(vec3(.7, .2, .2), vec3(.1, .2, .2), length(mask * vec3(1., .5, .75)));
	c = mix(c, altC, clamp(colorShift + gHigh * 0.15, 0.0, 1.0));

	c += g * .4;
	c.r += sin(time)*.2 + sin(p.z*.5 - time * speed);
	c = mix(c, vec3(.2, .1, .2), 1. - exp(-fog*t*t));

	float coloredPixels = dot(clamp(c, 0., 1.), vec3(1.0));
	fragColor = vec4(c * color.rgb, alpha * coloredPixels);
}
