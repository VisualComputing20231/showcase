let blendingShader;
let brightness;
let color1, color2, picker1, picker2;
let blendingSelect;
let mode = 0, identity = [1.0, 1.0, 1.0, 1.0];

function preload() {
    blendingShader = readShader(
        '/showcase/sketches/frags/colorBlending.frag'
    );
}

function setup() {
    createCanvas(550, 550, WEBGL);
    colorMode(RGB, 1);
    noStroke();

    picker1 = createColorPicker(color('#cc804d'));
    picker1.position(30, 30);
    picker2 = createColorPicker(color('#e61a66'));
    picker2.position(width / 2 + 30, 30);

    brightness = createSlider(0, 1, 1, 0.01);
    brightness.position(width / 2 + 40, height / 2);
    brightness.style('width', '100px');

    shader(blendingShader);

    blendingSelect = createSelect();
    blendingSelect.position(150, height / 2);
    blendingSelect.option('MULTIPLY');
    blendingSelect.option('ADD');
    blendingSelect.option('DARKEST');
    blendingSelect.option('LIGHTEST');
    blendingSelect.option('DIFFERENCE');
    blendingSelect.option('SCREEN');

    blendingSelect.changed(() => {
        [mode, identity] = blendingMode(blendingSelect.value());
        blendingShader.setUniform("blendMode", mode)
    });
}

function draw() {
    color1 = picker1.color();
    color2 = picker2.color();
    background(0);

    blendingShader.setUniform('uMaterial2', identity);
    blendingShader.setUniform('uMaterial1', [red(color1), green(color1), blue(color1), 1.0]);
    blendingShader.setUniform('brightness', 1.0);

    beginShape();
    vertex(-0.85, 0.15, 0);
    vertex(-0.15, 0.15, 0);
    vertex(-0.15, 0.85, 0);
    vertex(-0.85, 0.85, 0);
    endShape();

    blendingShader.setUniform('uMaterial1', identity);
    blendingShader.setUniform('uMaterial2', [red(color2), green(color2), blue(color2), 1.0]);
    blendingShader.setUniform('brightness', 1.0);

    beginShape();
    vertex(0.15, 0.15, 0);
    vertex(0.85, 0.15, 0);
    vertex(0.85, 0.85, 0);
    vertex(0.15, 0.85, 0);
    endShape();

    blendingShader.setUniform('uMaterial1', [red(color1), green(color1), blue(color1), 1.0]);
    blendingShader.setUniform('uMaterial2', [red(color2), green(color2), blue(color2), 1.0]);
    blendingShader.setUniform('brightness', brightness.value());
    blendingShader.setUniform('identity', [1.0, 1.0, 1.0, 1.0]);

    beginShape();
    vertex(-0.35, -0.85, 0);
    vertex(0.35, -0.85, 0);
    vertex(0.35, -0.15, 0);
    vertex(-0.35, -0.15, 0);
    endShape();
}

function blendingMode(mode){
    if (mode === 'MULTIPLY'){
        return [0,  [1.0, 1.0, 1.0, 1.0]]
    }
    else if (mode === 'ADD'){
        return [1,  [0.0, 0.0, 0.0, 0.0]]
    }
    else if (mode === 'DARKEST'){
        return [2,  [1.0, 1.0, 1.0, 1.0]]
    }
    else if (mode === 'LIGHTEST'){
        return [3,  [0.0, 0.0, 0.0, 0.0]]
    }
    else if (mode === 'DIFFERENCE'){
        return [4,  [0.0, 0.0, 0.0, 0.0]]
    }
    else if (mode === 'SCREEN'){
        return [5,  [0.0, 0.0, 0.0, 0.0]]
    }
}