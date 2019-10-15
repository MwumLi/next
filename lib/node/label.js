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

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _core = require("@mesh.js/core");

var _texture_loader = require("../utils/texture_loader");

var _block = _interopRequireDefault(require("./block"));

var _label = _interopRequireDefault(require("../attribute/label"));

var _document = _interopRequireDefault(require("../document"));

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

var _textImage = Symbol('textImage');

var _textImageTask = Symbol('textImageTask');

var _textureContext = Symbol('textureContext');

var _updateTextureRect = Symbol('updateTextureRect');

var Label =
/*#__PURE__*/
function (_Block) {
  (0, _inherits2.default)(Label, _Block);

  function Label() {
    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Label);
    if (typeof attrs === 'string') attrs = {
      text: attrs
    };
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Label).call(this, attrs));
  }

  (0, _createClass2.default)(Label, [{
    key: "updateText",
    value: function updateText() {
      var _this = this;

      if (!this[_textImageTask]) {
        this[_textImageTask] = new Promise(function (resolve) {
          requestAnimationFrame(function () {
            _this[_textImageTask] = null;
            var _this$attributes = _this.attributes,
                text = _this$attributes.text,
                font = _this$attributes.font,
                fillColor = _this$attributes.fillColor,
                strokeColor = _this$attributes.strokeColor;
            _this[_textImage] = (0, _core.createText)(text, {
              font: font,
              fillColor: fillColor,
              strokeColor: strokeColor
            });

            _this.updateContours();

            _this.forceUpdate();

            resolve(_this[_textImage]);
          });
        });
      }
    }
    /* override */

  }, {
    key: "onPropertyChange",
    value: function onPropertyChange(key, newValue, oldValue) {
      if (key === 'text' || key === 'fontSize' || key === 'fontFamily' || key === 'fontStyle' || key === 'fontVariant' || key === 'fontWeight' || key === 'fontStretch' || key === 'lineHeight' || key === 'strokeColor' || key === 'fillColor') {
        this.updateText();
      }

      if (key === 'textAlign' || key === 'verticalAlign') {
        this[_updateTextureRect] = true;
        (0, _get2.default)((0, _getPrototypeOf2.default)(Label.prototype), "onPropertyChange", this).call(this, key, newValue, oldValue);
      } else {
        (0, _get2.default)((0, _getPrototypeOf2.default)(Label.prototype), "onPropertyChange", this).call(this, key, newValue, oldValue);
      }
    }
    /* override */

  }, {
    key: "draw",
    value: function draw() {
      var meshes = (0, _get2.default)((0, _getPrototypeOf2.default)(Label.prototype), "draw", this).call(this);

      if (meshes && meshes.length) {
        var clientBoxMesh = this.clientBoxMesh;
        var textImage = this[_textImage];

        if (textImage) {
          var texture = clientBoxMesh.texture;

          if (!texture || this[_textureContext] && this[_textureContext] !== this.renderer || texture.image !== textImage || this[_updateTextureRect]) {
            var newTexture = (0, _texture_loader.createTexture)(textImage, this.renderer);
            var width = textImage.width,
                height = textImage.height;

            var _this$contentSize = (0, _slicedToArray2.default)(this.contentSize, 2),
                w = _this$contentSize[0],
                h = _this$contentSize[1];

            var textAlign = this.attributes.textAlign;
            var verticalAlign = this.attributes.verticalAlign;
            var x = 0;

            if (textAlign === 'center') {
              x = (w - width) / 2;
            } else if (textAlign === 'right' || textAlign === 'end') {
              x = w - width;
            }

            var y;

            if (verticalAlign === 'top') {
              y = 0;
            } else if (verticalAlign === 'bottom') {
              y = h - height;
            } else {
              y = (h - height) / 2;
            }

            var _this$attributes2 = this.attributes,
                paddingLeft = _this$attributes2.paddingLeft,
                paddingTop = _this$attributes2.paddingTop;
            x += paddingLeft;
            y += paddingTop;
            var _this$attributes3 = this.attributes,
                anchorX = _this$attributes3.anchorX,
                anchorY = _this$attributes3.anchorY;
            x -= this.clientSize[0] * anchorX;
            y -= this.clientSize[1] * anchorY;
            clientBoxMesh.setTexture(newTexture, {
              rect: [x, y, width, height]
            });
            this[_updateTextureRect] = false;
            this[_textureContext] = this.renderer;
          }
        }
      }

      return meshes;
    }
  }, {
    key: "contentSize",
    get: function get() {
      var _this$attributes4 = this.attributes,
          width = _this$attributes4.width,
          height = _this$attributes4.height;

      if (width == null || height == null) {
        var img = this[_textImage];
        var w = 0;
        var h = 0;

        if (img) {
          w = img.width;
          h = img.height;
        }

        width = width == null ? w : width;
        height = height == null ? h : height;
      }

      return [width, height];
    }
  }, {
    key: "text",
    get: function get() {
      return this.attributes.text;
    },
    set: function set(value) {
      this.attributes.text = value;
    }
  }]);
  return Label;
}(_block.default);

exports.default = Label;
(0, _defineProperty2.default)(Label, "Attr", _label.default);

_document.default.registerNode(Label, 'label');