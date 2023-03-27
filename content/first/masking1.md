# Visual Masking I

{{% justify %}}

## Introducción

En esta sección se discute acerca del enmascaramiento visual, haciendo énfasis en los kinegramas
y los patrones de moiré, que son fenómenos visuales estrechamente relacionados con esta acción.

Acto seguido, se desarrollan varios ejercicios relacionados con tales conceptos. En
particular, se llevó a cabo un programa que genera un kinegrama a partir de un *gif*, así
como un patrón de moiré en dos dimensiones y otro en tres dimensiones.

Para terminar, se discuten posibles aplicaciones de los conceptos aprendidos, así
como el trabajo futuro que se puede desarrollar mediante este tipo de patrones y animaciones.

## Marco Teórico

El enmascaramiento visual es un fenómeno perceptual en el que la visibilidad
de un estímulo se ve afectada por la presentación simultánea de otro estímulo:
el que afecta la visibilidad del otro se conoce como enmascarador o máscara
y puede ser presentado antes, después, o al mismo tiempo que el estímulo objetivo.
Este fenómeno puede ocurrir tanto en la visión consciente como en la no consciente,
y puede tener implicaciones en la percepción visual, la atención y la memoria *[1]*.

A continuación, se exponen los ejemplos de enmascaramiento visual que competen a esta sección:

- **Patrones de moiré:**

Los patrones de moiré son un ejemplo de *visual masking* en el que se produce una
interferencia entre dos patrones de líneas superpuestas con una ligera diferencia en su
orientación o frecuencia espacial. El resultado es una percepción errónea de los patrones de líneas,
con la aparición de un nuevo patrón que puede parecer más denso, más oscuro o con un patrón diferente
al original. Este fenómeno puede tener aplicaciones en la detección de irregularidades en superficies
o la verificación de seguridad en tarjetas de crédito o documentos de identidad *[2]*.

- **Kinegramas:**

Los kinegramas son una técnica de impresión en la que se superponen patrones de líneas de diferentes
tamaños y orientaciones para crear una imagen con efectos de movimiento y cambios de color. Se utilizan,
comúnmente, como medida de seguridad en billetes, pasaportes y otros documentos oficiales, pues están
hechos de patrones de líneas finas y detallados que, cuando se ven desde diferentes ángulos o se mueven,
crean un efecto de profundidad y movimiento que es difícil de reproducir o falsificar *[3]*.

En general, el proceso de creación de un kinegrama está compuesto por los siguientes pasos elementales *[4]*:

1. Seleccionar un conjunto de imágenes que tengan el mismo tamaño y que representen una secuencia
de movimiento suave o una transformación gradual, como una rotación o un cambio de forma.
2. Superponer estas imágenes con un patrón de rejilla o de líneas finas.
3. Ajustar la frecuencia y la velocidad del movimiento o la transformación para crear una
animación fluida.

## Código y Resultados:

Inicialmente, se realizaron dos implementaciones de patrones de moiré: la primera de ellas se trata de
dos conjuntos de círculos concentricos, donde el segundo grupo se desplaza horizontalmente. Es posible
mover el *slider* para aumentar o disminuir la velocidad de tal desplazamiento.

{{< details title="**Código completo**" open=false >}}
{{< highlight js >}}
let direction = true;

function setup() {
    createCanvas(650, 500);
    ellipseMode(RADIUS);
    slider = createSlider(10, 100, 50);
    slider.position(width/3, (9 * height) / 10);
    slider.style('width', '250px');
}

function draw() {
    background(255);

    frameRate(slider.value());

    if (frameCount % width == 0)
        direction = !direction;

    for (let i = 8; i <= height/2 - 40; i+=8){
        noFill()
        strokeWeight(2)
        ellipse(width/2, height/2 - 40, i);
        if (direction)
            ellipse(frameCount % width, height/2 - 40, i);
        else
            ellipse(width - (frameCount % width), height/2 - 40, i);
    }
}
{{< /highlight >}} {{< /details >}}

{{% /justify %}}

