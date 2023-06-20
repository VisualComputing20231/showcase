# Texturing

{{% justify %}}

## Introducción

En esta sección se abordará el problema de *texture sampling*, también conocido como mapeo de texturas o filtrado
de texturas, el cual es una técnica utilizada en gráficos por computadora para aplicar texturas a superficies u objetos 3D.

## Marco Teórico

El filtrado o suavizado de texturas abarca los métodos empleados para reconstruir texturas mediante la modificación de los
valores de los pixeles de estas de acuerdo a un criterio. Por su parte, el tinte de texturas consiste en operar los valores de las componentes
RGB de los pixeles con información interpolada en estos, como la posición, la luz, y otro tipo de datos que se puedan asociar a
los vértices de los triángulos que conforman el objeto en cuestión.

En este ejercicio se realizan dos implementaciones:

- **Coloring Brightness Tools:**
  Las herramientas de ajuste de brillo para colorear, como luma, HSV, HSL y Average, se utilizan para modificar el brillo o la luminosidad de un color o una imagen. Estas herramientas permiten ajustar la intensidad luminosa de los colores de una manera específica.

  Luma es una medida de la luminosidad de un color. En el contexto del ajuste de brillo, la luma se refiere a modificar la cantidad de luz en una imagen manteniendo la saturación de los colores. Ajustar la luma puede oscurecer o aclarar una imagen sin alterar los tonos de color.

  El modelo de color HSV divide los colores en tres componentes: matiz (hue), saturación (saturation) y valor (value). La herramienta de brillo HSV se enfoca en el componente de valor, que controla la luminosidad de un color. Ajustar el valor puede hacer que un color sea más brillante o más oscuro sin afectar su tono o saturación.

  Similar al modelo HSV, el modelo de color HSL también utiliza el matiz (hue) y la saturación (saturation) como componentes, pero reemplaza el valor con luminosidad (lightness). La herramienta de brillo HSL permite ajustar la luminosidad de un color en una escala de más oscuro a más claro, manteniendo el tono y la saturación.

  La herramienta "Average" es una técnica básica para ajustar el brillo en la que se calcula el valor promedio de los componentes de color de un píxel o una selección de píxeles. Al promediar los valores de los componentes, se obtiene un nuevo color que puede ser más brillante o más oscuro que el original, dependiendo de los valores iniciales.

  Estas herramientas de ajuste de brillo son comunes en aplicaciones de edición de imágenes y software de diseño gráfico. Permiten controlar el aspecto visual de una imagen o un color mediante el ajuste de su luminosidad, sin modificar necesariamente otros aspectos como el tono o la saturación.

- **Texture Tinting:**
  También conocido como tinte de textura, es una técnica utilizada en gráficos por computadora para modificar el color de una textura aplicada a una superficie o un objeto. Consiste en cambiar el tono o matiz de una textura manteniendo su estructura y detalles originales.

  Cuando se aplica una textura a una superficie, es posible aplicar un tinte o coloración a esa textura para alterar su apariencia. Esto se logra multiplicando o mezclando los valores de color de los texels de la textura con un color específico.

  El tinte de textura puede ser utilizado para varios propósitos, como ajustar la atmósfera o el ambiente de una escena, resaltar o cambiar el tono de ciertos elementos de una textura, o crear variaciones de color en una superficie para darle más realismo o estilizarla.

  En la implementación práctica, el tinte de textura se puede lograr mediante operaciones de mezcla o multiplicación de colores en el espacio de color utilizado en la escena, como RGB (rojo, verde, azul) u otros espacios de color.

  Es importante tener en cuenta que el tinte de textura no altera la estructura de la textura ni los patrones o detalles originales, sino que solo modifica el color en función del tinte aplicado.

## Código y Resultados

A continuación se presenta el ejercicio desarrollado, en el cual se carga una imagen (o video) y,
sobre esta, se pueden aplicar las herramientas mencionadas anteriormente.

Puede dar clic sobre el selector de la parte superior izquierda para cambiar entre
luma, HSV, HSL y Average. Por su parte, con el selector de la parte superior derecha
es posible seleccionar si aplicar el tinte o no; adicionalmente, al lado se cuenta
con la opción de elegir el color a interporlar.

{{% /justify %}}

