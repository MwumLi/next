function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async function () {
  /* globals Animator */
  const {Scene, Path, Gradient} = spritejs;
  const container = document.getElementById('stage');
  const scene = new Scene({
    container,
    width: 1600,
    height: 1200,
    mode: 'stickyWidth',
  });

  async function ray() {
    const s = new Path();

    const pos = [200 + 1200 * Math.random(), 200 + 800 * Math.random()];
    const rotate = 360 * Math.random();
    const controller = Math.random() * 340 + 10;

    const color = [127 + 128 * Math.random(), 255 * Math.random(), 128 * Math.random()].map(Math.round);

    s.attr({
      pos,
      rotate,
      lineWidth: 6,
      d: `M10,80 q${controller},-80 350,0`,
    });

    scene.layer().append(s);


    const a1 = new Animator(3000, (p) => {
      let q = 0;

      if(p > 0.618) {
        q = 1 - (1 - p) / 0.382;
      }

      p = Math.min(p / 0.7, 1);

      const colors = [
        {offset: 0, color: `rgba(${color[0]},${color[1]},${color[2]},0)`},
        {offset: q, color: `rgba(${color[0]},${color[1]},${color[2]},0)`},
        {offset: p, color: `rgba(${color[0]},${color[1]},${color[2]},1)`},
        {offset: Math.min(p + 0.06, 1), color: `rgba(${color[0]},${color[1]},${color[2]},0)`},
      ];

      const len = s.getPathLength();
      const [x, y] = s.getPointAtLength(p * len);
      const vector = [0, 0, x + 5, y];

      const gradient = new Gradient({
        vector,
        colors,
      });

      s.attr({strokeColor: gradient});
    });

    await a1.animate();
    s.remove();
  }

  do {
    ray();
    const delay = Math.random() * 500 + 200;
    await sleep(delay); // eslint-disable-line no-await-in-loop
  } while(1);
}());