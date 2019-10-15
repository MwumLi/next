import {createCanvas} from '@mesh.js/core';

const loadedTextures = {};

export function loadTexture(src, alias) {
  if(!loadedTextures[src]) {
    if(typeof Image === 'function') {
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
    } else { // run in worker
      return fetch(src, {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
      }).then((response) => {
        return response.blob();
      }).then((blob) => {
        return createImageBitmap(blob, {imageOrientation: 'flipY'}).then((bitmap) => {
          loadedTextures[src] = bitmap;
          return bitmap;
        });
      });
    }
  }
  return Promise.resolve(loadedTextures[src]);
}

const _textureMap = Symbol('textureMap');

export function createTexture(image, renderer) {
  renderer[_textureMap] = renderer[_textureMap] || new Map();
  if(renderer[_textureMap].has(image)) return renderer[_textureMap].get(image);
  const texture = renderer.createTexture(image);
  renderer[_textureMap].set(image, texture);
  return texture;
}

/**
  u3d-json compatible: https://www.codeandweb.com/texturepacker
  {
    frames: {
      key: {
        frame: {x, y, w, h},
        trimmed: ...,
        rotated: true|false,
        spriteSourceSize: {x, y, w, h},
        sourceSize: {w, h}
      }
    }
  }
  */
export async function loadFrames(src, frameData) {
  if(typeof frameData === 'string') {
    const response = await fetch(frameData, {
      method: 'GET',
      mode: 'cors',
      cache: 'default',
    });
    frameData = await response.json();
  }

  const texture = await loadTexture(src);
  const frames = frameData.frames;

  Object.entries(frames).forEach(([key, frame]) => {
    const {w, h} = frame.sourceSize;

    const canvas = createCanvas(w, h),
      srcRect = frame.frame,
      rect = frame.spriteSourceSize,
      context = canvas.getContext('2d');

    const rotated = frame.rotated;

    context.save();

    if(rotated) {
      context.translate(0, h);
      context.rotate(-0.5 * Math.PI);

      const tmp = rect.y;
      rect.y = rect.x;
      rect.x = h - srcRect.h - tmp;

      context.drawImage(
        texture,
        srcRect.x, srcRect.y, srcRect.h, srcRect.w,
        rect.x, rect.y, rect.h, rect.w
      );
    } else {
      context.drawImage(
        texture,
        srcRect.x, srcRect.y, srcRect.w, srcRect.h,
        rect.x, rect.y, rect.w, rect.h
      );
    }

    context.restore();

    loadedTextures[key] = canvas;
  });

  return texture;
}