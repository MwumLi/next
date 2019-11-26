import NodeAttr from '../src/attribute/node';

// window.HTMLCanvasElement = Canvas;
// console.log(document.createElement('canvas').getContext('2d'));

function sum(x, y) {
  return x + y;
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('canvas 2d', () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.arc(1, 2, 3, 4, 5);
  ctx.moveTo(6, 7);
  ctx.rect(6, 7, 8, 9);
  ctx.closePath();

  ctx.fillStyle = 'red';
  ctx.fill();

  /**
  * Any method that modifies the current path (and subpath) will be pushed to an event array. When
  * using the `__getPath` method, that array will sliced and usable for snapshots.
  */
  const path = ctx.canvas.toDataURL();
  expect(path).toMatchSnapshot();
});


// test('canvas 3d', () => {
//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('webgl');

//   expect(typeof ctx).toBe('object');
// });