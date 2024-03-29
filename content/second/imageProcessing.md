# Image Processing & Post Effects

{{% justify %}}

## Introducción

En esta sección se aborda el procesamiento de imágenes digitales, referido a las
las máscaras de convolución. Acto seguido, se desarrolla una aplicación que abarca algunos de los kernels
más comunes: *identity, edge detection, sharpen, emboss, sobel, gaussian blur,
unsharp masking*. Adicionalmente, se lleva a cabo la implementación de una región
de interés, lupa y herramientas de coloring brightness mediante postefectos.

Para terminar, se discuten posibles aplicaciones de los conceptos aprendidos, así
como el trabajo futuro que se puede desarrollar en este ámbito.

## Marco Teórico

- **Máscaras de convolución:**

Para entender el concepto, en primer lugar es importante comprender qué es una convolución. De acuerdo
con *[1]*, esta se puede describir, intuitivamente, como una función que es la integral o suma de dos
funciones componentes y que mide la cantidad de superposición a medida que una se desplaza sobre la
otra. Formalmente, una convolución está definida de la siguiente manera *[2]*:

{{< katex display >}} g(x,y) = \omega * f(x,y) = \sum_{dx=-a}^{a}\sum_{dy=-b}^{b} \omega(dx,dy) f(x-dx,y-dy) {{< /katex >}}

Ahora, una máscara de convolución es una matriz o kernel numérico utilizado en procesamiento de imágenes
y visión por computadora para realizar operaciones de convolución en una imagen. Estas matrices, típicamente
son de tamaño *3 **x** 3*, aunque también se pueden emplear matrices de tamaño *2 **x** 2* y *5 **x** 5*,
entre otras. En líneas generales, en procedimiento consiste en que, a partir de una imagen, se van tomando
bloques que posean el mismo tamaño de la matriz. Luego, aplicando la operación descrita (convolución) en
función de los valores de los píxeles originales y los coeficientes de la máscara, se calcula el valor de
cada píxel de la imagen resultante *[1]*. Esta tendrá ciertas características dependiendo del kernel que
haya sido aplicado. Algunos de los más comunes (y los cuales fueron implementados en este ejercicio) se
listan a continuación *[2]* y *[3]*:

1. **Identity:**

{{< katex display >}} \begin{bmatrix} 0 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 0 \\ \end{bmatrix} {{< /katex >}}

2. **Edge detection:**

{{< katex display >}} \begin{bmatrix} -1 & -1 & -1 \\ -1 & 8 & -1 \\ -1 & -1 & -1 \\ \end{bmatrix} {{< /katex >}}

3. **Sharpen:**

{{< katex display >}} \begin{bmatrix} 0 & -1 & 0 \\ -1 & 5 & -1 \\ 0 & -1 & 0 \\ \end{bmatrix} {{< /katex >}}

4. **Emboss:**

{{< katex display >}} \begin{bmatrix} -2 & -1 & 0 \\ -1 & 1 & 1 \\ 0 & 1 & 2 \\ \end{bmatrix} {{< /katex >}}

5. **Sobel:**

{{< katex display >}} \begin{bmatrix} 1 & 2 & 1 \\ 0 & 0 & 0 \\ -1 & -2 & -1 \\ \end{bmatrix} {{< /katex >}}

6. **Gaussian Blur (5x5):**

{{< katex display >}} \frac{1}{256} \begin{bmatrix} 1 & 4 & 6 & 4 & 1 \\ 4 & 16 & 24 & 16 & 4 \\ 6 & 24 & 36 & 24 & 6 \\ 4 & 16 & 24 & 16 & 4 \\ 1 & 4 & 6 & 4 & 1 \\ \end{bmatrix} {{< /katex >}}

7. **Unsharp Masking (5x5):**

