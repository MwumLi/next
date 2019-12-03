import {createTexture, applyTexture} from '../utils/texture_loader';
import {compareValue} from '../utils/attribute_value';
import Block from './block';
import Attr from '../attribute/sprite';
import ownerDocument from '../document';

const _textureContext = Symbol('textureContext');

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
      const sourceRect = this.attributes.sourceRect;
      if(sourceRect) {
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
      applyTexture(this, newValue);
      // this.setTexture(newValue);
    }
  }

  /* override */
  draw() {
    const meshes = super.draw();
    if(meshes && meshes.length) {
      const clientBoxMesh = this.clientBoxMesh;
      // console.log(clientBoxMesh);
      const textureImage = this.textureImage;
      if(textureImage) {
        const texture = clientBoxMesh.texture;
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
          clientBoxMesh.setTexture(newTexture, {
            rect: textureRect,
            repeat: textureRepeat,
            srcRect: sourceRect,
          });
          this[_textureContext] = this.renderer;
        }
      }
    }

    return meshes;
  }
}

ownerDocument.registerNode(Sprite, 'sprite');