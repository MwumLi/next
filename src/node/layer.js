import {Renderer} from '@mesh.js/core';
import {Timeline} from 'sprite-animator';
import Group from './group';

const defaultOptions = {
  antialias: true,
  autoUpdate: true,
};

const _autoUpdate = Symbol('autoUpdate');
const _renderer = Symbol('renderer');
const _timeline = Symbol('timeline');

export default class Layer extends Group {
  constructor(canvas, options = {}) {
    super();
    const opts = Object.assign({}, defaultOptions, options);
    this[_autoUpdate] = opts.autoUpdate;
    delete options.autoUpdate;
    this[_renderer] = new Renderer(canvas, opts);
    this.setResolution(canvas);
    this.options = options;
    this.canvas = canvas;
    this[_timeline] = new Timeline();
  }

  /* override */
  get renderer() {
    return this[_renderer];
  }

  get layer() {
    return this;
  }

  get timeline() {
    return this[_timeline];
  }

  /* override */
  setResolution({width, height}) {
    if(this.canvas) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    if(this.renderer.glRenderer) {
      this.renderer.glRenderer.gl.viewport(0, 0, width, height);
    }
    if(this.parent && this.parent.options) {
      const {left, top} = this.parent.options;
      this.renderer.setGlobalTransform(1, 0, 0, 1, left, top);
    }
    super.setResolution({width, height});
  }

  render() {
    const meshes = this.draw();
    this[_renderer].clear();
    if(meshes && meshes.length) {
      this.renderer.drawMeshes(meshes);
    }
  }

  /* override */
  forceUpdate() {
    if(!this.prepareRender) {
      this.prepareRender = new Promise((resolve) => {
        requestAnimationFrame(() => {
          delete this.prepareRender;
          this.render();
          resolve();
        });
      });
    }
  }
}