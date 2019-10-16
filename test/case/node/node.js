import test from 'ava';

import Node from '../../../src/node/node';

test('base node', (t) => {
  t.is(typeof Node, 'function');
});

test('node default attributes', (t) => {
  const node = new Node();
  t.is(node.id, '');
  t.is(node.name, '');
  t.is(node.className, '');
  t.is(node.zIndex, 0);
});

test('node set attributes', (t) => {
  const node = new Node();
  const attrs = node.attributes;

  t.is(node.id, '');
  node.id = 'abc';
  t.is(node.id, 'abc');

  t.is(attrs.pointerEvents, 'visible');
  attrs.pointerEvents = 'none';
  t.is(attrs.pointerEvents, 'none');

  t.is(attrs.filter, 'none');
  attrs.filter = 'blur(10px)';
  t.is(attrs.filter, 'blur(10px)');

  // attribute sealed
  t.throws(() => {
    attrs.zzz = 333;
  });
});