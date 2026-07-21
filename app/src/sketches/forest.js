export default function forest(p, env) {
  let birds = [];
  let tree, tree2;
  let c1, c2;

  class Bird {
    constructor(x, y) {
      this.x = x;
      this.y = y + p.random(0, p.height * 0.5);

      // Wing flapping
      this.flapSpeed = p.random(0.1, 0.2);
      this.flapOffset = p.random(180);

      // Vertical drift
      this.yOffset = p.random(1000);

      // Flight tilt range (~±15°)
      this.tiltRange = p.random(-15, 15);
    }

    fly() {
      this.x += 1;
      this.y += p.map(p.noise(this.x * 0.005, this.yOffset), 0, 1, -0.5, 0.5);
    }

    display() {
      const flap = p.sin(p.frameCount * this.flapSpeed + this.flapOffset) * 12;
      const tilt = p.sin(p.frameCount * this.flapSpeed + this.flapOffset) * this.tiltRange;

      p.push();
      p.translate(this.x, this.y);
      p.rotate(tilt);

      p.noFill();
      p.stroke(0);
      p.strokeWeight(2);
      p.beginShape();
      p.curveVertex(-10, 0);
      p.curveVertex(-10, 0);
      p.curveVertex(0, 8 + flap);
      p.curveVertex(10, 0);
      p.curveVertex(10, 0);
      p.endShape();

      p.pop();
    }
  }

  class Tree {
    constructor(len, iter, x, y) {
      this.x = x;
      this.y = y;
      this.len = len;
      this.iter = iter;

      // Randomized scaling of branch lengths
      this.rarr = [];
      for (let i = 0; i < this.iter + 1; i++) {
        this.rarr.push(p.random(0.7, 0.9));
      }

      // Randomized leaf colors
      this.barr = [];
      for (let i = 0; i < 2 * this.iter + 1; i++) {
        this.barr.push(p.random(0, 1));
      }

      const leafCount = 2 * (Math.pow(2, this.iter) - 1);
      this.windOffsets = [];
      for (let i = 0; i < leafCount; i++) {
        this.windOffsets.push(p.random(0, p.TWO_PI));
      }
    }

    getWindAngle(index) {
      const speed = Math.floor(env.getParam("rustleLevel") * 10);
      return p.sin(p.frameCount * speed + this.windOffsets[index]) * 15;
    }

    branch(iter = this.iter, len = this.len) {
      // Reset leaf counter on top-level call
      if (iter === this.iter) {
        this.leafCounter = 0;
      }

      p.stroke(105, 32, 26);
      p.strokeWeight(p.map(len, 0, p.height / 6, 1, 12));
      p.line(0, 0, 0, -len);
      p.translate(0, -len);

      if (iter > 0) {
        p.push();
        const newlen = len * this.rarr[iter];
        p.rotate(25);
        this.branch(iter - 1, newlen);

        // LEFT leaf
        p.push();
        p.rotate(this.getWindAngle(this.leafCounter));
        const r = 80 - this.barr[iter] * 80;
        const g = 120 - this.barr[iter] * 60;
        const b = 40 - this.barr[iter] * 60;
        p.fill(r, g, b);
        p.noStroke();
        this.drawLeaf();
        p.pop();
        this.leafCounter++;
        p.pop();

        p.push();
        p.rotate(-25);
        this.branch(iter - 1, len * this.rarr[iter - 1]);

        // RIGHT leaf
        p.push();
        p.rotate(this.getWindAngle(this.leafCounter));
        p.fill(
          80 - this.barr[iter + 1] * 80,
          120 - this.barr[iter + 2] * 80,
          40 - this.barr[iter + 3] * 100,
        );
        p.noStroke();
        this.drawLeaf();
        p.pop();
        this.leafCounter++;
        p.pop();
      }
    }

    drawLeaf() {
      p.beginShape();
      for (let i = 45; i < 135; i++) {
        const rad = 15;
        p.vertex(rad * p.cos(i), rad * p.sin(i));
      }
      for (let i = 135; i > 40; i--) {
        const rad = 15;
        p.vertex(rad * p.cos(i), rad * p.sin(-i) + 20);
      }
      p.endShape();
    }
  }

  function plantTrees() {
    tree = new Tree(p.height / 6, 9, p.width / 2, p.height * 0.95);
    tree2 = new Tree(p.height / 10, 7, p.width - p.width / 8, p.height - p.height / 4);
  }

  p.setup = () => {
    p.createCanvas(env.container.clientWidth, env.container.clientHeight);
    p.angleMode(p.DEGREES);

    plantTrees();

    c1 = p.color(5, 31, 135);
    c2 = p.color(245, 160, 2);
  };

  p.draw = () => {
    // sky gradient
    for (let y = 0; y < p.height / 2; y++) {
      const n = p.map(y, 0, p.height / 2, 0, 1);
      p.stroke(p.lerpColor(c1, c2, n));
      p.line(0, y, p.width, y);
    }

    // sun
    p.noStroke();
    p.fill(252, 227, 3);
    p.circle(p.width / 4, p.height / 2, p.height / 5);
    // grass
    p.fill(6, 79, 32);
    p.rect(-2, p.height / 2, p.width + 2, p.height / 2 + 2);

    // spawn birds with frequency based on the birds slider
    if (p.frameCount % 140 === 0) {
      if (p.random(10) < env.getParam("birdLevel") * 10) {
        birds.push(new Bird(0, 0));
      }
    }

    for (let i = birds.length - 1; i >= 0; i--) {
      birds[i].fly();
      birds[i].display();
      if (birds[i].y < 10 || birds[i].x > p.width) {
        birds.splice(i, 1);
      }
    }

    // trees
    p.push();
    p.translate(tree.x, tree.y);
    tree.branch();
    p.pop();
    p.push();
    p.translate(tree2.x, tree2.y);
    tree2.branch();
    p.pop();
  };

  p.windowResized = () => {
    p.resizeCanvas(env.container.clientWidth, env.container.clientHeight);
    plantTrees();
    birds = [];
  };
}
