let cols, rows;
let scl = 20
let w = 1200
let h = 900
let terrein
var fly = 0
let colors

function setup() {
  createCanvas(800, 650, WEBGL);
  cols = w/scl
  rows = h/scl
  
  terrein = Array(cols)
  
  for(var x = 0; x<terrein.length; x++){
    terrein[x] = new Array(rows)
  }
  
  slider = createSlider(0, 300, 100);
  slider.position(width/3, 30);
  slider.style('width', '300px');
  
}

function draw() {
  
  fly -= 0.1
  var yoff = fly
  
  for(var j=0; j<rows; j++){
    var xoff = 0
    for(var i=0; i<cols; i++){
      terrein[i][j] = map(noise(xoff,yoff), 0, 1, -100, slider.value())
      xoff += 0.1
    }
    yoff += 0.1
  }
  
  background(10);
  stroke(225)
  
  
  
  
  translate(0, 0)
  rotateX(PI/3)
  translate(-w/2, -h/2)
  
  for(var j=0; j<rows-1; j++){
    
    beginShape(TRIANGLE_STRIP)
    
    for(var i=0; i<cols; i++){
      vertex(i*scl, j*scl, terrein[i][j])
      vertex(i*scl, (j+1)*scl, terrein[i][j+1])
      colors = colorChange(terrein[i][j])
      fill(colors)
    }
    endShape()
  }
  
  
}

function colorChange(num){
  if(num>=120){
      return(255)
  }else if(num>=100){
    return(200)
  }else if(num>=40){
    return([128,64 ,0])
  }
  else if(num>=10){
    return([0,150,0])
  }
  else{
    return([0,0,150])
  }
}