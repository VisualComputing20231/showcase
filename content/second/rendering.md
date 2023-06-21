# Rendering

{{% justify %}}

## Introducción

Para esta sección se llevó a cabo un estudio de diversos algoritmos de determinación de superficies ocultas, profundizando en el
algoritmo del ordenamiento de pintado y de cómo este se puede aplicar en un sketch 3D.

## Marco Teórico

Los algoritmos de determinación de superficies ocultas (Hidden Surface Determination Algorithms en inglés) son técnicas utilizadas en gráficos por computadora para determinar qué superficies de una escena 3D son visibles y cuáles están ocultas detrás de otras superficies. Estos algoritmos son fundamentales para generar imágenes realistas al renderizar escenas complejas.

Cuando se representan objetos 3D en una escena, es posible que algunas partes de los objetos estén ocultas a la vista debido a la intersección y superposición de los objetos. Los algoritmos de determinación de superficies ocultas resuelven este problema al identificar y eliminar las superficies que no son visibles desde el punto de vista del observador.

Existen diferentes enfoques y algoritmos utilizados para la determinación de superficies ocultas, algunos de los cuales incluyen:

- **Algoritmo del Z-buffer (Z-buffer algorithm):** Este es uno de los métodos más comunes y sencillos. Se utiliza un búfer de profundidad (Z-buffer) para almacenar la información de la profundidad de cada píxel en la escena. Durante el proceso de renderizado, se compara la profundidad de cada objeto y se mantiene la información del objeto más cercano en el búfer de profundidad. Esto permite renderizar los objetos más cercanos correctamente y descartar los objetos ocultos.

- **Algoritmo de eliminación de superficies ocultas (Back-face culling):** Este algoritmo se basa en la eliminación de las superficies que están de espaldas al observador. Utiliza la orientación de las normales de las caras de los objetos para determinar si están orientadas hacia el observador o hacia el interior del objeto. Las superficies orientadas hacia el observador se consideran visibles y se renderizan, mientras que las superficies orientadas hacia el interior se descartan.

- **Binary Space Partitioning (BSP):** Es un algoritmo utilizado para dividir y organizar eficientemente el espacio tridimensional en un árbol binario. El algoritmo parte de un espacio inicial y lo divide en dos subespacios mediante un plano. Este proceso de subdivisión se repite recursivamente hasta que cada región del espacio contiene un conjunto de polígonos no superpuestos. El árbol binario resultante permite una representación jerárquica del espacio y se utiliza para acelerar las operaciones de determinación de superficies ocultas y renderizado en tiempo real.

- **Warnock Algorithm:** Este algoritmo, también conocido como el algoritmo de subdivisión recursiva de Warnock, se utiliza para renderizar escenas 2D y determinar la visibilidad de las regiones de una imagen. El algoritmo divide la imagen en regiones más pequeñas y decide si cada región está completamente dentro, completamente fuera o intersecta un objeto en la escena. La subdivisión recursiva continúa hasta que todas las regiones estén completamente dentro o fuera de los objetos. El algoritmo de Warnock se utiliza principalmente en renderizado de imágenes y ha sido utilizado históricamente en gráficos por computadora.

- **Ray Casting:** Es una técnica utilizada para renderizar gráficos en 3D y simular la interacción de los rayos de luz con los objetos de una escena. El algoritmo lanza rayos desde una fuente de luz o desde la cámara a través de cada píxel de la imagen. Estos rayos se intersectan con los objetos de la escena, y se calcula la interacción de los rayos con los materiales de los objetos para determinar el color y la apariencia de cada píxel en la imagen final. El ray casting se utiliza para generar imágenes realistas y permite efectos como sombras, reflexiones y refracciones.

- **Algoritmo de corte de líneas (Line Clipping):** Este algoritmo se utiliza para recortar líneas que están parcial o totalmente fuera de la ventana de visualización. Ayuda a eliminar segmentos de línea que no son visibles y solo muestra las partes visibles dentro del área de visualización.

- **Algoritmo de eliminación de superficies ocultas por área de recorte (Area Clipping):** Este algoritmo se basa en recortar las regiones de las superficies que están completamente fuera de la ventana de visualización. Permite eliminar completamente las superficies ocultas antes de pasar a los pasos de renderizado, lo que ahorra tiempo de procesamiento.

- **Algoritmo del plano de separación (Plane-Sweep):** Este algoritmo se utiliza para determinar qué polígonos se intersectan en una escena 3D. Se basa en mover un plano virtual a través de la escena y rastrear las intersecciones de los polígonos con el plano en un orden determinado. Permite identificar y eliminar superficies ocultas mediante el análisis de las intersecciones de los polígonos.