{{< katex display >}} \frac{-1}{256} \begin{bmatrix} 1 & 4 & 6 & 4 & 1 \\ 4 & 16 & 24 & 16 & 4 \\ 6 & 24 & -476 & 24 & 6 \\ 4 & 16 & 24 & 16 & 4 \\ 1 & 4 & 6 & 4 & 1 \\ \end{bmatrix} {{< /katex >}}

- **Región de interés:**

En el procesamiento de imágenes digitales, una región de interés (ROI, por sus siglas en inglés) se refiere a una parte específica de una imagen que es seleccionada para ser analizada, procesada o resaltada en función de un objetivo particular. Una ROI es una subregión dentro de una imagen más grande que se considera relevante o de interés para el análisis o aplicación en cuestión.

La selección de una región de interés puede ser realizada de forma manual, mediante la interacción del usuario que delimita el área de interés utilizando herramientas como rectángulos de selección, trazado a mano alzada, o mediante técnicas de segmentación automática en función de propiedades específicas de la imagen, como el color, la textura, el contraste, la forma, entre otros.

Una vez definida la región de interés, se pueden aplicar diversas técnicas de procesamiento de imágenes para extraer características, medir propiedades, aplicar filtros o realizar análisis específicos en esa región en particular. Por ejemplo, se puede realizar un seguimiento de movimiento en una ROI, calcular estadísticas sobre esa región, realizar un recorte para obtener solo esa parte de la imagen, aplicar técnicas de reconocimiento de objetos, entre otros.

Las regiones de interés son especialmente útiles cuando se trabaja con imágenes grandes o complejas, ya que permiten focalizar el procesamiento o el análisis en áreas específicas de interés, evitando el procesamiento innecesario de la imagen completa y mejorando la eficiencia computacional.

En resumen, una región de interés (ROI) en el procesamiento de imágenes digitales es una parte seleccionada o delimitada de una imagen que se considera relevante para un análisis, procesamiento o aplicación específica. Permite enfocar la atención y los cálculos en áreas de interés específicas en lugar de procesar la imagen completa.

- **Magnificador:**

Un magnificador es una herramienta o dispositivo que se utiliza para aumentar el tamaño o la visualización de objetos pequeños o detalles finos. Su función principal es proporcionar una ampliación óptica para facilitar la observación y el estudio de elementos que no son fácilmente visibles a simple vista.

Existen diferentes tipos de magnificadores, cada uno con sus características y usos específicos; en este caso se implementa una
lupa, la cual es el tipo más común de magnificador y generalmente consiste en una lente convexa montada en un mango o marco. Las lupas pueden tener diferentes grados de aumento y se utilizan para examinar detalles pequeños, como texto, imágenes o componentes electrónicos.

- **Post Effects:**

Los postefectos (*posteffects* en inglés), también conocidos como efectos posteriores o efectos de posprocesamiento, son técnicas utilizadas en gráficos por computadora para aplicar efectos visuales a una imagen o una escena después de que han sido renderizadas.

Estos efectos se aplican en la etapa final del proceso de renderizado y se utilizan para mejorar la calidad visual, añadir realismo, crear estilos artísticos o modificar la apariencia estética de una imagen o una escena.

Los postefectos se aplican mediante algoritmos y técnicas de procesamiento de imágenes y pueden incluir diferentes tipos de efectos, como los siguientes:

1. **Efectos de color y tonalidad:** Se utilizan para ajustar el color, el contraste, la saturación o el balance de blancos de una imagen. También pueden incluir efectos de tonemapping para ajustar la representación tonal de una escena.

2. **Efectos de desenfoque y enfoque:** Estos efectos permiten simular la profundidad de campo, el desenfoque de movimiento, el desenfoque gaussiano u otros tipos de desenfoque para agregar realismo o resaltar elementos específicos de una imagen.

3. **Efectos de iluminación y sombreado:** Se utilizan para simular la iluminación global, las sombras suaves, los reflejos o la refracción de la luz. Estos efectos pueden mejorar la apariencia y el realismo de una escena.

