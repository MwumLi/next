import NodeAttr from '../../src/attribute/node';

test('attribute object', () => {
  const attr = new NodeAttr({
    onPropertyChange(key, value, oldValue, attributes) {

    },
  });

  expect(typeof attr).toBe('object');
});