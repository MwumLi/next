const drawCase = require('./drawcase');
const sleep = require('./sleep');
const {Sprite} = require('../../lib');

drawCase('red-block-150', [300, 300], (scene) => {
  const sprite = new Sprite();
  sprite.attr({
    size: [150, 150],
    bgcolor: 'red',
  });
  scene.layer().append(sprite);

  return scene;
});

drawCase('blue-block-150-centered', [300, 300], (scene) => {
  const sprite = new Sprite();
  sprite.attr({
    anchor: 0.5,
    pos: [150, 150],
    size: [150, 150],
    bgcolor: 'blue',
  });
  scene.layer().append(sprite);

  return scene;
});

drawCase('robot-texture', [300, 300], async (scene) => {
  const robot = new Sprite('https://p0.ssl.qhimg.com/t01a72262146b87165f.png');
  robot.attr({
    anchor: 0.5,
    pos: [150, 150],
  });
  scene.layer().append(robot);

  while(robot.contentSize[0] === 0) {
    await sleep(100); // eslint-disable-line no-await-in-loop
  }
  return scene;
});