let maskShader, mask_pg, pg;
let lensShader, lens_radius, magnification, lens_pg;
let lumaShader, luma_pg;
let img, vid, video_on, src;
let roi;
let menu, coloringBrightness;

function preload() {

    maskShader = readShader('/showcase/sketches/frags/mask.frag',
        { varyings: Tree.texcoords2 });

    lensShader = readShader('/showcase/sketches/frags/lens.frag',
        { varyings: Tree.texcoords2 });

    lumaShader = readShader('/showcase/sketches/frags/luma.frag',
        { varyings: Tree.texcoords2 });

    img = loadImage('../../assets/shrek.png');
    vid = createCapture(VIDEO);
    vid.hide();
    src = img;
}

function setup() {
    createCanvas(550, 550);

    video_on = createCheckbox('camera', false);
    video_on.style('color', 'white');
    video_on.changed(() => {
        src = video_on.checked() ? vid : img;
    });
    video_on.position(480, 40);

    mask_pg = createGraphics(width, height, WEBGL);
    mask_pg.colorMode(RGB, 1);
    mask_pg.textureMode(NORMAL);
    mask_pg.shader(maskShader);

    luma_pg = createGraphics(width, height, WEBGL);
    luma_pg.colorMode(RGB, 1);
    luma_pg.textureMode(NORMAL);
    luma_pg.shader(lumaShader);

    lens_pg = createGraphics(width, height, WEBGL);
    lens_pg.colorMode(RGB, 1);
    lens_pg.textureMode(NORMAL);
    lens_pg.shader(lensShader);

    menu = createSelect();
    menu.position(10, 10);
    menu.style('width', '160px');
    menu.option("Identity");
    menu.option("Edge Detection");
    menu.option("Sharpen");
    menu.option("Emboss");
    menu.option("Sobel");
    menu.option("Gaussian Blur 5x5");
    menu.option("Unsharp Masking 5x5");

    lens_radius = createSlider(0.1, 0.3, 0.15, 0.01);
    lens_radius.position(110, 40);
    lens_radius.style('width', '80px');
    lens_radius.input(() => {
        maskShader.setUniform('lens_radius', lens_radius.value())
        lumaShader.setUniform('lens_radius', lens_radius.value())
        lensShader.setUniform('lens_radius', lens_radius.value())
    });
    maskShader.setUniform('lens_radius', lens_radius.value());
    lumaShader.setUniform('lens_radius', lens_radius.value());
    lensShader.setUniform('lens_radius', lens_radius.value())

    roi = createSelect();
    roi.position(200, 10);
    roi.style('width', '160px');
    roi.option("None");
    roi.option("Magnifier");
    roi.option("R.O.I: Convolution");
    roi.option("R.O.I: Color Brightness");

    magnification = createSlider(1, 8, 2, 0);
    magnification.position(10, 40);
    magnification.style('width', '80px');
    magnification.input(() => {
        lensShader.setUniform('magnification', magnification.value())
    });
    lensShader.setUniform('magnification', magnification.value());
    magnification.attribute('disabled', '');
    lens_radius.attribute('disabled', '');

    roi.input(() => {
        if (roi.value() == "Magnifier"){
            magnification.removeAttribute('disabled');
        } else {
            magnification.attribute('disabled', '');
        }
        if (roi.value() == "None"){
            lens_radius.attribute('disabled', '');
        } else {
            lens_radius.removeAttribute('disabled');
        }
    })

    coloringBrightness = createSelect();
    coloringBrightness.position(390, 10);
    coloringBrightness.style('width', '160px');
    coloringBrightness.option('None');
    coloringBrightness.option('Luma');
    coloringBrightness.option('HSV');
    coloringBrightness.option('HSL');
    coloringBrightness.option('Average');

    coloringBrightness.changed(() => {
        let val = coloringBrightness.value();
        if (val === 'Luma') {
            lumaShader.setUniform('coloringBrightness', 1);
        } else if (val === 'HSV') {
            lumaShader.setUniform('coloringBrightness', 2);
        } else if (val === 'HSL') {
            lumaShader.setUniform('coloringBrightness', 3);
        } else if (val === 'Average') {
            lumaShader.setUniform('coloringBrightness', 4);
        } else {
            lumaShader.setUniform('coloringBrightness', 0);
        }
    });

    lumaShader.setUniform('coloringBrightness', 0);
}

function draw() {
    maskShader.setUniform('texOffset', [1 / src.width, 1 / src.height])
    maskShader.setUniform('mask', masking());
    maskShader.setUniform('customLen', masking().length);
    mask_pg.emitResolution(maskShader, 'iResolution');
    mask_pg.emitPointerPosition(maskShader, mouseX, height - mouseY, 'iMouse');
    maskShader.setUniform('roi', roi.value() == "R.O.I: Convolution");
    maskShader.setUniform('texture', src);

    pg = mask_pg;
    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1)

    lens_pg.emitResolution(lensShader, 'iResolution');
    lens_pg.emitPointerPosition(lensShader, mouseX, mouseY, 'iMouse');
    lensShader.setUniform('roi', roi.value() != "Magnifier");
    lensShader.setUniform('texture', pg)

    pg = lens_pg;
    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1)

    luma_pg.emitResolution(lumaShader, 'iResolution');
    luma_pg.emitPointerPosition(lumaShader, mouseX, mouseY, 'iMouse');
    lumaShader.setUniform('roi', roi.value() == "R.O.I: Color Brightness");
    lumaShader.setUniform('texture', pg);

    pg = luma_pg;
    pg.quad(-1, 1, 1, 1, 1, -1, -1, -1)

    image(pg, 0, 0)
}

function masking() {
    if (menu.value() == "Identity"){
        return [ 0, 0, 0, 0, 1, 0, 0, 0, 0 ];
    } else if (menu.value() == "Edge Detection"){
        return [ -1, -1, -1, -1, 8, -1, -1, -1, -1 ];
    } else if (menu.value() == "Sharpen"){
        return [ 0, -1, 0, -1, 5, -1, 0, -1, 0 ];
    } else if (menu.value() == "Emboss"){
        return [ -2, -1, 0, -1, 1, 1, 0, 1, 2 ];
    } else if (menu.value() == "Sobel"){
        return [ 1, 2, 1, 0, 0, 0, -1, -2, -1 ];
    }else if (menu.value() == "Gaussian Blur 5x5"){
        return [ 1/256,  4/256,  6/256,  4/256, 1/256, 4/256, 16/256, 24/256, 16/256, 4/256, 6/256, 24/256, 36/256, 24/256, 6/256, 4/256, 16/256, 24/256, 16/256, 4/256, 1/256,  4/256,  6/256,  4/256, 1/256 ]
    } else if (menu.value() == "Unsharp Masking 5x5"){
        return [ -1/256,  -4/256,  -6/256,  -4/256, -1/256, -4/256, -16/256, -24/256, -16/256, -4/256, -6/256, -24/256, 476/256, -24/256, -6/256, -4/256, -16/256, -24/256, -16/256, -4/256, -1/256,  -4/256,  -6/256,  -4/256, -1/256 ]
    }
}