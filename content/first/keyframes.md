# Temporal Coherence

{{% justify %}}

## Introducción

En esta sección se discute, en primer lugar, acerca del fenómeno de coherencia temporal
y la estrecha relación que guarda con las animaciones y, en particular, con el uso de
fotogramas clave (*keyframes*).

Después, a manera de ejercicio práctico, se desarrolla una animación por *keyframes*
empleando la librería **nub** en el lenguaje **Processing**. Para ello, se realiza
un estudio detallado de esta, con el fin de comprender su funcionamiento y generar, 
así, un producto donde el posicionamiento de sus fotogramas guarde una intención
determinada: es decir, donde este no se lleve a cabo de manera aleatoria.

Finalmente, se discuten posibles aplicaciones de los conceptos aprendidos, así
como el trabajo futuro que se puede llevar a cabo tomando el ejercicio desarrollado
como punto de partida.

## Marco Teórico

La coherencia temporal es un fenómeno visual presente en toda la naturaleza:
de acuerdo con la teoría, un color percibido de un punto en una región de interés
tiende a variar más según el tiempo transcurrido entre dos momentos dados *[1]*.

Por otra parte, en animación y gráficos por computadora, se tiene que los *keyframes*
son un conjunto de fotogramas que representan los momentos clave de una animación.
Los keyframes son los fotogramas en los que se definen los cambios en la posición,
la rotación, la escala, la opacidad y otros atributos de los objetos en la animación.
En general, suelen utilizarse algoritmos de interpolación para crear fotogramas
intermedios que conecten los keyframes *[2]*.

Con base en lo anterior, los *keyframes* son esenciales para la coherencia temporal de la animación,
pues se relacionan directamente con su capacidad para mantener una secuencia de fotogramas que sea
suave y coherente a lo largo del tiempo. Si los *keyframes* están mal ubicados o son inconsistentes, 
la animación puede tener errores de coherencia temporal, como saltos o sacudidas entre fotogramas.

Una vez que es claro el concepto, entra a colación el uso de la libería **nub**. Esta es de código
abierto y fue cuenta con marcos de interacción, visualización, animación, y admite técnicas avanzadas de renderizado
(tanto en como fuera de pantalla): por ejemplo, el recorte de frustum de visualización *[3]*, que se
refiere a la visualización de una escena desde diferentes ángulos empleando una cámara vortual, tal
como ocurre en el presente ejercicio.

A grandes rasgos, para desarrollar una animación empleando esta librería se debe instaciar la escena
y los nodos. Luego de las configuraciones iniciales, el proceso consiste en ir variando la posición,
la orientación, la escala y demás atributos entre cada *keyframe*: esto es lo que permite que los nodos
se muevan dentro de la escena. Al ojo de la escena también se le pueden aplicar las mismas transformaciones, 
lo cual da la sensación de movimiento de la cámara al desplegar su animación por fotogramas clave.

La posición se establece mediante vectrores de tres dimensiones, los cuales dan las coordenadas para los
ejes `x`, `y` y `z` en el plano.

La rotación se establece mediante cuaterniones: estos elementos matemáticos, que fueron descubiertos por
William Rowan Hamilton en 1843, constan de cuatro componentes: una parte real y tres partes imaginarias *[4]*.
Se pueden escribir como `q = w + xi + yj + zk`, donde `w`, `x`, `y` y `z` son números reales, e `i`, `j`
y `k` son unidades imaginarias que satisfacen las siguientes relaciones:

`i² = j² = k² = ijk = -1`

Se tiene que, a diferencia de los números complejos, los cuaterniones poseen tres partes imaginarias
Esto permite una representación más completa de las rotaciones tridimensionales que los números
complejos no pueden proporcionar, ya que sólo poseen dos partes imaginarias.

## Código y Resultados

A continuación, se describe el ejercicio desarrollado y se destacan las piezas de código
más relevantes, las cuales demuestran los aportes efectuados sobre el ejemplo disponible.
Para esta sección en particular, se adjunta un vídeo de demostración, dado que este ejercicio
fue hecho en **Processing** y no en **P5js**.

<video controls>
  <source src="../assets/keyframesDemo.mp4" type="video/mp4">
</video>

