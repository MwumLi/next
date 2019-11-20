"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _glMatrix = require("gl-matrix");

var _core = require("@mesh.js/core");

var _attribute_value = require("../utils/attribute_value");

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

var setAttribute = Symbol.for('spritejs_setAttribute');
var getAttribute = Symbol.for('spritejs_getAttribute');
var setDefault = Symbol.for('spritejs_setAttributeDefault');
var attributes = Symbol.for('spritejs_attributes');
var changedAttrs = Symbol.for('spritejs_changedAttrs');

var _subject = Symbol.for('spritejs_subject');

var _attr = Symbol('attr');

var _default = Symbol('default');

function getMatrix(transformMap, _ref) {
  var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
      ox = _ref2[0],
      oy = _ref2[1];

  var m = _glMatrix.mat2d.fromValues(1, 0, 0, 1, 0, 0);

  (0, _toConsumableArray2.default)(transformMap).forEach(function (_ref3) {
    var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];

    if (ox || oy) m = _glMatrix.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), m, [ox, oy]);

    if (key === 'matrix') {
      m = _glMatrix.mat2d.multiply(m, m, value);
    } else if (key === 'offsetTranslate') {
      m[4] += value[0];
      m[5] += value[1];
    } else if (key === 'offsetRotate') {
      m = _glMatrix.mat2d.rotate(Array.of(0, 0, 0, 0, 0, 0), m, value);
    } else if (key === 'skew') {
      var _value = (0, _slicedToArray2.default)(value, 2),
          x = _value[0],
          y = _value[1];

      m = _glMatrix.mat2d.multiply(m, m, _glMatrix.mat2d.fromValues(1, Math.tan(y), Math.tan(x), 1, 0, 0));
    } else {
      _glMatrix.mat2d[key](m, m, value);
    }

    if (ox || oy) m = _glMatrix.mat2d.translate(Array.of(0, 0, 0, 0, 0, 0), m, [-ox, -oy]);
  });
  return m;
}

var _transformMatrix = Symbol('transformMatrix');

var _transforms = Symbol('transforms');

var _changedAttrs = Symbol('changedAttrs');

var _offsetFigure = Symbol('offsetFigure');

function updateOffset(attr) {
  var offsetFigure = attr[_offsetFigure];
  var distance = attr.offsetDistance * offsetFigure.getTotalLength();
  var point = offsetFigure.getPointAtLength(distance);

  if (point) {
    var transformMap = attr[_transforms];
    var rotateValue = attr.offsetRotate;

    if (rotateValue === 'auto') {
      rotateValue = point.angle;
    } else if (rotateValue === 'reverse') {
      rotateValue = Math.PI + point.angle;
    } else {
      rotateValue = Math.PI * rotateValue / 180;
    }

    transformMap.set('offsetRotate', rotateValue);
    transformMap.set('offsetTranslate', [point.x, point.y]);
    attr[_transformMatrix] = getMatrix(transformMap, attr.transformOrigin);
  }
} // 规范：属性只能是原始类型或元素是原始类型的数组


