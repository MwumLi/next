import {Figure2D, Mesh2D} from '@mesh.js/core';
import {mat2d} from 'gl-matrix';
import pasition from 'pasition';
import Node from './node';
import Attr from '../attribute/path';
import {setFillColor, setStrokeColor} from '../utils/color';
import {loadTexture, createTexture} from '../utils/texture_loader';
import {compareValue} from '../utils/attribute_value';

const _mesh = Symbol('mesh');
const _textureImage = Symbol('textureImage');
const _textureContext = Symbol('textureContext');

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

  async setTexture(url) {
    const textureImage = await loadTexture(url);
    this[_textureImage] = textureImage;
    this.updateContours();
    this.forceUpdate();
    return textureImage;
  }

  set d(value) {
    this.attributes.d = value;
  }

  get d() {
    return this.attributes.d;
  }

  get originalContentRect() {
    if(this.path) {
      const boundingBox = this.path.boundingBox;
      return [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0] - boundingBox[0][0], boundingBox[1][1] - boundingBox[0][1]];
    }
    return [0, 0, 0, 0];
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
    if(this[_mesh] && (key === 'strokeColor' || key === 'lineWidth' || key === 'lineCap' || key === 'lineJoin'
      || key === 'lineDash' || key === 'lineDashOffset')) {
      const {lineCap, lineJoin, lineWidth, strokeColor, lineDash, lineDashOffset, miterLimit} = this.attributes;
      setStrokeColor(this[_mesh], {color: strokeColor, lineCap, lineJoin, lineWidth, lineDash, lineDashOffset, miterLimit});
    }
  }

  get isVisible() {
    return this.attributes.opacity > 0 && !!this.d;
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
    const pointerEvents = this.attributes.pointerEvents;
    if(pointerEvents === 'none') return false;
    if(pointerEvents !== 'all' && !this.isVisible) return false;
    let which = 'both';
    if(pointerEvents === 'visibleFill') which = 'fill';
    if(pointerEvents === 'visibleStroke') which = 'stroke';
    return !!this.mesh && this.mesh.isPointCollision(x, y, which);
  }

  /* override */
  updateContours() {
    this.path = this.path || new Figure2D();
    this.path.beginPath();
    this.path.addPath(this.attributes.d);
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
      const textureImage = this[_textureImage];
      if(textureImage) {
        const texture = mesh.texture;
        const contentRect = this.originalContentRect;
        let textureRect = this.attributes.textureRect;
        const textureRepeat = this.attributes.textureRepeat;
        const sourceRect = this.attributes.sourceRect;

        if(!texture
          || this[_textureContext] && this[_textureContext] !== this.renderer
          || texture.image !== textureImage
          || texture.options.repeat !== textureRepeat
          || !compareValue(texture.options.rect, textureRect)
          || !compareValue(texture.options.srcRect, sourceRect)) {
          const newTexture = createTexture(textureImage, this.renderer);

          if(textureRect) {
            textureRect[0] += contentRect[0];
            textureRect[1] += contentRect[1];
          } else {
            textureRect = contentRect;
          }
          mesh.setTexture(newTexture, {
            rect: textureRect,
            repeat: textureRepeat,
            srcRect: sourceRect,
          });
          this[_textureContext] = this.renderer;
        }
      }
      return [mesh];
    }

    return [];
  }
}