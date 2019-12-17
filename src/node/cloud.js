import {MeshCloud} from '@mesh.js/core';
import Node from './node';
import ownerDocument from '../document';

const _amount = Symbol('amount');
const _meshCloud = Symbol('meshCloud');

export default class Cloud extends Node {
  constructor(node, amount = 1) {
    super();
    this.meshNode = node;
    node.connect(this);
    this[_amount] = amount;
    this[_meshCloud] = null;
  }

  get amount() {
    return this[_amount];
  }

  set amount(value) {
    this[_amount] = value;
  }

  /* override */
  setResolution({width, height}) {
    super.setResolution({width, height});
    this.meshNode.setResolution({width, height});
  }

  get meshCloud() {
    const meshNode = this.meshNode;
    const amount = this[_amount];

    if(!this[_meshCloud] && meshNode.mesh) {
      this[_meshCloud] = new MeshCloud(meshNode.mesh, amount);
      const {bgcolor, fillColor} = meshNode.attributes;
      for(let i = 0; i < this[_amount]; i++) {
        if(bgcolor) {
          this[_meshCloud].setFillColor(i, bgcolor);
        } else if(fillColor) {
          this[_meshCloud].setFillColor(i, fillColor);
        }
      }
    }
    if(this[_meshCloud].amount !== amount) {
      this[_meshCloud].amount = amount;
    }
    return this[_meshCloud];
  }

  setColorTransform(...args) {
    if(this.meshCloud) {
      this.meshCloud.setColorTransform(...args);
      this.forceUpdate();
    }
  }

  transformColor(...args) {
    if(this.meshCloud) {
      this.meshCloud.transformColor(...args);
      this.forceUpdate();
    }
  }

  setFillColor(...args) {
    if(this.meshCloud) {
      this.meshCloud.setFillColor(...args);
      this.forceUpdate();
    }
  }

  setStrokeColor(...args) {
    if(this.meshCloud) {
      this.meshCloud.setStrokeColor(...args);
      this.forceUpdate();
    }
  }

  grayscale(...args) {
    if(this.meshCloud) {
      this.meshCloud.grayscale(...args);
      this.forceUpdate();
    }
  }

  brightness(...args) {
    if(this.meshCloud) {
      this.meshCloud.brightness(...args);
      this.forceUpdate();
    }
  }

  saturate(...args) {
    if(this.meshCloud) {
      this.meshCloud.saturate(...args);
      this.forceUpdate();
    }
  }

  contrast(...args) {
    if(this.meshCloud) {
      this.meshCloud.contrast(...args);
      this.forceUpdate();
    }
  }

  invert(...args) {
    if(this.meshCloud) {
      this.meshCloud.invert(...args);
      this.forceUpdate();
    }
  }

  sepia(...args) {
    if(this.meshCloud) {
      this.meshCloud.sepia(...args);
      this.forceUpdate();
    }
  }

  opacity(...args) {
    if(this.meshCloud) {
      this.meshCloud.opacity(...args);
      this.forceUpdate();
    }
  }

  hueRotate(...args) {
    if(this.meshCloud) {
      this.meshCloud.hueRotate(...args);
      this.forceUpdate();
    }
  }

  setTransform(...args) {
    if(this.meshCloud) {
      this.meshCloud.setTransform(...args);
      this.forceUpdate();
    }
  }

  getTransform(...args) {
    if(this.meshCloud) return this.meshCloud.getTransform(...args);
  }

  transform(...args) {
    if(this.meshCloud) {
      this.meshCloud.transform(...args);
      this.forceUpdate();
    }
  }

  translate(...args) {
    if(this.meshCloud) {
      this.meshCloud.translate(...args);
      this.forceUpdate();
    }
  }

  rotate(idx, ang, [ox, oy] = [0, 0]) {
    const rad = Math.PI * ang / 180;
    if(this.meshCloud) {
      const {x: x0, y: y0} = this.meshNode.attributes;
      this.meshCloud.rotate(idx, rad, [ox + x0, oy + y0]);
      this.forceUpdate();
    }
  }

  scale(idx, [x, y = x], [ox, oy] = [0, 0]) {
    if(this.meshCloud) {
      const {x: x0, y: y0} = this.meshNode.attributes;
      this.meshCloud.scale(idx, [x, y], [ox + x0, oy + y0]);
      this.forceUpdate();
    }
  }

  skew(idx, [x, y = x], [ox, oy] = [0, 0]) {
    if(this.meshCloud) {
      const {x: x0, y: y0} = this.meshNode.attributes;
      this.meshCloud.skew(idx, [x, y], [ox + x0, oy + y0]);
      this.forceUpdate();
    }
  }

  /* override */
  isVisible() {
    return !!this.meshNode && this.meshNode.isVisible;
  }

  /* override */
  isPointCollision(x, y) {
    if(!this.meshCloud) return false;

    const pointerEvents = this.attributes.pointerEvents;
    if(pointerEvents === 'none') return false;
    if(pointerEvents !== 'all' && !this.isVisible) return false;
    let which = 'both';
    if(pointerEvents === 'visibleFill') which = 'fill';
    if(pointerEvents === 'visibleStroke') which = 'stroke';
    for(let i = 0; i < this[_amount]; i++) {
      if(!this.meshCloud.isPointCollision(i, [x, y], which)) return false;
    }
    return true;
  }

  draw(meshes = []) {
    super.draw(meshes);

    if(this.meshCloud) {
      meshes.push(this.meshCloud);
    }

    return meshes;
  }
}

ownerDocument.registerNode(Cloud, 'cloud');