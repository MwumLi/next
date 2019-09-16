import {loadTexture, createTexture} from '../utils/texture_loader';
import {compareValue} from '../utils/attribute_value';
import Block from './block';
import Attr from '../attribute/sprite';

const _textureImage = Symbol('textureImage');
const _textureContext = Symbol('textureContext');

export default class Sprite extends Block {
  static Attr = Attr;

  async setTexture(url) {
    const textureImage = await loadTexture(url);
    this[_textureImage] = textureImage;
    this.updateContours();
    this.forceUpdate();
    return textureImage;
  }

  get contentSize() {
    let {width, height} = this.attributes;
    if(width == null || height == null) {
      const img = this[_textureImage];
      const textureRect = this.attributes.textureRect;
      let w = 0;
      let h = 0;
      if(textureRect) {
        w = textureRect[0] + textureRect[2];
        h = textureRect[1] + textureRect[3];
      } else if(img) {
        w = img.width;
        h = img.height;
      }
      width = width == null ? w : width;
      height = height == null ? h : height;
    }
    return [width, height];
  }

  draw() {
    const meshes = super.draw();
    if(meshes && meshes.length) {
      const clientBoxMesh = this.clientBoxMesh;
      // console.log(clientBoxMesh);
      const textureImage = this[_textureImage];
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