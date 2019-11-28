import {mat2d} from 'gl-matrix';
import NodeAttr from '../../src/attribute/node';

const {getAttribute, setDefault} = NodeAttr;

test('export api', () => {
  expect(typeof NodeAttr).toBe('function');
  expect(typeof getAttribute).toBe('function');
  expect(typeof setDefault).toBe('function');
});


describe('attribute set get', () => {
  const subject = {
    onPropertyChange(key, value, oldValue, attributes) { },
  };
  const attr = new NodeAttr(subject);

  test('default value', () => {
    attr.id = 'test';
    expect(attr.id).toBe('test');

    expect(getAttribute(attr, 'id')).toBe('test');

    setDefault(attr, {className: 'foo'});
    expect(getAttribute(attr, 'className')).toBe('foo');

    attr.class = 'bar';
    expect(attr.class).toBe('bar');

    attr.class = null;
    expect(attr.class).toBe('foo');

    attr.id = null;
    expect(attr.id).toBe('');
  });

  test('id name class', () => {
    attr.id = 'foobar';
    expect(attr.id).toBe('foobar');

    attr.name = 'foobar';
    expect(attr.name).toBe('foobar');

    attr.class = 'foobar';
    expect(attr.class).toBe('foobar');
    expect(attr.className).toBe('foobar');
  });

  test('x y pos', () => {
    expect(attr.x).toBe(0);
    expect(attr.y).toBe(0);

    attr.x = 100;
    attr.y = 50;

    expect(attr.x).toBe(100);
    expect(attr.y).toBe(50);
    expect(attr.pos).toEqual([100, 50]);

    attr.pos = [-50, -100];
    expect(attr.x).toBe(-50);
    expect(attr.y).toBe(-100);
    expect(attr.pos).toEqual([-50, -100]);
  });

  describe('transforms', () => {
    test('basic transform', () => {
      expect(attr.transform).toBe('');
      expect(subject.transformMatrix).toEqual([1, 0, 0, 1, 0, 0]);

      attr.transform = 'matrix(2, 0, 0, 2, 0, 0)';
      expect(attr.transform).toBe('matrix(2, 0, 0, 2, 0, 0)');
      expect(subject.transformMatrix).toEqual([2, 0, 0, 2, 0, 0]);

      attr.transform = null;
      expect(attr.transform).toBe('');
      expect(subject.transformMatrix).toEqual([1, 0, 0, 1, 0, 0]);
    });

    test('transform translate', () => {
      attr.transform = 'translate(2rem, 1rem)';
      expect(attr.transform).toBe('translate(2rem, 1rem)');
      expect(subject.transformMatrix).toEqual([1, 0, 0, 1, 32, 16]);
      attr.transform = null;
    });

    test('transform scale', () => {
      attr.transform = 'scale(2, 3)';
      expect(attr.transform).toBe('scale(2, 3)');
      expect(subject.transformMatrix).toEqual([2, 0, 0, 3, 0, 0]);
      attr.transform = null;
    });

    test('transform rotate', () => {
      attr.transform = 'rotate(30deg)';
      expect(attr.transform).toBe('rotate(30deg)');
      const rad = Math.PI * 30 / 180;
      expect(subject.transformMatrix).toEqual([Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), 0, 0]);
      attr.transform = null;
    });

    test('transform skew', () => {
      attr.transform = 'skew(10, 20)';
      expect(attr.transform).toBe('skew(10, 20)');
      expect(subject.transformMatrix).toEqual([1, Math.tan(20), Math.tan(10), 1, 0, 0]);
      attr.transform = null;
    });

    test('transform composit', () => {
      attr.transform = 'translate(100, 50);scale(2,3)';
      expect(attr.transform).toBe('translate(100, 50);scale(2,3)');
      expect(subject.transformMatrix).toEqual([2, 0, 0, 3, 100, 50]);
      attr.transform = 'scale(2,3);translate(100, 50)';
      expect(subject.transformMatrix).toEqual([2, 0, 0, 3, 200, 150]);
      attr.transform = null;
    });

    test('translate', () => {
      expect(attr.translate).toEqual([0, 0]);

      attr.translate = [100, 50];
      expect(subject.transformMatrix).toEqual([1, 0, 0, 1, 100, 50]);

      attr.transform = 'translate(50, 100)';
      expect(subject.transformMatrix).toEqual([1, 0, 0, 1, 150, 150]);

      attr.translate = null;
      expect(subject.transformMatrix).toEqual([1, 0, 0, 1, 50, 100]);

      attr.transform = null;
      expect(subject.transformMatrix).toEqual([1, 0, 0, 1, 0, 0]);
    });

    test('rotate', () => {
      const rad = Math.PI * 30 / 180;
      expect(attr.rotate).toEqual(0);

      const rotated = [Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad)];

      attr.rotate = 30;
      expect(subject.transformMatrix).toEqual([...rotated, 0, 0]);
      attr.rotate = null;
    });

    test('scale', () => {
      attr.scale = [2, 3];
      expect(subject.transformMatrix).toEqual([2, 0, 0, 3, 0, 0]);

      attr.transform = 'translate(100, 50)';
      expect(subject.transformMatrix).toEqual([2, 0, 0, 3, 200, 150]);

      attr.scale = [2, 3];
      expect(subject.transformMatrix).toEqual([2, 0, 0, 3, 100, 50]);
      attr.scale = null;
      expect(attr.scale).toEqual([1, 1]);

      attr.transform = null;
      expect(subject.transformMatrix).toEqual([1, 0, 0, 1, 0, 0]);
    });

    test('skew', () => {
      attr.skew = [10, 20];
      expect(subject.transformMatrix).toEqual([1, Math.tan(20), Math.tan(10), 1, 0, 0]);
      attr.skew = null;
    });

    test('transformOrigin', () => {
      attr.translate = [100, 50];
      expect(attr.transformOrigin).toEqual([0, 0]);
      attr.transformOrigin = '10rem';
      expect(attr.transformOrigin).toEqual([160, 160]);
      expect(subject.transformMatrix).toEqual([1, 0, 0, 1, 100, 50]);
      attr.translate = null;

      const rad = Math.PI * 30 / 180;
      let m = mat2d(1, 0, 0, 1, 0, 0);
      m = mat2d.translate(m, [160, 160]);
      m = mat2d.rotate(m, rad);
      m = mat2d.translate(m, [-160, -160]);
      attr.rotate = 30;
      expect(subject.transformMatrix).toEqual(m);
      attr.transformOrigin = null;
      expect(subject.transformMatrix).toEqual([Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), 0, 0]);
      attr.rotate = 0;
    });
  });

  test('opacity', () => {
    expect(attr.opacity).toBe(1);
    attr.opacity = 0.5;
    expect(attr.opacity).toBe(0.5);
    attr.opacity = null;
    expect(attr.opacity).toBe(1);
  });

  test('zIndex', () => {
    expect(attr.zIndex).toBe(0);
    attr.zIndex = 100;
    expect(attr.zIndex).toBe(100);
    attr.zIndex = 0;
    expect(attr.zIndex).toBe(0);
  });
});