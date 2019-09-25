import {mat2d} from 'gl-matrix';
import {Figure2D} from '@mesh.js/core';
import {toString, toNumber, toArray, compareValue} from '../utils/attribute_value';

const setAttribute = Symbol.for('spritejs_setAttribute');
const getAttribute = Symbol.for('spritejs_getAttribute');
const setDefault = Symbol.for('spritejs_setAttributeDefault');

const attributes = Symbol.for('spritejs_attributes');
const changedAttrs = Symbol.for('spritejs_changedAttrs');

const _subject = Symbol.for('spritejs_subject');
const _attr = Symbol('attr');
const _default = Symbol('default');

function getMatrix(transformMap, [ox, oy]) {
  let m = mat2d(1, 0, 0, 1, 0, 0);
  [...transformMap].forEach(([key, value]) => {
    if(ox || oy) m = mat2d.translate(m, [ox, oy]);
    if(key === 'matrix') {
      m *= mat2d(value);
    } else if(key === 'offsetTranslate') {
      m[4] += value[0];
      m[5] += value[1];
    } else if(key === 'offsetRotate') {
      m = mat2d.rotate(m, value);
    } else if(key === 'skew') {
      const [x, y] = value;
      m *= mat2d(1, Math.tan(y), Math.tan(x), 1, 0, 0);
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
const _offsetFigure = Symbol('offsetFigure');

function updateOffset(attr) {
  const distance = attr.offsetDistance;
  const point = attr[_offsetFigure].getPointAtLength(distance);
  if(point) {
    const transformMap = attr[_transforms];
    let rotateValue = attr.offsetRotate;
    if(rotateValue === 'auto') {
      rotateValue = point.angle;
    } else if(rotateValue === 'reverse') {
      rotateValue = Math.PI + point.angle;
    } else {
      rotateValue = Math.PI * rotateValue / 180;
    }
    transformMap.set('offsetRotate', rotateValue);
    transformMap.set('offsetTranslate', [point.x, point.y]);
    attr[_transformMatrix] = getMatrix(transformMap, attr.transformOrigin);
  }
}

// 规范：属性只能是原始类型或元素是原始类型的数组
export default class Node {
  constructor(subject) {
    this[_subject] = subject;
    this[_attr] = {};
    this[_transformMatrix] = mat2d(1, 0, 0, 1, 0, 0);
    this[_transforms] = new Map();
    this[_default] = {};

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
      /* pos */
      transformOrigin: [0, 0],
      transform: '',
      translate: [0, 0],
      rotate: 0,
      scale: [1, 1],
      skew: [0, 0],
      opacity: 1,
      zIndex: 0,
      offsetPath: undefined,
      offsetDistance: 0,
      offsetRotate: 'auto',
      pointerEvents: 'visible', // none | visible | visibleFill | visibleStroke | all
      filter: 'none',
    });

    this[_changedAttrs] = new Set();
    this[_offsetFigure] = new Figure2D({scale: 5});
  }

  get [changedAttrs]() {
    const ret = {};
    [...this[_changedAttrs]].forEach((key) => {
      ret[key] = this[_attr][key];
    });
    return ret;
  }

  get [attributes]() {
    return Object.assign({}, this[_attr], {
      pos: this.pos,
    });
  }

  [setDefault](attrs) {
    Object.assign(this[_default], attrs);
    Object.assign(this[_attr], attrs);
  }

  [setAttribute](key, value) {
    const oldValue = this[_attr][key];
    const subject = this[_subject];
    if(value == null) value = this[_default][key];
    if(!compareValue(oldValue, value)) {
      this[_attr][key] = value;
      if(this[_changedAttrs].has(key)) this[_changedAttrs].delete(key);
      this[_changedAttrs].add(key);
      subject.onPropertyChange(key, value, oldValue, this);
      return true;
    }
    return false;
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

  set pos(value) {
    value = toArray(value);
    if(!Array.isArray(value)) value = [value, value];
    this.x = value[0];
    this.y = value[1];
  }

  get transform() {
    return this[getAttribute]('transform');
  }

  set transform(value) {
    if(this[setAttribute]('transform', value)) {
      const transformMap = this[_transforms];
      if(transformMap.has('matrix')) {
        transformMap.delete('matrix');
      }
      if(Array.isArray(value)) {
        transformMap.set('matrix', value);
      } else if(value) {
        const transforms = value.match(/(matrix|translate|rotate|scale|skew)\([^()]+\)/g);
        if(transforms) {
          let m = mat2d(1, 0, 0, 1, 0, 0);
          for(let i = 0; i < transforms.length; i++) {
            const t = transforms[i];
            const matched = t.match(/^(matrix|translate|rotate|scale|skew)\(([^()]+)\)/);
            if(matched) {
              let [, method, value] = matched;
              if(method === 'rotate') value = Math.PI * parseFloat(value) / 180;
              else value = value.trim().split(/[\s,]+/).map(v => toNumber(v));
              if(method === 'matrix') {
                m *= mat2d(value);
              } else {
                mat2d[method](m, m, value);
              }
              transformMap.set('matrix', m);
            }
          }
        }
      }
      this[_transformMatrix] = getMatrix(transformMap, this.transformOrigin);
    }
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
    if(this[setAttribute]('rotate', value)) {
      const transformMap = this[_transforms];
      if(transformMap.has('rotate')) {
        transformMap.delete('rotate');
      }
      if(value) transformMap.set('rotate', Math.PI * value / 180);
      this[_transformMatrix] = getMatrix(transformMap, this.transformOrigin);
    }
  }

  get translate() {
    return this[getAttribute]('translate');
  }

  set translate(value) {
    if(this[setAttribute]('translate', value)) {
      const transformMap = this[_transforms];
      if(transformMap.has('translate')) {
        transformMap.delete('translate');
      }
      if(value) transformMap.set('translate', value);
      this[_transformMatrix] = getMatrix(transformMap, this.transformOrigin);
    }
  }

  get scale() {
    return this[getAttribute]('scale');
  }

  set scale(value) {
    value = toArray(value);
    if(!Array.isArray(value)) value = [value, value];
    if(this[setAttribute]('scale', value)) {
      const transformMap = this[_transforms];
      if(transformMap.has('scale')) {
        transformMap.delete('scale');
      }
      if(value) transformMap.set('scale', value);
      this[_transformMatrix] = getMatrix(transformMap, this.transformOrigin);
    }
  }

  get skew() {
    return this[getAttribute]('skew');
  }

  set skew(value) {
    if(this[setAttribute]('skew', value)) {
      const transformMap = this[_transforms];
      if(transformMap.has('skew')) {
        transformMap.delete('skew');
      }
      if(value) transformMap.set('skew', value);
      this[_transformMatrix] = getMatrix(transformMap, this.transformOrigin);
    }
  }

  get opacity() {
    return this[getAttribute]('opacity');
  }

  set opacity(value) {
    if(value != null) value = Number(value);
    this[setAttribute]('opacity', value);
  }

  get zIndex() {
    return this[getAttribute]('zIndex');
  }

  set zIndex(value) {
    if(value != null) value = Number(value);
    this[setAttribute]('zIndex', value);
  }

  get offsetPath() {
    return this[getAttribute]('offsetPath');
  }

  set offsetPath(value) {
    if(this[setAttribute]('offsetPath', value)) {
      this[_offsetFigure].beginPath();
      this[_offsetFigure].addPath(value);
      updateOffset(this);
    }
  }

  get offsetDistance() {
    return this[getAttribute]('offsetDistance');
  }

  set offsetDistance(value) {
    if(this[setAttribute]('offsetDistance', toNumber(value))) {
      updateOffset(this);
    }
  }

  get offsetRotate() {
    return this[getAttribute]('offsetRotate');
  }

  set offsetRotate(value) {
    this[setAttribute]('offsetRotate', value);
    updateOffset(this);
  }

  get pointerEvents() {
    return this[getAttribute]('pointerEvents');
  }

  set pointerEvents(value) {
    if(value !== 'none' && value !== 'visible' && value !== 'visibleFill' && value !== 'visibleStroke' && value !== 'all') {
      throw new TypeError('Invalid pointerEvents type.');
    }
    this[setAttribute]('pointerEvents', value);
  }

  get filter() {
    return this[getAttribute]('filter');
  }

  set filter(value) {
    this[setAttribute]('filter', value);
  }

  set offset(value) {
    /* ignore setting offset for animations */
  }
}