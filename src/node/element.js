import {Figure2D, Mesh2D} from '@mesh.js/core';
import {mat2d} from 'gl-matrix';
import Node from './node';
import Attr from '../attribute/element';

const _resolution = Symbol('resolution');

export default class extends Node {
  static Attr = Attr;

  constructor(attrs = {}) {
    super(attrs);
    this[_resolution] = {width: 300, height: 150};
  }

  get contentSize() {
    const {width, height} = this.attributes;
    return [width || 0, height || 0];
  }

  // content + padding
  get clientSize() {
    const {paddingTop, paddingRight, paddingBottom, paddingLeft, width, height} = this.attributes;
    return [paddingLeft + width + paddingRight,
      paddingTop + height + paddingBottom];
  }

  get borderSize() {
    const {paddingTop, paddingRight, paddingBottom, paddingLeft, width, height, borderWidth} = this.attributes;
    return [paddingLeft + width + paddingRight + borderWidth,
      paddingTop + height + paddingBottom + borderWidth];
  }

  // content + padding + border
  get offsetSize() {
    const {paddingTop, paddingRight, paddingBottom, paddingLeft, width, height, borderWidth} = this.attributes;
    const bw2 = 2 * borderWidth;
    return [paddingLeft + width + paddingRight + bw2,
      paddingTop + height + paddingBottom + bw2];
  }

  get isVisible() {
    const [width, height] = this.contentSize;

    return this.attributes.opacity > 0 && (width > 0 && height > 0) && !!(this.hasBorder || this.hasContent);
  }

  get hasBorder() {
    const borderWidth = this.attributes.borderWidth;
    const borderColor = this.attributes.borderColor;

    return borderWidth > 0 && borderColor[3] > 0;
  }

  get hasContent() {
    const bgcolor = this.attributes.bgcolor;
    return bgcolor && bgcolor[3] > 0;
  }

  get originalClientBox() {
    if(this.clientBox) {
      const points = this.clientBox.contours[0];
      return [points[0][0], points[0][1], points[2][0], points[2][1]];
    }
    return [0, 0, 0, 0];
  }

  get originalClientRect() {
    const [left, top, right, bottom] = this.originalClientBox;
    return [left, top, right - left, bottom - top];
  }

  get renderer() {
    if(this.parent) return this.parent.renderer;
    return null;
  }

  // content + padding + border + margin
  // get layoutSize() {
  //   return [0, 0];
  // }

  onPropertyChange(key, newValue, oldValue) {
    super.onPropertyChange(key, newValue, oldValue);
    if(key !== 'id' && key !== 'name' && key !== 'className') {
      this.forceUpdate();
    }
    if(key === 'anchorX' || key === 'anchorY' || key === 'width' || key === 'height' || key === 'borderWidth') {
      this.updateContours();
    }
    if(this.clientBoxMesh && key === 'bgcolor') {
      this.clientBoxMesh.setFill({
        color: newValue,
      });
    }
    if(this.borderBoxMesh && (key === 'borderColor' || key === 'borderWidth')) {
      const {borderColor, borderWidth} = this.attributes;
      this.borderBoxMesh.setStroke({
        color: borderColor,
        thickness: borderWidth,
      });
    }
    if(key === 'zIndex' && this.parent) {
      this.parent.reorder();
    }
  }

  setResolution({width, height}) {
    this[_resolution] = {width, height};
    if(this.borderBoxMesh) this.borderBoxMesh.setResolution(this[_resolution]);
    if(this.clientBoxMesh) this.clientBoxMesh.setResolution(this[_resolution]);
  }

  getResolution() {
    return {...this[_resolution]};
  }

  updateContours() {
    const {anchorX, anchorY, borderWidth} = this.attributes;
    const [width, height] = this.borderSize;
    const offsetSize = this.offsetSize;

    const bw = 0.5 * borderWidth;

    const left = -anchorX * offsetSize[0] + bw;
    const top = -anchorY * offsetSize[1] + bw;

    const figure = new Figure2D();
    figure.rect(left, top, width, height);
    this.borderBox = figure;

    const innerFigure = new Figure2D();
    innerFigure.rect(left + bw, top + bw, width - borderWidth, height - borderWidth);
    this.clientBox = innerFigure;
  }

  forceUpdate() {
    if(this.isVisible && this.parent) this.parent.forceUpdate();
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

  /* override */
  connect(parent, zOrder) {
    super.connect(parent, zOrder);
    this.setResolution(parent[_resolution]);
    this.forceUpdate();
  }

  disconnect() {
    const parent = this.parent;
    super.disconnect();
    if(parent) parent.forceUpdate();
  }

  draw() {
    if(!this.isVisible) return [];

    const opacity = this.attributes.opacity;
    const borderWidth = this.attributes.borderWidth;
    const bgcolor = this.attributes.bgcolor;
    const borderColor = this.attributes.borderColor;

    const ret = [];

    if(this.hasBorder) {
      let borderBoxMesh = this.borderBoxMesh;
      if(!borderBoxMesh) {
        borderBoxMesh = new Mesh2D(this.borderBox, this[_resolution]);
        borderBoxMesh.box = this.borderBox;
        this.borderBoxMesh = borderBoxMesh;

        borderBoxMesh.setStroke({
          color: borderColor,
          thickness: borderWidth,
        });
        borderBoxMesh.uniforms.u_opacity = opacity;
      } else if(borderBoxMesh.box !== this.borderBox) {
        borderBoxMesh.contours = this.borderBox.contours;
        borderBoxMesh.box = this.borderBox;
      }
      ret.push(borderBoxMesh);
    }

    if(this.hasContent) {
      let clientBoxMesh = this.clientBoxMesh;
      if(!clientBoxMesh) {
        clientBoxMesh = new Mesh2D(this.clientBox, this[_resolution]);
        clientBoxMesh.box = this.clientBox;
        this.clientBoxMesh = clientBoxMesh;

        if(bgcolor && bgcolor[3] > 0) {
          clientBoxMesh.setFill({
            color: bgcolor,
          });
        }
        clientBoxMesh.uniforms.u_opacity = opacity;
      } else if(clientBoxMesh.box !== this.clientBox) {
        clientBoxMesh.contours = this.clientBox.contours;
        clientBoxMesh.box = this.clientBox;
      }
      ret.push(clientBoxMesh);
    }

    const m = this.renderMatrix;

    ret.forEach((mesh) => {
      const m2 = mesh.transformMatrix;
      if(!mat2d.equals(m, m2)) {
        mesh.setTransform(...m);
      }
    });

    return ret;
  }
}