{{< p5-iframe sketch="/showcase/sketches/texturing.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="720" height="520" >}}

{{% justify %}}

A continuación se muestra el shader implementado para esta aplicación:

{{% /justify %}}

{{< details title="**texturing.frag**" open=true >}}
{{< highlight js >}}

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

{{< /highlight >}} {{< /details >}}

{{% justify %}}

Es evidente que para el HSV se toma el mayor valor de los canales de color, para el HSL se promedia entre el
máximo y el mínimo, y para "average" se calcula el promedio de los componentes r, g, b. En cuanto al tinte de
la textura, se aplica un "color blending" sencillo, realizando una multiplicación entre el color seleccionado
y el texel. Para mayor detalle sobre esta mezcla de colores, se puede remitir a la sección anterior.

El código en JavaScript, por su parte, también es bastante intuitivo. Primero se carga la imagen. Luego, se instancian
los objetos html, entre ellos los selectores para determinar la aplicación de las herramientas implementadas en el 
shader, un selector de color y un checkbox para alternar entre imagen y video. Después, tras indicar los valores uniformes,
se traza la textura utilizando la función `vertex`, donde las coordenadas le indican que debe ocupar todo el canvas.
A continuación se deja el archivo en su totalidad:

{{% /justify %}}

{{< details title="**Código completo**" open=true >}}
{{< highlight js >}}

let coloringShader;
let img, vid, video_on;
let coloringBrightness;
let blendingSelect, picker, selectedColor;

function preload() {
    coloringShader = readShader('/showcase/sketches/frags/texturing.frag', { varyings: Tree.texcoords2 });
    img = loadImage('showcase/assets/fire_breathing.jpg');
    vid = createVideo(['showcase/assets/wagon.webm']);
    vid.hide();
    src = img
}

function setup() {
    createCanvas(700, 500, WEBGL);
    noStroke();
    textureMode(NORMAL);
    shader(coloringShader);

    video_on = createCheckbox('video', false);
    video_on.style('color', 'white');
    video_on.changed(() => {
        src = video_on.checked() ? vid : img;
        video_on.checked() ? vid.loop() : vid.pause();
    });
    video_on.position(120, 30);

    coloringBrightness = createSelect();
    coloringBrightness.position(30, 30);
    coloringBrightness.option('None');
    coloringBrightness.option('Luma');
    coloringBrightness.option('HSV');
    coloringBrightness.option('HSL');
    coloringBrightness.option('Average');

    picker = createColorPicker(color('#010104'));
    picker.position(width - 60, 30);

    blendingSelect = createSelect();
    blendingSelect.position(width - 140, 30);
    blendingSelect.option('No Tint');
    blendingSelect.option('Tint');

    coloringBrightness.changed(() => {
        let val = coloringBrightness.value();
        if (val === 'Luma') {
            coloringShader.setUniform('coloringBrightness', 1);
        } else if (val === 'HSV') {
            coloringShader.setUniform('coloringBrightness', 2);
        } else if (val === 'HSL') {
            coloringShader.setUniform('coloringBrightness', 3);
        } else if (val === 'Average') {
            coloringShader.setUniform('coloringBrightness', 4);
        } else {
            coloringShader.setUniform('coloringBrightness', 0);
        }
    });

    blendingSelect.changed(() => {
        if (blendingSelect.value() === 'Tint') {
            coloringShader.setUniform('tinting', true);
        } else {
            coloringShader.setUniform('tinting', false);
        }
    });

    coloringShader.setUniform('coloringBrightness', 0);
    coloringShader.setUniform('tinting', false);
}

function draw() {
    selectedColor = picker.color();
    background(0);
    coloringShader.setUniform('texture', src);
    coloringShader.setUniform('color', [red(selectedColor), green(selectedColor), blue(selectedColor), 1.0]);
    beginShape();
    // format is: vertex(x, y, z, u, v)
    vertex(-1, -1, 0, 0, 1);
    vertex(1, -1, 0, 1, 1);
    vertex(1, 1, 0, 1, 0);
    vertex(-1, 1, 0, 0, 0);
    endShape();
}

{{< /highlight >}} {{< /details >}}

{{% justify %}}

## Conclusiones y Trabajo futuro

- Se logra evidenciar que, mediante el uso de shaders, se reduce enormemente el consumo de recursos computacionales
  en las tareas relacionadas con el uso de texturas, pues la aplicación de las herramientas de coloración y el tinte
  sobre el video se logran de manera casi inmediata, algo que, bajo un enfoque que no emplea shaders, requeriría aplicar
  las operaciones pixel a pixel, fotograma por fotograma, causando latencia y otros problemas; en este caso, eso
  no sucede.
- Como trabajo futuro, se podrían implementar los otros tipos de mezcla para realizar el texture tinting, pues sólo
  se hace mediante "MULTIPLY" para esta aplicación. También, sería interesante aplicar las herramientas de coloración
  y tinte en texturas sobre objetos 3D.

## Referencias

#### *[1]* J. P. Charalambos, "Shaders: Texturing". Visual Computing, Apr. 2023. <https://visualcomputing.github.io/docs/shaders/texturing/>
#### *[2]* FITRIYAH, Hurriyatul; WIHANDIKA, Randy Cahya. An analysis of rgb, hue and grayscale under various illuminations. En 2018 International Conference on Sustainable Information Engineering and Technology (SIET). IEEE, 2018. p. 38-41.
#### *[3]* Michael W. Schwarz, William B. Cowan, and John C. Beatty (April 1987). "An experimental comparison of RGB, YIQ, LAB, HSV, and opponent color models." ACM Transactions on Graphics 6(2): 123–158.

{{% /justify %}}