4. **Efectos de partículas y partículas de postprocesamiento:** Estos efectos permiten agregar elementos como humo, fuego, niebla o chispas a una imagen o una escena. También se pueden utilizar para aplicar efectos de movimiento o de distorsión a la imagen.

5. **Efectos de profundidad y efectos de contorno:** Estos efectos permiten resaltar los contornos de los objetos, aplicar sombreado de borde o agregar efectos de profundidad basados en la distancia o la posición del objeto en la escena.

Los postefectos se aplican generalmente mediante el uso de shaders o filtros de imagen que se aplican a la imagen final o a los píxeles de la escena renderizada. En este caso, se utilizan
para implementar una región de interés, un magnificador y herramientas de coloring brigthness. Estas últimas fueron cubiertas a completitud en una sección anterior, así que no se volverá a ahondar en la teoría.

## Código y Resultados:

A continuación se encuentra la aplicación construida. Para desarrollarla se llevó un estudio a profundidad, pues el resultado tiene un alto nivel de complejidad.
Cabe aclarar que para el correcto funcionamiento del código se debe autorizar a la página para que esta use la *webcam*

En primer lugar, se carga la imagen sin ningún tipo de alteración. Hay tres selectores: el primero (el de la izquierda) se usa para
seleccionar la máscara de convolución que se desea aplicar. El segundo (el del medio) se emplea para definir si el usuario desea 
manejar un magnificador (o lupa), una región de interés respecto a la máscara de convolución, una región de interés respecto a
las herramientas de coloring brightness, o ninguna. El tercero (el de la derecha) se emplea para elegir cuál herramienta desea aplicar
entre luma, HSV, HSL, Component Average o ninguna.

Es decir, puede seleccionar el kernel de detección de bordes, la opción luma y el magnificador: en ese caso podrá mirar de cerca los bordes
de cerca, gracias a la lupa, con el filtro correspondiente. También podrá seleccionar, otro ejemplo, el kernel "sharpen", la opción región
de interés respecto al coloring brightness y HSV. En ese caso, el kernel se aplicará a toda la imagen, perp el HSV irá solo dentro de la región
de interés. Si eligiera la región de interés respecto al coloring brightness, pasaría lo contrario: HSV se aplica a toda la imagen, pero
la convolución solamente ocurriría en la zona circular.

Ahora, también hay dos sliders: el primero (el de la izquierda), sirve para hacer zoom a la lupa; el segundo, por su parte, sirve para ampliar el radio
de la región de interés. Finalmente, a la derecha hay un checkbox que permite alternar entre una imagen o la cámara web de su computadora.

{{% /justify %}}

{{< p5-iframe sketch="../../sketches/imageProcessing.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="600" height="600" >}}

{{% justify %}}
A continuación se dejan los shaders implementados:

{{% /justify %}}

{{< details title="**mask.frag**" open=true >}}
{{< highlight js >}}

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
        rgba[i] = texture2D(texture, texcoords2
                  + vec2(-texOffset.s*floor(sqrt(customLen)/2.0)
                  + texOffset.s*mod(float(i),sqrt(customLen)),
                  - texOffset.t*floor(sqrt(customLen)/2.0)
                  + texOffset.t*floor(float(i)/sqrt(customLen))));
    }

    // Apply convolution kernel
    vec4 convolution;
    for (int i = 0; i < 100; i++) {
        if (float(i) == customLen){
            break;
        }
        convolution += rgba[i]*mask[i];
    }

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

        // Draw a processed version of the texture
        if (mouse_dist < lens_radius)
            gl_FragColor = vec4(convolution.rgb, 1.0);
    }

    else {
        // Set color from convolution
        gl_FragColor = vec4(convolution.rgb, 1.0);
    }
}

{{< /highlight >}} {{< /details >}}

