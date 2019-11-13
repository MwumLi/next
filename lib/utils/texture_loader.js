"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadTexture = loadTexture;
exports.createTexture = createTexture;
exports.loadFrames = loadFrames;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _core = require("@mesh.js/core");

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

var loadedTextures = {};

function loadTexture(src, alias) {
  if (!loadedTextures[src]) {
    if (typeof Image === 'function') {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      loadedTextures[src] = new Promise(function (resolve) {
        img.onload = function () {
          loadedTextures[src] = img;
          if (alias) loadedTextures[alias] = img;
          resolve(img);
        };

        img.src = src;
      });
    } else {
      // run in worker
      return fetch(src, {
        method: 'GET',
        mode: 'cors',
        cache: 'default'
      }).then(function (response) {
        return response.blob();
      }).then(function (blob) {
        return createImageBitmap(blob, {
          imageOrientation: 'flipY'
        }).then(function (bitmap) {
          loadedTextures[src] = bitmap;
          return bitmap;
        });
      });
    }
  }

  return loadedTextures[src];
}

var _textureMap = Symbol('textureMap');

function createTexture(image, renderer) {
  renderer[_textureMap] = renderer[_textureMap] || new Map();
  if (renderer[_textureMap].has(image)) return renderer[_textureMap].get(image);
  var texture = renderer.createTexture(image);

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


function loadFrames(_x, _x2) {
  return _loadFrames.apply(this, arguments);
}

function _loadFrames() {
  _loadFrames = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(src, frameData) {
    var response, texture, frames;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(typeof frameData === 'string')) {
              _context.next = 7;
              break;
            }

            _context.next = 3;
            return fetch(frameData, {
              method: 'GET',
              mode: 'cors',
              cache: 'default'
            });

          case 3:
            response = _context.sent;
            _context.next = 6;
            return response.json();

          case 6:
            frameData = _context.sent;

          case 7:
            _context.next = 9;
            return loadTexture(src);

          case 9:
            texture = _context.sent;
            frames = frameData.frames;
            Object.entries(frames).forEach(function (_ref) {
              var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
                  key = _ref2[0],
                  frame = _ref2[1];

              var _frame$sourceSize = frame.sourceSize,
                  w = _frame$sourceSize.w,
                  h = _frame$sourceSize.h;
              var canvas = (0, _core.createCanvas)(w, h),
                  srcRect = frame.frame,
                  rect = frame.spriteSourceSize,
                  context = canvas.getContext('2d');
              var rotated = frame.rotated;
              context.save();

              if (rotated) {
                context.translate(0, h);
                context.rotate(-0.5 * Math.PI);
                var tmp = rect.y;
                rect.y = rect.x;
                rect.x = h - srcRect.h - tmp;
                context.drawImage(texture, srcRect.x, srcRect.y, srcRect.h, srcRect.w, rect.x, rect.y, rect.h, rect.w);
              } else {
                context.drawImage(texture, srcRect.x, srcRect.y, srcRect.w, srcRect.h, rect.x, rect.y, rect.w, rect.h);
              }

              context.restore();
              loadedTextures[key] = canvas;
            });
            return _context.abrupt("return", texture);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _loadFrames.apply(this, arguments);
}