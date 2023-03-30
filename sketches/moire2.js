function setup() {
    createCanvas(700, 700, WEBGL);

    slider1 = createSlider(5000, 20000, 10000);
    slider1.position(width/3, 30);
    slider1.style('width', '250px');
    slider1.style('accent-color', 'red');

    slider2 = createSlider(5000, 20000, 10000);
    slider2.position(width/12, height-50);
    slider2.style('width', '250px');
    slider2.style('accent-color', 'green');

    slider3 = createSlider(5000, 20000, 10000);
    slider3.position(7*width/12, height-50);
    slider3.style('width', '250px');
    slider3.style('accent-color', 'blue');

    cam = createCamera();
    cam.setPosition(0, 0, 600);
}

function draw() {
    background(255);

    strokeWeight(3);

    rotateX(-millis()/slider1.value());
    lines('red');

    rotateX(millis()/slider1.value());
    rotateY(-millis()/slider2.value());
    lines('green');

    rotateY(millis()/slider2.value());
    rotateZ(-millis()/slider3.value());
    lines('blue');

    if (keyIsDown(LEFT_ARROW)) {
        cam.setPosition(0, 0, -600);
        cam.lookAt(0,0,0);
    }
    if (keyIsDown(RIGHT_ARROW)) {
        cam.setPosition(0, 0, 600);
        cam.lookAt(0,0,0);
    }
}

function lines(color){
    stroke(color)
    for (let i = 160 - width/2; i <= width/2 - 160; i += 5){
        line(i, 160 - height/2, i, height/2 - 160)
    }
}