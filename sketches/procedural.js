let pg;
let proceduralShader;
let bricksize, solidSpped, noiseSelection;
let valueNoise = false;
let gradientNoise = false;
let simplexNoise = false;
let shapeSelection;
let selectedShape = 'Sphere';

function preload() {
    proceduralShader = loadShader('/showcase/sketches/frags/procedural.vert', '/showcase/sketches/frags/procedural.frag');
}

function setup() {
    createCanvas(500, 500, WEBGL);

    pg = createGraphics(500, 500, WEBGL);
    pg.textureMode(NORMAL);
    pg.noStroke();
    pg.shader(proceduralShader);
    
    // emitResolution, see: https://github.com/VisualComputing/p5.treegl#macros
    pg.emitResolution(proceduralShader);
    
    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    
    bricksize = createSlider(10, 100, 10, 10);
    bricksize.position(30, 30);

    solidSpped = createSlider(0.05, 0.4, 0.05, 0.05);
    solidSpped.position(190, 30);

    noiseSelection = createSelect();
    noiseSelection.position(360, 30);
    noiseSelection.option('None');
    noiseSelection.option('Value Noise');
    noiseSelection.option('Gradient Noise');
    noiseSelection.option('Simplex Noise');
    noiseSelection.changed(() => {
        let val = noiseSelection.value();
        valueNoise = gradientNoise = simplexNoise = false;
        if(val === 'Value Noise'){
            valueNoise = true;
        } else if(val === 'Gradient Noise'){
            gradientNoise = true;
        } else if(val === 'Simplex Noise'){
            simplexNoise = true;
        }
    });

    shapeSelection = createSelect();
    shapeSelection.position(220, height - 30);
    shapeSelection.option('Sphere');
    shapeSelection.option('Cylinder');
    shapeSelection.option('Box');
    shapeSelection.option('Cone');
    shapeSelection.changed(() => {
        selectedShape = shapeSelection.value();
    });

    // Set texture
    proceduralShader.setUniform('brick_num', 10.0);
    proceduralShader.setUniform('speedFactor', 0.02);
    proceduralShader.setUniform('valueNoise', false);
    proceduralShader.setUniform('gradientNoise', false);
    proceduralShader.setUniform('simplexNoise', false);
    texture(pg);
    noStroke();
}

function draw() {
    proceduralShader.setUniform('frameCount', frameCount);
    proceduralShader.setUniform('brick_num', bricksize.value());
    proceduralShader.setUniform('speedFactor', solidSpped.value());

    proceduralShader.setUniform('valueNoise', valueNoise);
    proceduralShader.setUniform('gradientNoise', gradientNoise);
    proceduralShader.setUniform('simplexNoise', simplexNoise);

    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    orbitControl();

    if(selectedShape === 'Sphere'){
        background(0);
        sphere(150);
    } else if(selectedShape === 'Cylinder'){
        background(0);
        cylinder(150, 200);
    } else if(selectedShape === 'Box'){
        background(0);
        box(200);
    } else if(selectedShape === 'Cone'){
        background(0);
        cone(150,250);
    }
}

function mouseMoved() {
    let lightLoc = treeLocation(createVector(-(mouseX - width / 2), -(mouseY - height / 2), 1.5), { from: 'SCREEN', to: 'CLIP'});
    proceduralShader.setUniform('light_pos', [lightLoc.x, lightLoc.y, lightLoc.z, 1.] );
    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
}