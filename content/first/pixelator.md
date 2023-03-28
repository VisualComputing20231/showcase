# Spatial Coherence

## Introducción

Para este ejercicio se puso en practica el fenomeno visual de *"Spatial Coherence"*  con el objetivo de desarrollar un codigo capaz de pixelar una imagen o video. 

Durante este ejercicio se busco ir un poco más allá de lo que se nos pedia como tarea inicial, por lo que se implemento una manera de pixelear un video en vivo y agregarle diversas funciones para que el usuario pudiese interectuar con el programa. Todo esto, por su puesto, hecho a través de la implementación de un código en JavaScript, con el uso de la libreria *P5*.

Finalmente, se discuten posibles aplicaciones de los conceptos aprendidos, así
como el trabajo futuro que se puede llevar a cabo tomando el ejercicio desarrollado
como punto de partida.

## Marco teorico 
La coherencia espacial es un término que se utiliza en la óptica para describir la capacidad de una onda electromagnética para mantener una relación de fase estable en diferentes puntos del espacio. La coherencia espacial se refiere a la propiedad de la luz que hace que se comporte como una onda, lo que significa que tiene la capacidad de interferir constructiva o destructivamente consigo misma en diferentes puntos del espacio.

La coherencia espacial se utiliza en muchas aplicaciones ópticas, como la holografía, la tomografía óptica de coherencia y la microscopía de campo cercano. En estas aplicaciones, la coherencia espacial es esencial para la formación de imágenes y para obtener información detallada sobre la estructura de los objetos que se están observando.

La coherencia espacial se puede cuantificar utilizando varias medidas, como la función de correlación espacial, el ancho de banda de coherencia y la longitud de coherencia. La función de correlación espacial es una medida de la correlación entre dos puntos de la onda en diferentes posiciones. El ancho de banda de coherencia es una medida de la gama de longitudes de onda que contribuyen a la coherencia de la onda. La longitud de coherencia es una medida de la distancia sobre la cual la onda mantiene una relación de fase estable.

En resumen, la coherencia espacial es una propiedad fundamental de las ondas electromagnéticas que permite que se comporten como ondas y que puedan interferir constructiva o destructivamente en diferentes puntos del espacio. La coherencia espacial se utiliza en muchas aplicaciones ópticas para la formación de imágenes y para obtener información detallada sobre la estructura de los objetos que se están observando.

## Código y Resultados

A continuación, se describe el ejercicio desarrollado y se destacan las piezas de código más relevantes, las cuales demuestran los aportes efectuados sobre el ejemplo disponible. Cabe aclarar que para el correcto funcionamiento del codigo se debe autorizar a la pagina para que esta use la webcam.

{{< p5-iframe sketch="/showcase/sketches/pixelator.js" width="830" height="625">}}

Como se puede evidenciar, el ejercicio desarrollado consiste en capturar la imagen proviniente de la camara del computador y modificar los pixeles provinientes de cada Frame, podiendo variar el tamaño de los pixeles, la forma o el color y todo al mismo tiempo. Para esto Se tomo cada fotograma como una matriz, compuetsa de pequeñas submatrices, las cuales van siendo manipulada para lograr cada efecto visual. Primero utilizamos un funcion interna de P5 llamada **LoadPixels** que nos va a facilitar todo el trabajo y permitira usar cada Frame como una matriz. Después tendremos que crear una variable que nos ayudara a manejar el valor de cada pixel, basandonos en el tamaño de la pantalla, la posición del mouse sobre el eje X y unos valores predeterminados. Una vez definido el tamaño de los Pixeles los agruparemos en pequeñas submatrices de 4x4 y a cada pixel se le asignará un color predeterminado. Una vez realizamos estas funciones en el codigo podemos empezar a jugar con el tamaño de los Pixeles. En caso de querer disminuir el numero de pixeles en la transmisión, lo que se hace es que para cada pequeña submatriz se le asigna un color siguiendo el principio de la coherencia espacial. Una vez todos los pixeles de esa matriz tengan el mismo color pasara a ser considerada un solo pixel y será parte de una matriz más grande. Este proceso se puede repetir hasta llegar al minimo de pixeles permitidos por frame. Cabe aclarar que cada pixel debe ser escalado para que se ajuste al tamaño de pantalla y estos pixeles escalados son los que usamos para modificar la forma de los mismos. Así mismo como manipulamos estas submatrices para modificar el tamaño de los pixeles de la imagen, podemos modificar la forma y la paleta de colores empleados siguiendo la misma logica y empleando unas funciones especiales de P5. 

En la siguiente porción de codigo se resalta como se generan los valores para cada pixel, como se van manipulando el tamaño, la forma o el color dependiendo la posición del mouse y la opción que escoga el usuario.

{{< highlight js >}}