Se observa que este shader hace uso de la macro `texOffSet` para lograr el desplazamiento a lo largo de los
pixeles que resulta necesario para calcular la convolución. Por una parte, se tiene que glsl no recibe arreglos
dinámicos, así que se instancia un array con una longitud suficiente (100) y se detiene el ciclo cuando se llega
al valor enviado desde JavaScript (9 para el caso de las matrices 3x3, y 25 para las matrices 5x5).

Adicionalmente a la aplicación de la convolución, se destaca el código para la región de interés, el cual fue
inspirado en los ejemplos ofrecidos en shadertoy para implementar un magnificador. En esencia, se hace un mapeo
uv sobre las coordenadas del mouse; inicialmente se traza la textura sin alteraciones y, luego, se aplica la
convolución hasta una cierta distancia: ello logrará que se tomen todos los puntos equidistantes al mouse y,
en consecuencia, la región sea circular. Se hace algo semejante, antes de trazar esa textura, para conseguir
que la región tenga un borde blanco delgado.

Una lógica semejante se emplea para el siguiente shader:

{{< details title="**lens.frag**" open=true >}}
{{< highlight js >}}

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

    // At the beginning of the sketch, center the magnifying glass.
    vec2 mouse = iMouse.xy;
    if (mouse == vec2(0.0))
        mouse = iResolution.xy / 2.0;

    // UV coordinates of mouse
    vec2 mouse_uv = mouse / iResolution.y;

    // Distance to mouse
    float mouse_dist = distance(uv, mouse_uv);

    // Draw the texture
    gl_FragColor = texture2D(texture, uv);

    if (!roi){
        // Draw the outline of the glass
        if (mouse_dist < lens_radius + 0.01)
            gl_FragColor = vec4(1., 1., 1., 1.);

        // Draw a zoomed-in version of the texture
        if (mouse_dist < lens_radius)
            gl_FragColor = texture2D(texture, mouse_uv - (mouse_uv - texcoords2) / magnification);
    }
}

{{< /highlight >}} {{< /details >}}

En este caso, aquí se lleva a cabo el magnificador: por ello, la textura aumentada se dibuja solo
cuando el booleano `roi` es falso, pues quiere decir que no se está en ninguna de las dos opciones
relacionadas con regiones de interés.

Otra diferencia con respecto al anterior shader es el trazado de la textura dentro del lente: en el
caso anterior se aplicaba la convolución, aquí se lleva a cabo una operación matemática que recalcula
las coordenadas a partir del nivel de zoom que se recibe desde el slider (`magnification`).

Este es el último shader: se puede ver que se aplica la misma lógica que los anteriores para establecer
la región de interés y, por su parte, se aplica la misma lógica del shader de la sección "Texturing" para
aplicar luma, HSV, HSL y Average.

{{< details title="**luma.frag**" open=true >}}
{{< highlight js >}}

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

{{< /highlight >}} {{< /details >}}

{{% justify %}}

Con los shaders claros, es posible explicar la implementación en JavaScript. Dentro del código puede
destacarse la siguiente sección, en la cual se bloquean los sliders dependiendo de la opción seleccionada:
es decir, sólo se habilita el ajuste del nivel de zoom cuando se está empleando el magnificador, pero
en cualquier otro caso se bloquea. El tamaño del radio del lente sólo se deshabilita si no está seleccionada
ninguna de las herramientas.

{{< highlight js >}}

roi.input(() => {
    if (roi.value() == "Magnifier"){
        magnification.removeAttribute('disabled');
    } else {
        magnification.attribute('disabled', '');
    }
    if (roi.value() == "None"){
        lens_radius.attribute('disabled', '');
    } else {
        lens_radius.removeAttribute('disabled');
    }
})

{{< /highlight >}}

