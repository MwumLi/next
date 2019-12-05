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

var _get4 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _texture = require("../utils/texture");

var _block = _interopRequireDefault(require("./block"));

var _sprite = _interopRequireDefault(require("../attribute/sprite"));

var _document = _interopRequireDefault(require("../document"));

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

var Sprite =
/*#__PURE__*/
function (_Block) {
  (0, _inherits2.default)(Sprite, _Block);

  function Sprite() {
    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Sprite);
    if (typeof attrs === 'string') attrs = {
      texture: attrs
    };
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Sprite).call(this, attrs));
  }
  /* override */


  (0, _createClass2.default)(Sprite, [{
    key: "onPropertyChange",

    /* override */
    value: function onPropertyChange(key, newValue, oldValue) {
      (0, _get4.default)((0, _getPrototypeOf2.default)(Sprite.prototype), "onPropertyChange", this).call(this, key, newValue, oldValue);

      if (key === 'texture') {
        (0, _texture.applyTexture)(this, newValue); // this.setTexture(newValue);
      }
    }
    /* override */

  }, {
    key: "draw",
    value: function draw() {
      var meshes = (0, _get4.default)((0, _getPrototypeOf2.default)(Sprite.prototype), "draw", this).call(this);

      if (meshes && meshes.length) {
        var clientBoxMesh = this.clientBoxMesh;
        (0, _texture.drawTexture)(this, clientBoxMesh);
      }

      return meshes;
    }
  }, {
    key: "contentSize",
    get: function get() {
      var _get2 = (0, _get4.default)((0, _getPrototypeOf2.default)(Sprite.prototype), "contentSize", this),
          _get3 = (0, _slicedToArray2.default)(_get2, 2),
          w = _get3[0],
          h = _get3[1];

      var _this$attributes = this.attributes,
          width = _this$attributes.width,
          height = _this$attributes.height;

      if (width == null || height == null) {
        var img = this.textureImage;
        var sourceRect = this.attributes.sourceRect;

        if (sourceRect) {
          if (width == null) w = sourceRect[2];
          if (height == null) h = sourceRect[3];
        } else if (img) {
          if (width == null) w = img.width;
          if (height == null) h = img.height;
        }
      }

      return [w, h];
    }
  }]);
  return Sprite;
}(_block.default);

exports.default = Sprite;
(0, _defineProperty2.default)(Sprite, "Attr", _sprite.default);

_document.default.registerNode(Sprite, 'sprite');