Como se puede evidenciar, el ejercicio desarrollado consiste en una animación que muestra un
bosquejo de la rotación de la Tierra, al igual que tanto la rotación como la traslación de su satélite
(la Luna). Haciendo uso del mouse, se pueden alterar los *keyframes* de la Luna lo que, en consecuencia,
altera la rotación natural que trae por defecto; también se puede mover el ángulo de la cámara.

Para la construcción de los objetos (Tierra y Luna), se crearon los nodos como esferas y se texturizaron
a partir de imágenes en línea como se evidencia a continuación:

{{< highlight java >}}

earth = loadImage("https://b3d.interplanety.org/wp-content/upload_content/2016/08/01-3.jpg");
moon = loadImage("https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_1k.jpg");

(...)

pshape = createShape(SPHERE, 80);
pshape2 = createShape(SPHERE, 20);
pshape.setTexture(earth);
pshape2.setTexture(moon);

{{< /highlight >}}

Para definir los movimientos de rotación y traslación se definió el siguiente ciclo **for**:

{{< highlight java >}}

shape2.setPosition(120,0,0);
int x = 40; int y = 80;

for (int i = 0; i < 8; i++) {
    shape.addKeyFrame(Node.AXES | Node.SHAPE, 4000);
    shape.rotate(new Quaternion(0,1,0,0));

    shape2.addKeyFrame(Node.AXES | Node.SHAPE | Node.HUD, 2000);
    shape2.translate(x*(i < 4 ? -1 : 1), 0, y*(i > 1 && i < 6 ? -1 : 1));
    shape2.rotate(new Quaternion(0,1,0,0));
    
    if (i % 2 == 0){
      int tmp = x; x = y; y = tmp;
    }
}

{{< /highlight >}}

Aquí se evidencia cómo se instancia un cuaternión cuyo único valor distinto de cero es el segundo
a la hora de rotar la Tierra: con ello se consigue que rote únicamente alrededor del eje `y`.
En cuanto a la Luna, aparte de la rotación (que sigue la misma lógica), se lleva a cabo una traslación
definida por condiciones.

Para lograr lo anterior, se estudiaron, mediante ensayo y error, configuraciones matemáticas que
dieran la sensación de movimiento circular (pues en realidad sólo se desplaza en línea recta). 
Entonces, se definieron 8 posiciones (adelante, atrás, izquierda, derecha y las 4 diagonales).
La Luna arranca en la posición `(120,0,0)`, es decir, a la derecha de la Tierra, y se desplaza en
relación `80` y `40` en los ejes `x` y `y` para ocupar cada una de las posiciones subsecuentes.

Es así que se inicializan dos variables con dichos valores y, cada vez que el contador del ciclo es par,
estos valores se intercambian. La primera coordenada siempre será negativa cuando `i < 4`, porque será
cuando la Luna se desplace hacia la izquierda; después de ello será positiva porque se desplazará a la
derecha. El mismo razonamiento aplica cuando se desplaza hacia atrás y hacia adelante: el primer caso
se dará desde la segunda iteración hasta la sexta y el otro se dará en los escenarios opuestos.

Por otra parte, algunas teclas permiten alterar los *keyframes* del ojo de la escena. Dicha configuración
está dada de la siguiente manera:

- **Vista frontal (*FRONT*):** tecla "F".
- **Vista posterior (*BACK*):** tecla "B".
- **Vista lateral izquierda (*LEFT*):** tecla "L".
- **Vista lateral derecha (*RIGHT*):** tecla "R".
- **Vista superior (*UP*):** tecla "U".
- **Vista inferior (*DOWN*):** tecla "D".

Esto se consigue a partir de la función **keyPressed()**, la cual se detalla a continuación:

{{< highlight java >}}

