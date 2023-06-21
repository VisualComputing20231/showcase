// heavily influence by some discussions with Sebastian Chaparro
// https://github.com/sechaparroc
precision mediump float;

// palette is sent by the sketch and comprises the video
uniform sampler2D source;
// palette is sent by the sketch and comprises the video
uniform sampler2D palette;
// target horizontal & vertical resolution
uniform float resolution;
// uv visualization
uniform bool uv;
// pixelator
uniform bool pixelator;
// target horizontal & vertical resolution
uniform float pg_size;

// texture space normalized interpolated texture coordinates
// should have same name and type as in vertex shader
varying vec2 texcoords2; // (defined in [0..1] ∈ R)

float luma(vec3 texel) {
    return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}

void main() {
    // i. define symbolCoord as a texcoords2
    // remapping in [0.0, resolution] ∈ R
    vec2 symbolCoord = texcoords2 * resolution;
    // ii. define stepCoord as a symbolCoord
    // remapping in [0.0, resolution] ∈ Z
    vec2 stepCoord = floor(symbolCoord);
    // iii. remap symbolCoord to [0.0, 1.0] ∈ R
    symbolCoord = symbolCoord - stepCoord;
    stepCoord = stepCoord / vec2(resolution);
    vec4 texel = texture2D(source, stepCoord);
    vec2 tile = vec2((floor(luma(texel.rgb) * pg_size) + symbolCoord.x) / pg_size, symbolCoord.y);
    // display uv or sample palette using symbolCoord
    gl_FragColor = pixelator ?
    uv ? vec4(stepCoord.st, 0.0, 1.0): texture2D(source, stepCoord)
    :
    uv ? vec4(tile.st, 0.0, 1.0) : texture2D(palette, tile);
}