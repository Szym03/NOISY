let birds = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  angleMode(DEGREES);

   // Connect the slider to our p5 variable
   document.getElementById('birdSlider').addEventListener('change', function() {
    // Call our update function (optional)
    birb();

    
  })
}

function draw() {
  background(255);
  push();

  translate(width / 2, height);
  let baseLength = parseFloat(document.getElementById('rustleSlider').value);
  let birbs = parseFloat(document.getElementById('birdSlider').value);
  branch(height / 4, Math.floor((baseLength) * 12),30);
  translate(width / 3, height/4);
  branch(height / 5, Math.floor((baseLength) * 12),30);
  pop();

  

  for (let i = 0; i < birds.length; i++) {
    birds[i].fly();
    birds[i].display();
}
}

function branch(len, iter, angle) {
  if (iter === 0) {
    // Draw a petal at the end
    noStroke();
    fill(100, 200, 150, 180);
    ellipse(0, 0, 50, 50);
    return;
  }

  // Draw branch
  stroke(130, 49, 43);
  strokeWeight(map(iter, 0, 15, 1, 50));
  line(0, 0, 0, -len);
  translate(0, -len);

  // Continue branching
  push();
  rotate(angle);
  branch(len * 0.7, iter - 1, angle);
  pop();

  push();
  rotate(-angle);
  branch(len * 0.7, iter - 1, angle);
  pop();
}

class Bird {
  constructor(x,y) {
    this.x = x;
    this.y = y + random(0, height * 0.75);
  }
  
  fly() {
    this.x = this.x + 0.5;
    this.y = this.y + -0.2;
  }

  display() {
    {
      fill(0);
      //for (let i = 0; i > height * 0.25 && i < height *0.25; i++);
      triangle(this.x, this.y, this.x - 20,  this.y - 8, this.x + 20, this.y - 20)
      fill(255)
      noStroke()
      triangle(this.x, this.y-5, this.x - 20,  this.y-20, this.x + 20, this.y - 27)
     
    }
  }
}

function birb() {
  let b = new Bird(0, 0);
  birds.push(b);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

