import {Figure2D, Mesh2D} from '@mesh.js/core';
import {mat2d} from 'gl-matrix';
import pasition from 'pasition';
import Node from './node';
import Attr from '../attribute/path';
import {setFillColor, setStrokeColor} from '../utils/color';

const _mesh = Symbol('mesh');

export default class Path extends Node {
  static Attr = Attr;

  constructor(attrs = {}) {
    super(attrs);
    this.effects = {
      d(from, to, p, s, e) {
        const ep = (p - s) / (e - s);
        if(ep <= 0) return from;
        if(ep >= 1) return to;
        const shapes = pasition._preprocessing(pasition.path2shapes(from), pasition.path2shapes(to));
        const shape = pasition._lerp(...shapes, ep)[0];
        const path = shape.reduce((str, c) => {
          return `${str}${c.slice(2).join(' ')} `;
        }, `M${shape[0][0]} ${shape[0][1]}C`).trim();
        return path;
      },
    };
  }

  set d(value) {
    this.attributes.d = value;
  }

  get d() {
    return this.attributes.d;
  }

  /* override */
  setResolution({width, height}) {
    super.setResolution({width, height});
    if(this.mesh) this.mesh.setResolution({width, height});
  }

  /* override */
  onPropertyChange(key, newValue, oldValue) {
    super.onPropertyChange(key, newValue, oldValue);
    if(key === 'd') {
      this.updateContours();
    }
    if(this[_mesh] && key === 'fillColor') {
      setFillColor(this[_mesh], {color: newValue});
    }
    if(this[_mesh] && (key === 'strokeColor' || key === 'lineWidth' || key === 'lineCap' || key === 'lineJoin')) {
      const {lineCap, lineJoin, lineWidth, strokeColor, miterLimit} = this.attributes;
      setStrokeColor(this[_mesh], {color: strokeColor, lineCap, lineJoin, lineWidth, miterLimit});
    }
  }

  get isVisible() {
    return !!this.d;
  }

  get mesh() {
    const path = this.path;
    if(path) {
      let mesh = this[_mesh];
      if(!mesh) {
        mesh = new Mesh2D(this.path, this.getResolution());
        mesh.path = path;
        const fillColor = this.attributes.fillColor;
        if(fillColor) {
          setFillColor(mesh, {color: fillColor});
        }
        const lineWidth = this.attributes.lineWidth;
        if(lineWidth > 0) {
          const {strokeColor, lineCap, lineJoin, miterLimit} = this.attributes;
          setStrokeColor(mesh, {
            color: strokeColor,
            lineWidth,
            lineCap,
            lineJoin,
            miterLimit,
          });
        }
        this[_mesh] = mesh;
      } else if(mesh.path !== path) {
        mesh.contours = path.contours;
        mesh.path = path;
      }

      const m = this.renderMatrix;
      const m2 = mesh.transformMatrix;
      if(!mat2d.equals(m, m2)) {
        mesh.setTransform(...m);
      }
      return mesh;
    }
    return null;
  }

  isPointCollision(x, y) {
    return !!this.mesh && this.mesh.isPointCollision(x, y, 'both');
  }

  /* override */
  updateContours() {
    const figure = new Figure2D();
    figure.addPath(this.attributes.d);

    this.path = figure;
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

  /* override */
  draw() {
    const mesh = this.mesh;
    if(mesh) {
      return [mesh];
    }

    return [];
  }
}