# Visual illusions

## Introducción


{{% justify %}}
En esta sección se presentarán algunos fenómenos visuales y su respectiva implementación; además, se proporcionará una breve explicación junto con la fuente de donde se obtuvo la información.

## Motion Aftereffect (Waterfall Illusion)
### Marco Teórico

El fenómeno de la cascada es una ilusión óptica que se produce cuando se observa una cascada o un río en movimiento y luego se mira hacia una superficie estática. La superficie estática parece moverse en la dirección opuesta al flujo original. Este efecto se debe a la adaptación del sistema visual a un estímulo en movimiento que, al desaparecer, produce un efecto residual de movimiento en la dirección opuesta. Este efecto es conocido como "inducción de movimiento".

Este fenómeno ha sido observado desde la antigüedad. Lucrecio, poeta romano del siglo I a.C., describió la ilusión de que las piernas de un caballo estacionado en un río parecían moverse en la dirección opuesta al flujo del agua. El filósofo Aristóteles también hizo referencia a la percepción errónea del movimiento en el agua, aunque en su caso se tratara de la percepción de que objetos estáticos parecían moverse.

Investigaciones posteriores han demostrado que el fenómeno de la cascada está mediado por procesos neuronales complejos en el cerebro que procesan y adaptan la percepción visual del movimiento. Estudios modernos han identificado las áreas cerebrales que son responsables de esta adaptación y han ayudado a explicar los mecanismos subyacentes a la ilusión de la cascada.

En resumen, la ilusión de la cascada es un fenómeno óptico que se produce cuando se observa una superficie estática después de haber mirado un objeto en movimiento. Este efecto se debe a la adaptación del sistema visual a estímulos en movimiento que persisten durante unos momentos después de que el estímulo ha desaparecido. Este fenómeno ha sido estudiado desde la antigüedad y ha sido objeto de investigación científica moderna, lo que ha ayudado a comprender mejor los mecanismos neuronales que subyacen a la percepción visual del movimiento.

### Instrucciones

Fíjate en la cruz central durante el movimiento y mira el ciclo al menos tres veces. Observa el efecto de la imagen posterior al movimiento en la figura en reposo (el Buda de Kamakura). La "deformación" causada por el efecto de la imagen posterior al movimiento se aplica a cualquier cosa que observes. También puedes intentar cubrir un ojo, adaptarte durante aproximadamente tres ciclos y luego probar con el otro ojo.

