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
  createCanvas(windowWidth, windowHeight);
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
    let pixelSize = int(map(mouseX, 0, windowWidth, minSize, maxSize));

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
  // Gray scale based on linear luminance for each color channel:
  // https://en.wikipedia.org/wiki/Grayscale
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getGameboyColor(r, g, b) {
  // Color palette source:
  // https://lospec.com/palette-list/kirokaze-gameboy

  let grayScale = getGrayScaleColor(r, g, b);
  let colorPalette = ["#332c50", "#46878f", "#94e344", "#e2f3e4"];
  let index = floor(map(grayScale, 0, 255, 0, 4));

  return colorPalette[index];
}

function getFunkyFutureColor(r, g, b) {
  // Color palette source:
  // https://lospec.com/palette-list/funkyfuture-8

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
  // Color palette source:
  // https://lospec.com/palette-list/fairydust-8

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