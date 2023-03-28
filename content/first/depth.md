# Depth Perception

{{% justify %}}

## Introducción

En esta sección se discute acerca de la percepción de la profundidad y su relación con
las claves monoculares ("*monocular cues*" en inglés). Luego se procede a definir y
detallar algunas de ellas.

Acto seguido, se desarrollan dos *sketchs* en 2D, los cuales, haciendo uso de las claves
monoculares descritas en el marco teórico, permiten engañar al ojo para que se perciban
como escenas en tres dimensiones.

Finalmente, se discuten posibles aplicaciones de los conceptos aprendidos, así
como el trabajo futuro que se puede llevar a cabo a partir del uso de las claves monoculares.

## Marco Teórico

La percepción de la profundidad es la habilidad para percibir la distancia a los objetos
en el mundo utilizando el sistema visual y la percepción visual. Es un factor importante
en la percepción del mundo en tres dimensiones *[1]*. La percepción de la profundidad ocurre,
principalmente, debido a la estereopsis, un fenómeno propio de la visión binocular.
Sin embargo, también existen algunas pistas visuales que favorecen la percepción de la
profundidad con un sólo ojo: estas se conocen como claves monoculares.

A continuación se describen las claves monoculares que se aplicaron
en el desarrollo del presente ejercicio:

- **Paralaje de movimiento:**

El paralaje es un fenómeno óptico en el que la posición aparente de un objeto parece
cambiar cuando se observa desde diferentes ángulos o posiciones. Este efecto es causado
por la diferencia en la ubicación de los ojos o la cámara utilizada para observar el objeto.

El paralaje es importante en muchas áreas: por ejemplo, en la astronomía, el paralaje se
utiliza para medir la distancia de las estrellas y otros objetos celestes; en la fotografía,
el paralaje se utiliza para ajustar la posición de la imagen en el visor de la cámara y para
obtener una vista previa precisa de la imagen antes de tomarla; y en la medición, el paralaje
se utiliza para determinar la profundidad y la distancia de los objetos *[2]*.

Ahora bien, si además de la posición aparente se recibe información acerca del entorno, esto
porque el observador está en movimiento, es aquí cuando se empieza a hablar de paralaje de
movimiento: este efecto visual hace que los objetos cercanos parezcan moverse más rápido que
los objetos más alejados, los cuales parecen estacionarios o, incluso, parecen moverse en la
dirección opuesta *[3]*.

- **Perspectiva Aérea:**

La perspectiva aérea, también conocida como perspectiva atmosférica, se refiere al efecto
visual en el que los objetos que se encuentran más lejos parecen más borrosos, descoloridos
y con menos detalle que los objetos que están más cerca *[4]*.

Este efecto se produce debido a la interferencia de la atmósfera entre los objetos y el observador.

- **Perspectiva:**

En este contexto, la perspectiva se refiere a la relación entre el tamaño de los objetos
y su distancia percibida. Los objetos más alejados parecen más pequeños que los objetos
más cercanos debido a la manera en que los rayos de luz se proyectan en el ojo del
observador *[5]*.

Este efecto de los rayos de luz se traslada a líneas que convergen en un punto al
infinito, lo cual permite que el observador reconstruya la distancia relativa
entre los objetos. También existen otros tipos de perspectiva, como la mencionada
anteriormente, la curvilínea y otras con más puntos de fuga. Sin embargo, para
este ejercicio sólo se contempló la perspectiva lineal con un punto de fuga,
pues, aunada con otras claves monoculares, ayudaba a reforzar la percepción de
la profundidad.

- **Profundidad a partir de la expansión óptica:**

La profundidad a partir del movimiento, también conocida como "*depth from motion*"
en inglés, es una forma de percepción visual que se basa en la observación de la forma
en que los objetos se mueven en relación con el observador. A partir de esta información,
el cerebro puede determinar la velocidad, la dirección y la aceleración del movimiento de
los objetos, lo que le permite calcular la profundidad y la distancia de los objetos
en el mundo real *[5]*.

Dentro de la profundidad a partir del movimiento, puede encontrarse una clave monocular
aún más específica: la profunidad a partir de la expansión óptica. Esta pista visual
es utilizada para inferir la profundidad y la distancia a partir de la información
sobre cómo se expande un objeto en la retina, lo que le indica al cerebro que el objeto 
está más cerca en el espacio *[6]*. En consencuencia, este fenómeno otorga una sensación
de movimiento en dirección al observador debido al cambio de tamaño.

## Código y Resultados

