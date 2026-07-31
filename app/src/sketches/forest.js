// Placeholder sketch — the fractal-tree forest animation was too heavy
// and is due for a redesign.
export default function forest(p, env) {
  let drifters = [];

  p.setup = () => {
    p.createCanvas(env.container.clientWidth, env.container.clientHeight);
    p.frameRate(30);
    p.noStroke();

    drifters = [];
    for (let i = 0; i < 12; i++) {
      drifters.push({
        x: p.random(p.width),
        y: p.random(p.height),
        r: p.random(20, 60),
        speed: p.random(0.2, 0.6),
        offset: p.random(1000),
      });
    }
  };

  p.draw = () => {
    p.background(16, 46, 28);

    for (const d of drifters) {
      d.x += d.speed;
      if (d.x - d.r > p.width) d.x = -d.r;
      const wobble = p.sin(p.frameCount * 0.02 + d.offset) * 10;
      p.fill(60, 110, 70, 90);
      p.circle(d.x, d.y + wobble, d.r);
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(env.container.clientWidth, env.container.clientHeight);
  };
}
