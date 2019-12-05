"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _core = require("@mesh.js/core");

var _glMatrix = require("gl-matrix");

var _pasition = _interopRequireDefault(require("pasition"));

var _node = _interopRequireDefault(require("./node"));

var _path = _interopRequireDefault(require("../attribute/path"));

var _color = require("../utils/color");

var _texture = require("../utils/texture");

var _filter = require("../utils/filter");

var _document = _interopRequireDefault(require("../document"));

var _bounding_box = _interopRequireDefault(require("../utils/bounding_box"));

var _render_event = _interopRequireDefault(require("../utils/render_event"));

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

var _mesh = Symbol('mesh');

var _filters = Symbol('filters');

var Path =
/*#__PURE__*/
function (_Node) {
  (0, _inherits2.default)(Path, _Node);

  function Path() {
    var _this;

    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Path);
    if (typeof attrs === 'string') attrs = {
      d: attrs
    };
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Path).call(this, attrs));
    _this.effects = {
      d: function d(from, to, p, s, e) {
        var ep = (p - s) / (e - s);
        if (ep <= 0) return from;
        if (ep >= 1) return to;

        var shapes = _pasition.default._preprocessing(_pasition.default.path2shapes(from), _pasition.default.path2shapes(to));

        var shape = _pasition.default._lerp.apply(_pasition.default, (0, _toConsumableArray2.default)(shapes).concat([ep]))[0];

        var path = shape.reduce(function (str, c) {
          return "".concat(str).concat(c.slice(2).join(' '), " ");
        }, "M".concat(shape[0][0], " ").concat(shape[0][1], "C")).trim();
        return path;
      }
    };
    return _this;
  }

  (0, _createClass2.default)(Path, [{
    key: "getPathLength",
    value: function getPathLength() {
      if (this.mesh) {
        return this.mesh.getTotalLength();
      }

      return 0;
    }
  }, {
    key: "getPointAtLength",
    value: function getPointAtLength(len) {
      if (this.mesh) {
        var point = this.mesh.getPointAtLength(len);

        if (point) {
          return [point.x, point.y];
        }
      }

      return [0, 0];
    }
    /* override */

  }, {
    key: "setResolution",
    value: function setResolution(_ref) {
      var width = _ref.width,
          height = _ref.height;
      (0, _get2.default)((0, _getPrototypeOf2.default)(Path.prototype), "setResolution", this).call(this, {
        width: width,
        height: height
      });
      if (this.mesh) this.mesh.setResolution({
        width: width,
        height: height
      });
    }
    /* override */

  }, {
    key: "onPropertyChange",
    value: function onPropertyChange(key, newValue, oldValue) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Path.prototype), "onPropertyChange", this).call(this, key, newValue, oldValue);

      if (key === 'd' || key === 'normalize') {
        this.updateContours();
      }

      if (key === 'opacity') {
        if (this[_mesh]) this[_mesh].uniforms.u_opacity = newValue;
      }

      if (this[_mesh] && key === 'fillColor') {
        (0, _color.setFillColor)(this[_mesh], {
          color: newValue
        });
      }

      if (this[_mesh] && (key === 'strokeColor' || key === 'lineWidth' || key === 'lineCap' || key === 'lineJoin' || key === 'lineDash' || key === 'lineDashOffset')) {
        var _this$attributes = this.attributes,
            strokeColor = _this$attributes.strokeColor,
            lineWidth = _this$attributes.lineWidth;

        if (strokeColor && lineWidth > 0) {
          var _this$attributes2 = this.attributes,
              lineCap = _this$attributes2.lineCap,
              lineJoin = _this$attributes2.lineJoin,
              lineDash = _this$attributes2.lineDash,
              lineDashOffset = _this$attributes2.lineDashOffset,
              miterLimit = _this$attributes2.miterLimit;
          (0, _color.setStrokeColor)(this[_mesh], {
            color: strokeColor,
            lineCap: lineCap,
            lineJoin: lineJoin,
            lineWidth: lineWidth,
            lineDash: lineDash,
            lineDashOffset: lineDashOffset,
            miterLimit: miterLimit
          });
        }
      }

      if (key === 'filter') {
        this[_filters] = (0, _filter.parseFilterString)(newValue);

        if (this[_mesh]) {
          (0, _filter.applyFilters)(this[_mesh], this[_filters]);
        }
      }

      if (key === 'texture') {
        (0, _texture.applyTexture)(this, newValue);
      }
    }
    /* override */

  }, {
    key: "isPointCollision",

    /* override */
    value: function isPointCollision(x, y) {
      var pointerEvents = this.attributes.pointerEvents;
      if (pointerEvents === 'none') return false;
      if (pointerEvents !== 'all' && !this.isVisible) return false;
      var which = 'both';
      if (pointerEvents === 'visibleFill') which = 'fill';
      if (pointerEvents === 'visibleStroke') which = 'stroke';
      return !!this.mesh && this.mesh.isPointCollision(x, y, which);
    }
  }, {
    key: "getBoundingClientRect",
    value: function getBoundingClientRect() {
      var boundingBox = null;
      if (this.mesh) boundingBox = this.mesh.boundingBox;
      return (0, _bounding_box.default)(boundingBox, this.renderMatrix);
    }
    /* override */

  }, {
    key: "updateContours",
    value: function updateContours() {
      this.path = new _core.Figure2D();
      this.path.addPath(this.attributes.d);

      if (this.attributes.normalize) {
        var _this$path;

        (_this$path = this.path).normalize.apply(_this$path, (0, _toConsumableArray2.default)(this.path.boundingCenter));
      }
    }
    /* override */

  }, {
    key: "connect",
    value: function connect(parent, zOrder) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Path.prototype), "connect", this).call(this, parent, zOrder);
      this.setResolution(parent.getResolution());
      this.forceUpdate();
    }
    /* override */

  }, {
    key: "disconnect",
    value: function disconnect() {
      var parent = this.parent;
      (0, _get2.default)((0, _getPrototypeOf2.default)(Path.prototype), "disconnect", this).call(this);
      if (parent) parent.forceUpdate();
    }
    /* override */

  }, {
    key: "draw",
    value: function draw() {
      var mesh = this.mesh;

      if (mesh) {
        (0, _texture.drawTexture)(this, mesh);
        (0, _render_event.default)(this, mesh);
        return [mesh];
      }

      return [];
    }
  }, {
    key: "d",
    set: function set(value) {
      this.attributes.d = value;
    },
    get: function get() {
      return this.attributes.d;
    }
  }, {
    key: "originalContentRect",
    get: function get() {
      if (this.path) {
        var boundingBox = this.path.boundingBox;
        return [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0] - boundingBox[0][0], boundingBox[1][1] - boundingBox[0][1]];
      }

      return [0, 0, 0, 0];
    }
  }, {
    key: "originalClientRect",
    get: function get() {
      if (this.mesh) {
        var boundingBox = this.mesh.boundingBox;
        return [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0] - boundingBox[0][0], boundingBox[1][1] - boundingBox[0][1]];
      }

      return [0, 0, 0, 0];
    }
  }, {
    key: "originalClientCenter",
    get: function get() {
      if (this.mesh) {
        return this.mesh.boundingCenter;
      }

      return [0, 0];
    }
  }, {
    key: "isVisible",
    get: function get() {
      return !!this.d;
    }
  }, {
    key: "mesh",
    get: function get() {
      var path = this.path;

      if (path) {
        var mesh = this[_mesh];

        if (!mesh) {
          mesh = new _core.Mesh2D(this.path, this.getResolution());
          mesh.path = path;
          var fillColor = this.attributes.fillColor;

          if (fillColor) {
            (0, _color.setFillColor)(mesh, {
              color: fillColor
            });
          }

          var lineWidth = this.attributes.lineWidth;
          var strokeColor = this.attributes.strokeColor;

          if (strokeColor && lineWidth > 0) {
            var _this$attributes3 = this.attributes,
                lineCap = _this$attributes3.lineCap,
                lineJoin = _this$attributes3.lineJoin,
                miterLimit = _this$attributes3.miterLimit;
            (0, _color.setStrokeColor)(mesh, {
              color: strokeColor,
              lineWidth: lineWidth,
              lineCap: lineCap,
              lineJoin: lineJoin,
              miterLimit: miterLimit
            });
          }

          var opacity = this.attributes.opacity;
          mesh.uniforms.u_opacity = opacity;

          if (this[_filters]) {
            (0, _filter.applyFilters)(mesh, this[_filters]);
          }

          this[_mesh] = mesh;
        } else if (mesh.path !== path) {
          mesh.contours = path.contours;
          mesh.path = path;
        }

        var m = this.renderMatrix;
        var m2 = mesh.transformMatrix;

        if (!_glMatrix.mat2d.equals(m, m2)) {
          var _mesh2;

          (_mesh2 = mesh).setTransform.apply(_mesh2, (0, _toConsumableArray2.default)(m));
        }

        return mesh;
      }

      return null;
    }
  }]);
  return Path;
}(_node.default);

exports.default = Path;
(0, _defineProperty2.default)(Path, "Attr", _path.default);

_document.default.registerNode(Path, 'path');