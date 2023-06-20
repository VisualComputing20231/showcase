precision mediump float;

uniform sampler2D texture;

varying vec2 texcoords2;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float lens_radius;
uniform float magnification;
uniform bool roi;

void main()
{
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

    //Draw the texture
    gl_FragColor = texture2D(texture, uv);

    if (!roi){
        //Draw the outline of the glass
        if (mouse_dist < lens_radius + 0.01)
        gl_FragColor = vec4(1., 1., 1., 1.);

        //Draw a zoomed-in version of the texture
        if (mouse_dist < lens_radius)
        gl_FragColor = texture2D(texture, mouse_uv - (mouse_uv - texcoords2) / magnification);
    }
}