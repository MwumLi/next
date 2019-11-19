import {Renderer, createCanvas} from '@mesh.js/core';
import {Timeline} from 'sprite-animator';
import Group from './group';
import ownerDocument from '../document';

const defaultOptions = {
  antialias: true,
  autoRender: true,
};

const _autoRender = Symbol('autoRender');
const _renderer = Symbol('renderer');
const _timeline = Symbol('timeline');

export default class Layer extends Group {
  constructor(options = {}) {
    super();
    if(!options.canvas) {
      const {width, height} = this.getResolution();
      const canvas = createCanvas(width, height, {offscreen: false});
      if(canvas.style) canvas.style.position = 'absolute';
      if(canvas.dataset) canvas.dataset.layerId = options.id;
      options.canvas = canvas;
    }
    const canvas = options.canvas;
    const opts = Object.assign({}, defaultOptions, options);
    this[_autoRender] = opts.autoRender;
    delete options.autoRender;
    this[_renderer] = new Renderer(canvas, opts);
    this.options = options;
    this.id = options.id;
    this.setResolution(canvas);
    this.canvas = canvas;
    this[_timeline] = new Timeline();
  }

  /* override */
  get renderer() {
    return this[_renderer];
  }

  /* override */
  get layer() {
    return this;
  }

  get timeline() {
    return this[_timeline];
  }

  get renderOffset() {
    if(this.parent && this.parent.options) {
      const {left, top} = this.parent.options;
      return [left, top];
    }
    return [this.options.left | 0, this.options.top | 0];
  }

  // isPointCollision(x, y) {
  //   return true;
  // }

  /* override */
  setResolution({width, height}) {
    if(super.setResolution({width, height})) {
      if(this.canvas) {
        this.canvas.width = width;
        this.canvas.height = height;
      }
      if(this.renderer.glRenderer) {
        this.renderer.glRenderer.gl.viewport(0, 0, width, height);
      }
      const [left, top] = this.renderOffset;
      this.renderer.setGlobalTransform(1, 0, 0, 1, left, top);
      this.attributes.size = [width, height];
      return true;
    }
    return false;
  }

  toLocalPos(x, y) {
    const {width, height} = this.getResolution();
    const offset = this.renderOffset;
    const viewport = [this.canvas.clientWidth, this.canvas.clientHeight];
    x = x * width / viewport[0] - offset[0];
    y = y * height / viewport[1] - offset[1];

    return [x, y];
  }

  toGlobalPos(x, y) {
    const {width, height} = this.getResolution();
    const offset = this.renderOffset;
    const viewport = [this.canvas.clientWidth, this.canvas.clientHeight];

    x = x * viewport[0] / width + offset[0];
    y = y * viewport[1] / height + offset[1];

    return [x, y];
  }

  render({clear = true} = {}) {
    if(clear) this[_renderer].clear();
    const meshes = this.draw();
    if(meshes && meshes.length) {
      this.renderer.drawMeshes(meshes);
    }
  }

  /* override */
  forceUpdate() {
    if(this[_autoRender] && !this.prepareRender) {
      this.prepareRender = new Promise((resolve) => {
        requestAnimationFrame(() => {
          delete this.prepareRender;
          this.render();
          resolve();
        });
      });
    }
  }

  /* override */
  onPropertyChange(key, newValue, oldValue) {
    super.onPropertyChange(key, newValue, oldValue);
    if(key === 'zIndex') {
      this.canvas.style.zIndex = newValue;
    }
  }
}

ownerDocument.registerNode(Layer, 'layer');