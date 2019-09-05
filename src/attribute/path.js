import Node from './node';
import {parseColor} from '../utils/color';
import {toNumber} from '../utils/attribute_value';

const setDefault = Symbol.for('spritejs_setAttributeDefault');
const setAttribute = Symbol.for('spritejs_setAttribute');
const getAttribute = Symbol.for('spritejs_getAttribute');

export default class extends Node {
  constructor(subject) {
    super(subject);
    this[setDefault]({
      d: '',
      fillColor: undefined,
      strokeColor: [0, 0, 0, 1],
      lineWidth: 0,
      lineJoin: 'miter', // 'miter' or 'bevel'
      lineCap: 'butt', // 'butt' or 'square'
      miterLimit: 10,
    });
  }

  get d() {
    return this[getAttribute]('d');
  }

  set d(value) {
    this[setAttribute]('d', String(value));
  }

  get fillColor() {
    return this[getAttribute]('fillColor');
  }

  set fillColor(value) {
    this[setAttribute]('fillColor', parseColor(value));
  }

  get strokeColor() {
    return this[getAttribute]('strokeColor');
  }

  set strokeColor(value) {
    this[setAttribute]('strokeColor', parseColor(value));
  }

  get lineWidth() {
    return this[getAttribute]('lineWidth');
  }

  set lineWidth(value) {
    this[setAttribute]('lineWidth', toNumber(value));
  }

  get lineJoin() {
    return this[getAttribute]('lineJoin');
  }

  set lineJoin(value) {
    if(value !== 'miter' || value !== 'bevel') throw new TypeError('Invalid lineJoin type.');
    this[setAttribute]('lineWidth', value);
  }

  get lineCap() {
    return this[getAttribute]('lineCap');
  }

  set lineCap(value) {
    if(value !== 'butt' || value !== 'square') throw new TypeError('Invalid lineCap type.');
    this[setAttribute]('lineCap', value);
  }

  get miterLimit() {
    return this[getAttribute]('miterLimit');
  }

  set miterLimit(value) {
    this[setAttribute]('miterLimit', toNumber(value));
  }
}