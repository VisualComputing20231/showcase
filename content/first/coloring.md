# Coloring
 
## Introducción


{{% justify %}}
En esta sección se abordará el problema de "remappear" o reasignar colores a una imagen para facilitar su visualizacion por parte de personas con visibilidad reducida. 

## Color Blindness
### Marco Teórico
Cerca de 1 de cada 20 personas son daltónicas, lo cual significa que tienen problemas para distinguir algunos colores *[1]*.

El ojo humano tiene dos tipos de receptores: conos y bastones. Los bastones detectan la luz y la oscuridad, mientras que los conos detectan los colores correspondientes a las longitudes de onda de la luz roja, verde y azul.
El daltonismo está relacionado con el tipo de cono que tiene problemas *[2]*:

- **Protanopia:** los conos de onda larga (rojos) no funcionan o están ausentes.
- **Protanomalía:** los conos de onda larga funcionan parcialmente.
- **Deuteranopia:** los conos de onda media (verdes) no funcionan o están ausentes.
- **Deuteranomalía:** los conos de onda media funcionan parcialmente.
- **Tritanopia:** los conos de onda corta (azules) no funcionan o están ausentes.
- **Tritanomalía:** los conos de onda corta funcionan parcialmente.
- **Acromatopsia:** ningún cono o solo un tipo de cono funciona.

Técnicamente, es posible que una persona tenga más de tres tipos de conos, lo que significa que todos somos daltónicos en cierto sentido.

Para personas con daltonismo de tipo protanopia es difícil distinguir entre el rojo y el verde. Esto se debe a que el sistema visual de estas personas no puede distinguir entre estos colores. Podemos simular esto reemplazando colores en una imagen para crear líneas de confusión y, así, verla tal como la vería alguien con daltonismo. 

Para ello, se diseñó una aplicacion que permite modificar los colores de las imágenes de un video por medio de RGB para que, primeramente, se imite la dificultad para distinguir colores de una imagen y, posteriormente, esta pueda modificarse para facilitar el uso a personas con discapacidad visual.

### Instrucciones

Haga click o arrastre un video para que la aplicación lo cargue. Puede utilizar la página *[3]* para descargar un archivo de prueba: se recomienda emplear un *mp4* con dimensiones *360 **x** 240*, dado que esta configuración se ajusta mejor a las dimensiones del *canvas*. Si lo desea, puede acceder al ejemplo en dicho formato específico siguiendo este [enlace](https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_2mb.mp4).

El video iniciará automáticamente sin ningún filtro. Luego, podrá añadair hasta cuatro copias del video con diferentes filtros para comparar.

Manipule los canales con las teclas 'r', 'g', 'b' para ver cómo se ven (aproximadamente) los colores para personas con daltonismo.

Mantenga presionado la tecla SHIFT y mueva el rodillo del ratón (o deslice dos dedos en su *touchpad*) para aumentar o disminuir el valor del canal seleccionado.

Oprima la tecla 's' para guardar un pantallazo de los filtros activos en formato *jpg*.

{{% /justify %}}

<div style="position: relative;"> 
{{< p5-iframe sketch="/showcase/sketches/colormapping.js" width="800" height="720" align="middle">}}
</div>

{{% justify %}}

## Código y Resultados

Este ejercicio se desarrolla haciendo uso de la librería **p5.js**, la cual permite la creación de aplicaciones web interactivas y de código abierto. Se utiliza, principalmente, la funcionalidad de tomar *frame* por *frame* de un video y manipularlos para crear una nueva imagen con el método `onSeek` que se ejeuta en cada *frame* y hace una pausa determinada.

La principal funcionalidad es manipular los píxeles de la imagen actual y reemplazarlos por los píxeles de la imagen duplicada. Para ello, se utiliza el método `loadPixels()` que carga los píxeles de la imagen actual y el método `updatePixels()` que actualiza los píxeles de la imagen actual con los píxeles cargados.

