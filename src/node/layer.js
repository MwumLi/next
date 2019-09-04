import {Renderer} from '@mesh.js/core';
import Group from './group';

const defaultOptions = {
  antialias: true,
  autoUpdate: true,
};

const _autoUpdate = Symbol('autoUpdate');
const _renderer = Symbol('renderer');

export default class extends Group {
  constructor(canvas, options = {}) {
    super();
    const opts = Object.assign({}, defaultOptions, options);
    this[_autoUpdate] = opts.autoUpdate;
    delete options.autoUpdate;
    this[_renderer] = new Renderer(canvas, opts);
    this.setResolution(canvas);
  }

  /* override */
  get renderer() {
    return this[_renderer];
  }

  render() {
    const meshes = this.draw();
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