De las claves monoculares que se detallaron anteriormente, se tomaron las dos primeras
para desarrollar un *sketch* semejante a este [*gif*](https://upload.wikimedia.org/wikipedia/commons/d/d7/Parallax_scroll.gif),
el cual es un ejemplo típico al hablar de claves monoculares. El resultado se puede ver
a continuación:

{{% /justify %}}

{{< details title="**Código completo**" open=false >}}
{{< highlight js >}}

let val1 = []; let val2 = []; let val3 = []

function setup() {
    createCanvas(400, 400)
    frameRate(30)
    for(let i = 0; i < 8; i++){
        append(val1, height - random(height/2, height))
        append(val2, height - random(height/4, 4*height/5))
        append(val3, height - random(20, 3*height/5))
    }
}

function draw() {
    background(255)
    for(let i = -1; i <= width; i+=1){
        stroke(100,150,255,85)
        rect(((frameCount + i) % (width+1)), val1[int(i/50)], 0, height)
    }
    for(let i = -1; i <= width; i++){
        stroke(50,100,200,170)
        rect(((frameCount*4 + i) % (width+1)), val2[int(i/50)], 0, height)
    }
    for(let i = -1; i <= width; i++){
        stroke(0,50,100,255)
        rect(((frameCount*8 + i) % (width+1)), val3[int(i/50)], 0, height)
    }
}

{{< /highlight >}} {{< /details >}}

{{< p5-iframe sketch="/showcase/sketches/monocular1.js" width="420" height="420">}}

{{% justify %}}

Como se puede evidenciar, en primer lugar se asignan unos valores aleatorios
entre ciertos rangos para definir las alturas de los "edificios". Luego, dentro
del **draw** se definen 3 ciclos **for**, uno para los edificios delanteros,
otro para los que van en medio y otro para los que van atrás. Por ejemplo, se tiene
que el ciclo para el último caso mencionado es el siguiente:

{{< highlight js >}}
for(let i = -1; i <= width; i+=1){
    stroke(100,150,255,85)
    rect(((frameCount + i) % (width+1)), val1[int(i/50)], 0, height)
}
{{< /highlight >}}

En primer lugar, se define el **stroke** correspondiente: en este caso
es un tono de azul claro con un nivel alto de transparencia. Los edificios del
medio tienen un color más oscuro y transparencia más baja, mientras que los
edificios delanteros poseen el tono más opaco y sin transparencia. Esto se hace,
justamente, para aplicar la clave monocular de perspectiva aérea.

Luego, se dibujan rectángulos sin ancho (es decir, líneas, pero usa la función
**rect** por practicidad) donde la posición en `x` está dada por la palabra reservada
**frameCount**: esto se hace para dar la sensación de movimiento y, adicionalmente,
se usa el operador módulo con el ancho del canvas para que se repita sucesivamente.
Como altura se le da uno de los valores aleatorios asignados en el **setup**.

Ahora, para la otra clave monocular contenida en esta parte del código, se tiene que 
en el ciclo **for** de los edificios posicionados en medio, el valor de **frameCount**
se cuadruplica, mientras que para los edificios posicionados al frente, este valor se
multiplica por 8. De tal forma se consigue que, entre más cerca estén al observador,
estos se muevan más rápido, lo cual es una aplicación directa del paralaje de movimiento.

En cuanto al segundo *sketch*, se buscó aplicar las otras dos claves monoculares descritas,
es decir, la perspectiva y la profundidad a partir de la expansión óptica. Para ello,
se tomó como punto de partida el siguiente [código](https://editor.p5js.org/chaski/sketches/9_-tPg7I4),
el cual dibuja una carretera estática.

Aprovechando la perspectiva que presentaba, se buscó la manera de animarlo al agrandar el tamaño
progresivamente, esto con el fin de dar la sensación de entrada a un túnel. El resultado se presenta
a continuación:

{{% /justify %}}

{{< details title="**Código completo**" open=false >}}
{{< highlight js >}}

function setup() {
    createCanvas(600, 400);
    frameRate(100)
    rectMode(CENTER)
}

function draw() {
    background(80,180,80);
    road(frameCount % (2*height))
}

function road(fc){
    fill(140, 180, 240)

    for(let sky = -10; sky >= -200; sky-=10) {
        rect(width / 2, sky + fc / 4, 100 * fc, fc / 4)
    }

    stroke("black")
    strokeWeight(1)

    fill(220, 255)
    triangle(300, -10, 0, 400, 0, 350);

    fill(220, 255)
    triangle(300, -10, 600, 400, 600, 350);

    fill(220, 255)
    ellipse(300, -10 + fc/10, 63*fc/100);
    rect(width/2, -10 + fc/4, 63*fc/100, fc/4);

    fill(0, 255)
    ellipse(300, -10 + fc/10, 55*fc/100);
    rect(width/2, -10 + fc/4, 55*fc/100, fc/4);

    fill(70)
    triangle(300, -10, 600, 400, 0, 400);

    fill(155, 200)
    triangle(300, -10, 570, 400, 30, 400);

    stroke(255)
    fill(255)
    for(let i=15; i>0; i-=2){
        if (i <= 1){
            i+= 0.3
        }
        quad(width/2 - fc/80, i*fc/5, width/2 + fc/80, i*fc/5, width/2 + fc/200, (i-1)*fc/5, width/2 - fc/200, (i-1)*fc/5)
    }

    noStroke()
}

{{< /highlight >}} {{< /details >}}

{{< p5-iframe sketch="/showcase/sketches/monocular2.js" width="620" height="420">}}

{{% justify %}}

En síntesis, se probaron varios valores por ensayo y error hasta que la animación
fuese fluida. En este caso, el valor `frameCount % (2*height)` se seleccionó dado
que permite ver la animación hasta un punto en el que la figura del túnel ocupa la
mayor parte del espacio. Este mismo valor (que dentro la función se denomina como **fc**)
es el que se emplea para ir variando el tamaño del ancho y el alto de los elementos.
Por ejemplo, se tiene el siguiente ciclo:

{{< highlight js >}}
for(let i=15; i>0; i-=2){
    if (i <= 1){
        i+= 0.3
    }
    quad(width/2 - fc/80, i*fc/5, width/2 + fc/80, i*fc/5, width/2 + fc/200, (i-1)*fc/5, width/2 - fc/200, (i-1)*fc/5)
}
{{< /highlight >}}

Esta porción de código es la que dibuja las líneas en la carretera, de forma que se ven más grandes entre más cerca
están al borde inferior del *canvas*. En los puntos ubicados a la izquierda del paralelogramo, se resta una razón que
lleva la partícula **fc**, mientras que en los puntos ubicados a la derecha se suma: con esto se logra que el tamaño
se amplíe ya que los puntos se mueven en direcciones opuestas a la misma proporción.

## Conclusiones y Trabajo futuro

- En síntesis, se puede evidenciar que el uso de claves monoculares puede ser muy útil a la hora de realizar
animaciones en 2D, puesto que otorgan sensación de movimiento y profunidad de una manera sencilla.
- Es evidenciable que, cuando se aplican varias claves monoculares, el efecto de percepción de la profundidad
es mayor. A veces, incluso, termina siendo inevitable que se empleen dos o más claves monoculares, tal como ocurre
con el segundo *sketch*: para dar la sensación de que un elemento se acerca, este debe crecer proporcionalmente.
Lo anterior conlleva una sensación de perspectiva, dado que si se lleva el trazo de las posiciones del objeto cuyo
tamaño cambia, esto dará como resultado un par de líneas que tienden a un punto en el infinito.
- Como trabajo futuro, se podría hacer uso de otras claves monoculares que, al integrarlas con las presentadas,
acrecenten la sensación de percepción de la profundidad. Así mismo, se podrían evaluar las diferencias de
percepción entre el ojo izquierdo y el derecho en cuanto a las claves monoculares y, a partir de los resultados,
buscar la mejor forma en que dichas claves pueden integrarse en un sketch 2D.

## Referencias

#### *[1]* J. P. Charalambos, "Depth perception". Visual Computing, Feb. 2023. <https://visualcomputing.github.io/docs/visual_illusions/depth_perception/>
#### *[2]* A. E. Roy and D. Clarke, "Astronomy: Principles and Practice," 4th ed., CRC Press, 2003.
#### *[3]* B. J. Rogers and M. E. Graham, "Motion Parallax as an Independent Cue for Depth Perception," Perception, vol. 8, no. 2, pp. 125-34, 1979. doi: 10.1068/p080125.
#### *[4]* J. Murray. "Some perspectives on visual depth perception," ACM SIGGRAPH Computer Graphics, vol. 28, no. 2, pp. 155-157, 1994, doi: 10.1145/178951.178985.
#### *[5]* S. Schwartz, "Visual Perception: A Clinical Orientation (Fourth Edition)," McGraw-Hill Education, 1994.
#### *[6]* M.T. Swanston and W.C. Gogel, "Perceived size and motion in depth from optical expansion," Perception & Psychophysics, vol. 39, pp. 309-326, 1986. doi: 10.3758/BF03202998.

{{% /justify %}}