Se puede volver a cargar un nuevo video arrastrándolo o haciendo click en la imagen. Además, está disponible el botón de reiniciar el video desde el principio.

Se dispone de comandos por teclado para guardar un pantallazo de todos los filtros activos, así como las teclas para cambiar los valores de los canales RGB.

{{< details title="**Código completo**" open=true >}}
{{< highlight js >}}
let video;
let time = 0;
let loaded = false;
let selected = false;
let finished = false;
let reseted = false;
let filters = [false, false, false, false];
let button1, button2, button3, button4;
let rgb = 0;
let r1, g1, b1, r2, g2, b2, r3, g3, b3;

function setup() {
  let c = createCanvas(400, 400); // Twice the width of the video

  c.drop(processFile);
  c.mouseClicked(openFile);

  button1 = createButton("Copy original image here");
  button1.style("background-color", "rgba(0,0,0,0)");
  button1.style("color", "#006699");
  button1.style("border", "none");
  button1.style("font-size", "20px");
  button1.style("font-weight", "bold");
  button2 = createButton("Copy original image here");
  button2.style("background-color", "rgba(0,0,0,0)");
  button2.style("color", "#006699");
  button2.style("border", "none");
  button2.style("font-size", "20px");
  button2.style("font-weight", "bold");
  button3 = createButton("Copy original image here");
  button3.style("background-color", "rgba(0,0,0,0)");
  button3.style("color", "#006699");
  button3.style("border", "none");
  button3.style("font-size", "20px");
  button3.style("font-weight", "bold");

  button4 = createButton("RESET");
  button4.style("background-color", "rgba(0,0,0,0)");
  button4.style("color", "#F00");
  button4.style("font-size", "10px");
  button4.style("font-weight", "bold");

  button1.hide();
  button2.hide();
  button3.hide();
  button4.hide();

  (r1 = 1),
    (g1 = 1),
    (b1 = 1),
    (r2 = 1),
    (g2 = 1),
    (b2 = 1),
    (r3 = 1),
    (g3 = 1),
    (b3 = 1);
}

function processFile(file) {
  selected = true;
  noLoop();
  // noCanvas();
  if (file.type === "video") {
    video = createVideo(file.data, () => {
      loaded = true;
      video.volume(0);
      video.hide();

      const drawNextFrame = () => {
        // Only draw the image to the screen when the video
        // seek has completed
        const onSeek = () => {
          draw(); // All the drawing code goes here

          video.elt.removeEventListener("seeked", onSeek);

          // Wait a 100 milisecond and draw the next frame
          setTimeout(drawNextFrame, 100); // TODO: Can be adjusted with keypress
        };
        video.elt.addEventListener("seeked", onSeek);

        // Start seeking ahead

        video.time(time); // Seek ahead to the new time
        if (reseted) {
          reseted = false;
          time = 0;
        }
        time += 1 / 60;
      };
      drawNextFrame();

      video.onended(() => {
        // When the video ends
        finished = true;
      });
    });
  }
}

function openFile() {
  let inputbtn = createFileInput(processFile);
  inputbtn.remove();
  inputbtn.elt.click(); //Simulate Click
}

function printCurrentFrame() {
  fill("#F00");
  noStroke();
  textAlign(LEFT, TOP);
  textSize(width / 40);
  text("Frame: " + round(time * 60), width / 8, 5);
}

function copyImage(im, x, y, r, g, b) {
  let img = createImage(im.width, im.height);
  img.copy(im, 0, 0, im.width, im.height, 0, 0, im.width, im.height);
  img.loadPixels();
  let d = pixelDensity();
  let fullImage = 4 * (width * d) * (height * d);
  for (let i = 0; i < fullImage; i += 4) {
    img.pixels[i] = img.pixels[i] * r;
    img.pixels[i + 1] = img.pixels[i + 1] * g;
    img.pixels[i + 2] = img.pixels[i + 2] * b;
    img.pixels[i + 3] = img.pixels[i + 3];
  }
  img.updatePixels();
  image(img, im.width * x, im.height * y);
}

