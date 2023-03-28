# Visual Masking II

{{% justify %}}

## Introducción

En esta sección se continúa con el enmascaramiento visual, pero esta vez el foco está en
las máscaras de convolución (*kernels* de imágenes), así como en otras cualidades del
procesamiento digital de imágenes: los histogramas y la luminosidad.

Acto seguido, se desarrolla una aplicación de procesamiento de imágenes que abarca algunos
de los kernels más comunes: *identity, edge detection, sharpen, emboss, gaussian blur, unsharp
masking*. Dentro del mismo programa se lleva a cabo la generación de un histograma con los
valores de luminosidad del modo de color *HSL*: dicha luminosidad también es mutable en la
imagen resultante de la convolución, alterando el histograma trazado en el proceso.

Para terminar, se discuten posibles aplicaciones de los conceptos aprendidos, así
como el trabajo futuro que se puede desarrollar mediante *visual masking* en general.

## Marco Teórico

En la sección anterior se definía el enmascaramiento visual; por consiguiente, se pasa
directamente a la conceptualización propia de esta sección.

- **Máscaras de convolución:**

Para entender el concepto, en primer lugar es importante comprender qué es una convolución. De acuerdo
con *[1]*, esta se puede describir, intuitivamente, como una función que es la integral o suma de dos
funciones componentes y que mide la cantidad de superposición a medida que una se desplaza sobre la
otra. Formalmente, una convolución está definida de la siguiente manera *[2]*:

{{< katex display >}} g(x,y) = \omega * f(x,y) = \sum_{dx=-a}^{a}\sum_{dy=-b}^{b} \omega(dx,dy) f(x-dx,y-dy) {{< /katex >}}

Ahora, una máscara de convolución es una matriz o kernel numérico utilizado en procesamiento de imágenes
y visión por computadora para realizar operaciones de convolución en una imagen. Estas matrices, típicamente
son de tamaño *3 **x** 3*, aunque también se pueden emplear matrices de tamaño *2 **x** 2* y *5 **x** 5*,
entre otras. En líneas generales, en procedimiento consiste en que, a partir de una imagen, se van tomando
bloques que posean el mismo tamaño de la matriz. Luego, aplicando la operación descrita (convolución) en
función de los valores de los píxeles originales y los coeficientes de la máscara, se calcula el valor de
cada píxel de la imagen resultante *[1]*. Esta tendrá ciertas características dependiendo del kernel que
haya sido aplicado. Algunos de los más comunes (y los cuales fueron implementados en este ejercicio) se
listan a continuación *[2]* y *[3]*:

1. **Identity:**

{{< katex display >}} \begin{bmatrix} 0 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 0 \\ \end{bmatrix} {{< /katex >}}

2. **Edge detection:**

{{< katex display >}} \begin{bmatrix} -1 & -1 & -1 \\ -1 & 8 & -1 \\ -1 & -1 & -1 \\ \end{bmatrix} {{< /katex >}}

3. **Sharpen:**

{{< katex display >}} \begin{bmatrix} 0 & -1 & 0 \\ -1 & 5 & -1 \\ 0 & -1 & 0 \\ \end{bmatrix} {{< /katex >}}

4. **Emboss:**

{{< katex display >}} \begin{bmatrix} -2 & -1 & 0 \\ -1 & 1 & 1 \\ 0 & 1 & 2 \\ \end{bmatrix} {{< /katex >}}

5. **Gaussian Blur (5x5):**

{{< katex display >}} \frac{1}{256} \begin{bmatrix} 1 & 4 & 6 & 4 & 1 \\ 4 & 16 & 24 & 16 & 4 \\ 6 & 24 & 36 & 24 & 6 \\ 4 & 16 & 24 & 16 & 4 \\ 1 & 4 & 6 & 4 & 1 \\ \end{bmatrix} {{< /katex >}}

6. **Unsharp Masking (5x5):**

{{< katex display >}} \frac{-1}{256} \begin{bmatrix} 1 & 4 & 6 & 4 & 1 \\ 4 & 16 & 24 & 16 & 4 \\ 6 & 24 & -476 & 24 & 6 \\ 4 & 16 & 24 & 16 & 4 \\ 1 & 4 & 6 & 4 & 1 \\ \end{bmatrix} {{< /katex >}}

