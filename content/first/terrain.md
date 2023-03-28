# Terrein Generator



## Introducción 

Para este ejercicio se puso en practica los efectos visuales de *"Mach bands"* y *Perlin noise* y la relacion de estos dos a la hora de generar un terreno automatizado y continuo. 

Posteriormente, como ejercicio practico, se realizo una animación, la cual consiste en generar un terreno aleatorio que utilizara ambos efectos visuales, a través de la implementación de un código en JavaScript, con el uso de la libreria *P5*.

Finalmente, se discuten posibles aplicaciones de los conceptos aprendidos, así
como el trabajo futuro que se puede llevar a cabo tomando el ejercicio desarrollado
como punto de partida.


## Marco teorico 

Las bandas de Mach (Mach bands, en inglés) son un fenómeno óptico que se produce cuando hay un cambio gradual en la intensidad de la luz en una imagen. El ojo humano tiende a percibir estas transiciones como bordes o líneas más definidas de lo que realmente son. Esto se debe a la forma en que el cerebro procesa la información visual.

Por otro lado, la generación de terreno con Perlin noise es un método para crear terrenos y superficies naturales de forma procedural. Este método utiliza una función de ruido desarrollada por Ken Perlin en la década de 1980, que genera valores de ruido aleatorios pero coherentes y suaves.

La relación entre los Mach bands y la generación de terreno con Perlin noise es que se pueden utilizar las bandas de Mach para mejorar la apariencia visual de los terrenos generados con este método. Al aplicar una función de suavizado a los valores de ruido generados por Perlin noise, se pueden crear transiciones suaves entre las diferentes alturas del terreno. Sin embargo, estas transiciones suaves pueden producir una apariencia visual demasiado uniforme o artificial. Al aplicar una función que aumente los valores de intensidad cerca de las transiciones, se pueden crear efectos visuales similares a los de las bandas de Mach, que ayudan a definir mejor los bordes y las transiciones del terreno.

En resumen, las bandas de Mach se utilizan en la generación de terreno con Perlin noise como una técnica para mejorar la apariencia visual de los terrenos, creando efectos visuales que ayudan a definir mejor los bordes y las transiciones.


## Código y Resultados

A continuación, se describe el ejercicio desarrollado y se destacan las piezas de código más relevantes, las cuales demuestran los aportes efectuados sobre el ejemplo disponible.


{{< p5-iframe sketch="/showcase/sketches/terreinGenerator.js" width="820" height="670" align="middle">}}

Como se puede evidenciar, el ejercicio desarrollado consiste en una animación que genera de manera aleatoria y continua un terreno, al cual se le puede modificar los valores de altitud que puede llegar a tomar cada punto. Entrando un poco más en detalle sobre como se realizo el ejercicio tenemos que aclarar que para generar el terreno usamos una grilla en 3 dimensiones (x, y, z) con valores predeterminados tanto para los puntos X y Y. Realizamos una rotación sobre el eje X y le asignamos un valor aleatorio a la coordenada Z entre un rengo preestablecido. Acá es donde entra el método de Perlin Noise. Simplificadamente, con este método nos aseguramos que cada valor generado "aleatoriamente" para la coordenada Z, de cada punto de la grilla, unicamnete diverga dentro de un rango preestablecido, y a su vez, este rango sea dependiente de los valores en Z que se encuntren al rededor del punto que se esta generando. 

En la siguiente porción de codigo se resalta como se generan los valores en "z" para cada par de coordenadas (x,y) de la grilla y como se asegura que estos valores sean acordes al metodo de Perlin Noise.
 

{{< highlight js >}}

function draw() {
  
  fly -= 0.1
  var yoff = fly
  
  for(var j=0; j<rows; j++){
    var xoff = 0
    for(var i=0; i<cols; i++){
      terrein[i][j] = map(noise(xoff,yoff), 0, 1, -100, slider.value())
      xoff += 0.1
    }
    yoff += 0.1
  }
  
  background(10);
  stroke(225)
  
  
  
  
  translate(0, 0)
  rotateX(PI/3)
  translate(-w/2, -h/2)
  
  for(var j=0; j<rows-1; j++){
    
    beginShape(TRIANGLE_STRIP)
    
    for(var i=0; i<cols; i++){
      vertex(i*scl, j*scl, terrein[i][j])
      vertex(i*scl, (j+1)*scl, terrein[i][j+1])
      colors = colorChange(terrein[i][j])
      fill(colors)
    }
    endShape()
  }
  
  
}
{{< /highlight >}}

