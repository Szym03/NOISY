let pg;
let res = 5; // resolution factor: higher number = lower resolution

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  frameRate(30);
  
  // Create an off-screen graphics buffer at reduced resolution
  pg = createGraphics(floor(windowWidth / res), floor(windowHeight / res));
  pg.pixelDensity(1);  // Ensure performance by setting pixel density to 1
  noSmooth();          // Disable smoothing on main canvas
  pg.noSmooth();       // Disable smoothing on the graphics buffer
}

function draw() {
    pg.loadPixels();
    let t = frameCount * 0.004; // time component for animation
    for (let x = 0; x < pg.width; x++) {
      for (let y = 0; y < pg.height; y++) {
        let noiseValue = noise(x * 0.02, y * 0.02, t) * 255;
        let index = (x + y * pg.width) * 4;
        pg.pixels[index] = noiseValue;
        pg.pixels[index + 1] = noiseValue;
        pg.pixels[index + 2] = noiseValue;
        pg.pixels[index + 3] = 255;
      }
    }
    pg.updatePixels();
    image(pg, 0, 0, width, height);

    fill(255, 105, 180, 50); // RGBA (R=255, G=105, B=180, A=100 for transparency)
    rect(0, 0, width, height);
  }
  

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Also resize the off-screen buffer accordingly
  pg.resizeCanvas(floor(windowWidth / res), floor(windowHeight / res));
}
