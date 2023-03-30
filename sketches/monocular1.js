let val1 = []; let val2 = []; let val3 = []

function setup() {
    createCanvas(400, 400);
    frameRate(30)
    for(let i = 0; i < 8; i++){
        append(val1, height - random(height/2, height))
        append(val2, height - random(height/4, 4*height/5))
        append(val3, height - random(20, 3*height/5))
    }
}

function draw() {
    background(255);
    for(let i = -1; i <= width; i+=1){
        stroke(100,150,255,85)
        rect(((frameCount + i) % (width+1)), val1[int(i/50)], 0, height)
    }
    for(let i = -1; i <= width; i++){
        stroke(50,100,200,170)
        rect(((frameCount*4 + i) % (width+1)), val2[int(i/50)], 0, height)
    }
    for(let i = -1; i <= width; i++){
        stroke(0,50,100,255)
        rect(((frameCount*8 + i) % (width+1)), val3[int(i/50)], 0, height)
    }
}