{{< p5-iframe sketch="/showcase/sketches/moire1.js" width="670" height="520">}}

{{% justify %}}

De este código se destaca la manera en que se trazan los círculos en movimiento:

{{< highlight js >}}
if (direction)
    ellipse(frameCount % width, height/2 - 40, i);
else
    ellipse(width - (frameCount % width), height/2 - 40, i);
{{< /highlight >}}

Aquí, **direction** es un valor booleano que cambia cada vez que `frameCount % width == 0`:
así se consigue que cambie el sentido de izquierda a derecha y viceversa, dado que cambia
la coordenada en *x* mientras que lo demás permanece igual.

Una vez se ha interiorizado el concepto mediante esta implementación sencilla, se procede
con una más compleja, pues se trata de una animación en tres dimensiones que emplea color.
De manera análoga, es posible cambiar la velocidad de rotación de cada patrón mediante el
*slider* cuyo color coincide con las líneas (solo que, en este caso, deslizar hacia la
izquierda incrementa la velocidad, mientras deslizar a la derecha hace que disminuya).
Por otra parte, el ángulo de la cámara es mutable presionando las teclas de "flecha
derecha" y "flecha izquierda" para tener la vista frontal o posterior, respectivamente. 

{{< details title="**Código completo**" open=false >}}
{{< highlight js >}}
function setup() {
    createCanvas(700, 700, WEBGL);

    slider1 = createSlider(5000, 20000, 10000);
    slider1.position(width/3, 30);
    slider1.style('width', '250px');
    slider1.style('accent-color', 'red');

    slider2 = createSlider(5000, 20000, 10000);
    slider2.position(width/12, height-50);
    slider2.style('width', '250px');
    slider2.style('accent-color', 'green');

    slider3 = createSlider(5000, 20000, 10000);
    slider3.position(7*width/12, height-50);
    slider3.style('width', '250px');
    slider3.style('accent-color', 'blue');

    cam = createCamera();
    cam.setPosition(0, 0, 600);
}

function draw() {
    background(255);
    strokeWeight(3);

    rotateX(-millis()/slider1.value());
    lines('red');

    rotateX(millis()/slider1.value());
    rotateY(-millis()/slider2.value());
    lines('green');

    rotateY(millis()/slider2.value());
    rotateZ(-millis()/slider3.value());
    lines('blue');

    if (keyIsDown(LEFT_ARROW)) {
        cam.setPosition(0, 0, -600);
        cam.lookAt(0,0,0);
    }
    if (keyIsDown(RIGHT_ARROW)) {
        cam.setPosition(0, 0, 600);
        cam.lookAt(0,0,0);
    }
}

function lines(color){
    stroke(color)
    for (let i = 160 - width/2; i <= width/2 - 160; i += 5){
        line(i, 160 - height/2, i, height/2 - 160)
    }
}
{{< /highlight >}} {{< /details >}}

{{% /justify %}}

{{< p5-iframe sketch="/showcase/sketches/moire2.js" width="720" height="720">}}

{{% justify %}}
En este programa se destaca la manera en que se logran las rotaciones:

{{< highlight js >}}
rotateX(-millis()/slider1.value());
lines('red');

rotateX(millis()/slider1.value());
rotateY(-millis()/slider2.value());
lines('green');

rotateY(millis()/slider2.value());
rotateZ(-millis()/slider3.value());
lines('blue');
{{< /highlight >}}

Dado que las funciones *rotateX*, *rotateY* y *rotateZ* afectan a todos los elementos que se dibujen
después de haberlas mencionado, fue necesario volver a aplicar *rotateX* con la misma magnitud pero
el sentido opuesto para que el segundo patrón rotara únicamente en el eje *y*. Del mismo modo se volvió
a aplicar *rotateY* al dibujar el tercer patrón para que este rotara tan solo en el eje *z*. Así se
consiguió que cada conjunto de líneas girara sobre un eje distinto.

