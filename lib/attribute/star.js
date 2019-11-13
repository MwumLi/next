"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _set2 = _interopRequireDefault(require("@babel/runtime/helpers/set"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _polyline = _interopRequireDefault(require("./polyline"));

var _attribute_value = require("../utils/attribute_value");

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

var setDefault = Symbol.for('spritejs_setAttributeDefault');
var setAttribute = Symbol.for('spritejs_setAttribute');
var getAttribute = Symbol.for('spritejs_getAttribute');

function getPoints(attr) {
  var angles = attr.angles,
      innerRadius = attr.innerRadius,
      outerRadius = attr.outerRadius,
      offsetAngle = attr.offsetAngle;
  var offset = Math.PI * offsetAngle / 180 - 0.5 * Math.PI;
  if (angles < 3 || innerRadius <= 0 || outerRadius <= 0) return [];
  var points = [];

  for (var i = 0; i < angles * 2; i++) {
    var angle = i * Math.PI / angles + offset;
    var radius = i % 2 ? innerRadius : outerRadius;
    var x = radius * Math.cos(angle);
    var y = radius * Math.sin(angle);
    points.push(x, y);
  }

  return points;
}

var Star =
/*#__PURE__*/
function (_Polyline) {
  (0, _inherits2.default)(Star, _Polyline);

  function Star(subject) {
    var _this;

    (0, _classCallCheck2.default)(this, Star);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Star).call(this, subject));

    _this[setDefault]({
      angles: 5,
      innerRadius: 0,
      outerRadius: 0,
      offsetAngle: 0,
      closeType: 'normal'
    });

    return _this;
  } // readonly


  (0, _createClass2.default)(Star, [{
    key: "points",
    get: function get() {
      return (0, _get2.default)((0, _getPrototypeOf2.default)(Star.prototype), "points", this);
    },
    set: function set(value) {} // eslint-disable-line no-empty-function

  }, {
    key: "angles",
    get: function get() {
      return this[getAttribute]('angles');
    },
    set: function set(value) {
      value = (0, _attribute_value.toNumber)(value);

      if (this[setAttribute]('angles', value)) {
        var points = getPoints(this);
        (0, _set2.default)((0, _getPrototypeOf2.default)(Star.prototype), "points", points, this, true);
      }
    }
  }, {
    key: "innerRadius",
    get: function get() {
      return this[getAttribute]('innerRadius');
    },
    set: function set(value) {
      value = (0, _attribute_value.toNumber)(value);

      if (this[setAttribute]('innerRadius', value)) {
        var points = getPoints(this);
        (0, _set2.default)((0, _getPrototypeOf2.default)(Star.prototype), "points", points, this, true);
      }
    }
  }, {
    key: "outerRadius",
    get: function get() {
      return this[getAttribute]('outerRadius');
    },
    set: function set(value) {
      value = (0, _attribute_value.toNumber)(value);

      if (this[setAttribute]('outerRadius', value)) {
        var points = getPoints(this);
        (0, _set2.default)((0, _getPrototypeOf2.default)(Star.prototype), "points", points, this, true);
      }
    }
  }, {
    key: "offsetAngle",
    get: function get() {
      return this[getAttribute]('offsetAngle');
    },
    set: function set(value) {
      value = (0, _attribute_value.toNumber)(value);

      if (this[setAttribute]('offsetAngle', value)) {
        var points = getPoints(this);
        (0, _set2.default)((0, _getPrototypeOf2.default)(Star.prototype), "points", points, this, true);
      }
    }
  }]);
  return Star;
}(_polyline.default);

exports.default = Star;