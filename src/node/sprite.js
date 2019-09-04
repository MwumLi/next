import {loadTexture, createTexture} from '../utils/texture_loader';
import {compareValue} from '../utils/attribute_value';
import Element from './element';
import Attr from '../attribute/sprite';

const _textureImage = Symbol('textureImage');

export default class extends Element {
  static Attr = Attr;

  async setTexture(url) {
    const textureImage = await loadTexture(url);
    this[_textureImage] = textureImage;
    this.forceUpdate();
    return textureImage;
  }

  draw() {
    const meshes = super.draw();
    if(meshes && meshes.length) {
      const clientBoxMesh = this.clientBoxMesh;
      // console.log(clientBoxMesh);
      const textureImage = this[_textureImage];
      if(textureImage) {
        const texture = clientBoxMesh.texture;
        const clientRect = this.originalClientRect;
        let textureRect = this.attributes.textureRect;
        const textureRepeat = this.attributes.textureRepeat;
        const sourceRect = this.attributes.sourceRect;

        if(!texture || texture.image !== textureImage
          || texture.options.repeat !== textureRepeat
          || !compareValue(texture.options.rect, textureRect)
          || !compareValue(texture.options.srcRect, sourceRect)) {
          const newTexture = createTexture(textureImage, this.renderer);
          if(textureRect) {
            textureRect[0] += clientRect[0];
            textureRect[1] += clientRect[1];
          } else {
            textureRect = clientRect;
          }
          clientBoxMesh.setTexture(newTexture, {
            rect: textureRect,
            repeat: textureRepeat,
            srcRect: sourceRect,
          });
        }
      }
    }

    return meshes;
  }
}