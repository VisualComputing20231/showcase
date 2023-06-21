# Spatial Coherence & Photomosaic

{{% justify %}}

## Introducción

Para este ejercicio se puso en práctica el fenómeno visual de *"Spatial Coherence"* con el objetivo de
desarrollar un código capaz de pixelar una imagen y, a partir de este, desarrollar una aplicación que
consiste en un fotomosaico.

## Marco Teórico

La coherencia espacial es un término que se utiliza en la óptica para describir la capacidad de una onda electromagnética para mantener una relación de fase estable en diferentes puntos del espacio. La coherencia espacial se refiere a la propiedad de la luz que hace que se comporte como una onda: esto significa que tiene la capacidad de interferir constructiva o destructivamente consigo misma en diferentes puntos del espacio [1].

La coherencia espacial se utiliza en muchas aplicaciones ópticas, como la holografía, la tomografía óptica de coherencia y la microscopía de campo cercano [3]. En estas aplicaciones, la coherencia espacial es esencial para la formación de imágenes y para obtener información detallada sobre la estructura de los objetos que se están observando.

La coherencia espacial se puede cuantificar utilizando varias medidas, tales como la función de correlación espacial, el ancho de banda de coherencia y la longitud de coherencia: la función de correlación espacial es una medida de la correlación entre dos puntos de la onda en diferentes posiciones, el ancho de banda de coherencia es una medida de la gama de longitudes de onda que contribuyen a la coherencia de la onda y la longitud de coherencia es una medida de la distancia sobre la cual la onda mantiene una relación de fase estable [1].

En resumen, la coherencia espacial es una propiedad fundamental de las ondas electromagnéticas que permite que se comporten como ondas y que puedan interferir constructiva o destructivamente en diferentes puntos del espacio. La coherencia espacial se utiliza en muchas aplicaciones ópticas para la formación de imágenes y para obtener información detallada sobre la estructura de los objetos que se están observando.

Ahora, un fotomosaico es una imagen o composición visual que se crea al combinar múltiples fotografías pequeñas, llamadas teselas, para formar una imagen más grande. Cada tesela individual es una fotografía completa en sí misma y puede ser una imagen independiente o una parte recortada de una imagen más grande.

El proceso de creación de un fotomosaico generalmente implica los siguientes pasos:

1. **Recopilación de imágenes:** Se selecciona un conjunto de imágenes que se utilizarán como teselas para construir el fotomosaico. Estas imágenes pueden ser fotografías relacionadas con un tema específico o pueden abarcar una amplia variedad de temas.

2. **Análisis y división:** La imagen objetivo o imagen base que se desea recrear con el fotomosaico se divide en pequeñas secciones o celdas.

3. **Asignación de teselas:** Cada celda de la imagen base se compara con las teselas disponibles y se selecciona la imagen más adecuada en función de la similitud de color, tono o características visuales.

4. **Composición:** Las teselas seleccionadas se colocan en las celdas correspondientes de la imagen base, formando así el fotomosaico completo.

El resultado final es una imagen que, a distancia o vista en su totalidad, representa la imagen base, pero cuando se observa de cerca o se examina con atención, se revelan las múltiples imágenes que componen el mosaico.

Los fotomosaicos pueden ser utilizados como una forma artística de representar imágenes o como una técnica de organización visual para presentar grandes conjuntos de imágenes de manera más compacta y creativa.

## Código y Resultados

A continuación se describe el ejercicio desarrollado: se implementó un dataset consistente de 56 imágenes relacionadas con películas. El fotomosaico
toma como fuente una de esas imágenes y la reconstruye a partir de las demás.

En la parte inferior se encuentra, a la izquierda, un checkbox que permite habilitar la visualización uv. En el centro hay otro checkbox
que permite alternar entre el fotomosaico o el pixelador. Por último, a la derecha hay un slider que permite realizar el downsampling, es
decir, aumentar el tamaño de las teselas (y, en consecuencia, disminuir el número de estas). El valor que se deja por defecto en el slider
es el sugerido para visualizar los fotomosaicos con mejor calidad respecto a las demás resoluciones.

Puede cambiar de una fotografía a otra presionando la tecla `d` para seguir y la tecla `s` para retroceder. 

{{% /justify %}}

{{< p5-iframe sketch="../../sketches/photomosaic.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" lib2="https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.js" width="620" height="650" >}}

{{% justify %}}

Para esta aplicación se implementó un fragment shader, el cual se detalla a continuación:

{{% /justify %}}

{{< details title="**photomosaic.frag**" open=true >}}
{{< highlight js >}}

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

{{< /highlight >}} {{< /details >}}

{{% justify %}}

Se evidencia que el shader recibe tanto `source` como `palette`, donde la primera corresponde a la imagen
que se va a reproducir y la segunda a la paleta de imágenes que se interpolarán. Entonces, se cuenta con 
la función `luma` (ya mencionada en secciones anteriores), puesto que se usa como criterio de ordenamiento.
En el main se remapean las coordenadas según la resolución, y luego se normalizan a un rango entre 0 y 1.
Se crea el texel como si se tratase del pixelador y, con este, se determinan las coordenadas de la tesela
correspondiente: para ello se calcula el "luma" del texel, multiplicado por el tamaño del buffer. Eso se le
suma a la coordenada en x, para luego dividirse de nuevo entre el tamaño. De esa manera se consigue que la
tesela (es decir, la imagen seleccionada del buffer) corresponda con el nivel de luminancia del texel.

