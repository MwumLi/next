import {Figure2D, Mesh2D} from '@mesh.js/core';
import {mat2d} from 'gl-matrix';
import Node from './node';
import Attr from '../attribute/block';
import {setFillColor, setStrokeColor} from '../utils/color';
import {createRadiusBox} from '../utils/border_radius';
import {parseFilterString, applyFilters} from '../utils/filter';
import ownerDocument from '../document';
import getBoundingBox from '../utils/bounding_box';
import applyRenderEvent from '../utils/render_event';

const _borderBoxMesh = Symbol('borderBoxMesh');
const _clientBoxMesh = Symbol('clientBoxMesh');
const _filters = Symbol('filters');

export default class Block extends Node {
  static Attr = Attr;

  constructor(attrs = {}) {
    super(attrs);
  }

  get contentSize() {
    let {width, height, boxSizing} = this.attributes;
    width = width || 0;
    height = height || 0;
    if(boxSizing === 'border-box') {
      const bw = 2 * this.attributes.borderWidth;
      width -= bw;
      height -= bw;
      width = Math.max(0, width);
      height = Math.max(0, height);
    }
    return [width, height];
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
    return borderWidth > 0;
  }

  get hasBackground() {
    return !!this.attributes.bgcolor;
  }

  get originalClientRect() {
    if(this.clientBox) {
      const boundingBox = this.clientBoxMesh.boundingBox;
      return [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0] - boundingBox[0][0], boundingBox[1][1] - boundingBox[0][1]];
    }
    return [0, 0, 0, 0];
  }

  get originalContentRect() {
    const [left, top, width, height] = this.originalClientRect;
    const padding = this.attributes.padding;
    return [left + padding[0], top + padding[1], width - padding[0] - padding[2], height - padding[1] - padding[3]];
  }

  getBoundingClientRect() {
    let boundingBox = null;
    if(this.clientBoxMesh) {
      boundingBox = [...this.clientBoxMesh.boundingBox];
      const borderWidth = this.attributes.borderWidth;
      if(borderWidth) {
        boundingBox[0] = [boundingBox[0][0] - borderWidth, boundingBox[0][1] - borderWidth];
        boundingBox[1] = [boundingBox[1][0] + borderWidth, boundingBox[1][1] + borderWidth];
      }
    }
    return getBoundingBox(boundingBox, this.renderMatrix);
  }

  get borderBoxMesh() {
    if(this.hasBorder) {
      const resolution = this.getResolution();
      let borderBoxMesh = this[_borderBoxMesh];
      if(!borderBoxMesh) {
        borderBoxMesh = new Mesh2D(this.borderBox, resolution);
        borderBoxMesh.box = this.borderBox;
        this[_borderBoxMesh] = borderBoxMesh;

        const {borderColor, borderWidth, borderDash, borderDashOffset, opacity} = this.attributes;
        setStrokeColor(borderBoxMesh,
          {color: borderColor, lineWidth: borderWidth, lineDash: borderDash, lineDashOffset: borderDashOffset});
        borderBoxMesh.uniforms.u_opacity = opacity;
        if(this[_filters]) {
          applyFilters(borderBoxMesh, this[_filters]);
        }
      } else if(borderBoxMesh.box !== this.borderBox) {
        borderBoxMesh.contours = this.borderBox.contours;
        borderBoxMesh.box = this.borderBox;
      }
      const m = this.renderMatrix;
      const m2 = borderBoxMesh.transformMatrix;
      if(!mat2d.equals(m, m2)) {
        borderBoxMesh.setTransform(...m);
      }
      return borderBoxMesh;
    }
    return null;
  }

  get clientBoxMesh() {
    if(this.clientBox) {
      let clientBoxMesh = this[_clientBoxMesh];
      const resolution = this.getResolution();

      if(!clientBoxMesh) {
        clientBoxMesh = new Mesh2D(this.clientBox, resolution);
        clientBoxMesh.box = this.clientBox;
        this[_clientBoxMesh] = clientBoxMesh;

        const {bgcolor, opacity} = this.attributes;

        if(this.hasBackground) {
          setFillColor(clientBoxMesh, {color: bgcolor});
        }
        clientBoxMesh.uniforms.u_opacity = opacity;
        if(this[_filters]) {
          applyFilters(clientBoxMesh, this[_filters]);
        }
      } else if(clientBoxMesh.box !== this.clientBox) {
        clientBoxMesh.contours = this.clientBox.contours;
        clientBoxMesh.box = this.clientBox;
      }
      const m = this.renderMatrix;
      const m2 = clientBoxMesh.transformMatrix;
      if(!mat2d.equals(m, m2)) {
        clientBoxMesh.setTransform(...m);
      }
      return clientBoxMesh;
    }
    return null;
  }

  /* override */
  setResolution({width, height}) {
    if(super.setResolution({width, height})) {
      if(this.clientBoxMesh) this.clientBoxMesh.setResolution({width, height});
      if(this.borderBoxMesh) this.borderBoxMesh.setResolution({width, height});
      return true;
    }
    return false;
  }

  // transformPoint(x, y) {
  //   const m = mat2d.invert(this.renderMatrix);
  //   const newX = x * m[0] + y * m[2] + m[4];
  //   const newY = x * m[1] + y * m[3] + m[5];
  //   return [newX, newY];
  // }

  isPointCollision(x, y) {
    const pointerEvents = this.attributes.pointerEvents;
    if(pointerEvents === 'none') return false;
    if(pointerEvents !== 'all' && !this.isVisible) return false;
    if(pointerEvents !== 'visibleStroke' && this.clientBoxMesh.isPointCollision(x, y, 'fill')) {
      return true;
    }
    return pointerEvents !== 'visibleFill' && this.hasBorder && this.borderBoxMesh.isPointCollision(x, y, 'stroke');
  }

  onPropertyChange(key, newValue, oldValue) { // eslint-disable-line complexity
    super.onPropertyChange(key, newValue, oldValue);
    if(key === 'anchorX' || key === 'anchorY' || key === 'boxSizing' || key === 'width' || key === 'height' || key === 'borderWidth'
      || key === 'paddingLeft' || key === 'paddingRight' || key === 'paddingTop' || key === 'paddingBottom'
      || /^border(TopLeft|TopRight|BottomRight|BottomLeft)Radius$/.test(key)) {
      this.updateContours();
    }
    if(key === 'opacity') {
      if(this[_clientBoxMesh]) this[_clientBoxMesh].uniforms.u_opacity = newValue;
      if(this[_borderBoxMesh]) this[_borderBoxMesh].uniforms.u_opacity = newValue;
    }
    if(key === 'anchorX' || key === 'anchorY' || key === 'boxSizing') {
      if(this[_clientBoxMesh]) {
        const bgcolor = this.attributes.bgcolor;
        if(bgcolor && bgcolor.vector) {
          setFillColor(this[_clientBoxMesh], {color: bgcolor});
        }
      }
      if(this[_borderBoxMesh]) {
        const borderColor = this.attributes.borderColor;
        if(borderColor && borderColor.vector) {
          const {borderWidth, borderDash, borderDashOffset} = this.attributes;
          setStrokeColor(this[_borderBoxMesh],
            {color: borderColor, lineWidth: borderWidth, lineDash: borderDash, lineDashOffset: borderDashOffset});
        }
      }
    }
    if(this[_clientBoxMesh] && key === 'bgcolor') {
      setFillColor(this[_clientBoxMesh], {color: newValue});
    }
    if(this[_borderBoxMesh]
      && (key === 'borderColor'
      || key === 'borderWidth'
      || key === 'borderDash'
      || key === 'borderDashOffset')) {
      const {borderColor, borderWidth, borderDash, borderDashOffset} = this.attributes;
      setStrokeColor(this[_borderBoxMesh],
        {color: borderColor, lineWidth: borderWidth, lineDash: borderDash, lineDashOffset: borderDashOffset});
    }
    if(key === 'zIndex' && this.parent) {
      this.parent.reorder();
    }
    if(key === 'filter') {
      this[_filters] = parseFilterString(newValue);
      if(this[_clientBoxMesh]) {
        applyFilters(this[_clientBoxMesh], this[_filters]);
      }
      if(this[_borderBoxMesh]) {
        applyFilters(this[_borderBoxMesh], this[_filters]);
      }
    }
  }

  updateContours() {
    const {anchorX, anchorY, borderWidth, borderRadius} = this.attributes;
    const [width, height] = this.borderSize;
    const offsetSize = this.offsetSize;

    const bw = 0.5 * borderWidth;

    const left = -anchorX * offsetSize[0] + bw;
    const top = -anchorY * offsetSize[1] + bw;

    this.borderBox = new Figure2D();
    createRadiusBox(this.borderBox, [left, top, width, height], borderRadius);
    const clientRect = [left + bw,
      top + bw,
      width - borderWidth,
      height - borderWidth];

    const clientBorderRadius = borderRadius.map((r) => {
      return Math.max(0, r - bw);
    });

    this.clientBox = new Figure2D();
    createRadiusBox(this.clientBox, clientRect, clientBorderRadius);
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

    const ret = [];

    const borderBoxMesh = this.borderBoxMesh;
    if(borderBoxMesh) {
      ret.push(borderBoxMesh);
    }

    const clientBoxMesh = this.clientBoxMesh;
    if(clientBoxMesh) {
      ret.push(clientBoxMesh);
    }

    if(borderBoxMesh) applyRenderEvent(this, borderBoxMesh);
    else if(clientBoxMesh) applyRenderEvent(this, clientBoxMesh);

    return ret;
  }
}

ownerDocument.registerNode(Block, 'block');