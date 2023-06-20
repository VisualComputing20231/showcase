precision mediump float;

uniform sampler2D texture;
// see the emitTexOffset() treegl macro
// https://github.com/VisualComputing/p5.treegl#macros
uniform vec2 texOffset;
// holds the 3x3 kernel
uniform float mask[100];
uniform float customLen;
// we need our interpolated tex coord
varying vec2 texcoords2;
uniform bool roi;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float lens_radius;

void main() {

    // Sample texel neighbours within the rgba array
    vec4 rgba[100];

    for (int i = 0; i < 100; i++) {
        if (float(i) == customLen){
            break;
        }
        rgba[i] = texture2D(texture, texcoords2 + vec2(-texOffset.s*floor(sqrt(customLen)/2.0) + texOffset.s*mod(float(i),sqrt(customLen)), -texOffset.t*floor(sqrt(customLen)/2.0) + texOffset.t*floor(float(i)/sqrt(customLen))));
    }

    // 3. Apply convolution kernel
    vec4 convolution;
    for (int i = 0; i < 100; i++) {
        if (float(i) == customLen){
            break;
        }
        convolution += rgba[i]*mask[i];
    }

    if (roi){

        vec2 uv = gl_FragCoord.xy / iResolution.y;

        //at the beginning of the sketch, center the magnifying glass.
        //Thanks to FabriceNeyret2 for the suggestion
        vec2 mouse = iMouse.xy;
        if (mouse == vec2(0.0))
        mouse = iResolution.xy / 2.0;

        //UV coordinates of mouse
        vec2 mouse_uv = mouse / iResolution.y;

        //Distance to mouse
        float mouse_dist = distance(uv, mouse_uv);

        gl_FragColor = texture2D(texture, texcoords2);

        //Draw the outline of the glass
        if (mouse_dist < lens_radius + 0.01)
        gl_FragColor = vec4(1., 1., 1., 1.);

        //Draw a processed version of the texture
        if (mouse_dist < lens_radius)
        gl_FragColor = vec4(convolution.rgb, 1.0);
    }

    else {
        // 4. Set color from convolution
        gl_FragColor = vec4(convolution.rgb, 1.0);
    }
}