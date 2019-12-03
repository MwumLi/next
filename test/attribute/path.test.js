import PathAttr from '../../src/attribute/path';

describe('attribute set get', () => {
  const subject = {
    onPropertyChange(key, value, oldValue, attributes) { },
  };
  const attr = new PathAttr(subject);

  test('attr obj', () => {
    expect(attr instanceof PathAttr).toBeTruthy();
  });
});