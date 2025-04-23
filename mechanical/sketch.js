let cellSize = 8;
let cols, rows;
let cells, nextCells;
let buffer;

function setup() {
  // Create and style the main canvas as a full-screen background
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  canvas.style('position', 'fixed');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('width', '100vw');
  canvas.style('height', '100vh');
  canvas.style('z-index', '-1');
  canvas.style('pointer-events', 'none');

  pixelDensity(1);

  cols = floor(width / cellSize);
  rows = floor(height / cellSize);

  // Initialize cells randomly (10% alive)
  cells = new Float32Array(cols * rows);
  nextCells = new Float32Array(cols * rows);
  for (let i = 0; i < cells.length; i++) {
    cells[i] = random() < 0.1 ? 1 : 0;
  }

  // Offscreen buffer at cell resolution
  buffer = createGraphics(cols, rows);
  buffer.pixelDensity(1);
  buffer.noStroke();
}

function draw() {
  // Compute next generation
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let idx = x + y * cols;
      let sum = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          let col = (x + i + cols) % cols;
          let row = (y + j + rows) % rows;
          sum += cells[col + row * cols];
        }
      }
      sum -= cells[idx];

      // Game of Life rules
      nextCells[idx] = cells[idx] > 0.5
        ? (sum === 2 || sum === 3 ? 1 : 0)
        : (sum === 3 ? 1 : 0);
    }
  }

  // Swap cell buffers
  [cells, nextCells] = [nextCells, cells];

  // Draw smoothed states into buffer
  buffer.loadPixels();
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let idx = x + y * cols;
      let pixIdx = idx * 4;
      let prev = buffer.pixels[pixIdx] / 255;
      let b = lerp(prev, cells[idx], 0.1);
      let c = floor(b * 255);
      buffer.pixels[pixIdx] = c;
      buffer.pixels[pixIdx + 1] = c;
      buffer.pixels[pixIdx + 2] = c;
      buffer.pixels[pixIdx + 3] = 255;
    }
  }
  buffer.updatePixels();

  // Apply gentle blur for soft edges
  buffer.filter(BLUR, 1);

  // Stretch buffer to fill screen
  image(buffer, 0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
  cells = new Float32Array(cols * rows);
  nextCells = new Float32Array(cols * rows);
  for (let i = 0; i < cells.length; i++) {
    cells[i] = random() < 0.1 ? 1 : 0;
  }
  buffer.resizeCanvas(cols, rows);
}
