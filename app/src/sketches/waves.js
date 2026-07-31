const numWaves = 8;
const waveHeightRatio = 0.12; // amplitude relative to window height
const noiseStrength = 0.5;

export default function waves(p, env) {
  let t = 0;

  p.setup = () => {
    const { clientWidth: w, clientHeight: h } = env.container;
    p.createCanvas(w, h);
    p.frameRate(30);
    p.colorMode(p.HSB, 360, 100, 100);
  };

  p.draw = () => {
    p.background(0, 0, 100);

    const waveSpacing = (p.height / numWaves) * 1.1;
    const waveHeight = p.height * waveHeightRatio;

    for (let i = 0; i < numWaves; i++) {
      const yOffset = i * waveSpacing;

      // Hues in the blue range, drifting slowly over time
      let hueVal = p.map(i, 0, numWaves - 1, 200, 250);
      hueVal = (hueVal + t * 5) % 360;
      p.stroke(hueVal, 80, 90);
      p.strokeWeight(2);
      p.noFill();

      p.beginShape();
      for (let x = 0; x <= p.width; x += 5) {
        const wave =
          p.sin(p.TWO_PI * (x / p.width) * 2 + t * (0.01 * (i + 1))) +
          p.noise(x * 0.02, t * 0.02) * noiseStrength;
        p.vertex(x, yOffset + wave * waveHeight);
      }
      p.endShape();
    }

    t += 0.06;
  };

  p.windowResized = () => {
    p.resizeCanvas(env.container.clientWidth, env.container.clientHeight);
  };
}