function manageButtons() {
  if (!filters[0]) {
    button1.show();
    button1.position((width * 3) / 4 - (button1.width * 3) / 4, height / 4);
    button1.style("font-size", width / 30 + "px");
    button1.style(
      "color",
      random(["#00669933", "#00669933", "#00669933", "#00669933", "#00669930"])
    );
    button1.mousePressed(() => {
      filters[0] = true;
      button1.hide();
    });
  }

  if (!filters[1]) {
    button2.show();
    button2.position(width / 4 - (button2.width * 3) / 4, (height * 3) / 4);
    button1.style("font-size", width / 30 + "px");
    button2.style(
      "color",
      random(["#00669933", "#00669933", "#00669933", "#00669933", "#00669930"])
    );
    button2.mousePressed(() => {
      filters[1] = true;
      button2.hide();
    });
  }

  if (!filters[2]) {
    button3.show();
    button3.position(
      (width * 3) / 4 - (button3.width * 3) / 4,
      (height * 3) / 4
    );
    button1.style("font-size", width / 30 + "px");
    button3.style(
      "color",
      random(["#00669933", "#00669933", "#00669933", "#00669933", "#00669930"])
    );
    button3.mousePressed(() => {
      filters[2] = true;
      button3.hide();
    });
  }

  button4.show();
  button4.position(5, 5);
  button4.style("font-size", width / 50 + "px");
  button4.style("color", random(["#F00", "#FFF"]));
  button4.mousePressed(() => {
    (r1 = 1),
      (g1 = 1),
      (b1 = 1),
      (r2 = 1),
      (g2 = 1),
      (b2 = 1),
      (r3 = 1),
      (g3 = 1),
      (b3 = 1);
    reseted = true;
  });
}

function draw() {
  background(20);
  if (!selected) {
    let time = millis();
    fill(0, 102, 153);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize((width / 500) * sin(time / 250) + width / 20);
    text("SELECT or DROP video files HERE...", width / 2, height / 2);
  }

  if (loaded && !finished) {
    // Draw the original video to the screen
    resizeCanvas(video.width * 2, video.height * 2);

    image(video, 0, 0);
    printCurrentFrame();

    manageButtons();

    if (filters[0]) {
      copyImage(video, 1, 0, r1, g1, b1);
    }
    if (filters[1]) {
      copyImage(video, 0, 1, r2, g2, b2);
    }
    if (filters[2]) {
      copyImage(video, 1, 1, r3, g3, b3);
    }

    if (keyIsDown(82)) {
      fill("#F00");
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      text("R", video.width, 15);
    }
    if (keyIsDown(71)) {
      fill("#0F0");
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      text("G", video.width, 15);
    }
    if (keyIsDown(66)) {
      fill("#00F");
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      text("B", video.width, 15);
    }
  }
}

function keyPressed() {
  if (key == "s") {
    saveCanvas("myCanvas", "jpg");
  }
  if (key == "r") {
    rgb = 0;
  }
  if (key == "g") {
    rgb = 1;
  }
  if (key == "b") {
    rgb = 2;
  }
}

