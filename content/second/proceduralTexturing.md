# Procedural Texturing

{{% justify %}}

## Introducción

En esta sección se aborda el problema de procedural texturing, que consiste en una técnica para generar texturas de forma automatizada mediante algoritmos y reglas matemáticas, en lugar de utilizar imágenes o fotografías preexistentes como base.

## Marco Teórico

En lugar de depender de imágenes de texturas reales, la texturización procedural se basa en algoritmos y fórmulas matemáticas para crear patrones y detalles visuales que se aplican a las superficies de los objetos virtuales en un entorno 3D. Esto permite generar texturas de forma dinámica y controlada, ofreciendo una mayor flexibilidad y eficiencia en comparación con el uso de imágenes de texturas estáticas.

Los procedimientos utilizados en la texturización procedural pueden incluir funciones matemáticas, ruido fractal, algoritmos de generación procedural, entre otros. Estos procedimientos permiten crear texturas complejas, variadas y detalladas que se adaptan a las características y propiedades de los objetos virtuales.

Algunos ejemplos de texturización procedural incluyen la creación de patrones naturales como terrenos, nubes, follaje, así como texturas más artificiales como ladrillos, madera, metal, entre otros. La texturización procedural también puede ser utilizada para simular efectos visuales como desgaste, corrosión, deformación o efectos de iluminación.

Las ventajas de la texturización procedural incluyen la capacidad de generar texturas infinitamente escalables, menor necesidad de almacenamiento, mayor control y manipulación de las texturas, y la posibilidad de generar variaciones aleatorias de texturas para aumentar la diversidad y realismo de las escenas.

A continuación se detallan algunos elementos relevantes:

- **Patrones:**

En los shaders el número de cálculos se mantiene constante. Por ende, son comúnmente empleados para la generación de patrones, donde se realiza una normalización del espacio, de forma que las coordenadas queden entre 1 y 0, las cuales se pueden dividir fácilmente para generar una cuadrícula. Las cuadrículas son especialmente útiles a la hora de generar patrones y se han utilizado desde la antigüedad; por ejemplo, en los mosaicos de los baños romanos.

En glsl, para realizar este proceso se toman las coordenadas de textura y se dividen en la resolución de la pantalla. Estas coordenadas también se pueden escalar para ocupar el espacio de una cuadrícula. Dentro de estas cuadrículas ya es posible patrones, tales como el patrón offset o patrón de desplazamiento.

- **Ruido:**

Ya teniendo las bases para generar formas definidas, se hace necesario introducir la aleatoriedad para generar formas más realistas. El primer acercamiento que se hace frente a este tema utiliza funciones sinusoidales: estas se multiplican por números muy grandes y, luego, se extrae la parte fraccionaria de cada número, generando números pseudoaleatorios.
El resultado de funciones como tal es un ruido como el que se generaba en los televisores antiguos cuando no había señal. En los años 80 Ken Perlin se enfrentó al reto de generar texturas más realistas para el cine y, por consiguiente, debía lograr un ruido más "natural". Entonces, ideó un algoritmo llamado “Value Noise”, el cual utiliza una interpolación
de la parte entera y la parte fraccionaria del número de entrada para realizar la generación, manteniendo tanto una correlación con la parte entera como un elemento que aporta aleatoriedad.

Ahora bien, aunque ese tipo de fórmulas aportan aleatoriedad, no resultan aplicables a la realidad, pues, en la naturaleza, la mayoría de los patrones guardan memoria del estado anterior.

No obstante, esta función no fue lo suficientemente buena para Perlin, quien ideó otra implementación de este algoritmo en 1985, la cual llamó “Gradient Noise”. En esta, Perlin plantea la interpolación de gradientes aleatorios, en lugar de valores. Estos gradientes son el resultado de una función aleatoria en 2D que retorna direcciones.
Finalmente, en 2001 presenta el algoritmo “simplex noise”, el cual tenía menor complejidad computacional y menos multiplicaciones, y un ruido que escala a dimensiones más altas con menos coste computacional, sin artefactos direccionales, con gradientes bien definidos y continuos que puedan calcularse de forma bastante económica.

Los tipos de ruido mencionados se implementan y detallan más adelante.

- **Iluminación:**

Para que un objeto tenga una apariencia texturizada, es necesario utilizar luces que se reflejarán según la forma y el material del objeto, creando efectos de brillo y profundidad. Dentro del modelo de iluminación más comúnmente utilizado se hallan diferentes tipos de luces:

1. **Luz difusa:** Es la luz reflejada por un objeto en todas las direcciones.

