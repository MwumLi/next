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

var _core = require("@mesh.js/core");

var _path = _interopRequireDefault(require("./path"));

var _attribute_value = require("../utils/attribute_value");

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

var setDefault = Symbol.for('spritejs_setAttributeDefault');
var setAttribute = Symbol.for('spritejs_setAttribute');
var getAttribute = Symbol.for('spritejs_getAttribute');

function getPath(attr) {
  var x = attr.x,
      y = attr.y,
      radiusX = attr.radiusX,
      radiusY = attr.radiusY,
      startAngle = attr.startAngle,
      endAngle = attr.endAngle,
      direction = attr.direction,
      close = attr.close;
  var anticlockwise = direction === 'anitclockwise';
  var f = new _core.Figure2D();

  if (close === 'sector') {
    f.moveTo(x, y);
  }

  f.ellipse(x, y, radiusX, radiusY, Math.PI * startAngle / 180, Math.PI * endAngle / 180, anticlockwise);

  if (close !== 'none') {
    f.closePath();
  }

  var path = f.path;

  if (path) {
    var ret = path.reduce(function (a, b) {
      return a + b.join(' ');
    }, '');
    return ret;
  }

  return '';
}

var Ellipse =
/*#__PURE__*/
function (_Path) {
  (0, _inherits2.default)(Ellipse, _Path);

  function Ellipse(subject) {
    var _this;

    (0, _classCallCheck2.default)(this, Ellipse);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Ellipse).call(this, subject));

    _this[setDefault]({
      radiusX: 0,
      radiusY: 0,
      startAngle: 0,
      endAngle: 0,
      direction: 'clockwise',
      // clockwise | anticlockwise
      close: 'none' // none | sector | normal

    });

    return _this;
  } // readonly


  (0, _createClass2.default)(Ellipse, [{
    key: "d",
    get: function get() {
      return this[getAttribute]('d');
    }
  }, {
    key: "radiusX",
    get: function get() {
      return this[getAttribute]('radiusX');
    },
    set: function set(value) {
      value = (0, _attribute_value.toNumber)(value);

      if (this[setAttribute]('radiusX', value)) {
        var d = getPath(this);
        this[setAttribute]('d', d);
      }
    }
  }, {
    key: "radiusY",
    get: function get() {
      return this[getAttribute]('radiusY');
    },
    set: function set(value) {
      value = (0, _attribute_value.toNumber)(value);

      if (this[setAttribute]('radiusY', value)) {
        var d = getPath(this);
        this[setAttribute]('d', d);
      }
    }
  }, {
    key: "direction",
    get: function get() {
      return this[getAttribute]('direction');
    },
    set: function set(value) {
      if (value !== 'clockwise' && value !== 'anticlockwise') throw new TypeError('Invalid direction type.');
      this[setAttribute]('direction', value);
    }
  }, {
    key: "startAngle",
    get: function get() {
      return this[getAttribute]('startAngle');
    },
    set: function set(value) {
      value = (0, _attribute_value.toNumber)(value);

      if (this[setAttribute]('startAngle', value)) {
        var d = getPath(this);
        this[setAttribute]('d', d);
      }
    }
  }, {
    key: "endAngle",
    get: function get() {
      return this[getAttribute]('endAngle');
    },
    set: function set(value) {
      value = (0, _attribute_value.toNumber)(value);

      if (this[setAttribute]('endAngle', value)) {
        var d = getPath(this);
        this[setAttribute]('d', d);
      }
    }
  }, {
    key: "close",
    get: function get() {
      return this[getAttribute]('close');
    },
    set: function set(value) {
      if (value !== 'none' && value !== 'sector' && value !== 'normal') throw new TypeError('Invalid close type.');

      if (this[setAttribute]('close', value)) {
        var d = getPath(this);
        this[setAttribute]('d', d);
      }
    }
  }]);
  return Ellipse;
}(_path.default);

exports.default = Ellipse;