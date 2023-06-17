let maskShader, mask_pg;
let lensShader, lens_pg;
let src;
let roi;

function preload() {

    maskShader = readShader('../../sketches/frags/mask.frag',
        { varyings: Tree.texcoords2 });

    lensShader = readShader('../../sketches/frags/lens.frag',
        { varyings: Tree.texcoords2 });

    // video source: https://t.ly/LWUs2
    // video_src = createVideo(['/sketches/shaders/wagon.webm']);
    // video_src.hide(); // by default video shows up in separate dom
    // image source: https://t.ly/Dz8W
    src = loadImage('../../assets/shrek.png');
}

function setup() {
    createCanvas(550, 550);

    mask_pg = createGraphics(width, height, WEBGL);
    mask_pg.colorMode(RGB, 1);
    mask_pg.textureMode(NORMAL);
    mask_pg.shader(maskShader);

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
    menu.option("Gaussian Blur 5x5");
    menu.option("Unsharp Masking 5x5");

    lens_radius = createSlider(0.1, 0.3, 0.15, 0.01);
    lens_radius.position(110, 40);
    lens_radius.style('width', '80px');
    lens_radius.input(() => {
        maskShader.setUniform('lens_radius', lens_radius.value())
        lensShader.setUniform('lens_radius', lens_radius.value())
    });
    maskShader.setUniform('lens_radius', lens_radius.value());
    lensShader.setUniform('lens_radius', lens_radius.value())

    roi = createSelect();
    roi.position(200, 10);
    roi.style('width', '160px');
    roi.option("Magnifier");
    roi.option("Region of interest");

    magnification = createSlider(1, 8, 2, 0);
    magnification.position(10, 40);
    magnification.style('width', '80px');
    magnification.input(() => {
        lensShader.setUniform('magnification', magnification.value())
    });
    lensShader.setUniform('magnification', magnification.value());

    roi.input(() => {
        if (roi.value() == "Region of interest"){
            magnification.attribute('disabled', '');
        } else {
            magnification.removeAttribute('disabled');
        }
    })
}

function draw() {
    maskShader.setUniform('texOffset', [1 / src.width, 1 / src.height])
    maskShader.setUniform('mask', masking());
    maskShader.setUniform('customLen', masking().length);
    mask_pg.emitResolution(maskShader, 'iResolution');
    mask_pg.emitPointerPosition(maskShader, mouseX, height - mouseY, 'iMouse');
    maskShader.setUniform('roi', roi.value() == "Region of interest");
    maskShader.setUniform('texture', src);

    pg = mask_pg;
    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1)

    lens_pg.emitResolution(lensShader, 'iResolution');
    lens_pg.emitPointerPosition(lensShader, mouseX, mouseY, 'iMouse');
    lensShader.setUniform('roi', roi.value() == "Region of interest");
    lensShader.setUniform('texture', pg)

    pg = lens_pg;
    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1)

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
    }else if (menu.value() == "Gaussian Blur 5x5"){
        return [ 1/256,  4/256,  6/256,  4/256, 1/256, 4/256, 16/256, 24/256, 16/256, 4/256, 6/256, 24/256, 36/256, 24/256, 6/256, 4/256, 16/256, 24/256, 16/256, 4/256, 1/256,  4/256,  6/256,  4/256, 1/256 ]
    } else if (menu.value() == "Unsharp Masking 5x5"){
        return [ -1/256,  -4/256,  -6/256,  -4/256, -1/256, -4/256, -16/256, -24/256, -16/256, -4/256, -6/256, -24/256, 476/256, -24/256, -6/256, -4/256, -16/256, -24/256, -16/256, -4/256, -1/256,  -4/256,  -6/256,  -4/256, -1/256 ]
    }
}