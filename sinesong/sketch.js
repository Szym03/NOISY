let cols, rows;
let scl = 100;           
let flowfield = [];
let zoff = 0;

const numParticles = 200; 
let particles = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  canvas.style('position', 'fixed');
  canvas.style('top', '0');
  canvas.style('left', '0');
  canvas.style('width', '100vw');
  canvas.style('height', '100vh');
  canvas.style('z-index', '-1');
  canvas.style('pointer-events', 'none');
  createCanvas(windowWidth, windowHeight);
  smooth();                   // enable antialiasing
  strokeCap(ROUND);           // round line ends

  cols = floor(width / scl);
  rows = floor(height / scl);
  flowfield = new Array(cols * rows);

  // initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }

  background(23, 10, 74);
}

function draw() {
  // fade old trails quickly so lines vanish
  background(23, 10, 74, 50);

  // rebuild flow field with finer increments for smoother curves
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      xoff += 0.05;
    }
    yoff += 0.05;
  }
  zoff += 0.001;

  // update & draw particles
  for (let p of particles) {
    p.follow(flowfield);
    p.update();
    p.edges();
    p.show();
    p.life--;
    if (p.life <= 0) {
      p.reset();
    }
  }
}

class Particle {
  constructor() {
    this.vel = createVector();
    this.acc = createVector();
    this.maxSpeed = 2;
    this.reset();
  }

  reset() {
    // new random position + lifetime
    this.pos = createVector(random(width), random(height));
    this.prevPos = this.pos.copy();
    this.life = floor(random(60, 120));

    // zero out motion so you don’t get one giant spur
    this.vel.set(0, 0);
    this.acc.set(0, 0);
  }

  follow(flow) {
    // compute which cell 
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);

    // clamp to valid indices
    x = constrain(x, 0, cols - 1);
    y = constrain(y, 0, rows - 1);

    let index = x + y * cols;
    let force = flow[index];
    this.applyForce(force);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    this.prevPos.set(this.pos);
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    let halfLife = 60;
    let alpha;
  
    if (this.life > halfLife) {
      // Fading in
      alpha = map(this.life, 120, halfLife, 0, 255);
    } else {
      // Fading out
      alpha = map(this.life, halfLife, 0, 255, 0);
    }
  
    stroke(227, 237, 38, alpha);
    strokeWeight(3);
    line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
  }

  edges() {
    let wrapped = false;

    if (this.pos.x > width)  { this.pos.x = 0; wrapped = true; }
    if (this.pos.x < 0)      { this.pos.x = width; wrapped = true; }
    if (this.pos.y > height) { this.pos.y = 0; wrapped = true; }
    if (this.pos.y < 0)      { this.pos.y = height; wrapped = true; }

    // if we did teleport, reset prevPos so no line is drawn across
    if (wrapped) {
      this.prevPos = this.pos.copy();
    }
}
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