- **Luminosidad e histograma de imagen:**

En este ámbito, un histograma es una representación gráfica de la distribución de los valores de los
píxeles en una imagen: el eje *x* representa los valores de intensidad de los píxeles, mientras que
el eje *y* representa la cantidad de píxeles en la imagen que tienen cada valor de intensidad *[4]*.

La intensidad es un valor presente en el modelo de color **HSI**, también conocido como **HSL**: sus siglas
se refieren a *Hue* (matiz), que corresponde al tono que distingue a un color de otro; *Saturation* (saturación),
que se relaciona con la pureza del color, es decir, la cantidad de gris en relación con el matiz; y *Lightness*
(luminosidad), que es la cantidad de luz blanca que se mezcla con un color, dando una medida de la claridad u
oscuridad del mismo con valores que van desde 0 (negro) hasta 100 (blanco) *[4]*.

## Código y Resultados:

{{< details title="**Código completo**" open=false >}}
{{< highlight js >}}
let file; let newFile
let maskedFile; let lightFile
let histogram;
let fileLoading = false;
let uploaded = false;

function preload() {
    file = loadImage("../assets/shrek.png");
}

function setup() {
    createCanvas(600, 1000);
    colorMode(RGB, 255);
    textSize(20);
    textAlign(CENTER);
    textStyle(BOLD);
    
    file.resize(250,250);
    maskedFile = createImage(file.width, file.height);
    lightFile = createImage(file.width, file.height);
    
    if (!uploaded){
        newFile = createFileInput(handleFile);
        newFile.position(width/2 - 65, 25);
    
        slider = createSlider(-100, 100, 0);
        slider.position(325, 380);
        slider.style('width', '250px');
    
        menu = createSelect();
        menu.position(25, 380);
        menu.style('width', '250px');
        menu.option("Identity");
        menu.option("Edge Detection");
        menu.option("Sharpen");
        menu.option("Emboss");
        menu.option("Gaussian Blur 5x5");
        menu.option("Unsharp Masking 5x5"); 
        
        resetHistogram();
    
        file.loadPixels();
        maskedFile.loadPixels();
    
        for (let j = 0; j < file.width; j++) {
          for (let k = 0; k < file.height; k++) {
            let pixel = file.get(j, k);
            maskedFile.set(j, k, pixel);
            lightFile.set(j, k, pixel);
            histogram[int(lightness(pixel))]++;
          }
        }
    
        scaleHistogram();
    
        maskedFile.updatePixels();
        lightFile.updatePixels();
    }
    else {
        masking();
    }
    slider.input(changeLightness);
    menu.input(masking);
}

function draw() {
    background(0);
    
    noStroke();
    fill("white")
    text("Lightness:", 3*width/4, 360);
    text("Kernel:", width/4, 360);
    rect(0, 420, width, height-420)
    fill("black")
    text("Histograma de la imagen resultante:", width/2, 450);
    
    if(!fileLoading){
        image(file, 25, 70);
        image(lightFile, 325, 70);
        stroke("purple");
        for (let w = 0; w <= 100; w++) {
            let ab = int(map(w, 0, 100, 25, width - 25));
            line(ab, height - histogram[w] - 30, ab, height - 30);
        }
    }
}

function changeLightness(){
    resetHistogram();
    for (let z = 0; z < maskedFile.width; z++) {
        for (let k = 0; k < maskedFile.height; k++) {
            let pixel = maskedFile.get(z, k);
            let l = constrain(int(lightness(pixel) + slider.value()), 0, 100)
            let newColor = "hsl(" + int(hue(pixel)) + ", " + saturation(pixel) + "%, " + l + "%)"
            lightFile.set(z, k, color(newColor));
            histogram[l]++;
        }
    }
    lightFile.updatePixels();
    scaleHistogram();
}

