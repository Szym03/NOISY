const chaos = 50;
const waveAmp = 12;
const waveFreq = 0.005;
const waveSpeed = 2;

export default function mantra(p, env) {
  let offset = 0;

  p.setup = () => {
    p.createCanvas(env.container.clientWidth, env.container.clientHeight);
    p.noiseDetail(3, 0.3);
    p.strokeWeight(2);
  };

  p.draw = () => {
    p.background(0, 0, 30);

    const mixNoise = 0.5; // how much perlin noise vs wave
    for (let x = 0; x < p.width; x += 7) {
      const nx = x * 0.02;
      const wave = p.sin(x * waveFreq + offset * waveSpeed) * waveAmp;

      for (let y = 0; y < p.height; y += 7) {
        const dx = (p.noise(nx, y * 0.035, offset) - 0.5) * chaos;
        const dxTot = dx * mixNoise + wave * (1 - mixNoise);

        const cblue = p.map(dxTot, -25, 25, 0, 255);
        p.stroke(50 + dxTot * 4, 50 + dxTot * 8.5, cblue);
        p.point(x + dxTot, y + 0.5 * dxTot);
      }
    }

    offset += 0.015;
  };

  p.windowResized = () => {
    p.resizeCanvas(env.container.clientWidth, env.container.clientHeight);
  };
}
