let birds = [];
let tree;
let lengthSlider;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  angleMode(DEGREES);

  // Get the slider and store it in the global variable
  lengthSlider = document.getElementById('rustleSlider');

  // Initial tree
  updateTree();

  // Listen for slider changes
  lengthSlider.addEventListener('change', function () {
    updateTree();
  });

  // Bird slider
  document.getElementById('birdSlider').addEventListener('change', function () {
    birb();
  });
}

function updateTree() {
  let iter = parseFloat(lengthSlider.value);
  tree = new Tree(height / 6, (Math.floor(iter * 5) + 5));
}

function draw() {
  background(255);

  push();
  translate(tree.x, tree.y);
  tree.branch();
  pop();


  // Draw the birds
  for (let i = birds.length - 1; i >= 0; i--) {
    birds[i].fly();
    birds[i].display();
    if (birds[i].y < 10 || birds[i].x > width) {
      birds.splice(i, 1);
    }
  }
}



class Bird {
  constructor(x, y) {
    this.x = x;
    this.y = y + random(0, height * 0.5); // higher in the sky

    // Wing flapping
    this.flapSpeed = random(0.1, 0.2);
    this.flapOffset = random(360); // degrees version

    // Vertical drift
    this.yOffset = random(1000);

    // Flight tilt range in degrees (~±15°)
    this.tiltRange = random(-15, 15);
  }

  fly() {
    this.x += 1;
    this.y += map(noise(this.x * 0.005, this.yOffset), 0, 1, -0.5, 0.5);
  }

  display() {
    let flap = sin(frameCount * this.flapSpeed + this.flapOffset) * 12;
    let tilt = sin(frameCount * this.flapSpeed + this.flapOffset) * this.tiltRange;

    push();
    translate(this.x, this.y);
    rotate(tilt); // rotate in degrees

    noFill();
    stroke(0);
    strokeWeight(2);
    beginShape();
    curveVertex(-10, 0);
    curveVertex(-10, 0);
    curveVertex(0, 8 + flap);
    curveVertex(10, 0);
    curveVertex(10, 0);
    endShape();

    pop();
  }
}




function birb() {
  let b = new Bird(0, 0);
  birds.push(b);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Tree {
  constructor(len, iter) {
    this.x = width / 2;
    this.y = height;
    this.len = len;
    this.iter = iter;
    this.rarr = [];
    this.barr = [];
    for (let i = 0; i < this.iter + 1; i++) {
      this.rarr.push(random(0.7, 0.9))
    }
    for (let i = 0; i < 2 * this.iter + 1; i++) {
      this.barr.push(random(0, 1))
    }
  }

  branch(iter = this.iter, len = this.len) {
    stroke(105, 32, 26);
    strokeWeight(map(len, 0, height / 6, 1, 12));
    line(0, 0, 0, -len);
    translate(0, -len);

    if (iter > 0) {
      push();
      let newlen = len * this.rarr[iter]
      rotate(25);
      this.branch(iter - 1, newlen);

      var r = 80 - (this.barr[iter] * 80)
      var g = 120 - (this.barr[iter] * 60)
      var b = 40 - (this.barr[iter] * 60)
      fill(r, g, b)
      noStroke()

      beginShape();
      for (var i = 45; i < 135; i++) {
        var rad = 15
        var x = rad * cos(i)
        var y = rad * sin(i)
        vertex(x, y)
      }
      for (var i = 135; i > 40; i--) {
        var rad = 15
        var x = rad * cos(i)
        var y = rad * sin(-i) + 20
        vertex(x, y)
      }
      endShape();

      pop();

      push();
      rotate(-25);
      this.branch(iter - 1, len * this.rarr[iter - 1]);

      var r = 80 - (this.barr[iter + 1] * 80)
      var g = 120 - (this.barr[iter + 2] * 80)
      var b = 40 - (this.barr[iter + 3] * 100)
      fill(r, g, b)
      noStroke();
      beginShape();
      for (var i = 45; i < 135; i++) {
        var rad = 15
        var x = rad * cos(i)
        var y = rad * sin(i)
        vertex(x, y)
      }
      for (var i = 135; i > 40; i--) {
        var rad = 15
        var x = rad * cos(i)
        var y = rad * sin(-i) + 20
        vertex(x, y)
      }
      endShape();


      pop();
    }

  }
}
