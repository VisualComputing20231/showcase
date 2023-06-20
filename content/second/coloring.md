# Coloring

{{% justify %}}

## Introducción

En esta sección se abordará el problema de *color blending*, también conocido como mezcla de colores,
que se refiere al proceso de combinar diferentes colores para crear nuevos tonos y matices.

## Marco Teórico

En el contexto del arte, el color blending se puede realizar mezclando pinturas en el lienzo o utilizando técnicas de mezcla digital en programas de diseño. Al combinar colores primarios o secundarios en diferentes proporciones, se pueden obtener una amplia variedad de colores intermedios. Los artistas suelen utilizar técnicas de mezcla, como el difuminado o el degradado, para suavizar las transiciones entre colores y lograr efectos de sombreado o iluminación.

En el diseño gráfico y la fotografía, el color blending se realiza a menudo mediante el uso de herramientas y software específicos. Los programas de edición de imágenes permiten mezclar colores de forma precisa y controlada, lo que resulta útil para retocar fotografías, crear ilustraciones o generar efectos especiales.

Algunos modos de mezcla, los cuales se implementan más adelante, son los siguientes:

- **Multiply (Multiplicar):**
Este modo de mezcla multiplica los valores de los píxeles de la capa superior con los valores de los píxeles de la capa inferior. El resultado es un color más oscuro y con mayor saturación. Es útil para oscurecer y dar profundidad a las imágenes, especialmente cuando se superponen capas con colores más oscuros.

- **Add (Sumar):**
En este modo de mezcla, los valores de los píxeles de la capa superior se suman a los valores de los píxeles de la capa inferior. El resultado es una imagen más clara y con mayor brillo. Se utiliza para crear efectos de luz y resplandor, ya que los colores más claros se suman entre sí para generar áreas más brillantes.

- **Darkest (Más oscuro):**
En este modo de mezcla, se selecciona el color más oscuro entre los píxeles de la capa superior y la capa inferior para formar la imagen resultante. Es útil para resaltar los detalles más oscuros de una imagen y crear efectos de contraste.

- **Lightest (Más claro):**
En contraste con el modo "Darkest", el modo "Lightest" selecciona el color más claro entre los píxeles de la capa superior y la capa inferior. Esto resulta en una imagen en la que se destacan los elementos más claros y se puede utilizar para realzar áreas iluminadas o generar efectos de luz intensa.

- **Difference (Diferencia):**
En este modo de mezcla, se calcula la diferencia entre los valores de los píxeles de la capa superior y la capa inferior. El resultado es una imagen en la que los colores similares entre las capas se anulan, mientras que los colores diferentes se acentúan. Se utiliza para crear efectos de contraste y resaltar las áreas donde las capas difieren significativamente en color.

- **Screen (Pantalla):**
En este modo de mezcla, los valores de los píxeles de la capa superior se invierten y luego se multiplican con los valores de los píxeles de la capa inferior. El resultado es una imagen más clara y con mayor iluminación. Se utiliza para añadir brillo y suavizar las transiciones entre capas.

## Código y Resultados

A continuación se presenta el ejercicio desarrollado, en el cual se realiza la mezcla
entre dos colores y también se aplica una modulación multiplicando el color resultante
por un valor de brillo (`brightness`).

Puede dar clic sobre los selectores de la parte superior para cambiar los colores a
mezclar. Puede elegir, entre la lista desplegable, cuál de los modos enunciados con
anterioridad desea aplicar. Por último, puede deslizar la barra para elegir el nivel
de brillo que desea aplicar al nuevo color. El resultado se muestra en la parte
inferior.

{{% /justify %}}

