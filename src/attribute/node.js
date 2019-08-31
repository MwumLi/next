function compareValue(oldValue, newValue) {
  if(Array.isArray(oldValue) && Array.isArray(newValue)) {
    if(oldValue.length !== newValue.length) return false;
    for(let i = 0; i < oldValue.length; i++) {
      if(oldValue[i] !== newValue[1]) return false;
    }
    return true;
  }
  return oldValue === newValue;
}

const setAttribute = Symbol.for('spritejs_setAttribute');
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
      anchorX: 0,
      anchorY: 0,
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

  set id(value) {
    this[setAttribute]('id', String(value));
  }

  get id() {
    return this[_attr].id;
  }

  set name(value) {
    this[setAttribute]('name', String(value));
  }

  get name() {
    return this[_attr].name;
  }

  set className(value) {
    this[setAttribute]('className', String(value));
  }

  get className() {
    return this[_attr].className;
  }

  // 非继承属性，默认值 0
  set anchorX(value) {
    this[setAttribute]('anchorX', Number(value));
  }

  get anchorX() {
    return this[_attr].anchorX;
  }

  set anchorY(value) {
    this[setAttribute]('anchorY', Number(value));
  }

  get anchorY() {
    return this[_attr].anchorY;
  }

  set anchor([x, y]) {
    this.anchorX = x;
    this.anchorY = y;
  }

  get anchor() {
    return [this.anchorX, this.anchorY];
  }
}