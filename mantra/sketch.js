const chaos    = 50;
let   offset   = 0;

const waveAmp  = 12;
const waveFreq = 0.005;
const waveSpeed= 2;

function setup() {
  let canvas = createCanvas(displayWidth, displayHeight);
  canvas.parent('sketch-container');
  noStroke();
  noiseDetail(3, 0.3);   
  strokeWeight(2);
}

function draw() {
  background(0,0,30);

  const mixNoise = 0.5;   // how much perlin noise vs wave
  for (let x = 0; x < width; x += 7) {
    let nx   = x * 0.02;
    let wave = sin(x * waveFreq + offset * waveSpeed) * waveAmp;

    for (let y = 0; y < height; y += 7) {
      let dx    = (noise(nx, y * 0.035, offset) - 0.5) * chaos;
      
      let dxTot = dx * mixNoise + wave * (1 - mixNoise);

      let cblue = map(dxTot, -25, 25, 0, 255);
      stroke(
        50 + dxTot * 4,
        50 + dxTot * 8.5,
        cblue
      );
      point(x + dxTot, y + 0.5 * dxTot);
    }
  }

  offset += 0.015;
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
