let birds = [];
let tree;
let tree2;
let lengthSlider;
let c1, c2;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  angleMode(DEGREES);

  // Get the slider and store it in the global variable
  lengthSlider = document.getElementById('rustleSlider');

  // Initial tree
  tree = new Tree(height / 6, 9, width / 2, height*0.95);
  tree2 = new Tree(height / 10, 7, width - width / 8, height - height / 4);

  c1 = color(5, 31, 135);
  c2 = color(245, 160, 2);




  // Bird slider
  document.getElementById('birdSlider').addEventListener('change', function () {

  });
}



function draw() {
  //sky gradient
  for (let y = 0; y < height / 2; y++) {
    n = map(y, 0, height / 2, 0, 1);
    let newc = lerpColor(c1, c2, n);
    stroke(newc);
    line(0, y, width, y);
  }

  //sun
  fill(252, 227, 3);
  circle(width / 4, height / 2, height / 5);
  //grass
  fill(6, 79, 32);
  rect(-2, height / 2, width + 2, height / 2 + 2);

  //make birds freq kinda random based on bird slider
  let birdsslide = parseFloat(document.getElementById('birdSlider').value);
  if(frameCount%140==0){
    if (random(10) < birdsslide*10) {
      birb();
    }
  }
  
  
  // Draw the birds
  for (let i = birds.length - 1; i >= 0; i--) {
    birds[i].fly();
    birds[i].display();
    if (birds[i].y < 10 || birds[i].x > width) {
      birds.splice(i, 1);
    }
  }

  //trees
  push();
  translate(tree.x, tree.y);
  tree.branch();
  pop();
  push();
  translate(tree2.x, tree2.y);
  tree2.branch();
  pop();



}



class Bird {
  constructor(x, y) {
    this.x = x;
    this.y = y + random(0, height * 0.5); // higher in the sky

    // Wing flapping
    this.flapSpeed = random(0.1, 0.2);
    this.flapOffset = random(180); // degrees version

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
  constructor(len, iter, x, y) {
    this.x = x;
    this.y = y;
    this.len = len;
    this.iter = iter;

    // For randomized scaling of branch lengths
    this.rarr = [];
    for (let i = 0; i < this.iter + 1; i++) {
      this.rarr.push(random(0.7, 0.9));
    }

    // For randomized leaf colors
    this.barr = [];
    for (let i = 0; i < 2 * this.iter + 1; i++) {
      this.barr.push(random(0, 1));
    }

    let leafCount = 2 * (Math.pow(2, this.iter) - 1);

    this.windOffsets = [];
    for (let i = 0; i < leafCount; i++) {
      this.windOffsets.push(random(0, TWO_PI));
    }
  }

  getWindAngle(index) {
    let speed = Math.floor(parseFloat(document.getElementById('rustleSlider').value) * 10);
    let sway = sin(frameCount * speed + this.windOffsets[index]) * 15;
    return sway;
  }

  branch(iter = this.iter, len = this.len) {
    // Reset leaf counter on top-level call
    if (iter === this.iter) {
      this.leafCounter = 0;
    }

    stroke(105, 32, 26);
    strokeWeight(map(len, 0, height / 6, 1, 12));
    line(0, 0, 0, -len);
    translate(0, -len);

    if (iter > 0) {
      push();
      let newlen = len * this.rarr[iter];
      rotate(25);
      this.branch(iter - 1, newlen);

      // LEFT leaf
      push();
      let swayL = this.getWindAngle(this.leafCounter);
      rotate(swayL);


      let r = 80 - (this.barr[iter] * 80);
      let g = 120 - (this.barr[iter] * 60);
      let b = 40 - (this.barr[iter] * 60);
      fill(r, g, b);
      noStroke();
      this.drawLeaf();
      pop();

      this.leafCounter++; // increment after using

      pop();

      push();
      rotate(-25);
      this.branch(iter - 1, len * this.rarr[iter - 1]);

      // RIGHT leaf
      push();
      let swayR = this.getWindAngle(this.leafCounter);
      rotate(swayR);
      r = 80 - (this.barr[iter + 1] * 80);
      g = 120 - (this.barr[iter + 2] * 80);
      b = 40 - (this.barr[iter + 3] * 100);
      fill(r, g, b);
      noStroke();
      this.drawLeaf();
      pop();

      this.leafCounter++; // increment after using

      pop();
    }
  }

  drawLeaf() {
    beginShape();
    for (let i = 45; i < 135; i++) {
      let rad = 15;
      let x = rad * cos(i);
      let y = rad * sin(i);
      vertex(x, y);
    }
    for (let i = 135; i > 40; i--) {
      let rad = 15;
      let x = rad * cos(i);
      let y = rad * sin(-i) + 20;
      vertex(x, y);
    }
    endShape();
  }
}
