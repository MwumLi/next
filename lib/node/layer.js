"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _core = require("@mesh.js/core");

var _spriteAnimator = require("sprite-animator");

var _group = _interopRequireDefault(require("./group"));

var _document = _interopRequireDefault(require("../document"));

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

var defaultOptions = {
  antialias: true,
  autoRender: true
};

var _autoRender = Symbol('autoRender');

var _renderer = Symbol('renderer');

var _timeline = Symbol('timeline');

var Layer =
/*#__PURE__*/
function (_Group) {
  (0, _inherits2.default)(Layer, _Group);

  function Layer() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Layer);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Layer).call(this));
    var canvas = options.canvas;
    var opts = Object.assign({}, defaultOptions, options);
    _this[_autoRender] = opts.autoRender;
    delete options.autoRender;
    _this[_renderer] = new _core.Renderer(canvas, opts);
    _this.options = options;

    _this.setResolution(canvas);

    _this.canvas = canvas;
    _this[_timeline] = new _spriteAnimator.Timeline();
    return _this;
  }
  /* override */


  (0, _createClass2.default)(Layer, [{
    key: "setResolution",

    /* override */
    value: function setResolution(_ref) {
      var width = _ref.width,
          height = _ref.height;

      if (this.canvas) {
        this.canvas.width = width;
        this.canvas.height = height;
      }

      if (this.renderer.glRenderer) {
        this.renderer.glRenderer.gl.viewport(0, 0, width, height);
      }

      var _this$renderOffset = (0, _slicedToArray2.default)(this.renderOffset, 2),
          left = _this$renderOffset[0],
          top = _this$renderOffset[1];

      this.renderer.setGlobalTransform(1, 0, 0, 1, left, top);
      (0, _get2.default)((0, _getPrototypeOf2.default)(Layer.prototype), "setResolution", this).call(this, {
        width: width,
        height: height
      });
    }
  }, {
    key: "toLocalPos",
    value: function toLocalPos(x, y) {
      var _this$getResolution = this.getResolution(),
          width = _this$getResolution.width,
          height = _this$getResolution.height;

      var offset = this.renderOffset;
      var viewport = [this.canvas.clientWidth, this.canvas.clientHeight];
      x = x * width / viewport[0] - offset[0];
      y = y * height / viewport[1] - offset[1];
      return [x, y];
    }
  }, {
    key: "toGlobalPos",
    value: function toGlobalPos(x, y) {
      var _this$getResolution2 = this.getResolution(),
          width = _this$getResolution2.width,
          height = _this$getResolution2.height;

      var offset = this.renderOffset;
      var viewport = [this.canvas.clientWidth, this.canvas.clientHeight];
      x = x * viewport[0] / width + offset[0];
      y = y * viewport[1] / height + offset[1];
      return [x, y];
    }
  }, {
    key: "render",
    value: function render() {
      var meshes = this.draw();

      this[_renderer].clear();

      if (meshes && meshes.length) {
        this.renderer.drawMeshes(meshes);
      }
    }
    /* override */

  }, {
    key: "forceUpdate",
    value: function forceUpdate() {
      var _this2 = this;

      if (this[_autoRender] && !this.prepareRender) {
        this.prepareRender = new Promise(function (resolve) {
          requestAnimationFrame(function () {
            delete _this2.prepareRender;

            _this2.render();

            resolve();
          });
        });
      }
    }
  }, {
    key: "renderer",
    get: function get() {
      return this[_renderer];
    }
  }, {
    key: "layer",
    get: function get() {
      return this;
    }
  }, {
    key: "timeline",
    get: function get() {
      return this[_timeline];
    }
  }, {
    key: "renderOffset",
    get: function get() {
      if (this.parent && this.parent.options) {
        var _this$parent$options = this.parent.options,
            left = _this$parent$options.left,
            top = _this$parent$options.top;
        return [left, top];
      }

      return [this.options.left | 0, this.options.top | 0];
    }
  }]);
  return Layer;
}(_group.default);

exports.default = Layer;

_document.default.registerNode(Layer, 'layer');