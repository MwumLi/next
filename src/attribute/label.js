import parseFont from '@mesh.js/core/src/utils/parse-font';
import {toNumber} from '../utils/attribute_value';
import {parseColor} from '../utils/color';
import Block from './block';

const setDefault = Symbol.for('spritejs_setAttributeDefault');
const setAttribute = Symbol.for('spritejs_setAttribute');
const getAttribute = Symbol.for('spritejs_getAttribute');

export default class extends Block {
  constructor(subject) {
    super(subject);
    this[setDefault]({
      text: '',
      fontSize: 16,
      fontFamily: 'sans-serif',
      fontStyle: 'normal',
      fontVariant: 'normal',
      fontWeight: 'normal',
      fontStretch: 'normal',
      lineHeight: 16,
      textAlign: 'left',
      strokeColor: undefined,
      fillColor: [0, 0, 0, 1],
    });
  }

  get text() {
    return this[getAttribute]('text');
  }

  set text(value) {
    return this[setAttribute]('text', String(value));
  }

  get fontSize() {
    return this[getAttribute]('fontSize');
  }

  set fontSize(value) {
    return this[setAttribute]('fontSize', toNumber(value));
  }

  get fontFamily() {
    return this[getAttribute]('fontFamily');
  }

  set fontFamily(value) {
    return this[setAttribute]('fontFamily', String(value));
  }

  get fontStyle() {
    return this[getAttribute]('fontStyle');
  }

  set fontStyle(value) {
    return this[setAttribute]('fontStyle', String(value));
  }

  get fontVariant() {
    return this[getAttribute]('fontVariant');
  }

  set fontVariant(value) {
    return this[setAttribute]('fontVariant', String(value));
  }

  get fontWeight() {
    return this[getAttribute]('fontWeight');
  }

  set fontWeight(value) {
    return this[setAttribute]('fontWeight', String(value));
  }

  get fontStretch() {
    return this[getAttribute]('fontStretch');
  }

  set fontStretch(value) {
    return this[setAttribute]('fontStretch', String(value));
  }

  get lineHeight() {
    return this[getAttribute]('lineHeight');
  }

  set lineHeight(value) {
    return this[setAttribute]('lineHeight', toNumber(value));
  }

  get textAlign() {
    return this[getAttribute]('textAlign');
  }

  set textAlign(value) {
    return this[setAttribute]('textAlign', String(value));
  }

  get strokeColor() {
    return this[getAttribute]('strokeColor');
  }

  set strokeColor(value) {
    this[setAttribute]('strokeColor', parseColor(value));
  }

  get fillColor() {
    return this[getAttribute]('fillColor');
  }

  set fillColor(value) {
    this[setAttribute]('fillColor', parseColor(value));
  }

  get font() {
    const {fontStyle, fontVariant, fontWeight, fontStretch, fontSize, lineHeight, fontFamily} = this;
    return `${fontStyle} ${fontVariant} ${fontWeight} ${fontStretch} ${fontSize}px/${lineHeight}px ${fontFamily}`;
  }

  set font(value) {
    const fontInfo = parseFont(value);
    this.fontStyle = fontInfo.style;
    this.fontVariant = fontInfo.variant;
    this.fontWeight = fontInfo.weight;
    this.fontStretch = fontInfo.stretch;
    this.fontSize = fontInfo.size;
    if(fontInfo.lineHeight) {
      this.lineHeight = fontInfo.pxLineHeight;
    }
    this.fontFamily = fontInfo.family;
  }
}