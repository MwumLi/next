import {loadTexture, createTexture} from '../utils/texture_loader';
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
    const clientBoxMesh = this.clientBoxMesh;
    // console.log(clientBoxMesh);
    const textureImage = this[_textureImage];
    if(textureImage) {
      const texture = clientBoxMesh.texture;
      if(!texture || texture.image !== textureImage) {
        const newTexture = createTexture(textureImage, this.renderer);
        // console.log(newTexture);
        clientBoxMesh.setTexture(newTexture, {
          rect: this.originalClientRect,
        });
      }
    }

    return meshes;
  }
}