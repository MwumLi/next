"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _node = _interopRequireDefault(require("./node"));

var _color = require("../utils/color");

var _attribute_value = require("../utils/attribute_value");

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

var setDefault = Symbol.for('spritejs_setAttributeDefault');
var setAttribute = Symbol.for('spritejs_setAttribute');
var getAttribute = Symbol.for('spritejs_getAttribute');

var Path =
/*#__PURE__*/
function (_Node) {
  (0, _inherits2.default)(Path, _Node);

  function Path(subject) {
    var _this;

    (0, _classCallCheck2.default)(this, Path);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Path).call(this, subject));

    _this[setDefault]({
      d: '',
      normalize: false,
      fillColor: undefined,
      strokeColor: undefined,
      lineWidth: 1,
      lineJoin: 'miter',
      // 'miter' or 'bevel'
      lineCap: 'butt',
      // 'butt' or 'square'
      lineDash: undefined,
      lineDashOffset: 0,
      miterLimit: 10,
      texture: undefined,
      textureRect: undefined,
      textureRepeat: false,
      sourceRect: undefined
    });

    return _this;
  }

  (0, _createClass2.default)(Path, [{
    key: "d",
    get: function get() {
      return this[getAttribute]('d');
    },
    set: function set(value) {
      this[setAttribute]('d', value);
    }
  }, {
    key: "normalize",
    get: function get() {
      return this[getAttribute]('normalize');
    },
    set: function set(value) {
      this[setAttribute]('normalize', !!value);
    }
  }, {
    key: "fillColor",
    get: function get() {
      return this[getAttribute]('fillColor');
    },
    set: function set(value) {
      this[setAttribute]('fillColor', (0, _color.parseColor)(value));
    }
  }, {
    key: "strokeColor",
    get: function get() {
      return this[getAttribute]('strokeColor');
    },
    set: function set(value) {
      this[setAttribute]('strokeColor', (0, _color.parseColor)(value));
    }
  }, {
    key: "lineWidth",
    get: function get() {
      return this[getAttribute]('lineWidth');
    },
    set: function set(value) {
      this[setAttribute]('lineWidth', (0, _attribute_value.toNumber)(value));
    }
  }, {
    key: "lineJoin",
    get: function get() {
      return this[getAttribute]('lineJoin');
    },
    set: function set(value) {
      if (value != null && value !== 'miter' && value !== 'bevel') throw new TypeError('Invalid lineJoin type.');
      this[setAttribute]('lineJoin', value);
    }
  }, {
    key: "lineCap",
    get: function get() {
      return this[getAttribute]('lineCap');
    },
    set: function set(value) {
      if (value != null && value !== 'butt' && value !== 'square') throw new TypeError('Invalid lineCap type.');
      this[setAttribute]('lineCap', value);
    }
  }, {
    key: "lineDash",
    get: function get() {
      return this[getAttribute]('lineDash');
    },
    set: function set(value) {
      value = (0, _attribute_value.toArray)(value, true);
      if (value != null && !Array.isArray(value)) value = [value];
      this[setAttribute]('lineDash', value ? value.map(_attribute_value.toNumber) : null);
    }
  }, {
    key: "lineDashOffset",
    get: function get() {
      return this[getAttribute]('lineDashOffset');
    },
    set: function set(value) {
      this[setAttribute]('lineDashOffset', (0, _attribute_value.toNumber)(value));
    }
  }, {
    key: "miterLimit",
    get: function get() {
      return this[getAttribute]('miterLimit');
    },
    set: function set(value) {
      this[setAttribute]('miterLimit', (0, _attribute_value.toNumber)(value));
    }
  }, {
    key: "texture",
    get: function get() {
      return this[getAttribute]('texture');
    },
    set: function set(value) {
      this[setAttribute]('texture', value);
    }
  }, {
    key: "textureRect",
    get: function get() {
      return this[getAttribute]('textureRect');
    },
    set: function set(value) {
      this[setAttribute]('textureRect', value);
    }
  }, {
    key: "sourceRect",
    get: function get() {
      return this[getAttribute]('sourceRect');
    },
    set: function set(value) {
      this[setAttribute]('sourceRect', value);
    }
  }, {
    key: "textureRepeat",
    get: function get() {
      return this[getAttribute]('textureRepeat');
    },
    set: function set(value) {
      this[setAttribute]('textureRepeat', !!value);
    }
  }]);
  return Path;
}(_node.default);

exports.default = Path;