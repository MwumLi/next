import createText from '@mesh.js/core/src/utils/create-text';
import {createTexture} from '../utils/texture_loader';
import Block from './block';
import Attr from '../attribute/label';
import ownerDocument from '../document';

const _textImage = Symbol('textImage');
const _textImageTask = Symbol('textImageTask');
const _textureContext = Symbol('textureContext');

const _updateTextureRect = Symbol('updateTextureRect');

export default class Label extends Block {
  static Attr = Attr;

  updateText() {
    if(!this[_textImageTask]) {
      this[_textImageTask] = new Promise((resolve) => {
        requestAnimationFrame(async () => {
          this[_textImageTask] = null;
          const {text, font, fillColor, strokeColor} = this.attributes;
          this[_textImage] = await createText(text, {font, fillColor, strokeColor});
          this.forceUpdate();
          resolve(this[_textImage]);
        });
      });
    }
  }

  /* override */
  onPropertyChange(key, newValue, oldValue) {
    if(key === 'text' || key === 'fontSize' || key === 'fontFamily'
      || key === 'fontStyle' || key === 'fontVariant' || key === 'fontWeight'
      || key === 'fontStretch' || key === 'lineHeight'
      || key === 'strokeColor' || key === 'fillColor') {
      this.updateText();
    } if(key === 'textAlign' || key === 'verticalAlign') {
      this[_updateTextureRect] = true;
      super.onPropertyChange(key, newValue, oldValue);
    } else {
      super.onPropertyChange(key, newValue, oldValue);
    }
  }

  /* override */
  get contentSize() {
    let {width, height} = this.attributes;
    if(width == null || height == null) {
      const img = this[_textImage];
      let w = 0;
      let h = 0;
      if(img) {
        w = img.width;
        h = img.height;
      }
      width = width == null ? w : width;
      height = height == null ? h : height;
    }
    return [width, height];
  }

  get text() {
    return this.attributes.text;
  }

  set text(value) {
    this.attributes.text = value;
  }

  draw() {
    const meshes = super.draw();
    if(meshes && meshes.length) {
      const clientBoxMesh = this.clientBoxMesh;
      const textImage = this[_textImage];
      if(textImage) {
        const texture = clientBoxMesh.texture;

        if(!texture
          || this[_textureContext] && this[_textureContext] !== this.renderer
          || texture.image !== textImage
          || this[_updateTextureRect]) {
          const newTexture = createTexture(textImage, this.renderer);
          const {width, height} = textImage;
          const [w, h] = this.contentSize;
          const textAlign = this.attributes.textAlign;
          const verticalAlign = this.attributes.verticalAlign;

          let x = 0;
          if(textAlign === 'center') {
            x = (w - width) / 2;
          } else if(textAlign === 'right' || textAlign === 'end') {
            x = w - width;
          }

          let y;
          if(verticalAlign === 'top') {
            y = 0;
          } else if(verticalAlign === 'bottom') {
            y = h - height;
          } else {
            y = (h - height) / 2;
          }
          const {paddingLeft, paddingTop} = this.attributes;

          x += paddingLeft;
          y += paddingTop;

          clientBoxMesh.setTexture(newTexture, {
            rect: [x, y, width, height],
          });
          this[_updateTextureRect] = false;
          this[_textureContext] = this.renderer;
        }
      }
    }
    return meshes;
  }
}

ownerDocument.registerNode(Label, 'label');