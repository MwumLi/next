"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelAnimationFrame = exports.requestAnimationFrame = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

/* istanbul ignore file */

/* eslint-disable no-undef */
function nowtime() {
  if (typeof performance !== 'undefined' && performance.now) {
    return performance.now();
  }

  if (typeof process !== 'undefined' && process.hrtime) {
    var _process$hrtime = process.hrtime(),
        _process$hrtime2 = (0, _slicedToArray2.default)(_process$hrtime, 2),
        s = _process$hrtime2[0],
        ns = _process$hrtime2[1];

    return s * 1e3 + ns * 1e-6;
  }

  return Date.now ? Date.now() : new Date().getTime();
}
/* eslint-enable no-undef */


var requestAnimationFrame = typeof global.requestAnimationFrame === 'function' ? global.requestAnimationFrame : function (fn) {
  return setTimeout(function () {
    fn(nowtime());
  }, 16);
};
exports.requestAnimationFrame = requestAnimationFrame;
var cancelAnimationFrame = typeof global.cancelAnimationFrame === 'function' ? global.cancelAnimationFrame : function (id) {
  return clearTimeout(id);
};
exports.cancelAnimationFrame = cancelAnimationFrame;