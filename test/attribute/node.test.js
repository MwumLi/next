import NodeAttr from '../../src/attribute/node';

test('attribute object', () => {
  const attr = new NodeAttr({
    onPropertyChange(key, value, oldValue, attributes) {

    },
  });

  attr.id = 'test';

  expect(typeof attr).toBe('object');
  expect(attr.id).toBe('test');

  const {getAttribute, setDefault} = NodeAttr;
  expect(getAttribute(attr, 'id')).toBe('test');

  setDefault(attr, {className: 'foo'});
  expect(getAttribute(attr, 'className')).toBe('foo');
});