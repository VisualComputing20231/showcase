let mosaic;
let paintings, imageCells, pg;
let symbol;
// ui
let resolution;
let uv, pixelator;
let movie = 0, num_movies = 56;

function preload() {
    mosaic = readShader('/showcase/sketches/frags/photomosaic.frag',
        { varyings: Tree.texcoords2 });
    paintings = [];
    for (let i = 1; i <= num_movies; i++) {
        paintings.push(loadImage(`../../assets/photomosaic/${i}.jpg`));
    }
}

function setup() {
    createCanvas(600, 600, WEBGL);
    textureMode(NORMAL);
    noStroke();
    shader(mosaic);
    imageCells = createQuadrille(paintings);
    resolution = createSlider(10, 600, 450, 10);
    resolution.position(width - 120, 620);
    resolution.style('width', '80px');
    resolution.input(() => {
        mosaic.setUniform('resolution', resolution.value())
    });
    mosaic.setUniform('resolution', resolution.value());
    symbol = paintings[movie];
    mosaic.setUniform('uv', false);
    uv = createCheckbox('uv visualization', false);
    uv.style('color', 'white');
    uv.changed(() => mosaic.setUniform('uv', uv.checked()));
    uv.position(30, 620);

    pixelator = createCheckbox('pixelator', false);
    pixelator.style('color', 'white');
    pixelator.changed(() => mosaic.setUniform('pixelator', pixelator.checked()));
    pixelator.position(width/2 - 40, 620);

    pg = createGraphics(100 * imageCells.width, 100);
    mosaic.setUniform('pg_size', imageCells.width);
    imageCells.sort();
    drawQuadrille(imageCells, {
        graphics: pg,
        cellLength: 100,
        outlineWeight: 0,
    });
}

function keyPressed() {
    if (key === 'd') {
        movie += 1;
        if (movie >= num_movies){
            movie = 0;
        }
        symbol = paintings[movie];
    }
    else if (key === 's') {
        movie -= 1;
        if (movie < 0){
            movie = num_movies - 1;
        }
        symbol = paintings[movie];
    }
}

function draw() {
    mosaic.setUniform('palette', pg);
    mosaic.setUniform('source', symbol);
    beginShape();
    vertex(-1, -1, 0, 0, 1);
    vertex(1, -1, 0, 1, 1);
    vertex(1, 1, 0, 1, 0);
    vertex(-1, 1, 0, 0, 0);
    endShape();
}