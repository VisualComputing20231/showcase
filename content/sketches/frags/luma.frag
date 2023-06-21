precision mediump float;

uniform int coloringBrightness;
uniform sampler2D texture;
varying vec2 texcoords2;
uniform bool roi;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float lens_radius;

float luma(vec3 texel) {
    return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}

float hsv(vec3 texel) {
    return max(max(texel.r, texel.b), max(texel.r,texel.g));
}

float hsl(vec3 texel){
    float maxColor = max(max(texel.r, texel.g), texel.b);
    float minColor = min(min(texel.r, texel.g), texel.b);

    return (maxColor + minColor)/2.0;
}

float average(vec3 texel) {
    return (texel.r + texel.g + texel.b)/3.0;
}

void limited(vec4 texel){
    if (roi){
        vec2 uv = gl_FragCoord.xy / iResolution.y;

        // At the beginning of the sketch, center the magnifying glass.
        vec2 mouse = iMouse.xy;
        if (mouse == vec2(0.0))
            mouse = iResolution.xy / 2.0;

        // UV coordinates of mouse
        vec2 mouse_uv = mouse / iResolution.y;

        // Distance to mouse
        float mouse_dist = distance(uv, mouse_uv);

        gl_FragColor = texture2D(texture, texcoords2);

        // Draw the outline of the glass
        if (mouse_dist < lens_radius + 0.01)
            gl_FragColor = vec4(1., 1., 1., 1.);

        // Draw a zoomed-in version of the texture
        if (mouse_dist < lens_radius)
            gl_FragColor = texel;
    }
    else {
        gl_FragColor = texel;
    }
}

void main() {
    vec4 texel = texture2D(texture, texcoords2);
    if (coloringBrightness == 1) {
        limited(vec4((vec3(luma(texel.rgb))), 1.0));
    } else if (coloringBrightness == 2) {
        limited(vec4((vec3(hsv(texel.rgb))), 1.0));
    } else if (coloringBrightness == 3) {
        limited(vec4((vec3(hsl(texel.rgb))), 1.0));
    } else if (coloringBrightness == 4) {
        limited(vec4((vec3(average(texel.rgb))), 1.0));
    } else {
        limited(texel);
    }
}