Luego, para hacer el sampleo, se mira si está habilitado o no la opción de pixelador: en caso que sí, se aplica
la textura de la imagen original en las coordenadas correspondientes tras la aplicación de la coherencia espacial;
en caso que no, se aplica la textura de la paleta en las coordenadas calculadas para la tesela. En ambos casos
se cuenta con la opción de que se habilite o no la visualización uv.

Por su parte, dentro del código de javascript se destaca que, en el `preload` se cargan todas las imágenes al arreglo
`paintings`. Después se hace uso de la librería `p5.Quadrille` para organizarlas según el criterio "luma" y, tras ello,
ponerlas en un objeto buffer en celdas de 100x100 y sin bordes. Luego está una función para que se cambien las imágenes
al oprimir las teclas indicadas más arriba. Por último, en el draw se pasan tanto el buffer como la imagen a replicar
al shader y se traza la textura obtenida. El archivo completo se deja a continuación:

{{% /justify %}}

{{< details title="**Código completo**" open=true >}}
{{< highlight js >}}

let mosaic;
let paintings, imageCells, pg;
let symbol;
// ui
let resolution;
let uv, pixelator;
let movie = 0, num_movies = 56;

function preload() {
    mosaic = readShader('/showcase/sketches/frags/photomosaic.frag',
        { varyings: Tree.texcoords2 });
    paintings = [];
    for (let i = 1; i <= num_movies; i++) {
        paintings.push(loadImage(`../../assets/photomosaic/${i}.jpg`));
    }
}

function setup() {
    createCanvas(600, 600, WEBGL);
    textureMode(NORMAL);
    noStroke();
    shader(mosaic);
    imageCells = createQuadrille(paintings);
    resolution = createSlider(10, 600, 450, 10);
    resolution.position(width - 120, 620);
    resolution.style('width', '80px');
    resolution.input(() => {
        mosaic.setUniform('resolution', resolution.value())
    });
    mosaic.setUniform('resolution', resolution.value());
    symbol = paintings[movie];
    mosaic.setUniform('uv', false);
    uv = createCheckbox('uv visualization', false);
    uv.style('color', 'white');
    uv.changed(() => mosaic.setUniform('uv', uv.checked()));
    uv.position(30, 620);

    pixelator = createCheckbox('pixelator', false);
    pixelator.style('color', 'white');
    pixelator.changed(() => mosaic.setUniform('pixelator', pixelator.checked()));
    pixelator.position(width/2 - 40, 620);

    pg = createGraphics(100 * imageCells.width, 100);
    mosaic.setUniform('pg_size', imageCells.width);
    imageCells.sort();
    drawQuadrille(imageCells, {
        graphics: pg,
        cellLength: 100,
        outlineWeight: 0,
    });
}

function keyPressed() {
    if (key === 'd') {
        movie += 1;
        if (movie >= num_movies){
            movie = 0;
        }
        symbol = paintings[movie];
    }
    else if (key === 's') {
        movie -= 1;
        if (movie < 0){
            movie = num_movies - 1;
        }
        symbol = paintings[movie];
    }
}

function draw() {
    mosaic.setUniform('palette', pg);
    mosaic.setUniform('source', symbol);
    beginShape();
    vertex(-1, -1, 0, 0, 1);
    vertex(1, -1, 0, 1, 1);
    vertex(1, 1, 0, 1, 0);
    vertex(-1, 1, 0, 0, 0);
    endShape();
}

{{< /highlight >}} {{< /details >}}

{{% justify %}}

## Conclusiones y Trabajo futuro

- Esta aplicación demuestra que el uso de shaders reduce bastante el consumo de recursos computacionales con respecto a la sección de coherencia espacial
  de la entrega anterior, pues facilita las operaciones que requieren hacerse pixel a pixel.
- Puede verse, en algunas de las imágenes, que su reproducción en el fotomosaico resulta un poco distorsionada: esto es evidente, más que todo, en las carátulas
  de películas que tienen juegos de luces y sombras, así que esas distorsiones tienen sentido ya que el criterio de ordenamiento empleado para la paleta fue `luma`.
- Como trabajo futuro se podría seguir esta misma aplicación sobre videos (por ejemplo, escenas de películas), donde las teselas también sean archivos de video. Sin embargo
  eso requeriría definir otros criterios, dado que `luma` puede no ser constante a lo largo de todos los fotogramas.

## Referencias

#### *[1]* J. P. Charalambos, "Spatial Coherence". Visual Computing, Apr. 2023. <https://visualcomputing.github.io/docs/shaders/spatial_coherence/>
#### *[2]* J. P. Charalambos, "Photomosaic". Visual Computing, Apr. 2023. <https://visualcomputing.github.io/docs/shaders/photomosaic/>
#### *[3]* C. Poynton, "Digital Video and HD: Algorithms and Interfaces," 2nd ed., Morgan Kaufmann, 2012, pp. 31-35, 65-68, 333, 337, ISBN 978-0-12-391926-7. [Online]. Available: <https://www.sciencedirect.com/book/9780123919267/digital-video-and-hd>

{{% /justify %}}