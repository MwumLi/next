import Node from './node';
import {toNumber} from '../utils/attribute_value';
import {parseColor} from '../utils/color';

const setAttribute = Symbol.for('spritejs_setAttribute');
const getAttribute = Symbol.for('spritejs_getAttribute');
const setDefault = Symbol.for('spritejs_setAttributeDefault');

export default class extends Node {
  constructor(subject) {
    super(subject);

    this[setDefault]({
      anchorX: 0,
      anchorY: 0,
      width: undefined,
      height: undefined,
      borderWidth: 0,
      borderColor: [0, 0, 0, 1],
      bgcolor: undefined,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
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

  set size([width, height]) {
    this.width = width;
    this.height = height;
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
    this[setAttribute]('borderColor', parseColor(value));
  }

  get bgcolor() {
    return this[getAttribute]('bgcolor');
  }

  set bgcolor(value) {
    this[setAttribute]('bgcolor', parseColor(value));
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
}