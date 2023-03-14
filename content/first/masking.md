# Visual Masking

### Patrones de moiré:

{{< p5-iframe sketch="/showcase/sketches/moire1.js" width="670" height="520">}}

{{< p5-iframe sketch="/showcase/sketches/moire2.js" width="720" height="720">}}

### Kinegramas:

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

### Image Kernels.

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