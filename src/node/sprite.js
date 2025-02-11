import {applyTexture, drawTexture} from '../utils/texture';
import Block from './block';
import Attr from '../attribute/sprite';
import ownerDocument from '../document';

export default class Sprite extends Block {
  static Attr = Attr;

  constructor(attrs = {}) {
    if(typeof attrs === 'string') attrs = {texture: attrs};
    super(attrs);
  }

  /* override */
  get contentSize() {
    let [w, h] = super.contentSize;
    const {width, height} = this.attributes;
    if(width == null || height == null) {
      const img = this.textureImage;
      const textureRect = this.attributes.textureRect;
      const sourceRect = this.attributes.sourceRect;
      if(textureRect) {
        if(width == null) w = textureRect[0] + textureRect[2];
        if(height == null) h = textureRect[1] + textureRect[3];
      } else if(sourceRect) {
        if(width == null) w = sourceRect[2];
        if(height == null) h = sourceRect[3];
      } else if(img) {
        if(width == null) w = img.width;
        if(height == null) h = img.height;
      }
    }
    return [w, h];
  }

  /* override */
  onPropertyChange(key, newValue, oldValue) {
    super.onPropertyChange(key, newValue, oldValue);
    if(key === 'texture') {
      applyTexture(this, newValue, true);
      // this.setTexture(newValue);
    }
    if(key === 'textureRect') {
      const {width, height} = this.attributes;
      if(width == null || height == null) {
        this.updateContours();
      }
    }
  }

  /* override */
  draw(meshes = []) {
    super.draw(meshes);
    const mesh = this.mesh;
    if(mesh) {
      drawTexture(this, mesh);
    }

    return meshes;
  }
}

ownerDocument.registerNode(Sprite, 'sprite');