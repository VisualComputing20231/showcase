precision mediump float;

uniform float brightness;
uniform vec4 uMaterial1;
uniform vec4 uMaterial2;
uniform int blendMode;
uniform vec4 identity;

void main() {
    if (blendMode == 0){
        vec4 material = uMaterial1 * uMaterial2;
        gl_FragColor = vec4(brightness * material.rgb, material.a);
    }
    else if (blendMode == 1){
        vec4 material = uMaterial1 + uMaterial2;
        gl_FragColor = vec4(brightness * material.rgb, material.a);
    }
    else if (blendMode == 2){
        vec4 material = min(uMaterial1, uMaterial2);
        gl_FragColor = vec4(brightness * material.rgb, material.a);
    }
    else if (blendMode == 3){
        vec4 material = max(uMaterial1, uMaterial2);
        gl_FragColor = vec4(brightness * material.rgb, material.a);
    }
    else if (blendMode == 4){
        vec4 material = max(uMaterial1, uMaterial2) - min(uMaterial1, uMaterial2);
        gl_FragColor = vec4(brightness * material.rgb, material.a);
    }
    else if (blendMode == 5){
        vec4 material = identity - ((identity - uMaterial1) * (identity - uMaterial2));
        gl_FragColor = vec4(brightness * material.rgb, material.a);
    }
}