{{< p5-iframe sketch="/showcase/sketches/colorBlending.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="600" height="600" >}}

{{% justify %}}

A continuación se muestra el shader implementado para esta aplicación:

{{% /justify %}}

{{< details title="**colorBlending.frag**" open=true >}}
{{< highlight js >}}

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

{{< /highlight >}} {{< /details >}}

{{% justify %}}

Se evidencia que para cada modo de mezcla se aplica una operación diferente. Por ejemplo, mientras que
el modo **multiply** (el primero) corresponde a mutiplicar *ab*, el modo **screen** (el último) corresponde a una operación
más compleja: *1 - (1-a)(1-b)*. El shader recibe en `uMaterial1` y en `uMaterial2` los colores a mezclar,
en `blendMode` un entero asociado al tipo de mezcla de la lista de selección, y en `identity` un vector
que representa el valor "1" para la operación del modo *screen* que se enunció hace un momento.

En el código de JavaScript, primero se crean los elementos html y, luego, para dibujar los colores originales
es importante tener en cuenta que estos pasan por el mismo shader que el color resultante de la mezcla. Por ello,
en la parte inferior se define una función que, además de asociar el modo de mezcla elegido con su entero análogo
en el shader, también retorna un vector, el cual, al ser operado con un color, lo deja invariable en el modo correspondiente.
Por ejemplo, en multiply es `[1.0, 1.0, 1.0, 1.0]` porque al multiplicar los pixeles por 1, el resultado no cambia.
Por su parte, en add es `[0.0, 0.0, 0.0, 0.0]` porque al sumar los pixeles con 0, el resultado no varía. Se sigue el
mismo análisis para los modos restantes y, finalmente, se hace uso de la función `vertex` para pintar todos los colores,
tanto los originales como el resultante. Para ello, se jugó con las coordenadas hasta dar con una posición que resultase
cómoda. El código completo se deja a continuación:

{{% /justify %}}

{{< details title="**Código completo**" open=true >}}
{{< highlight js >}}

let blendingShader;
let brightness;
let color1, color2, picker1, picker2;
let blendingSelect;
let mode = 0, identity = [1.0, 1.0, 1.0, 1.0];

function preload() {
    blendingShader = readShader('/showcase/sketches/frags/colorBlending.frag');
}

function setup() {
createCanvas(550, 550, WEBGL);
colorMode(RGB, 1);
noStroke();

    picker1 = createColorPicker(color('#cc804d'));
    picker1.position(30, 30);
    picker2 = createColorPicker(color('#e61a66'));
    picker2.position(width / 2 + 30, 30);

    brightness = createSlider(0, 1, 1, 0.01);
    brightness.position(width / 2 + 40, height / 2);
    brightness.style('width', '100px');

    shader(blendingShader);

    blendingSelect = createSelect();
    blendingSelect.position(150, height / 2);
    blendingSelect.option('MULTIPLY');
    blendingSelect.option('ADD');
    blendingSelect.option('DARKEST');
    blendingSelect.option('LIGHTEST');
    blendingSelect.option('DIFFERENCE');
    blendingSelect.option('SCREEN');

    blendingSelect.changed(() => {
        [mode, identity] = blendingMode(blendingSelect.value());
        blendingShader.setUniform("blendMode", mode)
    });
}

function draw() {
    color1 = picker1.color();
    color2 = picker2.color();
    background(0);

    blendingShader.setUniform('uMaterial2', identity);
    blendingShader.setUniform('uMaterial1', [red(color1), green(color1), blue(color1), 1.0]);
    blendingShader.setUniform('brightness', 1.0);

    beginShape();
    vertex(-0.85, 0.15, 0);
    vertex(-0.15, 0.15, 0);
    vertex(-0.15, 0.85, 0);
    vertex(-0.85, 0.85, 0);
    endShape();

    blendingShader.setUniform('uMaterial1', identity);
    blendingShader.setUniform('uMaterial2', [red(color2), green(color2), blue(color2), 1.0]);
    blendingShader.setUniform('brightness', 1.0);

    beginShape();
    vertex(0.15, 0.15, 0);
    vertex(0.85, 0.15, 0);
    vertex(0.85, 0.85, 0);
    vertex(0.15, 0.85, 0);
    endShape();

    blendingShader.setUniform('uMaterial1', [red(color1), green(color1), blue(color1), 1.0]);
    blendingShader.setUniform('uMaterial2', [red(color2), green(color2), blue(color2), 1.0]);
    blendingShader.setUniform('brightness', brightness.value());
    blendingShader.setUniform('identity', [1.0, 1.0, 1.0, 1.0]);

    beginShape();
    vertex(-0.35, -0.85, 0);
    vertex(0.35, -0.85, 0);
    vertex(0.35, -0.15, 0);
    vertex(-0.35, -0.15, 0);
    endShape();
}

function blendingMode(mode){
    if (mode === 'MULTIPLY'){
        return [0,  [1.0, 1.0, 1.0, 1.0]]
    }
    else if (mode === 'ADD'){
        return [1,  [0.0, 0.0, 0.0, 0.0]]
    }
    else if (mode === 'DARKEST'){
        return [2,  [1.0, 1.0, 1.0, 1.0]]
    }
    else if (mode === 'LIGHTEST'){
        return [3,  [0.0, 0.0, 0.0, 0.0]]
    }
    else if (mode === 'DIFFERENCE'){
        return [4,  [0.0, 0.0, 0.0, 0.0]]
    }
    else if (mode === 'SCREEN'){
        return [5,  [0.0, 0.0, 0.0, 0.0]]
    }
}

{{< /highlight >}} {{< /details >}}

{{% justify %}}

## Conclusiones y Trabajo futuro

- En síntesis, se puede evidenciar que el uso de shaders permite mezclar colores de manera ágil, pues solo
  basta con realizar una operación entre los pixeles para obtener el tono resultante, el cual también puede
  variar a partir de un cierto brillo.
- Como trabajo futuro, se podrían implementar muchos más modos de mezcla de colores, incluyendo aquellos que
  tienen un mayor nivel de complejidad, tales como **hard_light** o **soft_light**. Así mismo, se podrían evaluar
  otros valores que sean variables además de `brightness`, tales como la luminosidad o la saturación.

## Referencias

#### *[1]* J. P. Charalambos, "Shaders: Coloring". Visual Computing, Apr. 2023. <https://visualcomputing.github.io/docs/shaders/coloring/>
#### *[2]* MA, Yunpeng. The mathematic magic of Photoshop blend modes for image processing. En 2011 International Conference on Multimedia Technology. IEEE, 2011. p. 5159-5161.
#### *[3]* CHUANG, Johnson; WEISKOPF, Daniel; MOLLER, Torsten. Hue-preserving color blending. IEEE Transactions on Visualization and Computer Graphics, 2009, vol. 15, no 6, p. 1275-1282.
#### *[4]* VALENTINE, Scott. The hidden power of blend modes in Adobe Photoshop. Adobe Press, 2012.

{{% /justify %}}
