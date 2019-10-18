"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var LayerWorker =
/*#__PURE__*/
function (_Worker) {
  (0, _inherits2.default)(LayerWorker, _Worker);

  function LayerWorker(id, options) {
    var _this;

    (0, _classCallCheck2.default)(this, LayerWorker);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(LayerWorker).call(this, "./".concat(id, ".worker.js")));
    _this.id = id;
    _this.options = options;
    var offscreenCanvas = options.canvas.transferControlToOffscreen();

    var opts = _objectSpread({}, options);

    delete opts.container;
    opts.canvas = offscreenCanvas;

    _this.postMessage({
      type: 'create',
      options: opts
    }, [offscreenCanvas]);

    return _this;
  }

  (0, _createClass2.default)(LayerWorker, [{
    key: "remove",
    value: function remove() {
      if (this.parent && this.parent.removeChild) {
        this.parent.removeChild(this);
        return true;
      }

      return false;
    }
  }, {
    key: "connect",
    value: function connect(parent, zOrder) {
      Object.defineProperty(this, 'parent', {
        value: parent,
        writable: false,
        configurable: true
      });
      Object.defineProperty(this, 'zOrder', {
        value: zOrder,
        writable: false,
        configurable: true
      });
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      delete this.parent;
      delete this.zOrder;
    }
  }, {
    key: "dispatchPointerEvent",
    value: function dispatchPointerEvent(event) {
      this.postMessage({
        type: 'event',
        event: {
          cancelBubble: event.cancelBubble,
          bubbles: event.bubbles,
          detail: event.detail,
          identifier: event.identifier,
          layerX: event.layerX,
          layerY: event.layerY,
          originalX: event.originalX,
          originalY: event.originalY,
          type: event.type,
          x: event.x,
          y: event.y
        }
      });
    }
  }]);
  return LayerWorker;
}((0, _wrapNativeSuper2.default)(Worker));

exports.default = LayerWorker;