// polyfill for node-canvas
import EventEmitter from 'events';
import {createCanvas, Image, Canvas} from 'node-canvas-webgl';

function nowtime() {
  const [s, ns] = process.hrtime();
  return s * 1e3 + ns * 1e-6;
}

global.requestAnimationFrame = (fn) => {
  return setTimeout(() => {
    fn(nowtime());
  }, 16);
};

global.cancelAnimationFrame = (id) => {
  return clearTimeout(id);
};

global.createCanvas = createCanvas;
global.Image = Image;
global.Canvas = Canvas;
global.Worker = Object;

export class Container extends EventEmitter {
  constructor(width = 800, height = 600) {
    super();
    this.children = [];
    this.clientWidth = width;
    this.clientHeight = height;
  }

  get childNodes() {
    return this.children;
  }

  appendChild(node) {
    if(node.parent) node.parent.removeChild(node);
    node.parent = this;
    this.children.push(node);
  }

  removeChild(node) {
    const idx = this.children.indexOf(node);
    if(idx !== -1) {
      this.children.splice(idx, 1);
      node.parent = null;
    }
    return node;
  }

  dispatchEvent(evt) {
    evt.target = this;
    return this.emit(evt.type, evt);
  }

  addEventListener(type, handler) {
    return this.addListener(type, handler);
  }

  removeEventListener(type, handler) {
    if(handler) {
      return this.removeListener(type, handler);
    }
    return this.removeAllListeners(type);
  }
}

global.Container = Container;

if(typeof document !== 'undefined' && document.createElement) {
  const _createElement = document.createElement;
  document.createElement = function (tagName, ...args) {
    if(tagName.toLowerCase() === 'canvas') return new Canvas(300, 150);
    return _createElement.call(tagName, ...args);
  };
}