var Node =
/*#__PURE__*/
function () {
  function Node(subject) {
    var _this = this;

    (0, _classCallCheck2.default)(this, Node);
    this[_subject] = subject;
    this[_attr] = {};
    this[_transformMatrix] = _glMatrix.mat2d.fromValues(1, 0, 0, 1, 0, 0);
    this[_transforms] = new Map();
    this[_default] = {};
    Object.defineProperty(subject, 'transformMatrix', {
      get: function get() {
        return (0, _toConsumableArray2.default)(_this[_transformMatrix]);
      }
    });
    this[setDefault]({
      id: '',
      name: '',
      className: '',
      x: 0,
      y: 0,

      /* pos */
      transformOrigin: [0, 0],
      transform: '',
      translate: [0, 0],
      rotate: 0,
      scale: [1, 1],
      skew: [0, 0],
      opacity: 1,
      zIndex: 0,
      offsetPath: undefined,
      offsetDistance: 0,
      offsetRotate: 'auto',
      pointerEvents: 'visible',
      // none | visible | visibleFill | visibleStroke | all
      filter: 'none'
    });
    this[_changedAttrs] = new Set();
    this[_offsetFigure] = new _core.Figure2D({
      scale: 5
    });
  }

  (0, _createClass2.default)(Node, [{
    key: setDefault,
    value: function value(attrs) {
      Object.assign(this[_default], attrs);
      Object.assign(this[_attr], attrs);
    }
  }, {
    key: setAttribute,
    value: function value(key, _value2) {
      var oldValue = this[_attr][key];
      var subject = this[_subject];
      if (_value2 == null) _value2 = this[_default][key];

      if (!(0, _attribute_value.compareValue)(oldValue, _value2)) {
        this[_attr][key] = _value2;
        if (this[_changedAttrs].has(key)) this[_changedAttrs].delete(key);

        this[_changedAttrs].add(key);

        subject.onPropertyChange(key, _value2, oldValue, this);
        return true;
      }

      return false;
    }
  }, {
    key: getAttribute,
    value: function value(key) {
      return this[_attr][key];
    }
  }, {
    key: changedAttrs,
    get: function get() {
      var _this2 = this;

      var ret = {};
      (0, _toConsumableArray2.default)(this[_changedAttrs]).forEach(function (key) {
        ret[key] = _this2[_attr][key];
      });
      return ret;
    }
  }, {
    key: attributes,
    get: function get() {
      return Object.assign({}, this[_attr], {
        pos: this.pos
      });
    }
  }, {
    key: "id",
    set: function set(value) {
      this[setAttribute]('id', value);
    },
    get: function get() {
      return this[getAttribute]('id');
    }
  }, {
    key: "name",
    set: function set(value) {
      this[setAttribute]('name', value);
    },
    get: function get() {
      return this[getAttribute]('name');
    }
  }, {
    key: "className",
    set: function set(value) {
      this[setAttribute]('className', value);
    },
    get: function get() {
      return this[getAttribute]('className');
    }
  }, {
    key: "class",
    set: function set(value) {
      this.className = value;
    },
    get: function get() {
      return this.className;
    }
  }, {
    key: "x",
    get: function get() {
      return this[getAttribute]('x');
    },
    set: function set(value) {
      this[setAttribute]('x', (0, _attribute_value.toNumber)(value));
    }
  }, {
    key: "y",
    get: function get() {
      return this[getAttribute]('y');
    },
    set: function set(value) {
      this[setAttribute]('y', (0, _attribute_value.toNumber)(value));
    }
  }, {
    key: "pos",
    get: function get() {
      return [this.x, this.y];
    },
    set: function set(value) {
      value = (0, _attribute_value.toArray)(value);
      if (!Array.isArray(value)) value = [value, value];
      this.x = value[0];
      this.y = value[1];
    }
  }, {
    key: "transform",
    get: function get() {
      return this[getAttribute]('transform');
    },
    set: function set(value) {
      if (this[setAttribute]('transform', value)) {
        var transformMap = this[_transforms];

        if (transformMap.has('matrix')) {
          transformMap.delete('matrix');
        }

        if (Array.isArray(value)) {
          transformMap.set('matrix', value);
        } else if (value) {
          var transforms = value.match(/(matrix|translate|rotate|scale|skew)\([^()]+\)/g);

          if (transforms) {
            var m = _glMatrix.mat2d.fromValues(1, 0, 0, 1, 0, 0);

            for (var i = 0; i < transforms.length; i++) {
              var t = transforms[i];
              var matched = t.match(/^(matrix|translate|rotate|scale|skew)\(([^()]+)\)/);

              if (matched) {
                var _matched = (0, _slicedToArray2.default)(matched, 3),
                    method = _matched[1],
                    _value3 = _matched[2];

                if (method === 'rotate') _value3 = Math.PI * parseFloat(_value3) / 180;else _value3 = _value3.trim().split(/[\s,]+/).map(function (v) {
                  return (0, _attribute_value.toNumber)(v);
                });

                if (method === 'matrix') {
                  m = _glMatrix.mat2d.multiply(m, m, _value3);
                } else {
                  _glMatrix.mat2d[method](m, m, _value3);
                }

                transformMap.set('matrix', m);
              }
            }
          }
        }

        this[_transformMatrix] = getMatrix(transformMap, this.transformOrigin);
      }
    }
  }, {
    key: "transformOrigin",
    get: function get() {
      return this[getAttribute]('transformOrigin');
    },
    set: function set(_ref5) {
      var _ref6 = (0, _slicedToArray2.default)(_ref5, 2),
          x = _ref6[0],
          y = _ref6[1];

      this[setAttribute]('transformOrigin', [(0, _attribute_value.toNumber)(x), (0, _attribute_value.toNumber)(y)]);
    }
  }, {
    key: "rotate",
    get: function get() {
      return this[getAttribute]('rotate');
    },
    set: function set(value) {
      if (this[setAttribute]('rotate', value)) {
        var transformMap = this[_transforms];

        if (transformMap.has('rotate')) {
          transformMap.delete('rotate');
        }

        if (value) transformMap.set('rotate', Math.PI * value / 180);
        this[_transformMatrix] = getMatrix(transformMap, this.transformOrigin);
      }
    }
  }, {
    key: "translate",
    get: function get() {
      return this[getAttribute]('translate');
    },
    set: function set(value) {
      if (this[setAttribute]('translate', value)) {
        var transformMap = this[_transforms];

        if (transformMap.has('translate')) {
          transformMap.delete('translate');
        }

        if (value) transformMap.set('translate', value);
        this[_transformMatrix] = getMatrix(transformMap, this.transformOrigin);
      }
    }
  }, {
    key: "scale",
    get: function get() {
      return this[getAttribute]('scale');
    },
    set: function set(value) {
      value = (0, _attribute_value.toArray)(value);
      if (!Array.isArray(value)) value = [value, value];

      if (this[setAttribute]('scale', value)) {
        var transformMap = this[_transforms];

        if (transformMap.has('scale')) {
          transformMap.delete('scale');
        }

        if (value) transformMap.set('scale', value);
        this[_transformMatrix] = getMatrix(transformMap, this.transformOrigin);
      }
    }
  }, {
    key: "skew",
    get: function get() {
      return this[getAttribute]('skew');
    },
    set: function set(value) {
      if (this[setAttribute]('skew', value)) {
        var transformMap = this[_transforms];

        if (transformMap.has('skew')) {
          transformMap.delete('skew');
        }

        if (value) transformMap.set('skew', value);
        this[_transformMatrix] = getMatrix(transformMap, this.transformOrigin);
      }
    }
  }, {
    key: "opacity",
    get: function get() {
      return this[getAttribute]('opacity');
    },
    set: function set(value) {
      if (value != null) value = Number(value);
      this[setAttribute]('opacity', value);
    }
  }, {
    key: "zIndex",
    get: function get() {
      return this[getAttribute]('zIndex');
    },
    set: function set(value) {
      if (value != null) value = Number(value);
      this[setAttribute]('zIndex', value);
    }
  }, {
    key: "offsetPath",
    get: function get() {
      return this[getAttribute]('offsetPath');
    },
    set: function set(value) {
      if (this[setAttribute]('offsetPath', value)) {
        this[_offsetFigure].beginPath();

        this[_offsetFigure].addPath(value);

        updateOffset(this);
      }
    }
  }, {
    key: "offsetDistance",
    get: function get() {
      return this[getAttribute]('offsetDistance');
    },
    set: function set(value) {
      if (this[setAttribute]('offsetDistance', (0, _attribute_value.toNumber)(value))) {
        updateOffset(this);
      }
    }
  }, {
    key: "offsetRotate",
    get: function get() {
      return this[getAttribute]('offsetRotate');
    },
    set: function set(value) {
      this[setAttribute]('offsetRotate', value);
      updateOffset(this);
    }
  }, {
    key: "pointerEvents",
    get: function get() {
      return this[getAttribute]('pointerEvents');
    },
    set: function set(value) {
      if (value != null && value !== 'none' && value !== 'visible' && value !== 'visibleFill' && value !== 'visibleStroke' && value !== 'all') {
        throw new TypeError('Invalid pointerEvents type.');
      }

      this[setAttribute]('pointerEvents', value);
    }
  }, {
    key: "filter",
    get: function get() {
      return this[getAttribute]('filter');
    },
    set: function set(value) {
      this[setAttribute]('filter', value);
    }
  }, {
    key: "offset",
    set: function set(value) {
      /* ignore setting offset for animations */
    }
  }]);
  return Node;
}();

exports.default = Node;