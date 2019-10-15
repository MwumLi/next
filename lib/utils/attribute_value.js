"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sizeToPixel = sizeToPixel;
exports.toString = toString;
exports.toNumber = toNumber;
exports.toArray = toArray;
exports.compareValue = compareValue;

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

function sizeToPixel(value, defaultWidth) {
  // eslint-disable-line complexity
  var matched = value.trim().match(/^([\d.]+)(px|pt|pc|in|cm|mm|em|ex|rem|q|vw|vh|vmax|vmin)$/);

  if (matched) {
    value = {
      size: parseFloat(matched[1]),
      unit: matched[2]
    };
  } else {
    value = {
      size: parseFloat(value),
      unit: 'px'
    };
  }

  var _value = value,
      size = _value.size,
      unit = _value.unit;

  if (unit === 'pt') {
    size /= 0.75;
  } else if (unit === 'pc') {
    size *= 16;
  } else if (unit === 'in') {
    size *= 96;
  } else if (unit === 'cm') {
    size *= 96.0 / 2.54;
  } else if (unit === 'mm') {
    size *= 96.0 / 25.4;
  } else if (unit === 'em' || unit === 'rem' || unit === 'ex') {
    if (!defaultWidth && typeof getComputedStyle === 'function' && typeof document !== 'undefined') {
      var root = getComputedStyle(document.documentElement).fontSize;
      defaultWidth = sizeToPixel(root, 16);
    }

    size *= defaultWidth;
    if (unit === 'ex') size /= 2;
  } else if (unit === 'q') {
    size *= 96.0 / 25.4 / 4;
  } else if (unit === 'vw' || unit === 'vh') {
    if (typeof document !== 'undefined') {
      var val = unit === 'vw' ? document.documentElement.clientWidth : document.documentElement.clientHeight;
      size *= val / 100;
    }
  } else if (unit === 'vmax' || unit === 'vmin') {
    if (typeof document !== 'undefined') {
      var width = document.documentElement.clientWidth;
      var height = document.documentElement.clientHeight;

      if (unit === 'vmax') {
        size *= Math.max(width, height) / 100;
      } else {
        size *= Math.min(width, height) / 100;
      }
    }
  }

  return size;
}

function toString(value) {
  if (value == null) return value;
  return String(value);
}

function toNumber(value) {
  if (value == null) return value;

  if (typeof value === 'string') {
    value = sizeToPixel(value);
  }

  if (!Number.isFinite(value)) throw new Error('Invalid value');
  return value;
}

function toArray(value) {
  if (typeof value === 'string') return value.split(/[\s,]+/g);
  return value;
}

function compareValue(oldValue, newValue) {
  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    if (oldValue.length !== newValue.length) return false;

    for (var i = 0; i < oldValue.length; i++) {
      if (oldValue[i] !== newValue[i]) return false;
    }

    return true;
  }

  return oldValue == null && newValue == null || oldValue === newValue;
}