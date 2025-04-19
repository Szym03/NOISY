let t = 0;
let numWaves = 8;         // Number of waves
let waveHeight = 100;     // Amplitude of the waves
let noiseStrength = 0.5;  // Noise impact

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  background(255);
  frameRate(30);
  colorMode(HSB, 360, 100, 100); // Use HSB color mode for dynamic blue hues
}

function draw() {
  background(255); // Clear the background each frame

  let waveSpacing = (height / numWaves)*1.1; // Space between waves

  // Loop through each wave
  for (let i = 0; i < numWaves; i++) {
    let yOffset = i * waveSpacing;
    
    // Set a dynamic stroke color: vary hue across waves and slightly over time
    let hueVal = map(i, 0, numWaves - 1, 200, 250); // Hues in the blue range
    // You can add a time-based modulation to the hue if desired:
    hueVal = (hueVal + t * 5) % 360;
    stroke(hueVal, 80, 90); 
    strokeWeight(2);
    noFill();
    
    beginShape();
    // Sample every 5 pixels for efficiency
    for (let x = 0; x <= width; x += 5) {
      let wave = sin(TWO_PI * (x / width) * 2 + t * (0.01 * (i + 1))) +
                 noise(x * 0.02, t * 0.02) * noiseStrength;
      let y = yOffset + wave * waveHeight;
      vertex(x, y);
    }
    endShape();
  }

  t += 0.06; // Increment time for animation
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
