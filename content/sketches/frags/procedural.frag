precision mediump float;

uniform vec2 u_resolution;
uniform float frameCount;
varying vec2 texcoords2;
varying vec3 light_dir;
varying vec3 eye;
varying vec3 normal3;

uniform float brick_num;
uniform float speedFactor;
uniform bool valueNoise;
uniform bool gradientNoise;
uniform bool simplexNoise;

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);

    u = u*u*(3.0-2.0*u);

    float res = mix(
    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}
vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
    dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise2(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
    dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
    mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
    dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License :
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
//
float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
    // (3.0-sqrt(3.0))/6.0
    0.366025403784439,
    // 0.5*(sqrt(3.0)-1.0)
    -0.577350269189626,
    // -1.0 + 2.0 * C.x
    0.024390243902439);
    // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
    permute( i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
    dot(x0,x0),
    dot(x1,x1),
    dot(x2,x2)
    ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}


void main (void) {

    vec2 positionVec4 = texcoords2;
    positionVec4.x += frameCount/(brick_num/speedFactor);

    float n = 1.;

    if(valueNoise) {
        // Value Noise
        n = noise(positionVec4*500.0)+0.2;
    } else if(gradientNoise) {
        // Gradient Noise
        n = noise2(positionVec4*200.0)+0.2;
    } else if(simplexNoise) {
        // Simplex Noise
        n = snoise(positionVec4*200.0)+0.2;
    }
    // forma de ladrillos
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= brick_num;
    st.x += frameCount*speedFactor;

    float offset = step(1., mod(st.y,2.0));
    float limitY =  step(.8, mod(st.y,1.));
    float limitX = step(1.8, mod(st.x+offset,2.0));

    if(limitY==1.||limitX==1.){
        gl_FragColor = vec4(0.9*(n+.3),0.79*(n+.3),0.69*(n+.3),1.0);
    }else{
        gl_FragColor = vec4(.79*n,.25*n,.32*n,1.0);
    }

    vec3 nor = normalize(normal3);
    vec3 l = normalize(light_dir);
    vec3 e = normalize(eye);

    float intensity = max(dot(nor,l), 0.0);
    gl_FragColor = vec4(intensity, intensity, intensity, 1) * gl_FragColor;
}