function mouseWheel(event) {
  print(event.delta);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  if (keyIsDown(SHIFT)) {
    if (mouseX > video.width && mouseY < video.height && filters[0]) {
      if (rgb == 0) {
        fill("#F00");
        r1 -= event.delta / 256;
        if (r1 < 0) {
          r1 = 0;
        } else if (r1 > 5) {
          r1 = 5;
        }
        text("R: " + round(r1, 1), (video.width * 3) / 2, 15);
      }
      if (rgb == 1) {
        fill("#0F0");
        g1 -= event.delta / 256;
        if (g1 < 0) {
          g1 = 0;
        } else if (g1 > 5) {
          g1 = 5;
        }
        text("G: " + round(g1, 1), (video.width * 3) / 2, 15);
      }
      if (rgb == 2) {
        fill("#00F");
        b1 -= event.delta / 100;
        if (b1 < 0) {
          b1 = 0;
        } else if (b1 > 5) {
          b1 = 5;
        }
        text("B: " + round(b1, 1), (video.width * 3) / 2, 15);
      }
    }
    if (mouseX < video.width && mouseY > video.height && filters[1]) {
      if (rgb == 0) {
        fill("#F00");
        r2 -= event.delta / 256;
        if (r2 < 0) {
          r2 = 0;
        } else if (r2 > 5) {
          r2 = 5;
        }
        text("R: " + round(r2, 1), video.width / 2, video.height + 15);
      }
      if (rgb == 1) {
        fill("#0F0");
        g2 -= event.delta / 256;
        if (g2 < 0) {
          g2 = 0;
        } else if (g2 > 5) {
          g2 = 5;
        }
        text("G: " + round(g2, 1), video.width / 2, video.height + 15);
      }
      if (rgb == 2) {
        fill("#00F");
        b2 -= event.delta / 256;
        if (b2 < 0) {
          b2 = 0;
        } else if (b2 > 5) {
          b2 = 5;
        }
        text("B: " + round(b2, 1), video.width / 2, video.height + 15);
      }
    }
    if (mouseX > video.width && mouseY > video.height && filters[2]) {
      if (rgb == 0) {
        fill("#F00");
        r3 -= event.delta / 256;
        if (r3 < 0) {
          r3 = 0;
        } else if (r3 > 5) {
          r3 = 5;
        }
        text("R: " + round(r3, 1), (video.width * 3) / 2, video.height + 15);
      }
      if (rgb == 1) {
        fill("#0F0");
        g3 -= event.delta / 256;
        if (g3 < 0) {
          g3 = 0;
        } else if (g3 > 5) {
          g3 = 5;
        }
        text("G: " + round(g3, 1), (video.width * 3) / 2, video.height + 15);
      }
      if (rgb == 2) {
        fill("#00F");
        b3 -= event.delta / 256;
        if (b3 < 0) {
          b3 = 0;
        } else if (b3 > 5) {
          b3 = 5;
        }
        text("B: " + round(b3, 1), (video.width * 3) / 2, video.height + 15);
      }
    }
  }
}
{{< /highlight>}}
{{< /details >}}

## Conclusiones y Trabajo futuro

- Se pueden utilizar otros espacios de color para la manipulación de colores, tales como el espacio de color XYZ o HSV y, adí, concluir cuál es más apropiado para esta tarea.
- Es posible modificar los valores de los filtros de manera más precisa, y también la velocidad o *frames* por segundo de la aplicacion.
- Como trabajo futuro, se podría mejorar la experiencia de usuario para que la aplicación sea más intuitiva y fácil de usar. Así mismo, se plantea reducir el tamaño de los videos para que se puedan visualizar mejor.
- Adicionalmente, se propone profundizar en funciones de color para la manipulacion de colores en cada pixel y, en lo posible, evitar cambios constantes. Esto implicaría acercarse a un enfoque polinomial o curvas.
- Es posible utilizar, a manera de filtro inverso, las imágenes que logren confundir a las personas con discapacidad visual en este programa para que sea aplicado a voluntad según se requiera.
- Finalmente, se plantea la opción de extender la aplicación para que pueda ser utilizada con otros tipos de entrada como imágenes, videos, etc.

## Referencias
#### *[1]* D. Nichols, "Coloring for Colorblindness" [Online]. Available: https://davidmathlogic.com/colorblind/#%23D81B60-%231E88E5-%23FFC107-%23004D40.
#### *[2]* ndesmic, "Exploring Color Math Through Color Blindness" [Online]. Available: https://dev.to/ndesmic/exploring-color-math-through-color-blindness-2m2h.
#### *[3]* "Sample Videos" [Online]. Available: https://sample-videos.com.

{{% /justify %}}