Ahora, el uso de post effects para aplicar los múltiples shaders se evidencia en la función `draw`. Desde el
inicio se crean las variables `mask_pg`, `lens_pg` y `luma_pg`. Se puede observar que se aplica el primer
shader sobre la fuente (ya sea la imagen o la captura de video en vivo); luego, el segundo shader se aplica
sobre la textura obtenida (es decir, sobre `pg`) y, finalmente, el tercer shader se aplica tras el segundo
renderizado. Las coordenadas del cuadrilátero se modifican en este último para evitar que la imagen aparezca
invertida, tal como se aprecia a continuación:

{{< highlight js >}}

function draw() {
    maskShader.setUniform('texOffset', [1 / src.width, 1 / src.height])
    maskShader.setUniform('mask', masking());
    maskShader.setUniform('customLen', masking().length);
    mask_pg.emitResolution(maskShader, 'iResolution');
    mask_pg.emitPointerPosition(maskShader, mouseX, height - mouseY, 'iMouse');
    maskShader.setUniform('roi', roi.value() == "R.O.I: Convolution");
    maskShader.setUniform('texture', src);

    pg = mask_pg;
    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1)

    lens_pg.emitResolution(lensShader, 'iResolution');
    lens_pg.emitPointerPosition(lensShader, mouseX, mouseY, 'iMouse');
    lensShader.setUniform('roi', roi.value() != "Magnifier");
    lensShader.setUniform('texture', pg)

    pg = lens_pg;
    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1)

    luma_pg.emitResolution(lumaShader, 'iResolution');
    luma_pg.emitPointerPosition(lumaShader, mouseX, mouseY, 'iMouse');
    lumaShader.setUniform('roi', roi.value() == "R.O.I: Color Brightness");
    lumaShader.setUniform('texture', pg);

    pg = luma_pg;
    pg.quad(-1, 1, 1, 1, 1, -1, -1, -1)

    image(pg, 0, 0)
}

{{< /highlight >}}

En el próximo desplegable se anexa el código completo en JavaScript para su consulta.
{{% /justify %}}

{{< details title="**Código completo**" open=false >}}
{{< highlight js >}}

let maskShader, mask_pg, pg;
let lensShader, lens_radius, magnification, lens_pg;
let lumaShader, luma_pg;
let img, vid, video_on, src;
let roi;
let menu, coloringBrightness;

function preload() {

    maskShader = readShader('/showcase/sketches/frags/mask.frag',
        { varyings: Tree.texcoords2 });

    lensShader = readShader('/showcase/sketches/frags/lens.frag',
        { varyings: Tree.texcoords2 });

    lumaShader = readShader('/showcase/sketches/frags/luma.frag',
        { varyings: Tree.texcoords2 });

    img = loadImage('../../assets/shrek.png');
    vid = createCapture(VIDEO);
    vid.hide();
    src = img;
}

