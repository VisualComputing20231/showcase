function setup() {
    createCanvas(600, 400);
    frameRate(100)
    rectMode(CENTER)
}

function draw() {
    background(100,200,100);

    road(frameCount % (2*height))
}

function road(fc){

    fill(180, 200, 255)

    for(let sky = -10; sky >= -200; sky-=10) {
        rect(width / 2, sky + fc / 4, 100 * fc, fc / 4)
    }

    stroke("black")
    strokeWeight(1)

    fill(220, 255)
    triangle(300, -10, 0, 400, 0, 350);

    fill(220, 255)
    triangle(300, -10, 600, 400, 600, 350);

    fill(220, 255)
    ellipse(300, -10 + fc/10, 63*fc/100);
    rect(width/2, -10 + fc/4, 63*fc/100, fc/4);

    fill(0, 255)
    ellipse(300, -10 + fc/10, 55*fc/100);
    rect(width/2, -10 + fc/4, 55*fc/100, fc/4);

    fill(70)
    triangle(300, -10, 600, 400, 0, 400);

    fill(155, 200)
    triangle(300, -10, 570, 400, 30, 400);

    stroke(255)
    fill(255)
    for(let i=15; i>0; i-=2){

        if (i <= 1){
            i+= 0.3
        }
        quad(width/2 - fc/80, i*fc/5, width/2 + fc/80, i*fc/5, width/2 + fc/200, (i-1)*fc/5, width/2 - fc/200, (i-1)*fc/5)
    }


    noStroke()
}