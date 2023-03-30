let direction = true;

function setup() {
    createCanvas(650, 500);
    ellipseMode(RADIUS);
    slider = createSlider(10, 100, 50);
    slider.position(width/3, (9 * height) / 10);
    slider.style('width', '250px');
}

function draw() {
    background(255);

    frameRate(slider.value());

    if (frameCount % width == 0)
        direction = !direction;

    for (let i = 8; i <= height/2 - 40; i+=8){
        noFill()
        strokeWeight(2)
        ellipse(width/2, height/2 - 40, i);
        if (direction)
            ellipse(frameCount % width, height/2 - 40, i);
        else
            ellipse(width - (frameCount % width), height/2 - 40, i);
    }
}