function changeKernel(M){
    resetHistogram();

    let rangeX = int(M.length/2)
    let rangeY = int(M[0].length/2)
    
    for (let x = 0; x < maskedFile.width; x++) {
        for (let y = 0; y < maskedFile.height; y++) {
    
          let convolution = [0,0,0,255]
          
          for (let i = -rangeX; i <= rangeX; i++) {
            for (let j = -rangeY; j <= rangeY; j++) {
              
              let pixel = file.get(x + i, y + j);
              let val = M[i + rangeX][j + rangeY]
              
              convolution[0] += pixel[0] * val;
              convolution[1] += pixel[1] * val;
              convolution[2] += pixel[2] * val;          
            }
          }
          histogram[int(lightness(convolution))]++;
          maskedFile.set(x, y, convolution)
        }
    }
    maskedFile.updatePixels();
    scaleHistogram();
    changeLightness();
}

function masking() {
    if (menu.value() == "Identity"){
        matrix = [ [ 0, 0, 0 ],
                   [ 0, 1, 0 ],
                   [ 0, 0, 0 ] ];
    } else if (menu.value() == "Edge Detection"){
        matrix = [ [ -1, -1, -1 ],
                   [ -1,  8, -1 ],
                   [ -1, -1, -1 ] ];
    } else if (menu.value() == "Sharpen"){
        matrix = [ [  0, -1,  0 ],
                   [ -1,  5, -1 ],
                   [  0, -1,  0 ] ];
    } else if (menu.value() == "Emboss"){
        matrix = [ [ -2, -1, 0 ],
                   [ -1,  1, 1 ],
                   [  0,  1, 2 ] ];
    } else if (menu.value() == "Gaussian Blur 5x5"){
        matrix = [ [ 1/256,  4/256,  6/256,  4/256, 1/256 ],
                   [ 4/256, 16/256, 24/256, 16/256, 4/256 ],
                   [ 6/256, 24/256, 36/256, 24/256, 6/256 ],
                   [ 4/256, 16/256, 24/256, 16/256, 4/256 ],
                   [ 1/256,  4/256,  6/256,  4/256, 1/256 ] ];
    } else if (menu.value() == "Unsharp Masking 5x5"){
        matrix = [ [ -1/256,  -4/256,  -6/256,  -4/256, -1/256 ],
                   [ -4/256, -16/256, -24/256, -16/256, -4/256 ],
                   [ -6/256, -24/256, 476/256, -24/256, -6/256 ],
                   [ -4/256, -16/256, -24/256, -16/256, -4/256 ],
                   [ -1/256,  -4/256,  -6/256,  -4/256, -1/256 ] ];
    }
    changeKernel(matrix);
}

function resetHistogram(){
    histogram = [];
    for (let i = 0; i <= 100; i++){
        append(histogram, 0);
    }
}

function scaleHistogram(){
    for (let i = 0; i <= 100; i++){
        histogram[i] = int(map(histogram[i], min(histogram), max(histogram), 0, 500, true));
    }
}

function handleFile(img) {
    fileLoading = true;
    file = createImg(img.data, "");
    file.hide();
    let fileSrc = file.attribute("src");
    file = loadImage(fileSrc, fileLoaded);
}

function fileLoaded() {
    fileLoading = false;
    uploaded = true;
    setup();
}
{{< /highlight >}} {{< /details >}}

{{% /justify %}}

{{< p5-global-iframe width="620" height="1020">}}
let file; let newFile
let maskedFile; let lightFile
let histogram;
let fileLoading = false;
let uploaded = false;

function preload() {
file = loadImage("../assets/shrek.png");
}

function setup() {
createCanvas(600, 1000);
colorMode(RGB, 255);
textSize(20);
textAlign(CENTER);
textStyle(BOLD);

file.resize(250,250);
maskedFile = createImage(file.width, file.height);
lightFile = createImage(file.width, file.height);

if (!uploaded){
newFile = createFileInput(handleFile);
newFile.position(width/2 - 65, 25);

    slider = createSlider(-100, 100, 0);
    slider.position(325, 380);
    slider.style('width', '250px');

    menu = createSelect();
    menu.position(25, 380);
    menu.style('width', '250px');
    menu.option("Identity");
    menu.option("Edge Detection");
    menu.option("Sharpen");
    menu.option("Emboss");
    menu.option("Gaussian Blur 5x5");
    menu.option("Unsharp Masking 5x5"); 
    
    resetHistogram();

    file.loadPixels();
    maskedFile.loadPixels();

    for (let j = 0; j < file.width; j++) {
      for (let k = 0; k < file.height; k++) {
        let pixel = file.get(j, k);
        maskedFile.set(j, k, pixel);
        lightFile.set(j, k, pixel);
        histogram[int(lightness(pixel))]++;
      }
    }

    scaleHistogram();

    maskedFile.updatePixels();
    lightFile.updatePixels();
}
else {
masking();
}
slider.input(changeLightness);
menu.input(masking);
}