2. **Luz ambiente:** Se utiliza para simular la iluminación rebotada. Rellena las áreas donde no hay luz directa, evitando que esas zonas se vuelvan demasiado oscuras. Por lo general, el valor de luz ambiente es proporcional al color difuso.

3. **Luz especular:** Es la luz que se refleja con mayor intensidad en una dirección específica, generalmente alrededor del vector de reflexión de la luz y la normal de la superficie. Este color no está relacionado con el color difuso del objeto.

4. **Luz emisiva:** Es cuando el propio objeto emite luz por sí mismo.

5. **Luz puntual:** Implica que hay un punto específico en la escena desde donde la luz se emite e ilumina los objetos.

## Código y Resultados:

Para este ejercicio se llevó a cabo la generación de una textura de una pared de ladrillos desde el shader. Acto seguido, se agregaron las opciones de ruido descritas en el marco teórico
para emular la rugosidad de los ladrillos y, posteriormente, se le dio movimiento y velocidad a la figura, además de una luz difusa.

Al interactuar con la aplicación encontrará dos sliders: el primero (el de la izquierda) permite incrementar el número de ladrillos de la textura.
El segundo (el del centro) permite aumentar la velocidad de movimiento de la figura texturizada.

Por otra parte, se cuenta con dos selectores: el primero (en la esquina superior izquierda) permite alternar entre los algoritmos de Perlin Noise;
el segundo (en la parte inferior central), permite alternar entre varias formas sobre las cuales se desea aplicar la textura del shader.

{{% /justify %}}