Para el próximo ejercicio, partiendo de los pasos descritos en el marco teórico para crear un kiengrama,
se implementó un programa que, tomando un archivo de tipo *gif*, extrajera sus primeros 20 fotogramas y
construyera tal animación. Con el botón de la parte inferior es posible mostrar y ocultar la máscara,
mientras que el slider permite controlar su velocidad.

{{< details title="**Código completo**" open=false >}}
{{< highlight js >}}
let keyframes = [];
let kinegram;
let overlay;
let animate = false;
let gif; let newGif;
let gifLoading = false;
let uploaded = false;

function preload(){
    gif = loadImage("../assets/example.gif")
}

function setup() {
    createCanvas(600, 600);
    imageMode(CENTER);
    textAlign(CENTER);

    if (!uploaded){
        newGif = createFileInput(handleFile);
        newGif.position(width / 3, height / 8);

        slider = createSlider(5, 25, 5);
        slider.position((3 * width) / 5, (5 * height) / 6);
        slider.style('width', '100px');
    }

    gif.resize(0,300)

    for (let i = 0; i < 20; i++) {
        gif.setFrame(i)
        keyframes[i] = createImage(gif.width, gif.height);
        gif.loadPixels();
        keyframes[i].loadPixels();
        for (let j = 0; j < gif.width; j++) {
            for (let k = 0; k < gif.height; k++) {
                keyframes[i].set(j, k, gif.get(j, k));
            }
        }
        keyframes[i].updatePixels();
    }

    kinegram = createImage(keyframes[0].width, keyframes[0].height);
    kinegram.loadPixels();

    overlay = createImage(keyframes[0].width, keyframes[0].height);
    overlay.loadPixels();

    for (let x = 0; x < overlay.width; x++) {
        for (let y = 0; y < overlay.height; y++) {
            let index = int(x/0.25) % keyframes.length;
            if (x < kinegram.width) {
                kinegram.set(x, y, keyframes[index].get(x, y));
            }
            if (index > 0) {
                overlay.set(x, y, color(0, 255));
            } else {
                overlay.set(x, y, color(0, 0));
            }
        }
    }

    kinegram.updatePixels();
    overlay.updatePixels();

    button = createButton('Toggle Overlay');
    button.position(width / 4, (5 * height) / 6);
    button.mousePressed(() => {animate = !animate});
}

function draw() {
    background(255);
    if(!gifLoading){
        image(kinegram, width / 2, height / 2);
        if (animate){
            frameRate(slider.value());
            image(overlay, (frameCount * 4) % width, height / 2);
        }
    }
}

function handleFile(file) {
    gifLoading = true;
    gif = createImg(file.data, "");
    gif.hide();
    let gifSrc = gif.attribute("src");
    gif = loadImage(gifSrc, gifLoaded);
}

function gifLoaded() {
    gifLoading = false;
    uploaded = true;
    setup();
}
{{< /highlight >}} {{< /details >}}

{{% /justify %}}

{{< p5-global-iframe width="620" height="620">}}

let keyframes = [];
let kinegram;
let overlay;
let animate = false;
let gif; let newGif;
let gifLoading = false;
let uploaded = false;

function preload(){
gif = loadImage("../assets/example.gif")
}

function setup() {
createCanvas(600, 600);
imageMode(CENTER);
textAlign(CENTER);

    if (!uploaded){
        newGif = createFileInput(handleFile);
        newGif.position(width / 3, height / 8);

        slider = createSlider(5, 25, 5);
        slider.position((3 * width) / 5, (5 * height) / 6);
        slider.style('width', '100px');
    }

    gif.resize(0,300)

    for (let i = 0; i < 20; i++) {
        gif.setFrame(i)
        keyframes[i] = createImage(gif.width, gif.height);
        gif.loadPixels();
        keyframes[i].loadPixels();
        for (let j = 0; j < gif.width; j++) {
            for (let k = 0; k < gif.height; k++) {
                keyframes[i].set(j, k, gif.get(j, k));
            }
        }
        keyframes[i].updatePixels();
    }

    kinegram = createImage(keyframes[0].width, keyframes[0].height);
    kinegram.loadPixels();

    overlay = createImage(keyframes[0].width, keyframes[0].height);
    overlay.loadPixels();

    for (let x = 0; x < overlay.width; x++) {
        for (let y = 0; y < overlay.height; y++) {
            let index = int(x/0.25) % keyframes.length;
            if (x < kinegram.width) {
                kinegram.set(x, y, keyframes[index].get(x, y));
            }
            if (index > 0) {
                overlay.set(x, y, color(0, 255));
            } else {
                overlay.set(x, y, color(0, 0));
            }
        }
    }

    kinegram.updatePixels();
    overlay.updatePixels();

    button = createButton('Toggle Overlay');
    button.position(width / 4, (5 * height) / 6);
    button.mousePressed(() => {animate = !animate});

}


