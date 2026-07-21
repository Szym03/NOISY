const res = 5; // resolution factor: higher number = lower resolution

export default function pinknoise(p, env) {
  let pg;

  p.setup = () => {
    const { clientWidth: w, clientHeight: h } = env.container;
    p.createCanvas(w, h);
    p.frameRate(30);

    pg = p.createGraphics(p.floor(w / res), p.floor(h / res));
    pg.pixelDensity(1);
    p.noSmooth();
    pg.noSmooth();
  };

  p.draw = () => {
    pg.loadPixels();
    const t = p.frameCount * 0.004;
    for (let x = 0; x < pg.width; x++) {
      for (let y = 0; y < pg.height; y++) {
        const noiseValue = p.noise(x * 0.02, y * 0.02, t) * 255;
        const index = (x + y * pg.width) * 4;
        pg.pixels[index] = noiseValue;
        pg.pixels[index + 1] = noiseValue;
        pg.pixels[index + 2] = noiseValue;
        pg.pixels[index + 3] = 255;
      }
    }
    pg.updatePixels();
    p.image(pg, 0, 0, p.width, p.height);

    // Pink tint over the grayscale noise
    p.noStroke();
    p.fill(255, 105, 180, 50);
    p.rect(0, 0, p.width, p.height);
  };

  p.windowResized = () => {
    const { clientWidth: w, clientHeight: h } = env.container;
    p.resizeCanvas(w, h);
    pg.resizeCanvas(p.floor(w / res), p.floor(h / res));
  };
}
