import test from 'ava';
import compare from '../helper/compare';
import {Container} from '../../lib/polyfill/node-canvas';
import {Scene, Sprite} from '../../src';

test('red-block-150', async (t) => {
  const width = 300;
  const height = 300;

  const scene = new Scene({
    container: new Container(width, height),
  });

  const sprite = new Sprite();
  sprite.attr({
    size: [150, 150],
    bgcolor: 'red',
  });
  scene.layer().append(sprite);

  const isEqual = await compare(scene.snapshot(), 'red-block-150');
  t.truthy(isEqual);
});