function draw() {
background(0);

noStroke();
fill("white")
text("Lightness:", 3*width/4, 360);
text("Kernel:", width/4, 360);
rect(0, 420, width, height-420)
fill("black")
text("Histograma de la imagen resultante:", width/2, 450);

if(!fileLoading){
image(file, 25, 70);
image(lightFile, 325, 70);
stroke("purple");
for (let w = 0; w <= 100; w++) {
let ab = int(map(w, 0, 100, 25, width - 25));
line(ab, height - histogram[w] - 30, ab, height - 30);
}
}
}

function changeLightness(){
resetHistogram();
for (let z = 0; z < maskedFile.width; z++) {
for (let k = 0; k < maskedFile.height; k++) {
let pixel = maskedFile.get(z, k);
let l = constrain(int(lightness(pixel) + slider.value()), 0, 100)
let newColor = "hsl(" + int(hue(pixel)) + ", " + saturation(pixel) + "%, " + l + "%)"
lightFile.set(z, k, color(newColor));
histogram[l]++;
}
}
lightFile.updatePixels();
scaleHistogram();
}

function changeKernel(M){
resetHistogram();

let rangeX = int(M.length/2)
let rangeY = int(M[0].length/2)

for (let x = 0; x < maskedFile.width; x++) {
for (let y = 0; y < maskedFile.height; y++) {

      let convolution = [0,0,0,255]
      
      for (let i = -rangeX; i <= rangeX; i++) {
        for (let j = -rangeY; j <= rangeY; j++) {
          
          let pixel = file.get(x + i, y + j);
          let val = M[i + rangeX][j + rangeY]
          
          convolution[0] += pixel[0] * val;
          convolution[1] += pixel[1] * val;
          convolution[2] += pixel[2] * val;          
        }
      }
      histogram[int(lightness(convolution))]++;
      maskedFile.set(x, y, convolution)
    }
}
maskedFile.updatePixels();
scaleHistogram();
changeLightness();
}

function masking() {
if (menu.value() == "Identity"){
matrix = [ [ 0, 0, 0 ],
[ 0, 1, 0 ],
[ 0, 0, 0 ] ];
} else if (menu.value() == "Edge Detection"){
matrix = [ [ -1, -1, -1 ],
[ -1,  8, -1 ],
[ -1, -1, -1 ] ];
} else if (menu.value() == "Sharpen"){
matrix = [ [  0, -1,  0 ],
[ -1,  5, -1 ],
[  0, -1,  0 ] ];
} else if (menu.value() == "Emboss"){
matrix = [ [ -2, -1, 0 ],
[ -1,  1, 1 ],
[  0,  1, 2 ] ];
} else if (menu.value() == "Gaussian Blur 5x5"){
matrix = [ [ 1/256,  4/256,  6/256,  4/256, 1/256 ],
[ 4/256, 16/256, 24/256, 16/256, 4/256 ],
[ 6/256, 24/256, 36/256, 24/256, 6/256 ],
[ 4/256, 16/256, 24/256, 16/256, 4/256 ],
[ 1/256,  4/256,  6/256,  4/256, 1/256 ]];
} else if (menu.value() == "Unsharp Masking 5x5"){
matrix = [ [ -1/256,  -4/256,  -6/256,  -4/256, -1/256 ],
[ -4/256, -16/256, -24/256, -16/256, -4/256 ],
[ -6/256, -24/256, 476/256, -24/256, -6/256 ],
[ -4/256, -16/256, -24/256, -16/256, -4/256 ],
[ -1/256,  -4/256,  -6/256,  -4/256, -1/256 ]];
}
changeKernel(matrix);
}

function resetHistogram(){
histogram = [];
for (let i = 0; i <= 100; i++){
append(histogram, 0);
}
}

function scaleHistogram(){
for (let i = 0; i <= 100; i++){
histogram[i] = int(map(histogram[i], min(histogram), max(histogram), 0, 500, true));
}
}