El código completo se encuentra en el siguiente desplegable.

{{< details title="**Código completo**" open=false >}}
{{< highlight js >}}
let cols, rows;
let scl = 20
let w = 1200
let h = 900
let terrein
var fly = 0
let colors

function setup() {
  createCanvas(800, 650, WEBGL);
  cols = w/scl
  rows = h/scl
  
  terrein = Array(cols)
  
  for(var x = 0; x<terrein.length; x++){
    terrein[x] = new Array(rows)
  }
  
  slider = createSlider(0, 300, 100);
  slider.position(width/3, 30);
  slider.style('width', '300px');
  
}

function draw() {
  
  fly -= 0.1
  var yoff = fly
  
  for(var j=0; j<rows; j++){
    var xoff = 0
    for(var i=0; i<cols; i++){
      terrein[i][j] = map(noise(xoff,yoff), 0, 1, -100, slider.value())
      xoff += 0.1
    }
    yoff += 0.1
  }
  
  background(10);
  stroke(225)
  
  
  
  
  translate(0, 0)
  rotateX(PI/3)
  translate(-w/2, -h/2)
  
  for(var j=0; j<rows-1; j++){
    
    beginShape(TRIANGLE_STRIP)
    
    for(var i=0; i<cols; i++){
      vertex(i*scl, j*scl, terrein[i][j])
      vertex(i*scl, (j+1)*scl, terrein[i][j+1])
      colors = colorChange(terrein[i][j])
      fill(colors)
    }
    endShape()
  }
  
  
}

function colorChange(num){
  if(num>=120){
      return(255)
  }else if(num>=100){
    return(200)
  }else if(num>=40){
    return([128,64 ,0])
  }
  else if(num>=10){
    return([0,150,0])
  }
  else{
    return([0,0,150])
  }
}
{{< /highlight >}} {{< /details >}}


## Conclusiones y Trabajo futuro

- El uso de la libería **P5** permite una aplicación más fácil y práctica del concepto de Periln Noise, y Mach bands pues estos ya estan integrados dentro de la libreria, ademas de brindar una amplia documentación y guía de como usarlos.
- Así mismo usa la librería **P5** facilita considereblemente el trabajo y manejo de objetos en tres dimensiones. Brinda una amplia variedad de herramientas para la manipulación de estos objetos y es precisa para el desarrollo de esta actividad, pues permite realizar distintas acciones para cada objeto, como la manipulacion de los ejes (`x`, `y`o `z`), entre otras.  
- Para un trabajo futuro se podría implementar una función que permita al usuario girar la vista en modo 360° o que le permita jugar con los ejes de la grilla de modo que pueda visualizar la generación automatica del terreno desde diferentes perspectivas.
- Así mismo se podria integrar, como trabajo fúturo, la incorporación de una función que permita al usuario jugar con los valores preestablecidos, en tiempo de ejecución, usados en el metodo de Pearl Noise, a la hora de generar "aleatoriamente" los valores que toma `z` par cada par de coordenadas (X, Y). 

## Referencias
#### [1] F. Ratliff, "Mach bands: quantitative studies on neural networks in the retina", Holden-Day, 1965, ISBN 9780816270453.

#### [2] G. von Békésy, "Mach Band Type Lateral Inhibition in Different Sense Organs", PDF, 1967.

#### [3] F.A.A. Kingdom, "Mach bands explained by response normalization", Frontiers in Human Neuroscience, vol. 8, pp. 843, Nov. 2014, doi: 10.3389/fnhum.2014.00843, ISSN 1662-5161, PMC 4219435, PMID 25408643.

#### [4] P. Ambalathankandy et al, "Radiography Contrast Enhancement: Smoothed LHE Filter a Practical Solution for Digital X-Rays with Mach Band", Digital Image Computing: Techniques and Applications, 2019.

#### [5] C.J. Nielsen, "Effect of Scenario and Experience on Interpretation of Mach Bands", Journal of Endodontics, vol. 27, no. 11, pp. 687-691.

#### [7] R. Touti, "Perlin Noise Algorithm", [Online]. Available: https://rtouti.github.io/graphics/perlin-noise-algorithm.
#### *[8]*. J. P. Charalambos. "Temporal Coherence". Visual Computing. 2023. <https://visualcomputing.github.io/docs/visual_illusions/temporal_coherence/>

