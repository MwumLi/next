import {mat2d} from 'gl-matrix';
import Node from './node';
import {toNumber} from '../utils/attribute_value';
import toColor from '../utils/color';

const setAttribute = Symbol.for('spritejs_setAttribute');
const getAttribute = Symbol.for('spritejs_getAttribute');
const setDefault = Symbol.for('spritejs_setAttributeDefault');

const _transformMatrix = Symbol('transformMatrix');
const _transforms = Symbol('transforms');

function getMatrix(transformMap) {
  let m = mat2d(1, 0, 0, 1, 0, 0);
  [...transformMap].forEach(([key, value]) => {
    if(key === 'matrix') {
      m *= mat2d(value);
    } else {
      mat2d[key](m, m, value);
    }
  });
  return m;
}

export default class extends Node {
  constructor(subject) {
    super(subject);
    this[_transformMatrix] = mat2d(1, 0, 0, 1, 0, 0);
    this[_transforms] = new Map();

    Object.defineProperty(subject, 'transformMatrix', {
      get: () => {
        return [...this[_transformMatrix]];
      },
    });

    this[setDefault]({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      borderWidth: 0,
      borderColor: [0, 0, 0, 1],
      bgcolor: undefined,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      transformOrigin: [0, 0],
      transform: '',
      translate: [0, 0],
      rotate: 0,
      scale: [1, 1],
      skew: [0, 0],
    });
  }

  get anchorX() {
    return this[getAttribute]('anchorX');
  }

  set anchorX(value) {
    this[setAttribute]('anchorX', toNumber(value));
  }

  get anchorY() {
    return this[getAttribute]('anchorY');
  }

  set anchorY(value) {
    this[setAttribute]('anchorY', toNumber(value));
  }

  get anchor() {
    return [this.anchorX, this.anchorY];
  }

  set anchor(value) {
    if(!Array.isArray(value)) value = [value, value];
    this.anchorX = value[0];
    this.anchorY = value[1];
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

  get width() {
    return this[getAttribute]('width');
  }

  set width(value) {
    this[setAttribute]('width', toNumber(value));
  }

  get height() {
    return this[getAttribute]('height');
  }

  set height(value) {
    this[setAttribute]('height', toNumber(value));
  }

  get size() {
    return [this.width, this.height];
  }

  get borderWidth() {
    return this[getAttribute]('borderWidth');
  }

  set borderWidth(value) {
    this[setAttribute]('borderWidth', toNumber(value));
  }

  get borderColor() {
    return this[getAttribute]('borderColor');
  }

  set borderColor(value) {
    this[setAttribute]('borderWidth', toColor(value));
  }

  get bgcolor() {
    return this[getAttribute]('bgcolor');
  }

  set bgcolor(value) {
    this[setAttribute]('bgcolor', toColor(value));
  }

  get paddingTop() {
    return this[getAttribute]('paddingTop');
  }

  set paddingTop(value) {
    this[setAttribute]('paddingTop', toNumber(value));
  }

  get paddingRight() {
    return this[getAttribute]('paddingRight');
  }

  set paddingRight(value) {
    this[setAttribute]('paddingRight', toNumber(value));
  }

  get paddingBottom() {
    return this[getAttribute]('paddingBottom');
  }

  set paddingBottom(value) {
    this[setAttribute]('paddingBottom', toNumber(value));
  }

  get paddingLeft() {
    return this[getAttribute]('paddingLeft');
  }

  set paddingLeft(value) {
    this[setAttribute]('paddingLeft', toNumber(value));
  }

  get padding() {
    return [this.paddingTop, this.paddingRight, this.paddingBottom, this.paddingLeft];
  }

  set padding(value) {
    if(!Array.isArray(value)) {
      value = [value, value, value, value];
    } else if(value.length === 1) {
      value = [value[0], value[0], value[0], value[0]];
    } else if(value.length === 2) {
      value = [value[0], value[1], value[0], value[1]];
    } else if(value.length === 3) {
      value = [value[0], value[1], value[2], value[1]];
    }
    this.paddingTop = value[0];
    this.paddingRight = value[1];
    this.paddingBottom = value[2];
    this.paddingLeft = value[3];
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
    this[_transformMatrix] = getMatrix(transformMap);
    this[setAttribute]('transform', value);
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
    this[_transformMatrix] = getMatrix(transformMap);
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
    this[_transformMatrix] = getMatrix(transformMap);
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
    this[_transformMatrix] = getMatrix(transformMap);
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
    this[_transformMatrix] = getMatrix(transformMap);
    this[setAttribute]('skew', value);
  }
}