- **Algoritmo de detección de fronteras (Boundary Detection):** Este algoritmo se utiliza para identificar las fronteras visibles entre los objetos de una escena. Examina las intersecciones de las aristas de los polígonos para determinar qué segmentos de línea son visibles y, por lo tanto, representan las fronteras entre objetos.

- **Algoritmo de eliminación de superficies ocultas basado en rasterización (Rasterization-based Hidden Surface Removal):** Este enfoque se utiliza en el proceso de rasterización y renderizado en tiempo real. Se basa en el orden de dibujado de los polígonos en función de su distancia a la cámara. Los polígonos se dibujan en orden desde los más cercanos a los más lejanos, y se descartan aquellos que están completamente ocultos por polígonos previamente dibujados.

- **Algoritmo del ordenamiento de pintado (Painter's algorithm):** Es un método utilizado en gráficos por computadora para renderizar objetos tridimensionales en una escena 3D. Su objetivo principal es determinar el orden en el que se deben dibujar los objetos en función de su distancia desde la cámara y su posición relativa en la escena.

    El algoritmo se basa en el principio de que los objetos más alejados de la cámara deben dibujarse primero, seguidos por los objetos que se encuentran más cerca. Esto se debe a que los objetos más cercanos pueden ocultar total o parcialmente los objetos más alejados. Al seguir este orden, se asegura que los objetos visibles se dibujen correctamente y que los objetos ocultos queden detrás de ellos.

    El proceso del algoritmo del ordenamiento de pintado se puede resumir en los siguientes pasos:

  1. **Determinación de la distancia:** Se calcula la distancia desde la cámara a cada objeto de la escena. Esto se puede lograr utilizando técnicas como el cálculo de la distancia euclidiana desde la cámara hasta el centro del objeto o utilizando información de profundidad almacenada en un búfer de profundidad (Z-buffer).

  2. **Ordenamiento:** Los objetos se ordenan en función de su distancia, de manera que los objetos más lejanos se dibujan primero y los objetos más cercanos se dibujan al final.

  3. **Renderizado:** Los objetos se dibujan en el orden determinado por el paso anterior. Cada objeto se renderiza, teniendo en cuenta el efecto de transparencia o superposición que pueda tener con otros objetos ya dibujados.

    El principal desafío del algoritmo del ordenamiento de pintado es lidiar con los casos de intersección entre objetos. Cuando dos objetos se intersecan entre sí, puede haber partes de un objeto que estén ocultas por otro objeto. En estos casos, se pueden aplicar técnicas adicionales, como el recorte de polígonos (clipping) o el uso de información de profundidad precisa, para determinar qué partes de los objetos deben dibujarse y qué partes deben ser ocultas.

    Es importante destacar que el algoritmo del ordenamiento de pintado puede tener limitaciones en escenas con intersecciones complejas o cuando los objetos no tienen una representación convexa. En tales casos, pueden ser necesarios algoritmos más avanzados, como los algoritmos de partición espacial (como octree o BVH) o los algoritmos de eliminación de superficies ocultas basados en rasterización, para lograr una representación precisa de la escena en 3D.

## Código y Resultados

Se optó por profundizar en el último algoritmo debido a su facilidad de abstracción. Por tanto, a continuación se deja el código de la replicación que hace Dave Pagurek [2] de
portada de un álbum de la banda "Muse" en una escena 3D. Para ver la ejecución, copie y pegue el código dentro del widget. Luego oprima el botón "play".

{{% /justify %}}

{{< highlight js>}}
/*

A 3D remake of the album art for Muse's Origin of Symmetry
Original album art by William Eagar

This sketch is by Dave :)

I manually sort the tuning forks by Z so that I can draw them one at a time using
the 2D canvas's blur filter to imitate depth of field.

*/

const maxBlur = 15
const shadowLength = 200
const handleHeight = 200
const forkWidth = 80
const forkHeight = 95
const thickness = 8

let webglCanvas
let forks = []
function setup() {
    createCanvas(400, 400)
    pixelDensity(1)
    webglCanvas = createGraphics(width + 2 * maxBlur, height + 2 * maxBlur, WEBGL)
    webglCanvas.setAttributes({ antialias: true })
    webglCanvas.pixelDensity(pixelDensity())

    genForks()
}

function genForks() {
    forks = []
    for (let i = 0; i < 10; i++) {
        forks.push({
            x: random(-width, width),
            z: random(-width, width),
            rotation: random(TWO_PI),
        })
    }
}

function mousePressed() {
    genForks()
}

let lastScene = 0

function draw() {
    const scene = floor(millis() / 10000)
    if (scene !== lastScene) {
        genForks()
        lastScene = scene
    }

    background('#f5bf42')

    fill(255)
    noStroke()
    drawingContext.filter = `blur(${(2 * pixelDensity()).toFixed(2)}px)`
    rect(-50, height * 0.45, width + 100, height)

    imageMode(CENTER)
    translate(width / 2, height / 2)

    const sceneRotation = millis() / 20000

    const transform = new DOMMatrix()
    transform.rotateAxisAngleSelf(0, 1, 0, sceneRotation / PI * 180)
    for (const fork of forks) {
        const transformed = new DOMPoint(fork.x, 0, fork.z).matrixTransform(transform)
        fork.cameraDepth = transformed.z
    }
    forks.sort((a, b) => a.cameraDepth - b.cameraDepth)

    // Shadows
    webglCanvas.clear()
    webglCanvas.reset()
    webglCanvas._renderer.GL.disable(webglCanvas._renderer.GL.DEPTH_TEST)
    for (const { x, z } of forks) {
        webglCanvas.push()
        webglCanvas.translate(0, 0, -400)
        webglCanvas.rotateY(sceneRotation)
        webglCanvas.translate(x, height * 0.3, z)

        webglCanvas.noStroke()
        webglCanvas.beginShape(TRIANGLE_STRIP)
        webglCanvas.fill(0, 0, 0, 255)
        webglCanvas.vertex(thickness / 2, 0, thickness / 2)
        webglCanvas.vertex(thickness / 2, 0, -thickness / 2)
        webglCanvas.fill(0, 0, 0, 0)
        webglCanvas.vertex(-shadowLength, 0, thickness / 2)
        webglCanvas.vertex(-shadowLength, 0, -thickness / 2)
        webglCanvas.endShape()
        webglCanvas.pop()
    }
    image(webglCanvas, 0, 0)

    webglCanvas._renderer.GL.enable(webglCanvas._renderer.GL.DEPTH_TEST)
    for (const { x, z, cameraDepth, rotation } of forks) {
        webglCanvas.clear()
        webglCanvas.reset()
        webglCanvas.push()
        webglCanvas.translate(0, 0, -400)
        webglCanvas.rotateY(sceneRotation)
        webglCanvas.translate(x, height * 0.3, z)
        webglCanvas.rotateY(rotation)

        webglCanvas.fill(255)
        webglCanvas.stroke(0)
        webglCanvas.strokeWeight(2)
        webglCanvas.push()
        webglCanvas.translate(0, -handleHeight / 2, 0)
        webglCanvas.box(thickness, handleHeight, thickness)
        webglCanvas.pop()

        webglCanvas.push()
        webglCanvas.translate(0, -handleHeight - thickness / 2, 0)
        webglCanvas.box(forkWidth, thickness, thickness)
        webglCanvas.pop()

        for (const side of [-1, 1]) {
            webglCanvas.push()
            webglCanvas.translate(
                side * (forkWidth - thickness) / 2,
                -handleHeight - thickness - forkHeight / 2,
                0
            )
            webglCanvas.box(thickness, forkHeight, thickness)
            webglCanvas.pop()
        }

        webglCanvas.pop()

        const blur = Math.min(
            maxBlur,
            Math.abs(cameraDepth / 250)
        ) * pixelDensity()
        drawingContext.filter = `blur(${blur.toFixed(2)}px)`
        image(webglCanvas, 0, 0)
    }
}
{{< /highlight >}}

{{< p5-widget autoplay=false height="500" width="560" ver="1.6.0" >}}
  // Copie y pegue el código aquí
{{< /p5-widget >}}

{{% justify %}}

Dado que el ejercicio consistía, para esta sección, en estudiar uno de los algoritmos, no se desarrolló una aplicación, sino que se lleva a cabo un
análisis de un código desarrollado por un tercero. Este código es un sketch en p5.js que recrea la portada del álbum "Origin of Symmetry" de la banda Muse en 3D.
El objetivo principal es dibujar una serie de diapasones sintonizadores de forma tridimensional y aplicar efectos visuales como sombras y desenfoque para simular profundidad y campo de visión.

El sketch comienza con la inicialización de las variables y la configuración del lienzo de dibujo. Luego, se define la función `genForks()` que se utiliza para generar la posición y la rotación aleatoria de los diapasones.

La función `setup()` establece el lienzo principal y crea un lienzo adicional en 3D llamado `webglCanvas`. Se configura el antialiasing y la densidad de píxeles para el lienzo en 3D.

El evento `mousePressed()` llama a la función `genForks()` cuando se hace clic en el lienzo, lo que genera una nueva disposición aleatoria de los diapasones.

La función `draw()` se ejecuta continuamente y se encarga de renderizar la escena en cada fotograma. Comienza estableciendo el color de fondo y aplicando un desenfoque a un rectángulo para simular el efecto de desenfoque de campo.

A continuación, se realiza el renderizado de los diapasones. Se define una matriz de transformación que aplica una rotación basada en el tiempo para la escena en su conjunto. Luego, se calcula la profundidad de la cámara para cada diapasón
y se ordenan según su profundidad en relación con la cámara. Después, se crea un lienzo adicional en 3D llamado `webglCanvas` para renderizar las sombras de los diapasones. Se dibujan las sombras utilizando formas primitivas y se aplica una
transformación para ajustar su posición y rotación en la escena.

Finalmente, se renderizan los diapasones principales. Se aplica una serie de transformaciones para posicionar y rotar cada diapasón en la escena. Se dibujan las partes individuales de los diapasones utilizando primitivas como cajas y se aplica
un efecto de desenfoque en función de la profundidad de la cámara para simular el enfoque y la sensación de profundidad.

Lo más destacable del código, respecto al tema de estudio de algoritmos de determinación de superficies ocultas, es que cumple con los pasos del algoritmo del ordenamiento de pintado. A saber:

1. **Determinación de la distancia:** En el bucle `for (const fork of forks)`, se calcula la posición de cada diapasón en relación con la cámara y se almacena en la propiedad `cameraDepth` del objeto `fork`.
Esto se logra mediante la transformación de la posición del diapasón utilizando una matriz de transformación en el espacio tridimensional.

2. **Ordenamiento:** Después de calcular las distancias, se realiza el ordenamiento de los diapasones en función de su propiedad `cameraDepth` utilizando el método `sort()` en la siguiente línea:

    ``forks.sort((a, b) => a.cameraDepth - b.cameraDepth)``

    Esto garantiza que los diapasones se dibujen en orden ascendente de profundidad de la cámara, desde los más alejados hasta los más cercanos.

3. **Renderizado:** El renderizado de los diapasones se realiza dentro del bucle `for (const { x, z, cameraDepth, rotation } of forks)`.
Cada diapasón se dibuja en función de su posición, rotación y profundidad de la cámara. Se utilizan diversas funciones para dibujar los componentes de los diapasones, como cajas (`box()`) y formas (`beginShape()` y `endShape()`).
La función `image()` se utiliza para renderizar los diapasones en el lienzo principal.

En resumen, el código refleja los pasos del algoritmo de determinación de superficies ocultas al calcular las distancias desde la cámara, ordenar los objetos en función de esas distancias y realizar el renderizado en el orden adecuado.

## Conclusiones y Trabajo futuro

- En general, aunque el desarrollo de sketches en 3D no se enfque específicamente en la determinación de superficies ocultas, estos siguen una estructura que reflejan los pasos clave de un algoritmo determinado de forma implícita.
  Por ejemplo, aquí se pudo evidenciar la determinación de la distancia, el ordenamiento y el renderizado, lo cual permite deducir que se emplea un algoritmo de ordenamiento de pintado para el desarrollo de la escena.
  Esta labor puede llevarse a cabo con otros sketches para determinar cómo están implícitos otros algoritmos de determinación de superficies ocultas en ellos.
- En compañía con los algoritmos, es importante que se apliquen efectos visuales como sombras y desenfoque para simular la profundidad y el campo de visión en la escena. También se puede hacer uso de claves monoculares
  y otras estrategias para lograr dicho propósito.
- Como trabajo futuro se podría profundizar en los demás algoritmos, evaluar distintos sketches y realizar una comparativa en cuanto al consumo de recursos computacionales, fiabilidad de la escena, entre otros.
  Incluso, sería interesante ver cuál de estos algoritmos es el más utilizado y con qué otros efectos visuales se suele acompañar.
- Otra propuesta de trabajo futuro consiste en desarrollar un sketch 3d que use el algoritmo de ordenamiento de pintado, para luego volverlo a desarrollar empleando
  un algoritmo distinto con el fin de ver qué cosas cambiarían a nivel de código.

## Referencias

#### *[1]* J. P. Charalambos, "Rendering". Visual Computing, May. 2023. <https://visualcomputing.github.io/docs/rendering/>
#### *[2]* D. Pagurek, "Depth of field in p5.js". Blog. Oct. 2021. <https://www.davepagurek.com/blog/depth-of-field/>
#### *[3]* SUTHERLAND, Ivan E.; SPROULL, Robert F.; SCHUMACKER, Robert A. A characterization of ten hidden-surface algorithms. ACM Computing Surveys (CSUR), 1974, vol. 6, no 1, p. 1-55.
#### *[4]* DE BERG, Mark, et al. Binary space partitions: The painter’s algorithm. Computational Geometry: Algorithms and Applications, 2008, p. 259-281.
#### *[5]* NISHA, Nisha. Visible Surface Detection Algorithms: A Review. International Journal of Advanced Engineering Research and Science, 2017, vol. 4, no 2, p. 237055.

{{% /justify %}}