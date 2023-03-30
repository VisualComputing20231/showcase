let video;
let time = 0;
let loaded = false;
let selected = false;
let finished = false;
let reseted = false;
let filters = [false, false, false, false];
let button1, button2, button3, button4;
let rgb = 0;
let r1, g1, b1, r2, g2, b2, r3, g3, b3;

function setup() {
  let c = createCanvas(400, 400); // Twice the width of the video

  c.drop(processFile);
  c.mouseClicked(openFile);

  button1 = createButton("Copy original image here");
  button1.style("background-color", "rgba(0,0,0,0)");
  button1.style("color", "#006699");
  button1.style("border", "none");
  button1.style("font-size", "20px");
  button1.style("font-weight", "bold");
  button2 = createButton("Copy original image here");
  button2.style("background-color", "rgba(0,0,0,0)");
  button2.style("color", "#006699");
  button2.style("border", "none");
  button2.style("font-size", "20px");
  button2.style("font-weight", "bold");
  button3 = createButton("Copy original image here");
  button3.style("background-color", "rgba(0,0,0,0)");
  button3.style("color", "#006699");
  button3.style("border", "none");
  button3.style("font-size", "20px");
  button3.style("font-weight", "bold");

  button4 = createButton("RESET");
  button4.style("background-color", "rgba(0,0,0,0)");
  button4.style("color", "#F00");
  button4.style("font-size", "10px");
  button4.style("font-weight", "bold");

  button1.hide();
  button2.hide();
  button3.hide();
  button4.hide();

  (r1 = 1),
    (g1 = 1),
    (b1 = 1),
    (r2 = 1),
    (g2 = 1),
    (b2 = 1),
    (r3 = 1),
    (g3 = 1),
    (b3 = 1);
}

function processFile(file) {
  selected = true;
  noLoop();
  if (file.type === "video") {
    video = createVideo(file.data, () => {
      loaded = true;
      video.volume(0);
      video.hide();

      const drawNextFrame = () => {
        const onSeek = () => {
          draw();

          video.elt.removeEventListener("seeked", onSeek);

          // Wait a 100 milisecond and draw the next frame
          setTimeout(drawNextFrame, 100); // TODO: Can be adjusted with keypress
        };
        video.elt.addEventListener("seeked", onSeek);

        // Start seeking ahead

        video.time(time); // Seek ahead to the new time
        if (reseted) {
          reseted = false;
          time = 0;
        }
        time += 1 / 60;
      };
      drawNextFrame();

      video.onended(() => {
        // When the video ends
        finished = true;
      });
    });
  }
}

function openFile() {
  let inputbtn = createFileInput(processFile);
  inputbtn.remove();
  inputbtn.elt.click(); //Simulate Click
}

function printCurrentFrame() {
  fill("#F00");
  noStroke();
  textAlign(LEFT, TOP);
  textSize(width / 40);
  text("Frame: " + round(time * 60), width / 8, 5);
}

function copyImage(im, x, y, r, g, b) {
  let img = createImage(im.width, im.height);
  img.copy(im, 0, 0, im.width, im.height, 0, 0, im.width, im.height);
  img.loadPixels();
  let d = pixelDensity();
  let fullImage = 4 * (width * d) * (height * d);
  for (let i = 0; i < fullImage; i += 4) {
    img.pixels[i] = img.pixels[i] * r;
    img.pixels[i + 1] = img.pixels[i + 1] * g;
    img.pixels[i + 2] = img.pixels[i + 2] * b;
    img.pixels[i + 3] = img.pixels[i + 3];
  }
  img.updatePixels();
  image(img, im.width * x, im.height * y);
}

function manageButtons() {
  if (!filters[0]) {
    button1.show();
    button1.position((width * 3) / 4 - (button1.width * 3) / 4, height / 4);
    button1.style("font-size", width / 30 + "px");
    button1.style(
      "color",
      random(["#00669933", "#00669933", "#00669933", "#00669933", "#00669930"])
    );
    button1.mousePressed(() => {
      filters[0] = true;
      button1.hide();
    });
  }

  if (!filters[1]) {
    button2.show();
    button2.position(width / 4 - (button2.width * 3) / 4, (height * 3) / 4);
    button1.style("font-size", width / 30 + "px");
    button2.style(
      "color",
      random(["#00669933", "#00669933", "#00669933", "#00669933", "#00669930"])
    );
    button2.mousePressed(() => {
      filters[1] = true;
      button2.hide();
    });
  }

  if (!filters[2]) {
    button3.show();
    button3.position(
      (width * 3) / 4 - (button3.width * 3) / 4,
      (height * 3) / 4
    );
    button1.style("font-size", width / 30 + "px");
    button3.style(
      "color",
      random(["#00669933", "#00669933", "#00669933", "#00669933", "#00669930"])
    );
    button3.mousePressed(() => {
      filters[2] = true;
      button3.hide();
    });
  }

  button4.show();
  button4.position(5, 5);
  button4.style("font-size", width / 50 + "px");
  button4.style("color", random(["#F00", "#FFF"]));
  button4.mousePressed(() => {
    (r1 = 1),
      (g1 = 1),
      (b1 = 1),
      (r2 = 1),
      (g2 = 1),
      (b2 = 1),
      (r3 = 1),
      (g3 = 1),
      (b3 = 1);
    reseted = true;
  });
}

