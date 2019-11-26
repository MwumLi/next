"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Container = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _events = _interopRequireDefault(require("events"));

var _nodeCanvasWebgl = require("node-canvas-webgl");

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

function nowtime() {
  var _process$hrtime = process.hrtime(),
      _process$hrtime2 = (0, _slicedToArray2.default)(_process$hrtime, 2),
      s = _process$hrtime2[0],
      ns = _process$hrtime2[1];

  return s * 1e3 + ns * 1e-6;
}

global.requestAnimationFrame = function (fn) {
  return setTimeout(function () {
    fn(nowtime());
  }, 16);
};

global.cancelAnimationFrame = function (id) {
  return clearTimeout(id);
};

var Container =
/*#__PURE__*/
function (_EventEmitter) {
  (0, _inherits2.default)(Container, _EventEmitter);

  function Container() {
    var _this;

    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 800;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 600;
    (0, _classCallCheck2.default)(this, Container);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Container).call(this));
    _this.children = [];
    _this.clientWidth = width;
    _this.clientHeight = height;
    return _this;
  }

  (0, _createClass2.default)(Container, [{
    key: "appendChild",
    value: function appendChild(node) {
      if (node.parent) node.parent.removeChild(node);
      node.parent = this;
      this.children.push(node);
    }
  }, {
    key: "removeChild",
    value: function removeChild(node) {
      var idx = this.children.indexOf(node);

      if (idx !== -1) {
        this.children.splice(idx, 1);
        node.parent = null;
      }

      return node;
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(evt) {
      evt.target = this;
      return this.emit(evt.type, evt);
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(type, handler) {
      return this.addListener(type, handler);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, handler) {
      if (handler) {
        return this.removeListener(type, handler);
      }

      return this.removeAllListeners(type);
    }
  }, {
    key: "childNodes",
    get: function get() {
      return this.children;
    }
  }]);
  return Container;
}(_events.default);

exports.Container = Container;

if (typeof window === 'undefined' || !window.navigator) {
  global.Container = Container;
  global.createCanvas = _nodeCanvasWebgl.createCanvas;
  global.Image = _nodeCanvasWebgl.Image;
  global.Canvas = _nodeCanvasWebgl.Canvas;
  global.Worker = Object;
}

if (typeof document !== 'undefined' && document.createElement) {
  var _createElement = document.createElement;

  document.createElement = function (tagName) {
    if (tagName.toLowerCase() === 'canvas') return new _nodeCanvasWebgl.Canvas(300, 150);

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return _createElement.call.apply(_createElement, [tagName].concat(args));
  };
}