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

const textureMap = new WeakMap();

export function createTexture(image, renderer) {
  if(textureMap.has(image)) return textureMap.get(image);
  const texture = renderer.createTexture(image);
  textureMap.set(image, texture);
  return texture;
}