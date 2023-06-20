precision mediump float;

uniform int coloringBrightness;
uniform bool tinting;
uniform vec4 color;
uniform sampler2D texture;
varying vec2 texcoords2;

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

vec4 tint(vec4 texel, bool blend){
    if (blend) {
        return texel * color;
    } else {
        return texel;
    }
}

void main() {
    vec4 texel = texture2D(texture, texcoords2);
    if (coloringBrightness == 1) {
        gl_FragColor = tint(vec4((vec3(luma(texel.rgb))), 1.0), tinting);
    } else if (coloringBrightness == 2) {
        gl_FragColor = tint(vec4((vec3(hsv(texel.rgb))), 1.0), tinting);
    } else if (coloringBrightness == 3) {
        gl_FragColor = tint(vec4((vec3(hsl(texel.rgb))), 1.0), tinting);
    } else if (coloringBrightness == 4) {
        gl_FragColor = tint(vec4((vec3(average(texel.rgb))), 1.0), tinting);
    } else {
        gl_FragColor = tint(texel, tinting);
    }
}