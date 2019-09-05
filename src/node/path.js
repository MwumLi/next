import {Figure2D, Mesh2D} from '@mesh.js/core';
import {mat2d} from 'gl-matrix';
import Node from './node';
import Attr from '../attribute/path';
import {setFillColor, setStrokeColor} from '../utils/color';

// const _path = Symbol('path');

export default class extends Node {
  static Attr = Attr;

  set d(value) {
    this.attributes.d = value;
  }

  get d() {
    return this.attributes.d;
  }

  /* override */
  onPropertyChange(key, newValue, oldValue) {
    super.onPropertyChange(key, newValue, oldValue);
    if(key === 'd') {
      this.updateContours();
    }
    if(this.mesh && key === 'fillColor') {
      setFillColor(this.mesh, {color: newValue});
    }
    if(this.mesh && (key === 'strokeColor' || key === 'lineWidth' || key === 'lineCap' || key === 'lineJoin')) {
      const {lineCap, lineJoin, lineWidth, strokeColor, miterLimit} = this.attributes;
      setStrokeColor(this.mesh, {color: strokeColor, lineCap, lineJoin, lineWidth, miterLimit});
    }
  }

  get isVisible() {
    return !!this.d;
  }

  /* override */
  updateContours() {
    const figure = new Figure2D();
    figure.addPath(this.attributes.d);

    this.path = figure;
  }

  /* override */
  draw() {
    const path = this.path;
    if(path) {
      let mesh = this.mesh;
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
        this.mesh = mesh;
      } else if(mesh.path !== path) {
        mesh.contours = path.contours;
        mesh.path = path;
      }

      const m = this.renderMatrix;
      const m2 = mesh.transformMatrix;
      if(!mat2d.equals(m, m2)) {
        mesh.setTransform(...m);
      }

      return [mesh];
    }

    return [];
  }
}