function draw() {
  background(0);
  video.loadPixels();
  if (isProcessingEnabled) {
    pixelSize = int(map(mouseX, 0, windowWidth, minSize, maxSize));

    for (let x = 0; x < video.width; x += pixelSize) {
      for (let y = 0; y < video.height; y += pixelSize) {
        
        let index = (y * video.width + x) * 4;
        let r = video.pixels[index + 0];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];

        let newColor = getColor(r, g, b);

        // Scale to fit windowWidth:
        let scaledX = floor(x * windowVideoRatio);
        let scaledY = floor(y * windowVideoRatio);
        let scaledPixelSize = ceil(pixelSize * windowVideoRatio);
        
        fill(newColor);

        if(pixelMode == 0){
          stroke("black");
          rect(scaledX, scaledY, scaledPixelSize, scaledPixelSize);
        }else if(pixelMode == 1){
          ellipse(scaledX, scaledY, scaledPixelSize, scaledPixelSize);
        }else if(pixelMode == 2){
          triangle(scaledX, scaledY, scaledX + (pixelSize / 2), scaledY + pixelSize, scaledX + pixelSize, scaledY)
        } else if(pixelMode == 3){
          noStroke()
          rect(scaledX, scaledY, scaledPixelSize, scaledPixelSize);
        }
      }
    }
  } else {
    image(video, 0,0, videoXResolution * windowVideoRatio, 
          videoYResolution * windowVideoRatio);
  }

{{< /highlight >}}


El código completo se encuentra en el siguiente desplegable.

{{< details title="**Código completo**" open=false >}}
{{< highlight js >}}

const videoXResolution = 640;
const videoYResolution = 480;

let video;
let pixelSize = 10;
const minSize = 5;
const maxSize = 50;
let windowVideoRatio;
let colorButton;
let videoModeButton;
let isProcessingEnabled = true;
let colorModeIndex = 0;
let lastColorModeIndex = 4;
let pixelMode = 0
let lastPixelMode = 3

function setup() {
  createCanvas(800, 550);
  video = createCapture(VIDEO);
  video.size(videoXResolution, videoYResolution);
  video.hide();
  windowVideoRatio = windowWidth / video.width;
  
  colorButton = createButton("Toggle color modes");
  colorButton.size(200, 50);
  colorButton.position(230, windowHeight - 60);
  colorButton.mousePressed(changeColorMode);

  colorButton = createButton("Toggle processing");
  colorButton.size(200, 50);
  colorButton.position(10, windowHeight - 60);
  colorButton.mousePressed(changeProcessing);
  
  colorButton = createButton("Change pixels");
  colorButton.size(200, 50);
  colorButton.position(450, windowHeight - 60);
  colorButton.mousePressed(changePixels);
}

function draw() {
  background(0);
  video.loadPixels();
  if (isProcessingEnabled) {
    pixelSize = int(map(mouseX, 0, windowWidth, minSize, maxSize));

    for (let x = 0; x < video.width; x += pixelSize) {
      for (let y = 0; y < video.height; y += pixelSize) {
        
        let index = (y * video.width + x) * 4;
        let r = video.pixels[index + 0];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];

        let newColor = getColor(r, g, b);

        // Scale to fit windowWidth:
        let scaledX = floor(x * windowVideoRatio);
        let scaledY = floor(y * windowVideoRatio);
        let scaledPixelSize = ceil(pixelSize * windowVideoRatio);
        
        fill(newColor);

        if(pixelMode == 0){
          stroke("black");
          rect(scaledX, scaledY, scaledPixelSize, scaledPixelSize);
        }else if(pixelMode == 1){
          ellipse(scaledX, scaledY, scaledPixelSize, scaledPixelSize);
        }else if(pixelMode == 2){
          triangle(scaledX, scaledY, scaledX + (pixelSize / 2), scaledY + pixelSize, scaledX + pixelSize, scaledY)
        } else if(pixelMode == 3){
          noStroke()
          rect(scaledX, scaledY, scaledPixelSize, scaledPixelSize);
        }
      }
    }
  } else {
    image(video, 0,0, videoXResolution * windowVideoRatio, 
          videoYResolution * windowVideoRatio);
  }
  
  textSize(16);
  fill(255);
  text(`Pixel size: ${pixelSize} - Frame rate: ${int(frameRate())}`, 10, windowHeight - 80);
}

function changeColorMode() {
  if (colorModeIndex < lastColorModeIndex) {
    colorModeIndex++;
  } else {
    colorModeIndex = 0;
  }
}

function changeProcessing() {
  isProcessingEnabled = !isProcessingEnabled;
}

function changePixels() {
  if (pixelMode < lastPixelMode) {
    pixelMode++;
  } else {
    pixelMode = 0;
  }
}

function getColor(r, g, b) {
  let newColor;
  switch (colorModeIndex) {
    case 0:
      newColor = color(r, g, b);
      break;
    case 1:
      newColor = getGrayScaleColor(r, g, b);
      break;
    case 2:
      newColor = getGameboyColor(r, g, b);
      break;
    case 3:
      newColor = getFunkyFutureColor(r, g, b);
      break;
    case 4:
      newColor = getFairyDustColor(r, g, b);
      break;
  }

  return newColor;
}

