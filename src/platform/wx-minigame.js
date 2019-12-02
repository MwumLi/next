/* globals GameGlobal, wx */
const firstCanvas = wx.createCanvas();
let getFirstCanvas = false;

const {width, height} = firstCanvas;

GameGlobal.createCanvas = function () {
  if(!getFirstCanvas) {
    getFirstCanvas = true;
    return firstCanvas;
  }
  const canvas = wx.createCanvas();
  canvas._offscreen = true;
  return canvas;
};

GameGlobal.Image = function () {
  return wx.createImage();
};

function wrap(event) {
  event.target = firstCanvas;
  return event;
}

class Container {
  constructor() {
    this.children = [];
  }

  get clientWidth() {
    return width;
  }

  get clientHeight() {
    return height;
  }

  addEventListener(type, listener) {
    if(type === 'touchstart') {
      wx.onTouchStart((e) => {
        listener(wrap(e));
      });
    }
    if(type === 'touchmove') {
      wx.onTouchMove((e) => {
        listener(wrap(e));
      });
    }
    if(type === 'touchend') {
      wx.onTouchEnd((e) => {
        listener(wrap(e));
      });
    }
    if(type === 'touchcancel') {
      wx.onTouchCancel((e) => {
        listener(wrap(e));
      });
    }
  }

  appendChild(el) {
    this.children.push(el);
  }

  removeChild(el) {
    const idx = this.children.indexOf(el);
    if(idx >= 0) {
      this.children.splice(idx, 1);
      return el;
    }
    return null;
  }

  insertBefore(el, ref) {
    if(ref == null) return this.appendChild(el);
    const idx = this.children.indexOf(ref);
    if(idx >= 0) {
      this.children.splice(idx, 0, el);
    }
    return null;
  }

  replaceChild(el, ref) {
    const idx = this.children.indexOf(ref);
    if(idx >= 0) {
      this.children.splice(idx, 1, el);
      return el;
    }
    return null;
  }
}

GameGlobal.Container = Container;