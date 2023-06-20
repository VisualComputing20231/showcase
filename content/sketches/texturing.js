let coloringShader;
let img, vid, video_on, src;
let coloringBrightness;
let blendingSelect, picker, selectedColor;

function preload() {
    coloringShader = readShader('/showcase/sketches/frags/texturing.frag', { varyings: Tree.texcoords2 });
    img = loadImage('../../assets/fire_breathing.jpg');
    vid = createVideo(['../../assets/wagon.webm']);
    vid.hide();
    src = img
}

function setup() {
    createCanvas(700, 500, WEBGL);
    noStroke();
    textureMode(NORMAL);
    shader(coloringShader);

    video_on = createCheckbox('video', false);
    video_on.style('color', 'white');
    video_on.changed(() => {
        src = video_on.checked() ? vid : img;
        video_on.checked() ? vid.loop() : vid.pause();
    });
    video_on.position(120, 30);

    coloringBrightness = createSelect();
    coloringBrightness.position(30, 30);
    coloringBrightness.option('None');
    coloringBrightness.option('Luma');
    coloringBrightness.option('HSV');
    coloringBrightness.option('HSL');
    coloringBrightness.option('Average');

    picker = createColorPicker(color('#010104'));
    picker.position(width - 60, 30);

    blendingSelect = createSelect();
    blendingSelect.position(width - 140, 30);
    blendingSelect.option('No Tint');
    blendingSelect.option('Tint');

    coloringBrightness.changed(() => {
        let val = coloringBrightness.value();
        if (val === 'Luma') {
            coloringShader.setUniform('coloringBrightness', 1);
        } else if (val === 'HSV') {
            coloringShader.setUniform('coloringBrightness', 2);
        } else if (val === 'HSL') {
            coloringShader.setUniform('coloringBrightness', 3);
        } else if (val === 'Average') {
            coloringShader.setUniform('coloringBrightness', 4);
        } else {
            coloringShader.setUniform('coloringBrightness', 0);
        }
    });

    blendingSelect.changed(() => {
        if (blendingSelect.value() === 'Tint') {
            coloringShader.setUniform('tinting', true);
        } else {
            coloringShader.setUniform('tinting', false);
        }
    });

    coloringShader.setUniform('coloringBrightness', 0);
    coloringShader.setUniform('tinting', false);
}

function draw() {
    selectedColor = picker.color();
    background(0);
    coloringShader.setUniform('texture', src);
    coloringShader.setUniform('color', [red(selectedColor), green(selectedColor), blue(selectedColor), 1.0]);
    beginShape();
    // format is: vertex(x, y, z, u, v)
    vertex(-1, -1, 0, 0, 1);
    vertex(1, -1, 0, 1, 1);
    vertex(1, 1, 0, 1, 0);
    vertex(-1, 1, 0, 0, 0);
    endShape();
}