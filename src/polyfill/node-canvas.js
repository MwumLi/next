// polyfill for node-canvas
import EventEmitter from 'events';
import {createCanvas, Image, Canvas} from 'node-canvas-webgl';

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

function nowtime() {
  const [s, ns] = process.hrtime();
  return s * 1e3 + ns * 1e-6;
}

if(typeof window === 'undefined' || !window.navigator) {
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
}

global.Worker = Object;

if(typeof HTMLCanvasElement !== 'undefined') { // jsdom
  HTMLCanvasElement.prototype._getCanvas = function () {
    if(!this._canvas) {
      this._canvas = new Canvas(this.width, this.height);
    }
    return this._canvas;
  };

  HTMLCanvasElement.prototype.getContext = function (contextId) {
    const canvas = this._getCanvas();
    if(!this._context) {
      this._context = canvas.getContext(contextId) || null;
    }
    return this._context;
  };

  HTMLCanvasElement.prototype.toDataURL = function (...args) {
    const canvas = this._getCanvas();
    return canvas.toDataURL(...args);
  };

  HTMLCanvasElement.prototype.toBuffer = function (...args) {
    const canvas = this._getCanvas();
    return canvas.toBuffer(...args);
  };

  Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
    get() {
      const parsed = parseInt(this.getAttributeNS(null, 'width'), 10);
      return isNaN(parsed) || parsed < 0 || parsed > 2147483647 ? 300 : parsed;
    },
    set(value) {
      value = value > 2147483647 ? 300 : value;
      this.setAttributeNS(null, 'width', String(value));
      const canvas = this._getCanvas();
      canvas.width = value;
    },
  });

  Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
    get() {
      const parsed = parseInt(this.getAttributeNS(null, 'height'), 10);
      return isNaN(parsed) || parsed < 0 || parsed > 2147483647 ? 150 : parsed;
    },
    set(value) {
      value = value > 2147483647 ? 150 : value;
      this.setAttributeNS(null, 'height', String(value));
      const canvas = this._getCanvas();
      canvas.height = value;
    },
  });
}