function draw() {
  background(20);
  if (!selected) {
    let time = millis();
    fill(0, 102, 153);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize((width / 500) * sin(time / 250) + width / 20);
    text("SELECT or DROP video files HERE...", width / 2, height / 2);
  }

  if (loaded && !finished) {
    // Draw the original video to the screen
    resizeCanvas(video.width * 2, video.height * 2);

    image(video, 0, 0);
    printCurrentFrame();

    manageButtons();

    if (filters[0]) {
      copyImage(video, 1, 0, r1, g1, b1);
    }
    if (filters[1]) {
      copyImage(video, 0, 1, r2, g2, b2);
    }
    if (filters[2]) {
      copyImage(video, 1, 1, r3, g3, b3);
    }

    if (keyIsDown(82)) {
      fill("#F00");
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      text("R", video.width, 15);
    }
    if (keyIsDown(71)) {
      fill("#0F0");
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      text("G", video.width, 15);
    }
    if (keyIsDown(66)) {
      fill("#00F");
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      text("B", video.width, 15);
    }
  }
}

function keyPressed() {
  if (key == "s") {
    saveCanvas("myCanvas", "jpg");
  }
  if (key == "r") {
    rgb = 0;
  }
  if (key == "g") {
    rgb = 1;
  }
  if (key == "b") {
    rgb = 2;
  }
}

function mouseWheel(event) {
  print(event.delta);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  if (keyIsDown(SHIFT)) {
    if (mouseX > video.width && mouseY < video.height && filters[0]) {
      if (rgb == 0) {
        fill("#F00");
        r1 -= event.delta / 256;
        if (r1 < 0) {
          r1 = 0;
        } else if (r1 > 5) {
          r1 = 5;
        }
        text("R: " + round(r1, 1), (video.width * 3) / 2, 15);
      }
      if (rgb == 1) {
        fill("#0F0");
        g1 -= event.delta / 256;
        if (g1 < 0) {
          g1 = 0;
        } else if (g1 > 5) {
          g1 = 5;
        }
        text("G: " + round(g1, 1), (video.width * 3) / 2, 15);
      }
      if (rgb == 2) {
        fill("#00F");
        b1 -= event.delta / 100;
        if (b1 < 0) {
          b1 = 0;
        } else if (b1 > 5) {
          b1 = 5;
        }
        text("B: " + round(b1, 1), (video.width * 3) / 2, 15);
      }
    }
    if (mouseX < video.width && mouseY > video.height && filters[1]) {
      if (rgb == 0) {
        fill("#F00");
        r2 -= event.delta / 256;
        if (r2 < 0) {
          r2 = 0;
        } else if (r2 > 5) {
          r2 = 5;
        }
        text("R: " + round(r2, 1), video.width / 2, video.height + 15);
      }
      if (rgb == 1) {
        fill("#0F0");
        g2 -= event.delta / 256;
        if (g2 < 0) {
          g2 = 0;
        } else if (g2 > 5) {
          g2 = 5;
        }
        text("G: " + round(g2, 1), video.width / 2, video.height + 15);
      }
      if (rgb == 2) {
        fill("#00F");
        b2 -= event.delta / 256;
        if (b2 < 0) {
          b2 = 0;
        } else if (b2 > 5) {
          b2 = 5;
        }
        text("B: " + round(b2, 1), video.width / 2, video.height + 15);
      }
    }
    if (mouseX > video.width && mouseY > video.height && filters[2]) {
      if (rgb == 0) {
        fill("#F00");
        r3 -= event.delta / 256;
        if (r3 < 0) {
          r3 = 0;
        } else if (r3 > 5) {
          r3 = 5;
        }
        text("R: " + round(r3, 1), (video.width * 3) / 2, video.height + 15);
      }
      if (rgb == 1) {
        fill("#0F0");
        g3 -= event.delta / 256;
        if (g3 < 0) {
          g3 = 0;
        } else if (g3 > 5) {
          g3 = 5;
        }
        text("G: " + round(g3, 1), (video.width * 3) / 2, video.height + 15);
      }
      if (rgb == 2) {
        fill("#00F");
        b3 -= event.delta / 256;
        if (b3 < 0) {
          b3 = 0;
        } else if (b3 > 5) {
          b3 = 5;
        }
        text("B: " + round(b3, 1), (video.width * 3) / 2, video.height + 15);
      }
    }
  }
}
