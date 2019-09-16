import {mat2d} from 'gl-matrix';
import {toString, toNumber, compareValue} from '../utils/attribute_value';

const setAttribute = Symbol.for('spritejs_setAttribute');
const getAttribute = Symbol.for('spritejs_getAttribute');
const setDefault = Symbol.for('spritejs_setAttributeDefault');

const attributes = Symbol.for('spritejs_attributes');
const changedAttrs = Symbol.for('spritejs_changedAttrs');

const _subject = Symbol.for('spritejs_subject');
const _attr = Symbol('attr');

function getMatrix(transformMap, [ox, oy]) {
  let m = mat2d(1, 0, 0, 1, 0, 0);
  [...transformMap].forEach(([key, value]) => {
    if(ox || oy) m = mat2d.translate(m, [ox, oy]);
    if(key === 'matrix') {
      m *= mat2d(value);
    } else {
      mat2d[key](m, m, value);
    }
    if(ox || oy) m = mat2d.translate(m, [-ox, -oy]);
  });
  return m;
}

const _transformMatrix = Symbol('transformMatrix');
const _transforms = Symbol('transforms');
const _changedAttrs = Symbol('changedAttrs');

// 规范：属性只能是原始类型或元素是原始类型的数组
export default class Node {
  constructor(subject) {
    this[_subject] = subject;
    this[_attr] = {};
    this[_transformMatrix] = mat2d(1, 0, 0, 1, 0, 0);
    this[_transforms] = new Map();

    Object.defineProperty(subject, 'transformMatrix', {
      get: () => {
        return [...this[_transformMatrix]];
      },
    });

    this[setDefault]({
      id: '',
      name: '',
      className: '',
      x: 0,
      y: 0,
      transformOrigin: [0, 0],
      transform: '',
      translate: [0, 0],
      rotate: 0,
      scale: [1, 1],
      skew: [0, 0],
      opacity: 1,
      zIndex: 0,
    });

    this[_changedAttrs] = new Set();
  }

  get [changedAttrs]() {
    const ret = {};
    [...this[_changedAttrs]].forEach((key) => {
      ret[key] = this[_attr][key];
    });
    return ret;
  }

  get [attributes]() {
    return Object.assign({}, this[_attr]);
  }

  [setDefault](attrs) {
    Object.assign(this[_attr], attrs);
  }

  [setAttribute](key, value, quiet) {
    const oldValue = this[_attr][key];
    const subject = this[_subject];
    if(!compareValue(oldValue, value)) {
      this[_attr][key] = value;
      if(this[_changedAttrs].has(key)) this[_changedAttrs].delete(key);
      this[_changedAttrs].add(key);
      subject.onPropertyChange(key, value, oldValue, this);
    }
  }

  [getAttribute](key) {
    return this[_attr][key];
  }

  set id(value) {
    this[setAttribute]('id', toString(value));
  }

  get id() {
    return this[getAttribute]('id');
  }

  set name(value) {
    this[setAttribute]('name', toString(value));
  }

  get name() {
    return this[getAttribute]('name');
  }

  set className(value) {
    this[setAttribute]('className', toString(value));
  }

  get className() {
    return this[getAttribute]('className');
  }

  get x() {
    return this[getAttribute]('x');
  }

  set x(value) {
    this[setAttribute]('x', toNumber(value));
  }

  get y() {
    return this[getAttribute]('y');
  }

  set y(value) {
    this[setAttribute]('y', toNumber(value));
  }

  get pos() {
    return [this.x, this.y];
  }

  set pos([x, y]) {
    this.x = x;
    this.y = y;
  }

  get transform() {
    return this[getAttribute]('matrix');
  }

  set transform(value) {
    const transformMap = this[_transforms];
    if(transformMap.has('transform')) {
      transformMap.delete('transform');
    }
    const transforms = value.match(/(matrix|translate|rotate|scale|skew)\([^()]+\)/g);
    if(transforms) {
      let m = mat2d(1, 0, 0, 1, 0, 0);
      for(let i = 0; i < transforms.length; i++) {
        const t = transforms[i];
        const matched = t.match(/^(matrix|translate|rotate|scale|skew)\(([^()]+)\)/);
        if(matched) {
          let [, method, value] = matched;
          if(method === 'rotate') value = Math.PI * parseFloat(value) / 180;
          else value = value.trim().split(/\s+/).map(v => toNumber(v));
          if(method === 'matrix') {
            m *= mat2d(value);
          } else {
            mat2d[method](m, m, value);
          }
          transformMap.set('matrix', m);
        }
      }
    }
    this[_transformMatrix] = getMatrix(transformMap, this.transformOrigin);
    this[setAttribute]('transform', value);
  }

  get transformOrigin() {
    return this[getAttribute]('transformOrigin');
  }

  set transformOrigin([x, y]) {
    this[setAttribute]('transformOrigin', [toNumber(x), toNumber(y)]);
  }

  get rotate() {
    return this[getAttribute]('rotate');
  }

  set rotate(value) {
    const transformMap = this[_transforms];
    if(transformMap.has('rotate')) {
      transformMap.delete('rotate');
    }
    transformMap.set('rotate', Math.PI * value / 180);
    this[_transformMatrix] = getMatrix(transformMap, this.transformOrigin);
    this[setAttribute]('rotate', value);
  }

  get translate() {
    return this[getAttribute]('translate');
  }

  set translate(value) {
    const transformMap = this[_transforms];
    if(transformMap.has('translate')) {
      transformMap.delete('translate');
    }
    transformMap.set('translate', value);
    this[_transformMatrix] = getMatrix(transformMap, this.transformOrigin);
    this[setAttribute]('translate', value);
  }

  get scale() {
    return this[getAttribute]('scale');
  }

  set scale(value) {
    const transformMap = this[_transforms];
    if(transformMap.has('scale')) {
      transformMap.delete('scale');
    }
    transformMap.set('scale', value);
    this[_transformMatrix] = getMatrix(transformMap, this.transformOrigin);
    this[setAttribute]('scale', value);
  }

  get skew() {
    return this[getAttribute]('skew');
  }

  set skew(value) {
    const transformMap = this[_transforms];
    if(transformMap.has('skew')) {
      transformMap.delete('skew');
    }
    transformMap.set('skew', value);
    this[_transformMatrix] = getMatrix(transformMap, this.transformOrigin);
    this[setAttribute]('skew', value);
  }

  get opacity() {
    return this[getAttribute]('opacity');
  }

  set opacity(value) {
    this[setAttribute]('opacity', Number(value));
  }

  get zIndex() {
    return this[getAttribute]('zIndex');
  }

  set zIndex(value) {
    this[setAttribute]('zIndex', Number(value));
  }
}