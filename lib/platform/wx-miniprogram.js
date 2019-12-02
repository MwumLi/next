"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCanvas = createCanvas;
exports.Container = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

/* globals wx */
var Container =
/*#__PURE__*/
function () {
  function Container(width, height) {
    (0, _classCallCheck2.default)(this, Container);
    this.width = width;
    this.height = height;
    this.children = [];
    this._listeners = {};
  }

  (0, _createClass2.default)(Container, [{
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$left = _ref.left,
          left = _ref$left === void 0 ? 0 : _ref$left,
          _ref$top = _ref.top,
          top = _ref$top === void 0 ? 0 : _ref$top,
          _ref$width = _ref.width,
          width = _ref$width === void 0 ? this.width : _ref$width,
          _ref$height = _ref.height,
          height = _ref$height === void 0 ? this.height : _ref$height;

      if (this.children.length > 0) {
        var type = event.type;
        var target = event.target;

        target.getBoundingClientRect = function () {
          return {
            left: left,
            top: top,
            width: width,
            height: height
          };
        };

        target.width = this.children[0].width;
        target.height = this.children[0].height;

        this._listeners[type].forEach(function (listener) {
          listener(event);
        });
      }
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(type, listener) {
      this._listeners[type] = this._listeners[type] || [];

      this._listeners[type].push(listener);
    }
  }, {
    key: "appendChild",
    value: function appendChild(el) {
      this.children.push(el);
    }
  }, {
    key: "removeChild",
    value: function removeChild(el) {
      var idx = this.children.indexOf(el);

      if (idx >= 0) {
        this.children.splice(idx, 1);
        return el;
      }

      return null;
    }
  }, {
    key: "insertBefore",
    value: function insertBefore(el, ref) {
      if (ref == null) return this.appendChild(el);
      var idx = this.children.indexOf(ref);

      if (idx >= 0) {
        this.children.splice(idx, 0, el);
      }

      return null;
    }
  }, {
    key: "replaceChild",
    value: function replaceChild(el, ref) {
      var idx = this.children.indexOf(ref);

      if (idx >= 0) {
        this.children.splice(idx, 1, el);
        return el;
      }

      return null;
    }
  }, {
    key: "clientWidth",
    get: function get() {
      return this.width;
    }
  }, {
    key: "clientHeight",
    get: function get() {
      return this.height;
    }
  }]);
  return Container;
}();

exports.Container = Container;

var CanvasWrap =
/*#__PURE__*/
function () {
  function CanvasWrap(width, height, ctx) {
    (0, _classCallCheck2.default)(this, CanvasWrap);
    this.width = width;
    this.height = height;
    this._ctx = ctx;
    ctx.canvas = this;
  }

  (0, _createClass2.default)(CanvasWrap, [{
    key: "getContext",
    value: function getContext() {
      return this._ctx;
    }
  }, {
    key: "draw",
    value: function draw() {
      this._ctx.draw();
    }
  }, {
    key: "contextType",
    get: function get() {
      return '2d';
    }
  }]);
  return CanvasWrap;
}();

function createCanvas(width, height, options) {
  // console.log(options.id);
  var context = wx.createCanvasContext(options.id);
  var canvas = new CanvasWrap(width, height, context); // console.log(canvas);

  return canvas;
}