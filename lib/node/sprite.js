"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get4 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _texture_loader = require("../utils/texture_loader");

var _attribute_value = require("../utils/attribute_value");

var _block = _interopRequireDefault(require("./block"));

var _sprite = _interopRequireDefault(require("../attribute/sprite"));

var _document = _interopRequireDefault(require("../document"));

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

var _textureImage = Symbol('textureImage');

var _textureContext = Symbol('textureContext');

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

  (0, _createClass2.default)(Sprite, [{
    key: "setTexture",
    value: function () {
      var _setTexture = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(url) {
        var textureImage;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                textureImage = (0, _texture_loader.loadTexture)(url);

                if (!(typeof textureImage.then === 'function')) {
                  _context.next = 5;
                  break;
                }

                _context.next = 4;
                return textureImage;

              case 4:
                textureImage = _context.sent;

              case 5:
                if (url === this.attributes.texture) {
                  this[_textureImage] = textureImage;
                  this.updateContours();
                  this.forceUpdate();
                }

                return _context.abrupt("return", textureImage);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function setTexture(_x) {
        return _setTexture.apply(this, arguments);
      }

      return setTexture;
    }()
  }, {
    key: "draw",
    value: function draw() {
      var meshes = (0, _get4.default)((0, _getPrototypeOf2.default)(Sprite.prototype), "draw", this).call(this);

      if (meshes && meshes.length) {
        var clientBoxMesh = this.clientBoxMesh; // console.log(clientBoxMesh);

        var textureImage = this[_textureImage];

        if (textureImage) {
          var texture = clientBoxMesh.texture;
          var contentRect = this.originalContentRect;
          var textureRect = this.attributes.textureRect;
          var textureRepeat = this.attributes.textureRepeat;
          var sourceRect = this.attributes.sourceRect;

          if (!texture || this[_textureContext] && this[_textureContext] !== this.renderer || texture.image !== textureImage || texture.options.repeat !== textureRepeat || !(0, _attribute_value.compareValue)(texture.options.rect, textureRect) || !(0, _attribute_value.compareValue)(texture.options.srcRect, sourceRect)) {
            var newTexture = (0, _texture_loader.createTexture)(textureImage, this.renderer);

            if (textureRect) {
              textureRect[0] += contentRect[0];
              textureRect[1] += contentRect[1];
            } else {
              textureRect = contentRect;
            }

            clientBoxMesh.setTexture(newTexture, {
              rect: textureRect,
              repeat: textureRepeat,
              srcRect: sourceRect
            });
            this[_textureContext] = this.renderer;
          }
        }
      }

      return meshes;
    }
  }, {
    key: "textureImage",
    get: function get() {
      return this[_textureImage];
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
        var img = this[_textureImage];
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