void keyPressed() {
    if (key == ' ') {
        shape2.toggleHint(Node.KEYFRAMES);
    }
    else {
        scene.eye().removeKeyFrames();
        scene.eye().addKeyFrame(Node.CAMERA | Node.BULLSEYE, 1000);
        if (key == 'u') {
            scene.eye().setPosition(0,-300,0);
            scene.eye().setOrientation(1,0,0,1);
        }
        if (key == 'l') {
            scene.eye().setPosition(-300,0,0);
            scene.eye().setOrientation(0,-1,0,1);
        }
        if (key == 'r') {
            scene.eye().setPosition(300,0,0);
            scene.eye().setOrientation(0,1,0,1);
        }
        if (key == 'd') {
            scene.eye().setPosition(0,300,0);
            scene.eye().setOrientation(-1,0,0,1);
        }
        if (key == 'b') {
            scene.eye().setPosition(0,0,-300);
            scene.eye().setOrientation(0,1,0,0);
        }
        if (key == 'f') {
            scene.eye().setPosition(0,0,300);
            scene.eye().setOrientation(0,0,0,0);
        }
        scene.eye().addKeyFrame(Node.CAMERA | Node.BULLSEYE, 1000);
        scene.eye().animate();
    }
}

{{< /highlight >}}

Se puede ver que la cámara toma una distancia de `300` respecto al centro para poder
apreciar toda la animación: este valor se ubica en la posición correspondiente a la
vista que se desea (por ejemplo, para ver desde arriba, se ubica su negativo
en la posición `y`). Para la rotación se indica sobre qué eje se desea el movimiento
de la cámara y los demás ejes se dejan en cero; en cuanto al cuatro valor,
cuando este equivale a `1`, el giro resulta ser de `90°`, mientras
que si equivale a `0`, el giro resulta ser de `180°`.

El código completo se encuentra en el siguiente desplegable y, de manera posteior,
se encuentran dos botones en caso de que se desee descargar el programa como un archivo
ejecutable, dependiendo del sistema operativo, para interactuar con este desde la máquina local.

{{< details title="**Código completo**" open=false >}}
{{< highlight java >}}
import nub.primitives.*;
import nub.core.*;
import nub.processing.*;

Scene scene;
Node shape;
Node shape2;

String renderer = P3D;
float speed = 2;
PImage night = loadImage("https://images.hdqwalls.com/download/dark-starry-sky-stars-4k-9m-2560x1700.jpg");

void setup() {
    size(1000, 800, renderer);
    scene = new Scene(this, 150);
    
    PShape pshape;
    PShape pshape2;
    PImage earth;
    PImage moon;
    earth = loadImage("https://b3d.interplanety.org/wp-content/upload_content/2016/08/01-3.jpg");
    moon = loadImage("https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_1k.jpg");
    night.resize(1000,800);
    
    noStroke();
    pshape = createShape(SPHERE, 80);
    pshape2 = createShape(SPHERE, 20);
    pshape.setTexture(earth);
    pshape2.setTexture(moon);
    
    shape = new Node(pshape);
    shape2 = new Node(pshape2);
    shape.setMinMaxScalingFilter(0.5, 1.0);
    shape2.setMinMaxScalingFilter(0.5, 1.0);
    
    scene.eye().disableHint(Node.KEYFRAMES);
    shape.disableHint(Node.KEYFRAMES);
    shape2.enableHint(Node.KEYFRAMES, Node.AXES, 1, color(255, 255, 255), 2);
    
    shape.setAnimationRecurrence(true);
    shape2.setAnimationRecurrence(true);
    
    shape2.setPosition(120,0,0);
    int x = 40; int y = 80;
    
    for (int i = 0; i < 8; i++) {
        shape.addKeyFrame(Node.AXES | Node.SHAPE, 4000);
        shape.rotate(new Quaternion(0,1,0,0));
        
        shape2.addKeyFrame(Node.AXES | Node.SHAPE | Node.HUD, 2000);
        shape2.translate(x*(i < 4 ? -1 : 1), 0, y*(i > 1 && i < 6 ? -1 : 1));
        shape2.rotate(new Quaternion(0,1,0,0));
        
        if (i % 2 == 0){
          int tmp = x; x = y; y = tmp;
        }
    }
    
    shape2.addKeyFrame(Node.AXES | Node.SHAPE | Node.HUD, 2000);
    
    shape.resetScalingFilter();
    shape2.resetScalingFilter();
    shape.animate();
    shape2.animate();
}

void draw() {
    background(night);
    scene.render();
}

