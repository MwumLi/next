import {ENV} from '@mesh.js/core';

const loadedTextures = {};

export function loadTexture(src, alias) {
  if(loadedTextures[src]) return loadedTextures[src];
  const img = ENV.loadImage(src, {alias, useImageBitmap: false});
  return img != null ? img : src;
}

export async function applyTexture(node, image) {
  let textureImage = image;
  if(typeof image === 'string') {
    textureImage = loadTexture(image);
  }
  if(typeof textureImage.then === 'function') {
    textureImage = await textureImage;
  }
  if(image === node.attributes.texture) {
    node.textureImage = textureImage;
    node.updateContours();
    node.forceUpdate();
  }
  return textureImage;
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

    const canvas = ENV.createCanvas(w, h),
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