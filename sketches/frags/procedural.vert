precision mediump float;
attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec3 aNormal;
uniform mat4 uModelViewMatrix;
uniform mat3 uNormalMatrix;
varying vec2 texcoords2;
varying vec3 normal3;
varying vec3 position3;
varying vec3 light_dir;
varying vec3 eye;
uniform vec4 light_pos;
void main() {
    texcoords2 = aTexCoord;
    vec3 pos = vec3(uModelViewMatrix * vec4(aPosition, 1.0));
    normal3 = vec3(normalize(uNormalMatrix * aNormal));
    light_dir = vec3(light_pos) - pos;
    eye = -pos;
    position3 = aPosition;
    gl_Position = vec4(aPosition, 1.0);
}