let fr = 30;
let img = null;
let delayTime = 200;
let size = 560;
let angles = 12;
let speed = 2;
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
    button = createButton('Reversed');
    button.parent("waterfall-illusion");
    button.position(0, 0, 'sticky');
    button.mousePressed(() => { reversed = !reversed} );
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
        delayTime = 250;
        image(originalImage, 0, 0, 400, 400);
    } else {
        noFill();
        stroke(0);
        erase(0,255);
        strokeWeight(100);
        circle(200,200, 500);
        noErase();
        delayTime = 500;
    }
};
