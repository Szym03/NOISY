const cellSize = 8;

export default function softmachines(p, env) {
  let cols, rows;
  let cells, nextCells;
  let buffer;

  function seed() {
    cols = Math.max(1, p.floor(p.width / cellSize));
    rows = Math.max(1, p.floor(p.height / cellSize));

    // Initialize cells randomly (10% alive)
    cells = new Float32Array(cols * rows);
    nextCells = new Float32Array(cols * rows);
    for (let i = 0; i < cells.length; i++) {
      cells[i] = p.random() < 0.1 ? 1 : 0;
    }
  }

  p.setup = () => {
    p.createCanvas(env.container.clientWidth, env.container.clientHeight);
    p.pixelDensity(1);

    seed();

    // Offscreen buffer at cell resolution
    buffer = p.createGraphics(cols, rows);
    buffer.pixelDensity(1);
    buffer.noStroke();
  };

  p.draw = () => {
    // Compute next generation
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const idx = x + y * cols;
        let sum = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const col = (x + i + cols) % cols;
            const row = (y + j + rows) % rows;
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

    [cells, nextCells] = [nextCells, cells];

    // Draw smoothed states into buffer
    buffer.loadPixels();
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const idx = x + y * cols;
        const pixIdx = idx * 4;
        const prev = buffer.pixels[pixIdx] / 255;
        const c = p.floor(p.lerp(prev, cells[idx], 0.1) * 255);
        buffer.pixels[pixIdx] = c;
        buffer.pixels[pixIdx + 1] = c;
        buffer.pixels[pixIdx + 2] = c;
        buffer.pixels[pixIdx + 3] = 255;
      }
    }
    buffer.updatePixels();

    // Stretch buffer to fill the window
    p.image(buffer, 0, 0, p.width, p.height);
  };

  p.windowResized = () => {
    p.resizeCanvas(env.container.clientWidth, env.container.clientHeight);
    seed();
    buffer.resizeCanvas(cols, rows);
  };
}
