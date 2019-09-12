import {mat2d} from 'gl-matrix';
import Attr from '../attribute/node';
import Animation from '../animation';

const copy = Symbol.for('spritejs_copyAttribute');

const _resolution = Symbol('resolution');
const _animations = Symbol('animations');

export default class {
  static Attr = Attr;

  constructor(attrs = {}) {
    this.attributes = new this.constructor.Attr(this);
    this[_resolution] = {width: 300, height: 150};
    Object.assign(this.attributes, attrs);
    if(Object.seal) {
      Object.seal(this.attributes);
    }
    this[_animations] = new Set();
  }

  get renderer() {
    if(this.parent) return this.parent.renderer;
    return null;
  }

  get layer() {
    if(this.parent) return this.parent.layer;
    return null;
  }

  get animations() {
    return this[_animations];
  }

  get nodeName() {
    return 'node';
  }

  get zIndex() {
    return this.attributes.zIndex;
  }

  get renderMatrix() {
    const {x, y} = this.attributes;
    let m = this.transformMatrix;
    m[4] += x;
    m[5] += y;
    let parent = this.parent;
    while(parent && parent.renderMatrix) {
      m = mat2d(parent.renderMatrix) * mat2d(m);
      parent = parent.parent;
    }
    return m;
  }

  cloneNode() {
    const cloned = new this.constructor();
    cloned.attributes[copy](this.attributes);
    return cloned;
  }

  remove() {
    if(this.parent && this.parent.removeChild) {
      this.parent.removeChild(this);
      return true;
    }
    return false;
  }

  onPropertyChange(key, newValue, oldValue) {
    if(key !== 'id' && key !== 'name' && key !== 'className') {
      this.forceUpdate();
    }
    // if(this.layer && this.layer.useCSS) {
    //   this.updateCSS();
    // }
  }

  forceUpdate() {
    if(this.isVisible && this.parent) this.parent.forceUpdate();
  }

  // updateCSS() {

  // }

  // reflow() {

  // }

  // relayout() {

  // }

  // 获取可继承的和被样式影响的属性
  // getComputedAttribute(key) {

  // }

  setAttribute(key, value) {
    this.attributes[key] = value;
  }

  getAttribute(key) {
    return this.attributes[key];
  }

  attr(...args) {
    if(args.length > 1) {
      const [key, value] = args;
      this.setAttribute(key, value);
      return this;
    }
    if(typeof args[0] === 'string') {
      return this.getAttribute(args[0]);
    }
    Object.assign(this.attributes, args[0]);
    return this;
  }

  setResolution({width, height}) {
    this[_resolution] = {width, height};
    if(this.borderBoxMesh) this.borderBoxMesh.setResolution(this[_resolution]);
    if(this.clientBoxMesh) this.clientBoxMesh.setResolution(this[_resolution]);
  }

  getResolution() {
    return {...this[_resolution]};
  }

  connect(parent, zOrder) {
    Object.defineProperty(this, 'parent', {
      value: parent,
      writable: false,
      configurable: true,
    });
    Object.defineProperty(this, 'zOrder', {
      value: zOrder,
      writable: false,
      configurable: true,
    });
  }

  disconnect() {
    delete this.parent;
    delete this.zOrder;
  }

  animate(frames, timing) {
    const animation = new Animation(this, frames, timing);
    if(this.effects) animation.applyEffects(this.effects);
    if(this.layer) {
      animation.baseTimeline = this.layer.timeline;
      animation.play();
      animation.finished.then(() => {
        this[_animations].delete(animation);
      });
    }
    this[_animations].add(animation);
    return animation;
  }

  transition(sec, easing = 'linear') {
    const that = this,
      _animation = Symbol('animation');

    easing = easing || 'linear';

    let delay = 0;
    if(typeof sec === 'object') {
      delay = sec.delay || 0;
      sec = sec.duration;
    }

    return {
      [_animation]: null,
      cancel(preserveState = false) {
        const animation = this[_animation];
        if(animation) {
          animation.cancel(preserveState);
        }
      },
      end() {
        const animation = this[_animation];
        if(animation && (animation.playState === 'running' || animation.playState === 'pending')) {
          animation.finish();
        }
      },
      reverse() {
        const animation = this[_animation];
        if(animation) {
          if(animation.playState === 'running' || animation.playState === 'pending') {
            animation.playbackRate = -animation.playbackRate;
          } else {
            const direction = animation.timing.direction;
            animation.timing.direction = direction === 'reverse' ? 'normal' : 'reverse';
            animation.play();
          }
        }
        return animation.finished;
      },
      attr(prop, val) {
        this.end();
        if(typeof prop === 'string') {
          prop = {[prop]: val};
        }
        Object.entries(prop).forEach(([key, value]) => {
          if(typeof value === 'function') {
            prop[key] = value(that.attr(key));
          }
        });
        this[_animation] = that.animate([prop], {
          duration: sec * 1000,
          delay: delay * 1000,
          fill: 'forwards',
          easing,
        });
        return this[_animation].finished;
      },
    };
  }
}