function draw() {
background(255);
if(!gifLoading){
image(kinegram, width / 2, height / 2);
if (animate){
frameRate(slider.value());
image(overlay, (frameCount * 4) % width, height / 2);
}
}
}

function handleFile(file) {
gifLoading = true;
gif = createImg(file.data, "");
gif.hide();
let gifSrc = gif.attribute("src");
gif = loadImage(gifSrc, gifLoaded);
}

function gifLoaded() {
gifLoading = false;
uploaded = true;
setup();
}

{{</p5-global-iframe>}}

{{% justify %}}

Por otra parte, con el botón de la parte superior es posible cargar cualquier *gif* desde la máquina local.
Es importante tener en cuenta que su tamaño será reajustado a las proporciones del canvas. A continuación
se deja una carpeta con archivos de prueba que se pueden cargar:

<a href="https://drive.google.com/file/d/1UebYMcJYYfLnTYYtmSH6sk0UliLjAEZL/view?usp=share_link" target="_blank"> <img src="../assets/downloadButton.png" width="200px"> </a>

Aquí hay varias secciones del código que se destacan: en primera medida, se tiene el ciclo empleado para
extraer los fotogramas del *gif*:

{{< highlight js >}}
for (let i = 0; i < 20; i++) {
    gif.setFrame(i)
    keyframes[i] = createImage(gif.width, gif.height);
    gif.loadPixels();
    keyframes[i].loadPixels();
    for (let j = 0; j < gif.width; j++) {
        for (let k = 0; k < gif.height; k++) {
            keyframes[i].set(j, k, gif.get(j, k));
        }
    }
    keyframes[i].updatePixels();
}
{{< /highlight >}}

Como se puede observar, se utiliza la función **setFrame** para obtener el fotograma y, luego, se cargan
sus pixeles en otra imagen, la cual se almacena en un arreglo. Con los ciclos anidades se itera a través
de los pixeles para copiarlos en la nueva imagen; finalmente, los pixeles se actualizan.

El kinegrama y la máscara se crean usando un ciclo parecido al anterior:

{{< highlight js >}}
for (let x = 0; x < overlay.width; x++) {
    for (let y = 0; y < overlay.height; y++) {
        let index = int(x/0.25) % keyframes.length;
        if (x < kinegram.width) {
            kinegram.set(x, y, keyframes[index].get(x, y));
        }
        if (index > 0) {
            overlay.set(x, y, color(0, 255));
        } else {
            overlay.set(x, y, color(0, 0));
        }
    }
}
{{< /highlight >}}

La lógica es que se toma una columna de cada fotograma y sus pixeles se cargan en la nueva imagen
(el kinegrama): esto se hace de manera iterativa, por ello se utiliza la función módulo respecto
a la longitud del arreglo **keyframes**. Para la máscara, cada vez que este módulo sea igual a cero
(cuando termina una "iteración") se pinta de color negro y, en caso contrario, se deja transparente.
La fracción respecto a *x* en el cálculo del índice fue un valor obtenido mediante ensayo y error
que permitiese ver una animación fluida. Esta misma razón se tiene en cuenta al animar la máscara
mediante el código `image(overlay, (frameCount * 4) % width, height / 2)`, pues dividir entre *0.25*
es equivalente a multiplicar por 4.