void keyPressed() {
    if (key == ' ') {
        shape2.toggleHint(Node.KEYFRAMES);
    }
    else {
        scene.eye().removeKeyFrames();
        scene.eye().addKeyFrame(Node.CAMERA | Node.BULLSEYE, 1000);
        if (key == 'u') {
            scene.eye().setPosition(0,-300,0);
            scene.eye().setOrientation(1,0,0,1);
        }
        if (key == 'l') {
            scene.eye().setPosition(-300,0,0);
            scene.eye().setOrientation(0,-1,0,1);
        }
        if (key == 'r') {
            scene.eye().setPosition(300,0,0);
            scene.eye().setOrientation(0,1,0,1);
        }
        if (key == 'd') {
            scene.eye().setPosition(0,300,0);
            scene.eye().setOrientation(-1,0,0,1);
        }
        if (key == 'b') {
            scene.eye().setPosition(0,0,-300);
            scene.eye().setOrientation(0,1,0,0);
        }
        if (key == 'f') {
            scene.eye().setPosition(0,0,300);
            scene.eye().setOrientation(0,0,0,0);
        }
        scene.eye().addKeyFrame(Node.CAMERA | Node.BULLSEYE, 1000);
        scene.eye().animate();
    }
}

void mouseDragged() {
    if (mouseButton == LEFT)
        scene.spin();
    else if (mouseButton == RIGHT)
        scene.shift();
}

void mouseMoved() {
    scene.updateTag();
}
{{< /highlight >}} {{< /details >}}

<div style="display : flex">
<a href="https://drive.google.com/file/d/1gNqdQps26zfTv-orBPSpRv9ADPdNZ6f4/view?usp=share_link" target="_blank"> <img src="../assets/windowsButton.png" width="200px"> </a>
<a style="margin-left : 20px" href="https://drive.google.com/file/d/1JT51vdTpcALPSNR8O-INM0800labZqhR/view?usp=share_link" target="_blank"> <img src="../assets/linuxButton.png" width="200px"> </a>
</div>

## Conclusiones y Trabajo futuro

- El uso de la libería **nub** permite una comprensión más fácil y práctica del concepto de los cuaterniones,
pues se logró evidenciar que las tres primeras posiciones indicaban sobre  cuál de los 3 ejes (`x`, `y`
o `z`) se hacía la rotación, mientras que el último valor permitía variar el ángulo.
- Aunque es posible generar una animación aleatorizando las posiciones, rotaciones y escalas de cada
*keyframe*, se pudo comprobar que, con un estudio minucioso del manejo de vectores y cuaterniones, 
el programador puede definir con facilidad algunas transformaciones determinadas para que la animación
tenga un propósito o cuente una historia.
- Dentro de las posibilidades de trabajo futuro, una de ellas consistiría en aprovechar los hallazgos
encontrados para hacer modelos de interés científico, como lo pueden ser el sistema solar, los átomos,
las sociedades artificiales, entre muchos otros. Sin embargo, para lograrlo habría que buscar una mejor
manera de definir las trayectorias circulares o elípticas en reemplazo a las traslaciones en línea recta.
- Otra posible aplicación a futuro podría ser desarrollar una librería semejante para **P5js**, dado que el
lenguaje **Processing** no cuenta con un editor web oficial (sólo se consiguen algunos que, incluso, advierten
que ya no es tan utilizado y donde el manejo de liberías está lleno de dificultades). Esto permitiría aprovechar
nociones matemáticas y de coherencia temporal para crear animaciones con un acabado profesional en javascript.

## Referencias
#### *[1]* J. P. Charalambos, "Temporal Coherence," Visual Computing, Feb. 2023. <https://visualcomputing.github.io/docs/visual_illusions/temporal_coherence/>
#### *[2]* R. Parent, "Computer Animation: Algorithms and Techniques," 2nd ed. San Francisco, CA, USA: Morgan Kaufmann Publishers Inc., 2012.
#### *[3]* J. P. Charalambos, "nub: A library for processing large datasets in parallel," Github, 2021. <https://github.com/VisualComputing/nub>
#### *[4]* K. Shoemake, "Animating rotation with quaternion curves," in ACM SIGGRAPH Computer Graphics, vol. 19, no. 3, pp. 245-254, Jul. 1985, doi: 10.1145/325165.325242.

{{% /justify %}}