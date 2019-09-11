const loadedTextures = {};

export function loadTexture(src, alias) {
  if(!loadedTextures[src]) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    loadedTextures[src] = new Promise((resolve) => {
      img.onload = function () {
        loadedTextures[src] = img;
        if(alias) loadedTextures[alias] = img;
        resolve(img);
      };
      img.src = src;
    });
  }
  return Promise.resolve(loadedTextures[src]);
}

const _textureMap = Symbol('textureMap');

export function createTexture(image, renderer) {
  renderer[_textureMap] = renderer[_textureMap] || new WeakMap();
  if(renderer[_textureMap].has(image)) return renderer[_textureMap].get(image);
  const texture = renderer.createTexture(image);
  renderer[_textureMap].set(image, texture);
  return texture;
}