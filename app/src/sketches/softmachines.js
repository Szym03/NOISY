const cellSize = 26;
const cellGap = 3;
const fadeSpeed = 0.05;
const sparkRate = 0.0004; // chance per dead cell per frame to spontaneously spark alive

export default function softmachines(p, env) {
  let cols, rows;
  let cells, nextCells, brightness;

  function seed() {
    cols = Math.max(1, p.floor(p.width / cellSize));
    rows = Math.max(1, p.floor(p.height / cellSize));

    cells = new Uint8Array(cols * rows);
    nextCells = new Uint8Array(cols * rows);
    brightness = new Float32Array(cols * rows);
    for (let i = 0; i < cells.length; i++) {
      cells[i] = p.random() < 0.12 ? 1 : 0;
      brightness[i] = cells[i];
    }
  }

  function revive() {
    for (let i = 0; i < cells.length; i++) {
    if (cells[i] === 0 && p.random() < 0.09) {
      cells[i] = 1;
      brightness[i] = 0; // start faded, let it fade in naturally
    }
  }
  }



  p.setup = () => {
    p.createCanvas(env.container.clientWidth, env.container.clientHeight);
    p.pixelDensity(1);
    p.colorMode(p.HSB, 360, 100, 100);
    p.noStroke();
    p.frameRate(10);

    seed();
  };

  p.draw = () => {
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

        nextCells[idx] = cells[idx]
          ? sum === 2 || sum === 3
            ? 1
            : 0
          : sum === 3
            ? 1
            : 0;

        // Spontaneous sparks keep the grid alive past still lifes/die-offs.
        if (!nextCells[idx] && p.random() < sparkRate) {
          nextCells[idx] = 1;
        }
      }
    }

    [cells, nextCells] = [nextCells, cells];

    let alive = 0;
    for (let i = 0; i < cells.length; i++) {
      alive += cells[i];
    }
    if (alive / (cols * rows) < 0.01) {
      revive();
    }
    const size = cellSize - cellGap;
    p.background(220, 15, 12);

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const idx = x + y * cols;
        brightness[idx] = p.lerp(brightness[idx], cells[idx], fadeSpeed);
        if (brightness[idx] < 0.02) continue;

        const b = brightness[idx];
        p.fill(200, 20 - b * 15, 18 + b * 55);
        p.rect(x * cellSize, y * cellSize, size, size, 3);
      }
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(env.container.clientWidth, env.container.clientHeight);
    seed();
  };
}