Esto se explica, a menudo, en términos de "fatiga" de la clase de neuronas que codifican una dirección de movimiento. Sin embargo, es más preciso interpretar esto en términos de adaptación o "control de ganancia". Estos detectores de movimiento no se encuentran en la retina, sino en el cerebro *[1]*. Para obtener una explicación más detallada y una demostración interesante del "efecto cascada", consulte la página de [George Mather](http://www.georgemather.com/MotionDemos/MAEMP4.html).



{{< details title="Waterfall Illusion" open=true >}}
<div style="position: relative;   
  left: 0%;
  top: 50%;
  width: 50%;
  height: 50%;
  padding: 25px;
  text-align: center;
  // TODO: Move this to shortcode"> 
{{< p5-div sketch="/showcase/sketches/waterfall-illusion.js" >}}
</div>
{{< /details >}}

## Código y Resultados

En este ejercicio se desarrolla el efecto visual de la cascada. Para lograr la sensación de movimiento, se dibujan múltiples áreas a distintos radios, determinados por la cantidad de anillos (**rings**). Luego, se almacenan en un array **ringpos[]** en orden del más grande al más pequeño y, por último, se les asigna un color blanco o negro alternadamente. También hay que notar que la función está restringida por el módulo (%) de un radio establecido, por tanto, una vez que el radio de alguna área llega al límite (si se expande), este se devolverá al radio mínimo.

{{< highlight js >}}
for (let i = 0; i < rings; i++) {
        cursize = (frameCount * speed + (size / rings) * i) % size;
        if (cursize == 0) {
        inverted = !inverted;
        exterior = !exterior;
        }
        if (reversed) cursize = size - cursize;
        ringpos[i] = cursize;
    }
{{< /highlight >}}

En este caso no se dibujan círculos completos, sino más bien arcos con un ángulo definido por la cantidad de ángulos `angles` y los radios previamente calculados. Luego, se rellenan las áreas de estos arcos cambiando su radio en cada *frame*. De esta manera, se logra el efecto de movimiento y el estilo cuadriculado de cada anillo.

{{< highlight js>}}
for (let i = 0; i < rings; i++) {
        inverted = !inverted;
        for (let j = 0; j < angles; j++) {
        noStroke();
        push();
        if (j % 2 == 0) {
            if (inverted) fill(255);
            else fill(0);
        } else {
            if (inverted) fill(0);
            else fill(255);
        }
        arc(
            200,
            200,
            ringpos[i],
            ringpos[i],
            (2 * PI * j) / angles,
            (2 * PI * (j + 1)) / angles
        );
        pop();
        }
    }
{{< /highlight >}}

Según el *frame rate*, se actualiza el radio de cada arco presente, de manera que se expande o se colapsa según lo que determine la variable `reversed`, que cambiará su valor de verdad presionando el respectivo botón. Para lograr que el efecto se muestre correctamente, la duración del movimiento es mucho mayor a la duración de la imagen mostrada (cerca de 3 veces más largo).

Por último, se dibuja la imagen original en el centro de la pantalla. Esta imagen se carga previamente en la función `preload()` y se almacena en la variable `originalImage`. Esta imagen se muestra o no dependiendo del valor de la variable `showImage`, que se cambia cada cierto tiempo dependiendo de la variable `delayTime` y el frame actual.

{{< highlight js >}}
if (frameCount % delayTime == 0) showImage = !showImage;
    if (showImage) {
        delayTime = 200;
        image(originalImage, 0, 0, 400, 400);
    } else {
        noFill();
        stroke(0);
        erase(0,255);
        strokeWeight(100);
        circle(200,200, 500);
        noErase();
        delayTime = 600;
    }
{{< /highlight>}}

El código completo se encuentra en el siguiente desplegable:

{{< details title="**Código completo**" open=false >}}
{{< highlight js >}}
let fr = 30;
let img = null;
let delayTime = 200;
let size = 560;
let angles = 12;
let speed = 4;
let anchor = 100;
let rings = 14;

let inverted = false;
let exterior = false;
let reversed = false;
let showImage = false;

let button;

function preload() {
    originalImage = loadImage("../assets/buddha.jpg");
};

function setup() {
    var canvas = createCanvas(400, 400);
    canvas.parent("waterfall-illusion");
    frameRate(fr);
    button = createButton('Collapse');
    button.parent("waterfall-illusion");
    button.position(0, 0, 'sticky');
    button.mousePressed(() => { 
        button.elt.innerText = reversed ? 'Collapse' : 'Expand';
        reversed = !reversed} );
};

function draw() {
    background(128);
    var cursize;
    noStroke();
    for (let j = 0; j < angles; j++) {
        push();
        if (j % 2 == 0) {
        if (exterior) fill(255);
        else fill(0);
        } else {
        if (exterior) fill(0);
        else fill(255);
    }
    arc(
        200,
        200,
        size,
        size,
        (2 * PI * j) / angles,
        (2 * PI * (j + 1)) / angles
    );
    pop();
    }
    let ringpos = [];
    for (let i = 0; i < rings; i++) {
        cursize = (frameCount * speed + (size / rings) * i) % size;
        if (cursize == 0) {
        inverted = !inverted;
        exterior = !exterior;
        }
        if (reversed) cursize = size - cursize;
        ringpos[i] = cursize;
    }
    ringpos.sort(function (a, b) {
        return b - a;
    });
    for (let i = 0; i < rings; i++) {
        inverted = !inverted;
        for (let j = 0; j < angles; j++) {
        noStroke();
        push();
        if (j % 2 == 0) {
            if (inverted) fill(255);
            else fill(0);
        } else {
            if (inverted) fill(0);
            else fill(255);
        }
        arc(
            200,
            200,
            ringpos[i],
            ringpos[i],
            (2 * PI * j) / angles,
            (2 * PI * (j + 1)) / angles
        );
        pop();
        }
    }
    fill(0, 0, 255);
    circle(200, 200, 30);
    fill(255, 0, 0);
    rect(199, 192, 2, 16);
    rect(192, 199, 16, 2);
    if (frameCount % delayTime == 0) showImage = !showImage;
    if (showImage) {
        delayTime = 200;
        image(originalImage, 0, 0, 400, 400);
    } else {
        noFill();
        stroke(0);
        erase(0,255);
        strokeWeight(100);
        circle(200,200, 500);
        noErase();
        delayTime = 600;
    }
};

{{< /highlight >}} {{< /details >}}
## Conclusiones y Trabajo futuro

- Es posible mejorar el programa para que sea modificable en términos de velocidad, cantidad de anillos y/o ángulos, tamaño de la imagen, etc.
- Como trabajo futuro, se pueden investigar e implementar más fenómenos visuales.

## Referencias
#### *[1]* M. Bach, "Motion Aftereffect (Waterfall Illusion)" [Online]. Available: https://michaelbach.de/ot/mot-adapt/index.html.

{{% /justify %}}