Por último, se destacan las funciones para cargar *gifs* desde la máquina local:
{{< highlight js >}}
function handleFile(file) {
    gifLoading = true;
    gif = createImg(file.data, "");
    gif.hide();
    let gifSrc = gif.attribute("src");
    gif = loadImage(gifSrc, gifLoaded);
}

function gifLoaded() {
    gifLoading = false;
    uploaded = true;
    setup();
}
{{< /highlight >}}

Como se observa, cada vez que se carga un archivo, la bandera **gifLoading** se deja como verdadera,
y se vuelve a poner como falsa en la función **gifLoaded**, es decir, cuando ya ha finalizado la carga.
Se crea una nueva imagen en la variable **gif** (que luego debe ocultarse para evitar que aparezca bajo
el canvas) y se carga la ruta del archivo con **loadImage**, cuyo *callback* es la función que indica
que ya se cargó el archivo: dentro de esta última vuelve a llamarse el **setup**, pero se marca la bandera
**uploaded** como verdadera para que se refresquen únicamente las imágenes (pero no los sliders, por ejemplo).

## Conclusiones y Trabajo futuro

- Una particularidad muy interesante de los patrones de moiré que se observó en la segunda implementación son las
  deformaciones que se generan cuando el plano está en tres dimensiones: mientras que la superposición de patrones de
  líneas rectas en dos dimensiones genera efectos visuales rectilíneos, en este ejercicio la superposición de líneas
  rectas desemboca en la visualización de líneas curvas, dado que cada patrón gira sobre un eje distinto: `x`,`y` o `z`.
  Adicionalmente, estas líneas curvas se aprecian en tonalidades de amarillo, magenta y cian, puesto que las líneas
  rectas se trazaron en rojo, verde y azul (RGB).
- Mientras que elaborar un kinegrama manualmente puede ser una tarea compleja y que requiere conocimientos técnicos
  en programas de edición de imágenes, en **p5js** resulta convertirse en una tarea sencilla gracias a las múltiples
  funcionalidades que este lenguaje posee. Además, la propuesta realizada de convertir un *gif* a kinegrama permite
  comprender aún mejor su funcionamiento, dado que se ve la transición de animación a imagen estática y máscara, que
  vuelven a dar como resultado la misma animación cuando la máscara se pone en movimiento.
- No obstante, esta implementación también cuenta con algunos puntos negativos: por un lado, requiere ser muy precisa,
  porque calquier variación en el cálculo del índice podría estropear la armonía visual de la animación resultante
  (haciendo que no luzca ni remotamente parecido al *gif* original); por otra parte, consume muchos recursos tanto
  de tiempo, pues se aprecia que la página carga un poco más lento de lo usual, como de memoria, lo cual es
  evidente considerando toda la cantidad de imágenes y archivos que se están manipulando.
- Como trabajo futuro, se podría aplicar la implementación de patrones de moiré en tres dimensiones para construir,
  de manera análoga, kinegramas en tres dimensiones: esto podría conllevar un estudio a profunidad de cómo generar
  la máscara visual y, así mismo, de cómo debería ser su rotación para ofrecer una animación visualmente armoniosa.

## Referencias

#### *[1]*. B. G. Breitmeyer, “Visual Masking: An Integrative Approach,” Oxford University Press, Oxford, 1984.
#### *[2]*. L. Spillmann, "The Perception of Movement and Depth in Moiré Patterns," Perception, vol. 22, no. 3, pp. 287-308, 1993, doi: 10.1068/p220287.
#### *[3]*. R. L. Van Renesse, "A review of holograms and other microstructures as security features," Springer Series in Optical Sciences, vol. 78, 2007. <https://www.dslreports.com/r0/download/2346751~41cd69e70ba7cfa509b37dddbba63faa/vanrenesse.pdf>
#### *[4]*. O. Georgiou and M. Georgiou, "ZEBRA | COMPUTING MOIRE ANIMATIONS," Sustainable Computational Workflows, pp. 49-56, 2018. <http://papers.cumincad.org/data/works/att/ecaaderis2018_120.pdf>

{{% /justify %}}