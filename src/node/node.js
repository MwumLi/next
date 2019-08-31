import Attr from '../attribute/node';

export default class {
  static Attr = Attr;

  constructor() {
    this.attributes = new this.constructor.Attr(this);
    if(Object.seal) {
      Object.seal(this.attributes);
    }
  }

  get nodeName() {
    return 'node';
  }

  get layer() {
    return this.parent && this.parent.layer;
  }

  onPropertyChange(key, newValue, oldValue) {
    if(key !== 'id' && key !== 'name' && key !== 'className') {
      this.forceUpdate();
    }
    if(this.layer && this.layer.useCSS) {
      this.updateCSS();
    }
  }

  forceUpdate() {

  }

  updateCSS() {

  }

  reflow() {

  }

  relayout() {

  }

  // 获取可继承的和被样式影响的属性
  getComputedAttribute(key) {

  }

  connect(parent, zOrder) {

  }

  disconnect() {

  }
}