function setup() {
    createCanvas(550, 550);

    video_on = createCheckbox('camera', false);
    video_on.style('color', 'white');
    video_on.changed(() => {
        src = video_on.checked() ? vid : img;
    });
    video_on.position(480, 40);

    mask_pg = createGraphics(width, height, WEBGL);
    mask_pg.colorMode(RGB, 1);
    mask_pg.textureMode(NORMAL);
    mask_pg.shader(maskShader);

    luma_pg = createGraphics(width, height, WEBGL);
    luma_pg.colorMode(RGB, 1);
    luma_pg.textureMode(NORMAL);
    luma_pg.shader(lumaShader);

    lens_pg = createGraphics(width, height, WEBGL);
    lens_pg.colorMode(RGB, 1);
    lens_pg.textureMode(NORMAL);
    lens_pg.shader(lensShader);

    menu = createSelect();
    menu.position(10, 10);
    menu.style('width', '160px');
    menu.option("Identity");
    menu.option("Edge Detection");
    menu.option("Sharpen");
    menu.option("Emboss");
    menu.option("Sobel");
    menu.option("Gaussian Blur 5x5");
    menu.option("Unsharp Masking 5x5");

    lens_radius = createSlider(0.1, 0.3, 0.15, 0.01);
    lens_radius.position(110, 40);
    lens_radius.style('width', '80px');
    lens_radius.input(() => {
        maskShader.setUniform('lens_radius', lens_radius.value())
        lumaShader.setUniform('lens_radius', lens_radius.value())
        lensShader.setUniform('lens_radius', lens_radius.value())
    });
    maskShader.setUniform('lens_radius', lens_radius.value());
    lumaShader.setUniform('lens_radius', lens_radius.value());
    lensShader.setUniform('lens_radius', lens_radius.value())

    roi = createSelect();
    roi.position(200, 10);
    roi.style('width', '160px');
    roi.option("None");
    roi.option("Magnifier");
    roi.option("R.O.I: Convolution");
    roi.option("R.O.I: Color Brightness");

    magnification = createSlider(1, 8, 2, 0);
    magnification.position(10, 40);
    magnification.style('width', '80px');
    magnification.input(() => {
        lensShader.setUniform('magnification', magnification.value())
    });
    lensShader.setUniform('magnification', magnification.value());
    magnification.attribute('disabled', '');
    lens_radius.attribute('disabled', '');

    roi.input(() => {
        if (roi.value() == "Magnifier"){
            magnification.removeAttribute('disabled');
        } else {
            magnification.attribute('disabled', '');
        }
        if (roi.value() == "None"){
            lens_radius.attribute('disabled', '');
        } else {
            lens_radius.removeAttribute('disabled');
        }
    })

    coloringBrightness = createSelect();
    coloringBrightness.position(390, 10);
    coloringBrightness.style('width', '160px');
    coloringBrightness.option('None');
    coloringBrightness.option('Luma');
    coloringBrightness.option('HSV');
    coloringBrightness.option('HSL');
    coloringBrightness.option('Average');

    coloringBrightness.changed(() => {
        let val = coloringBrightness.value();
        if (val === 'Luma') {
            lumaShader.setUniform('coloringBrightness', 1);
        } else if (val === 'HSV') {
            lumaShader.setUniform('coloringBrightness', 2);
        } else if (val === 'HSL') {
            lumaShader.setUniform('coloringBrightness', 3);
        } else if (val === 'Average') {
            lumaShader.setUniform('coloringBrightness', 4);
        } else {
            lumaShader.setUniform('coloringBrightness', 0);
        }
    });

    lumaShader.setUniform('coloringBrightness', 0);
}

function draw() {
    maskShader.setUniform('texOffset', [1 / src.width, 1 / src.height])
    maskShader.setUniform('mask', masking());
    maskShader.setUniform('customLen', masking().length);
    mask_pg.emitResolution(maskShader, 'iResolution');
    mask_pg.emitPointerPosition(maskShader, mouseX, height - mouseY, 'iMouse');
    maskShader.setUniform('roi', roi.value() == "R.O.I: Convolution");
    maskShader.setUniform('texture', src);

    pg = mask_pg;
    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1)

    lens_pg.emitResolution(lensShader, 'iResolution');
    lens_pg.emitPointerPosition(lensShader, mouseX, mouseY, 'iMouse');
    lensShader.setUniform('roi', roi.value() != "Magnifier");
    lensShader.setUniform('texture', pg)

    pg = lens_pg;
    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1)

    luma_pg.emitResolution(lumaShader, 'iResolution');
    luma_pg.emitPointerPosition(lumaShader, mouseX, mouseY, 'iMouse');
    lumaShader.setUniform('roi', roi.value() == "R.O.I: Color Brightness");
    lumaShader.setUniform('texture', pg);

    pg = luma_pg;
    pg.quad(-1, 1, 1, 1, 1, -1, -1, -1)

    image(pg, 0, 0)
}