{{< p5-iframe sketch="../../sketches/procedural.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="520" height="520" >}}

{{% justify %}}

Para esta aplicación se implementó tanto un vertex shader como un fragment shader, los cuales se dejan a continuación:

{{% /justify %}}

{{< details title="**procedural.vert**" open=true >}}
{{< highlight js >}}

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

{{< /highlight >}} {{< /details >}}
{{% justify %}}

Este vertex shader se crea con el propósito de declarar variables adicionales a las que tiene
el shader que se genera automáticamente con treegl. Ahora, el fragment shader:

{{% /justify %}}

{{< details title="**procedural.frag**" open=true >}}
{{< highlight js >}}

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

{{< /highlight >}} {{< /details >}}

{{% justify %}}

Se tiene que, en primer lugar, hay una función para generar números pseudoaleatorios usando funciones sinusoidales, tal como se enunció
en el marco teórico; la siguiente función aplica el algoritmo de "Value Noise". Después hay otro generador de números aleatorios distinto
y, tras él, se implementa el algorimto de "Gradient Noise" (en los comentarios del código se acreditan las fuentes de dónde se obtuvieron
estos). Acto seguido, se implementan un par de funciones necesarias para el algoritmo "simplex noise". En el main se define la textura
de ladrillos a partir del ruido escogido, la velocidad y cantidad de ladrillos dadas por los sliders.

Ahora, en el archivo de JavaScript, se destaca la creación de un frame buffer (`pg`) aplicar el shader. Luego se crean todos los elementos
html y, en el draw, se renderiza la textura sobre la forma seleccionada. Por último, en la función `mouseMoved` se lleva a cabo el
establecimiento de una luz puntual que se refleja también en la textura. El código completo se encuentra a continuación:

{{% /justify %}}

{{< details title="**Código completo**" open=true >}}
{{< highlight js >}}

let pg;
let proceduralShader;
let bricksize, solidSpped, noiseSelection;
let valueNoise = false;
let gradientNoise = false;
let simplexNoise = false;
let shapeSelection;
let selectedShape = 'Sphere';

function preload() {
    proceduralShader = loadShader('/showcase/sketches/frags/procedural.vert', '/showcase/sketches/frags/procedural.frag');
}

function setup() {
    createCanvas(500, 500, WEBGL);

    pg = createGraphics(500, 500, WEBGL);
    pg.textureMode(NORMAL);
    pg.noStroke();
    pg.shader(proceduralShader);
    
    // emitResolution, see: https://github.com/VisualComputing/p5.treegl#macros
    pg.emitResolution(proceduralShader);
    
    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    
    bricksize = createSlider(10, 100, 10, 10);
    bricksize.position(30, 30);

    solidSpped = createSlider(0.05, 0.4, 0.05, 0.05);
    solidSpped.position(190, 30);

    noiseSelection = createSelect();
    noiseSelection.position(360, 30);
    noiseSelection.option('None');
    noiseSelection.option('Value Noise');
    noiseSelection.option('Gradient Noise');
    noiseSelection.option('Simplex Noise');
    noiseSelection.changed(() => {
        let val = noiseSelection.value();
        valueNoise = gradientNoise = simplexNoise = false;
        if(val === 'Value Noise'){
            valueNoise = true;
        } else if(val === 'Gradient Noise'){
            gradientNoise = true;
        } else if(val === 'Simplex Noise'){
            simplexNoise = true;
        }
    });

    shapeSelection = createSelect();
    shapeSelection.position(220, height - 30);
    shapeSelection.option('Sphere');
    shapeSelection.option('Cylinder');
    shapeSelection.option('Box');
    shapeSelection.option('Cone');
    shapeSelection.changed(() => {
        selectedShape = shapeSelection.value();
    });

    // Set texture
    proceduralShader.setUniform('brick_num', 10.0);
    proceduralShader.setUniform('speedFactor', 0.02);
    proceduralShader.setUniform('valueNoise', false);
    proceduralShader.setUniform('gradientNoise', false);
    proceduralShader.setUniform('simplexNoise', false);
    texture(pg);
    noStroke();
}

function draw() {
    proceduralShader.setUniform('frameCount', frameCount);
    proceduralShader.setUniform('brick_num', bricksize.value());
    proceduralShader.setUniform('speedFactor', solidSpped.value());

    proceduralShader.setUniform('valueNoise', valueNoise);
    proceduralShader.setUniform('gradientNoise', gradientNoise);
    proceduralShader.setUniform('simplexNoise', simplexNoise);

    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    orbitControl();

    if(selectedShape === 'Sphere'){
        background(0);
        sphere(150);
    } else if(selectedShape === 'Cylinder'){
        background(0);
        cylinder(150, 200);
    } else if(selectedShape === 'Box'){
        background(0);
        box(200);
    } else if(selectedShape === 'Cone'){
        background(0);
        cone(150,250);
    }
}

function mouseMoved() {
    let lightLoc = treeLocation(createVector(-(mouseX - width / 2), -(mouseY - height / 2), 1.5), { from: 'SCREEN', to: 'CLIP'});
    proceduralShader.setUniform('light_pos', [lightLoc.x, lightLoc.y, lightLoc.z, 1.] );
    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
}

{{< /highlight >}} {{< /details >}}
{{% justify %}}

{{% justify %}}

## Conclusiones y Trabajo futuro

- Esta técnica para generar texturas en el shader es muy útil dado que es muy eficiente al aprovechar las capacidades de las GPU y permite una mayor flexibilidad al momento de generar escenarios en 3D.
  No obstante, para darle más naturalidad a la textura resulta necesario el uso de funciones de ruido. Adicionalmente, estas texturas necesitan de diseños que permitan percibir profundidad entre otros
  rasgos para no verse solo como una imagen pintada en el objeto, para lo cual ya se utilizan modelos de iluminación y de texture mapping combinados con las técnicas de procedural texturing.
- Pueden llegar a apreciarse patrones de moiré en algunas de las figuras si se disminuye lo suficiente el tamaño de los ladrillos, lo cual permite ver la relación que guarda el enmascaramiento visual
  con el procedural texturing.
- Como trabajo futuro se podrían implementar shaders para aplicar múltiples texturas (no solamente los ladrillos), incluyendo también el Perlin Noise y la iluminación que se trabajaron aquí. 
  Adicionalmente, se podría ahondar en el uso de keyframes para elaborar animaciones a partir de objetos diseñados con la técnica de texturizado procedural.

## Referencias

#### *[1]* J. P. Charalambos, "Shaders". Visual Computing, Apr. 2023. <https://visualcomputing.github.io/docs/shaders/>
#### *[2]* J. P. Charalambos, "Procedural Texturing". Visual Computing, Apr. 2023. <https://visualcomputing.github.io/docs/shaders/procedural_texturing/>
#### *[3]* GILET, Guillaume, et al. Local random-phase noise for procedural texturing. ACM Transactions on Graphics (ToG), 2014, vol. 33, no 6, p. 1-11.
#### *[4]* Shadertoy. Gradient Noise. <https://www.shadertoy.com/view/XdXGW8>
#### *[5]* Ian McEwan, Ashima Arts. GLSL 2D simplex noise function. <https://github.com/ashima/webgl-noise>
#### *[6]* R. Touti, "Perlin Noise Algorithm", [Online]. Available: https://rtouti.github.io/graphics/perlin-noise-algorithm.

{{% /justify %}}