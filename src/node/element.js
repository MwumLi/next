import {Figure2D, Mesh2D} from '@mesh.js/core';
import {mat2d} from 'gl-matrix';
import Node from './node';
import Attr from '../attribute/element';

export default class extends Node {
  static Attr = Attr;

  constructor(attrs = {}) {
    super();
    Object.assign(this.attributes, attrs);
  }

  get contentSize() {
    const {width, height} = this.attributes;
    return [width, height];
  }

  // content + padding
  get clientSize() {
    const {paddingTop, paddingRight, paddingBottom, paddingLeft, width, height} = this.attributes;
    return [paddingLeft + width + paddingRight,
      paddingTop + height + paddingBottom];
  }

  get contoursSize() {
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
  }

  updateContours() {
    const {anchorX, anchorY, borderWidth} = this.attributes;
    const [width, height] = this.contoursSize;
    const offsetSize = this.offsetSize;

    const left = -anchorX * offsetSize[0] + 0.5 * borderWidth;
    const top = -anchorY * offsetSize[1] + 0.5 * borderWidth;

    const figure = new Figure2D();
    figure.rect(left, top, width, height);

    this.box = figure;
  }

  forceUpdate() {
    // TODO
  }

  get isVisible() {
    const [width, height] = this.contentSize;
    const {borderWidth} = this.attributes;

    return this.borderBoxMesh && (width > 0 && height > 0) || borderWidth > 0;
  }

  draw(renderer) {
    if(!this.isVisible) return null;

    let borderBoxMesh = this.borderBoxMesh;
    if(!borderBoxMesh) {
      borderBoxMesh = new Mesh2D(this.box, renderer.canvas);
      this.borderBoxMesh = borderBoxMesh;

      const borderWidth = this.attributes.borderWidth;

      if(borderWidth > 0) {
        const borderColor = this.attributes.borderColor;
        if(borderColor[3] > 0) {
          borderBoxMesh.setStroke({
            color: borderColor,
            thickness: borderWidth,
          });
        }
      }

      const bgcolor = this.attributes.bgcolor;

      if(bgcolor && bgcolor[3] > 0) {
        borderBoxMesh.setFill({
          color: bgcolor,
        });
      }
    } else if(borderBoxMesh.box !== this.box) {
      borderBoxMesh.contours = this.box.contours;
      borderBoxMesh.box = this.box;
    }

    const {x, y} = this.attributes;
    const m = this.transformMatrix;
    m[4] += x;
    m[5] += y;

    const m2 = borderBoxMesh.transformMatrix;
    if(!mat2d.equals(m, m2)) {
      borderBoxMesh.setTransform(...m);
    }

    return borderBoxMesh;
  }
}