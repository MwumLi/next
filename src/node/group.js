import Element from './element';
import Attr from '../attribute/group';

const _zOrder = Symbol('zOrder');

const _ordered = Symbol('ordered');

export default class extends Element {
  static Attr = Attr;

  constructor(attrs = {}) {
    super(attrs);
    this.children = [];
    this[_ordered] = null;
    this[_zOrder] = 0;
  }

  reorder() {
    this[_ordered] = null;
  }

  get orderedChildren() {
    if(!this[_ordered]) {
      this[_ordered] = [...this.children];
      this[_ordered].sort((a, b) => {
        return a.zIndex - b.zIndex || a.zOrder - b.zOrder;
      });
    }
    return this[_ordered];
  }

  appendChild(el) {
    el.remove();
    Object.defineProperty(el, 'parent', {
      value: this,
      writable: false,
      configurable: true,
    });
    Object.defineProperty(el, 'zOrder', {
      value: this[_zOrder]++,
      writable: false,
      configurable: true,
    });
    this.children.push(el);
  }

  replaceChild(el, ref) {
    el.remove();
    const refIdx = this.children.indexOf(ref);
    if(refIdx < 0) {
      throw new Error('Invalid reference node.');
    }
    this.children[refIdx] = el;
  }

  removeChild(el) {
    const idx = this.children.indexOf(el);
    if(idx >= 0) {
      this.children.splice(idx, 1);
      delete el.parent;
      delete el.zOrder;
    }
    return false;
  }

  insertBefore(el, ref) {
    el.remove();
    const refIdx = this.children.indexOf(ref);
    if(refIdx < 0) {
      throw new Error('Invalid reference node.');
    }
    this.children.splice(refIdx, 0, el);
  }
}