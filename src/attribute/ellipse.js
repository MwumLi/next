import {Figure2D} from '@mesh.js/core';
import Path from './path';
import {toNumber, toString} from '../utils/attribute_value';

const setDefault = Symbol.for('spritejs_setAttributeDefault');
const setAttribute = Symbol.for('spritejs_setAttribute');
const getAttribute = Symbol.for('spritejs_getAttribute');

function getPath(attr) {
  const {x, y, radiusX, radiusY, startAngle, endAngle, direction, closeType} = attr;
  const anticlockwise = direction === 'anitclockwise';
  const f = new Figure2D();
  if(closeType === 'sector') {
    f.moveTo(x, y);
  }
  f.ellipse(x, y, radiusX, radiusY, Math.PI * startAngle / 180, Math.PI * endAngle / 180, anticlockwise);
  if(closeType !== 'none') {
    f.closePath();
  }
  const path = f.path;
  if(path) {
    const ret = path.reduce((a, b) => {
      return a + b.join(' ');
    }, '');
    return ret;
  }
  return '';
}

export default class Ellipse extends Path {
  constructor(subject) {
    super(subject);

    this[setDefault]({
      radiusX: 0,
      radiusY: 0,
      startAngle: 0,
      endAngle: 0,
      direction: 'clockwise', // clockwise | anticlockwise
      closeType: 'none', // none | sector | normal
    });
  }

  // readonly
  get d() {
    return this[getAttribute]('d');
  }

  get radiusX() {
    return this[getAttribute]('radiusX');
  }

  set radiusX(value) {
    value = toNumber(value);
    if(this[setAttribute]('radiusX', value)) {
      const d = getPath(this);
      this[setAttribute]('d', d);
    }
  }

  get radiusY() {
    return this[getAttribute]('radiusY');
  }

  set radiusY(value) {
    value = toNumber(value);
    if(this[setAttribute]('radiusY', value)) {
      const d = getPath(this);
      this[setAttribute]('d', d);
    }
  }

  get direction() {
    return this[getAttribute]('direction');
  }

  set direction(value) {
    if(value !== 'clockwise' && value !== 'anticlockwise') throw new TypeError('Invalid direction type.');
    this[setAttribute]('direction', toString(value));
  }

  get startAngle() {
    return this[getAttribute]('startAngle');
  }

  set startAngle(value) {
    value = toNumber(value);
    if(this[setAttribute]('startAngle', value)) {
      const d = getPath(this);
      this[setAttribute]('d', d);
    }
  }

  get endAngle() {
    return this[getAttribute]('endAngle');
  }

  set endAngle(value) {
    value = toNumber(value);
    if(this[setAttribute]('endAngle', value)) {
      const d = getPath(this);
      this[setAttribute]('d', d);
    }
  }

  get closeType() {
    return this[getAttribute]('closeType');
  }

  set closeType(value) {
    if(value !== 'none' && value !== 'sector' && value !== 'normal') throw new TypeError('Invalid closeType type.');
    if(this[setAttribute]('closeType', value)) {
      const d = getPath(this);
      this[setAttribute]('d', d);
    }
  }
}