function masking() {
    if (menu.value() == "Identity"){
        return [ 0, 0, 0, 0, 1, 0, 0, 0, 0 ];
    } else if (menu.value() == "Edge Detection"){
        return [ -1, -1, -1, -1, 8, -1, -1, -1, -1 ];
    } else if (menu.value() == "Sharpen"){
        return [ 0, -1, 0, -1, 5, -1, 0, -1, 0 ];
    } else if (menu.value() == "Emboss"){
        return [ -2, -1, 0, -1, 1, 1, 0, 1, 2 ];
    } else if (menu.value() == "Sobel"){
        return [ 1, 2, 1, 0, 0, 0, -1, -2, -1 ];
    } else if (menu.value() == "Gaussian Blur 5x5"){
        return [ 1/256,  4/256,  6/256,  4/256, 1/256, 4/256, 16/256, 24/256, 16/256, 4/256, 6/256, 24/256, 36/256, 24/256, 6/256, 4/256, 16/256, 24/256, 16/256, 4/256, 1/256,  4/256,  6/256,  4/256, 1/256 ]
    } else if (menu.value() == "Unsharp Masking 5x5"){
        return [ -1/256,  -4/256,  -6/256,  -4/256, -1/256, -4/256, -16/256, -24/256, -16/256, -4/256, -6/256, -24/256, 476/256, -24/256, -6/256, -4/256, -16/256, -24/256, -16/256, -4/256, -1/256,  -4/256,  -6/256,  -4/256, -1/256 ]
    }
}

{{< /highlight >}} {{< /details >}}

{{% justify %}}

## Conclusiones y Trabajo futuro

- Se logra evidenciar que, mediante el uso de shaders, se reduce enormemente el consumo de recursos computacionales
  en las tareas relacionadas con el procesamiento de imagenes digitales respecto a la aplicación desarrollada en la
  entrega anterior. Aquí, incluso, se pueden implementar postefectos más allá de la mera convolución y no hay sobrecarga,
  como sí pasaba antes. De hecho, toda la ejecución se puede llevar a cabo en un video en vivo sin
  mayor complicación.
- Como trabajo futuro, se podría implementar esta aplicación en el procesamiento de imágenes dentro del ámbito de 
  la medicina, por dar un ejemplo. En ese caso, se daría la opción de cargar imágenes o videos. También
  podrían mirarse más postefectos para su aplicación dentro y fuera de la región de interés, así como la integración
  de dos o más de ellos (por ejemplo, que el lente funcione como magnificador y detector de bordes al mismo tiempo).

## Referencias

#### *[1]* S. Kim and R. Casper, "Applications of convolution in image processing with MATLAB," University of Washington, pp. 1-20, 2013. <http://kiwi.bridgeport.edu/cpeg585/ConvolutionFiltersInMatlab.pdf>
#### *[2]* J. P. Charalambos, "Visual masking". Visual Computing, Feb. 2023. <https://visualcomputing.github.io/docs/visual_illusions/masking/>
#### *[3]* S. Raveendran, P. J. Edavoor, N. K. Yernad Balachandra and V. Moodabettu Harishchandra, "Design and implementation of image kernels using reversible logic gates," IET Image Processing, vol. 14, no 16, pp. 4110-4121, 2020, doi: 10.1049/iet-ipr.2019.1681.
#### *[4]* R. C. Gonzalez and R. E. Woods, "Digital Image Processing," 4th ed., Pearson, 2018.
#### *[5]* J. P. Charalambos, "Image Processing". Visual Computing, Apr. 2023. <https://visualcomputing.github.io/docs/shaders/image_processing/>
#### *[6]* J. P. Charalambos, "Posteffects". Visual Computing, Apr. 2023. <https://visualcomputing.github.io/docs/shaders/post_effects/>
#### *[7]* DOPPIOSLASH, Claudia. Post-Processing Effects. Physically Based Shader Development for Unity 2017: Develop Custom Lighting Systems, 2018, p. 121-135.
#### *[8]* Shadertoy. Magnifier. <https://www.shadertoy.com/results?query=magnifier>

{{% /justify %}}