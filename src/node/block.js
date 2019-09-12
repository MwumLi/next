import {Figure2D, Mesh2D} from '@mesh.js/core';
import {mat2d} from 'gl-matrix';
import Node from './node';
import Attr from '../attribute/block';
import {setFillColor, setStrokeColor} from '../utils/color';

export default class extends Node {
  static Attr = Attr;

  constructor(attrs = {}) {
    super(attrs);
  }

  get contentSize() {
    const {width, height} = this.attributes;
    return [width || 0, height || 0];
  }

  // content + padding
  get clientSize() {
    const {paddingTop, paddingRight, paddingBottom, paddingLeft} = this.attributes;
    const [width, height] = this.contentSize;
    return [paddingLeft + width + paddingRight,
      paddingTop + height + paddingBottom];
  }

  get borderSize() {
    const {paddingTop, paddingRight, paddingBottom, paddingLeft, borderWidth} = this.attributes;
    const [width, height] = this.contentSize;
    return [paddingLeft + width + paddingRight + borderWidth,
      paddingTop + height + paddingBottom + borderWidth];
  }

  // content + padding + border
  get offsetSize() {
    const {paddingTop, paddingRight, paddingBottom, paddingLeft, borderWidth} = this.attributes;
    const [width, height] = this.contentSize;
    const bw2 = 2 * borderWidth;
    return [paddingLeft + width + paddingRight + bw2,
      paddingTop + height + paddingBottom + bw2];
  }

  get isVisible() {
    const [width, height] = this.contentSize;

    return this.attributes.opacity > 0 && (!!this.hasBorder || width > 0 && height > 0);
  }

  get hasBorder() {
    const borderWidth = this.attributes.borderWidth;
    const borderColor = this.attributes.borderColor;

    return borderWidth > 0 && borderColor[3] > 0;
  }

  get hasBackground() {
    const bgcolor = this.attributes.bgcolor;
    return bgcolor && bgcolor[3] > 0;
  }

  get originalClientRect() {
    if(this.clientBox) {
      const points = this.clientBox.contours[0];
      if(points.length > 2) {
        const [left, top, right, bottom] = [points[0][0], points[0][1], points[2][0], points[2][1]];
        return [left, top, right - left, bottom - top];
      }
    }
    return [0, 0, 0, 0];
  }

  get originalContentRect() {
    const [left, top, width, height] = this.originalClientRect;
    const padding = this.attributes.padding;
    return [left + padding[0], top + padding[1], width - padding[0] - padding[2], height - padding[1] - padding[3]];
  }

  // content + padding + border + margin
  // get layoutSize() {
  //   return [0, 0];
  // }

  onPropertyChange(key, newValue, oldValue) {
    super.onPropertyChange(key, newValue, oldValue);
    if(key === 'anchorX' || key === 'anchorY' || key === 'width' || key === 'height' || key === 'borderWidth'
      || key === 'paddingLeft' || key === 'paddingRight' || key === 'paddingTop' || key === 'paddingBottom') {
      this.updateContours();
    }
    if(this.clientBoxMesh && key === 'bgcolor') {
      setFillColor(this.clientBoxMesh, {color: newValue});
    }
    if(this.borderBoxMesh && (key === 'borderColor' || key === 'borderWidth')) {
      const {borderColor, borderWidth} = this.attributes;
      setStrokeColor(this.borderBoxMesh, {color: borderColor, lineWidth: borderWidth});
    }
    if(key === 'zIndex' && this.parent) {
      this.parent.reorder();
    }
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

  /* override */
  connect(parent, zOrder) {
    super.connect(parent, zOrder);
    this.setResolution(parent.getResolution());
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

    const resolution = this.getResolution();

    if(this.hasBorder) {
      let borderBoxMesh = this.borderBoxMesh;
      if(!borderBoxMesh) {
        borderBoxMesh = new Mesh2D(this.borderBox, resolution);
        borderBoxMesh.box = this.borderBox;
        this.borderBoxMesh = borderBoxMesh;

        setStrokeColor(borderBoxMesh, {color: borderColor, lineWidth: borderWidth});
        borderBoxMesh.uniforms.u_opacity = opacity;
      } else if(borderBoxMesh.box !== this.borderBox) {
        borderBoxMesh.contours = this.borderBox.contours;
        borderBoxMesh.box = this.borderBox;
      }
      ret.push(borderBoxMesh);
    }

    let clientBoxMesh = this.clientBoxMesh;
    if(!clientBoxMesh) {
      clientBoxMesh = new Mesh2D(this.clientBox, resolution);
      clientBoxMesh.box = this.clientBox;
      this.clientBoxMesh = clientBoxMesh;

      if(bgcolor && bgcolor[3] > 0) {
        setFillColor(clientBoxMesh, {color: bgcolor});
      }
      clientBoxMesh.uniforms.u_opacity = opacity;
    } else if(clientBoxMesh.box !== this.clientBox) {
      clientBoxMesh.contours = this.clientBox.contours;
      clientBoxMesh.box = this.clientBox;
    }
    ret.push(clientBoxMesh);

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