function handleFile(img) {
fileLoading = true;
file = createImg(img.data, "");
file.hide();
let fileSrc = file.attribute("src");
file = loadImage(fileSrc, fileLoaded);
}

function fileLoaded() {
fileLoading = false;
uploaded = true;
setup();
}
{{</p5-global-iframe>}}

{{% justify %}}

El programa desarrollado es extenso y posee varias funcionalidades: en primer lugar, el botón de la parte
superior sirve para cargar imágenes desde la máquina local. Es importante que la imagen sea cuadrada desde
un inicio para evitar deformaciones cuando se reajuste su tamaño. A continuación se deja una carpeta con
archivos de prueba que se pueden cargar para probar el funcionamiento:

<a href="https://drive.google.com/file/d/153XW4i6lhp4niwZDNx_7F-_M6RIB-0Xo/view?usp=share_link" target="_blank"> <img src="../assets/downloadButton.png" width="200px"> </a>

En segundo lugar, a la izquierda aparece la imagen original, mientras que a la derecha aparece la imagen
transformada. Debajo de ellas hay un selector y un *slider*: con el primero es posible elegir el kernel a
aplicar y con el segundo es posible cambiar la luminosidad.

Finalmente, se tiene el histograma que genera la imagen resultante, es decir, después de sufrir la convolución
y el cambio en la luminosidad: se hizo de esta forma porque así es posible ver las variaciones de este atributo
para cada caso.

En cuanto al código, se tienen las mismas funciones para la carga de archivos que en la sección anterior
sobre *visual masking*: allí están detalladas por si se desea conocer su funcionamiento. Como tal, en esta
aplicación hay dos funciones que se destacan: la del cambio de luminosidad y la del cambio de kernel.

{{< highlight js >}}
function changeLightness(){
    resetHistogram();
    for (let z = 0; z < maskedFile.width; z++) {
        for (let k = 0; k < maskedFile.height; k++) {
            let pixel = maskedFile.get(z, k);
            let l = constrain(int(lightness(pixel) + slider.value()), 0, 100)
            let newColor = "hsl(" + int(hue(pixel)) + ", " + saturation(pixel) + "%, " + l + "%)"
            lightFile.set(z, k, color(newColor));
            histogram[l]++;
        }
    }
    lightFile.updatePixels();
    scaleHistogram();
}
{{< /highlight >}}

Esta función del cambio de luminosidad, primero que todo, resetea el histograma (pues está mostrando la distribución
de la luminosidad y esta va a cambiar en cuanto se deslice el *slider*): esto equivale a poner todos sus valores
en cero. Acto seguido, itera sobre cada pixel de la imagen emnascarada (es decir, la que ya pasó por la convolución)
y obtiene su nuevo valor de luminosidad, limitándolo en el rango de cero a cien.

Para actualizar la imagen, se crea un nuevo pixel utilizando el modo de color **HSL**, a diferencia del canvas, que
utiliza **RGB**: aquí se recibe el matiz y la saturación sin variaciones, pero en la luminosidad sí se pasa el valor
alterado. Por último, se incrementa el valor del histograma en la posición **l**, esto es porque el eje x representa
los valores del cero al cien que puede tomar la luminosidad, dado que se va a mostrar la distribución que tiene en
la imagen. Al final se actualizan los pixeles del archivo **lightFile** (el que finalmente se muestra al usuario)
y se escala al histograma para que este se muestre de manera apropiada en el canvas.

{{< highlight js >}}
function changeKernel(M){
    resetHistogram();

    let rangeX = int(M.length/2)
    let rangeY = int(M[0].length/2)
    
    for (let x = 0; x < maskedFile.width; x++) {
        for (let y = 0; y < maskedFile.height; y++) {
    
          let convolution = [0,0,0,255]
          
          for (let i = -rangeX; i <= rangeX; i++) {
            for (let j = -rangeY; j <= rangeY; j++) {
              
              let pixel = file.get(x + i, y + j);
              let val = M[i + rangeX][j + rangeY]
              
              convolution[0] += pixel[0] * val;
              convolution[1] += pixel[1] * val;
              convolution[2] += pixel[2] * val;          
            }
          }
          histogram[int(lightness(convolution))]++;
          maskedFile.set(x, y, convolution)
        }
    }
    maskedFile.updatePixels();
    scaleHistogram();
    changeLightness();
}
{{< /highlight >}}

