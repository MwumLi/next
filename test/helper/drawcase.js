const fs = require('fs');
const {Container} = require('../../lib/polyfill/node-canvas');
const {Scene} = require('../../lib');

module.exports = async function drawCase(caseId, [width, height], handler) {
  const container = new Container(width, height);
  const scene = new Scene({
    container,
    width,
    height,
  });
  await handler(scene);
  const canvas = scene.snapshot();
  fs.writeFileSync(`../img/${caseId}.png`, canvas.toBuffer());
};
