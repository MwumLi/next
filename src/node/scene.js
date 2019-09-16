import {createCanvas} from '@mesh.js/core/src/utils/canvas';
import Layer from './layer';
import Group from './group';

export default class Scene extends Group {
  constructor(container, options = {}) {
    super();
    this.container = container;
    this.options = options;
    options.displayRatio = options.displayRatio || 1.0;
    if(options.width == null || options.height == null) {
      global.addEventListener('resize', () => {
        this.setResolution();
      });
    }
    this.setResolution(options);
  }

  /* override */
  setResolution({width, height} = {}) {
    const container = this.container;
    if(width == null || height == null) {
      const {clientWidth, clientHeight} = container;
      width = width == null ? clientWidth : width;
      height = height == null ? clientHeight : height;
    }
    const options = this.options;
    options.width = options.displayRatio * width;
    options.height = options.displayRatio * height;
    super.setResolution(options);
  }

  layer(id) {
    const layers = this.orderedChildren;
    for(let i = 0; i < layers.length; i++) {
      if(layers[i].id === id) return layers[i];
    }
    const {width, height} = this.options;
    const canvas = createCanvas(width, height, {offscreen: false});
    canvas.style.position = 'absolute';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    this.container.appendChild(canvas);
    const layer = new Layer(canvas, this.options);
    layer.id = id;
    this.appendChild(layer);
    return layer;
  }
}