Ahora, en la función de cambiar el kernel también se reinicia el histograma. Se calculan las variables 
**rangeX** y **rangeY** para saber qué tan atrás se debe ir en los pixeles que están al borde de la imagen.
Luego están cuatro ciclos anidados: con los dos primeros se itera sobre los pixeles de la imagen original,
mientras que con los dos internos se itera en los bloques del mismo tamaño de la matriz del kernel para
realizar la operación de convolución. Este procedimiento se aplica sobre cada valor R, G y B del píxel,
dando como resultado un pixel nuevo, llamado **convolution**, el cual se pone en el archivo **maskedFile**.


Por su parte, para el histograma se calcula la luminosidad del pixel nuevo y se incrementa el valor en
dicha posición del arreglo. Al final se actualizan los pixeles, se escala el histograma y se actualiza la
luminosidad, pues es el archivo **lightFile** y no **maskedFile** el que se está renderizando junto a la
imagen original. Esta función se llama dentro de la función **masking**, la cual contiene las matrices
expresadas en el marco teórico y le pasa una de ellas como parámetro a la función **changeKernel** a partir
de lo que se ingresó en el selector.

## Conclusiones y Trabajo futuro

- Se puede evidenciar que el uso de máscaras de convolución es muy útil en el procesamiento de imágenes
digitales, pues dependiendo del kernel aplicado es posible obtener información relevante como los bordes
de la imagen o versiones más nítidas y/o borrrosas de la misma. Esto es algo que también se puede lograr
mediante la aplicación de métodos numéricos, pero resulta ser mucho más sencillo (y práctico) con las
técnicas desarrolladas en esta sección.
- El hecho de que el histograma de la imagen cambie en tiempo real permite reconocer la importancia de
la luminosidad, pues su aumento o su decremento altera por completo la distribución del gráfico. Una posible
aplicación, que podría considerarse también como trabajo futuro, consistiría en tener *sliders* que permitan
variar las tonalidades R, G y B de manera individual, con el fin de evaluar qué impacto tienen en el
cáculo y la distribución de la luminosidad en la imagen.
- Entre otros trabajos futuros a desarrollar, se considera la posibilidad de aplicar máscaras de convolución
a animaciones y vídeos: esto podría ser una herramienta ampliamente útil, pero que podría consumir muchos
recursos computacionales, puesto que, finalmente, se terminaría aplicando la operación en cada pixel de cada
uno de los fotogramas.
- En síntesis, el enmascaramiento visual ofrece un abanico de posibilidades, tanto en lo que respecta a patrones
y animaciones de moiré como a kernels de imágenes: los conceptos aprendidos pueden aplicarse para evaluar
la atención visual de un producto multimedia, mejorar su accesibilidad y/o armonía, detectar ciertos patrones,
entre muchos otros. Así mismo, gracias a esto también es posible comprender cómo funcionan los filtros que
de edición de fotografías en los celulares y las aplicaciones móviles, e incluso algunas de las herramientas
que pueden llegar a emplear las inteligencias artificiales relacionadas con el procesamiento de imágenes digitales.

## Referencias

#### *[1]* S. Kim and R. Casper, "Applications of convolution in image processing with MATLAB," University of Washington, pp. 1-20, 2013. <http://kiwi.bridgeport.edu/cpeg585/ConvolutionFiltersInMatlab.pdf>
#### *[2]* J. P. Charalambos, "Visual masking". Visual Computing, Feb. 2023. <https://visualcomputing.github.io/docs/visual_illusions/masking/>
#### *[3]* S. Raveendran, P. J. Edavoor, N. K. Yernad Balachandra and V. Moodabettu Harishchandra, "Design and implementation of image kernels using reversible logic gates," IET Image Processing, vol. 14, no 16, pp. 4110-4121, 2020, doi: 10.1049/iet-ipr.2019.1681.
#### *[4]* R. C. Gonzalez and R. E. Woods, "Digital Image Processing," 4th ed., Pearson, 2018.

{{% /justify %}}