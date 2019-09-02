import {toString, compareValue} from '../utils/attribute_value';

const setAttribute = Symbol.for('spritejs_setAttribute');
const getAttribute = Symbol.for('spritejs_getAttribute');
const setDefault = Symbol.for('spritejs_setAttributeDefault');

const _subject = Symbol.for('spritejs_subject');
const _attr = Symbol('attr');

// 规范：属性只能是原始类型或元素是原始类型的数组
export default class {
  constructor(subject) {
    this[_subject] = subject;
    this[_attr] = {};
    this[setDefault]({
      id: '',
      name: '',
      className: '',
    });
  }

  [setDefault](attrs) {
    Object.assign(this[_attr], attrs);
  }

  [setAttribute](key, value, quiet) {
    const oldValue = this[_attr][key];
    const subject = this[_subject];
    if(!compareValue(oldValue, value)) {
      this[_attr][key] = value;
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
}