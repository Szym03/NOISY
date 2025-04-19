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
  
  for (let i = birds.length-1; i >= 0; i--) {
    birds[i].fly();
    birds[i].display();
    if(birds[i].y < 10 || birds[i].x > width){
      birds.splice(i,1);
    }
  console.log("length",birds.length);
}
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