function getGrayScaleColor(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getGameboyColor(r, g, b) {

  let grayScale = getGrayScaleColor(r, g, b);
  let colorPalette = ["#332c50", "#46878f", "#94e344", "#e2f3e4"];
  let index = floor(map(grayScale, 0, 255, 0, 4));

  return colorPalette[index];
}

function getFunkyFutureColor(r, g, b) {

  let colorPalette = [
    "#2b0f54",
    "#ab1f65",
    "#ff4f69",
    "#fff7f8",
    "#ff8142",
    "#ffda45",
    "#3368dc",
    "#49e7ec",
  ];
 
  return getNearestColorInPalette(colorPalette, r, g, b);
}

function getFairyDustColor(r, g, b) {

  let colorPalette = [
    "#f0dab1",
    "#e39aac",
    "#c45d9f",
    "#634b7d",
    "#6461c2",
    "#2ba9b4",
    "#93d4b5",
    "#f0f6e8",
  ];
 
  return getNearestColorInPalette(colorPalette, r, g, b);
}

function getNearestColorInPalette(colorPalette, r, g, b) {
  let nearestColorIndex = 0;
  let nearestColorDistance = 255;
  for (let c = 0; c < colorPalette.length; c++) {
    let indexColor = color(colorPalette[c]);
    let indexRed = red(indexColor);
    let indexGreen = green(indexColor);
    let indexBlue = blue(indexColor);
    let colorDist = dist(r, g, b, indexRed, indexGreen, indexBlue);
    if (colorDist < nearestColorDistance) {
      nearestColorDistance = colorDist;
      nearestColorIndex = c;
    }
  }

  return colorPalette[nearestColorIndex];
}

{{< /highlight >}} {{< /details >}}

## Conclusiones y Trabajo futuro

- El uso de la libería **P5** brinda muchas facilidades a la hora de realizar el ejercicio de pixelar una imagen. Mediante diversas funciones internas, que nos brinda la libreria, podemos saltarnos muchas dificultades que se presentan y ahorrarnos tiempo y esfuerzo.
- Como el programa esta hecho para modificar cada pixel para cada frame de un video en vivo, hay muchos valores que se deben calcular cada segundo y se debe llevar a cabo un gran procesamiento interno, por lo que se puede evidenciar que a medida que aumentamos el numero de pixeles en el video, este ira disminuyendo los frames que pude procesar por segundo. Sí a esto le agregamos todas las funciones extras que el usuario puede realizar se convierte en una tarea arduosa para llevar a cabo por lo que es normal una caida tan grande en los frames procesados por segundo.
- La mayoria de los efectos visuales conseguidos se pueden lograr tomando cada imagen como una matriz, lo cual nos facilita el manejo de los pixeles y su manipulación.  
- Para un trabajo futuro se podría implementar una función que permita al programa mejorar la tasa de procesamiento para cada pixel y la tasa de refresco de frames en pantalla y con esto lograr una mayor fluides en la transmisión con un mayor numero de pixels en pantalla. 
- Como trabajo futuro se puede implementar diversas formas de manipular las submatrices de pixeles, cuando se busca generar el efecto de pixelacion en las imagenes, y con esto comparar de que manera el código tiene un mejor desempeño a la hora de generar frames por segundo.


## Referencias

#### [1] J. P. Charalambos. "Temporal Coherence". Visual Computing. 2023. <https://visualcomputing.github.io/docs/visual_illusions/temporal_coherence/>

#### [2] "Kirokaze (Game Boy)", Lospec, [En línea]. Available: https://lospec.com/palette-list/kirokaze-gameboy.

#### [3] "Funky Future 8", Lospec, [En línea]. Available: https://lospec.com/palette-list/funkyfuture-8.

#### [4] "Fairydust 8", Lospec, [En línea]. Available: https://lospec.com/palette-list/fairydust-8.

#### [5] E. Glytsis, "Spatial Coherence," [En línea]. Available: http://users.ntua.gr/eglytsis/OptEng/Coherence_p.pdf.

#### [6] S. Johnson, "Stephen Johnson on Digital Photography," O'Reilly, 2006, ISBN 0-596-52370-X.

#### [7] C. Poynton, "Digital Video and HD: Algorithms and Interfaces," 2nd ed., Morgan Kaufmann, 2012, pp. 31-35, 65-68, 333, 337, ISBN 978-0-12-391926-7. [Online]. Available: https://www.sciencedirect.com/book/9780123919267/digital-video-and-hd. [Accessed: Mar. 31, 2022].

#### [8] Daniel Shiffman, "The Nature of Code - Simulating Natural Systems with Processing," YouTube, 2012. [En línea]. Available: https://www.youtube.com/watch?v=KfLqRuFjK5g. [Accedido: Mar. 31, 2022].

#### [9] "p5.js," [En línea]. Available: https://p5js.org/es/. [Accedido: Mar. 31, 2022].

#### [10] The Coding Train, "What is p5.js?," YouTube, 2017. [En línea]. Available: https://www.youtube.com/watch?v=M3wTNVICUTg&t=2s. [Accedido: Mar. 31, 2022].

#### [11] The Coding Train, "Introduction to p5.js - Variables and Drawing - p5.js Tutorial," YouTube, 2015. [En línea]. Available: https://www.youtube.com/watch?v=VYg-YdGpW1o. [Accedido: Mar. 31, 2022].