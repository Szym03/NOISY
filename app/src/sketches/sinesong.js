import p5 from "p5";

const scl = 100;
const numParticles = 200;

export default function sinesong(p, env) {
  let cols, rows;
  let flowfield = [];
  let zoff = 0;
  const particles = [];

  class Particle {
    constructor() {
      this.vel = p.createVector();
      this.acc = p.createVector();
      this.maxSpeed = 0.5;
      this.reset();
    }

    reset() {
      this.pos = p.createVector(p.random(p.width), p.random(p.height));
      this.prevPos = this.pos.copy();
      this.life = p.floor(p.random(60, 120));

      // zero out motion so you don't get one giant spur
      this.vel.set(0, 0);
      this.acc.set(0, 0);
    }

    follow(flow) {
      let x = p.floor(this.pos.x / scl);
      let y = p.floor(this.pos.y / scl);
      x = p.constrain(x, 0, cols - 1);
      y = p.constrain(y, 0, rows - 1);
      this.acc.add(flow[x + y * cols]);
    }

    update() {
      this.prevPos.set(this.pos);
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }

    show() {
      const halfLife = 60;
      const alpha =
        this.life > halfLife
          ? p.map(this.life, 120, halfLife, 0, 255) // fading in
          : p.map(this.life, halfLife, 0, 255, 0); // fading out

      p.stroke(227, 237, 38, alpha);
      p.strokeWeight(3);
      p.line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
    }

    edges() {
      let wrapped = false;
      if (this.pos.x > p.width) { this.pos.x = 0; wrapped = true; }
      if (this.pos.x < 0) { this.pos.x = p.width; wrapped = true; }
      if (this.pos.y > p.height) { this.pos.y = 0; wrapped = true; }
      if (this.pos.y < 0) { this.pos.y = p.height; wrapped = true; }

      // if we did teleport, reset prevPos so no line is drawn across
      if (wrapped) {
        this.prevPos = this.pos.copy();
      }
    }
  }

  function rebuildGrid() {
    cols = Math.max(1, p.floor(p.width / scl));
    rows = Math.max(1, p.floor(p.height / scl));
    flowfield = new Array(cols * rows);
  }

  p.setup = () => {
    p.createCanvas(env.container.clientWidth, env.container.clientHeight);
    p.strokeCap(p.ROUND);

    rebuildGrid();
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    p.background(23, 10, 74);
  };

  p.draw = () => {
    // fade old trails quickly so lines vanish
    p.background(23, 10, 74, 50);

    // rebuild flow field with fine increments for smooth curves
    let yoff = 0;
    for (let y = 0; y < rows; y++) {
      let xoff = 0;
      for (let x = 0; x < cols; x++) {
        const angle = p.noise(xoff, yoff, zoff) * p.TWO_PI * 4;
        const v = p5.Vector.fromAngle(angle);
        v.setMag(1);
        flowfield[x + y * cols] = v;
        xoff += 0.05;
      }
      yoff += 0.05;
    }
    zoff += 0.001;

    for (const particle of particles) {
      particle.follow(flowfield);
      particle.update();
      particle.edges();
      particle.show();
      particle.life--;
      if (particle.life <= 0) {
        particle.reset();
      }
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(env.container.clientWidth, env.container.clientHeight);
    rebuildGrid();
    p.background(23, 10, 74);
  };
}
