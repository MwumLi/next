"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _glMatrix = require("gl-matrix");

var _node = _interopRequireDefault(require("../attribute/node"));

var _animation2 = _interopRequireDefault(require("../animation"));

var _document = _interopRequireDefault(require("../document"));

var _event = _interopRequireDefault(require("../event/event"));

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var changedAttrs = Symbol.for('spritejs_changedAttrs');

var _resolution = Symbol('resolution');

var _animations = Symbol('animations');

var _eventListeners = Symbol('eventListeners');

var _captureEventListeners = Symbol('captureEventListeners'); // const _mouseCapture = Symbol('mouseCapture');


var Node =
/*#__PURE__*/
function () {
  function Node() {
    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Node);
    this.attributes = new this.constructor.Attr(this);
    this[_resolution] = {
      width: 300,
      height: 150
    };
    Object.assign(this.attributes, attrs); // if(Object.seal) {
    //   Object.seal(this.attributes);
    // }

    this[_animations] = new Set();
    this[_eventListeners] = {};
    this[_captureEventListeners] = {};
  }

  (0, _createClass2.default)(Node, [{
    key: "getOffsetPosition",
    value: function getOffsetPosition(x, y) {
      var m = _glMatrix.mat2d.invert(Array.of(0, 0, 0, 0, 0, 0), this.renderMatrix);

      var offsetX = x * m[0] + y * m[2] + m[4];
      var offsetY = x * m[1] + y * m[3] + m[5];
      return [offsetX, offsetY];
    }
  }, {
    key: "getListeners",
    value: function getListeners(type) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$capture = _ref.capture,
          capture = _ref$capture === void 0 ? false : _ref$capture;

      var eventListeners = capture ? _captureEventListeners : _eventListeners;
      return (0, _toConsumableArray2.default)(this[eventListeners][type] || []);
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(type, listener) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (typeof options === 'boolean') options = {
        capture: options
      };
      var _options = options,
          capture = _options.capture,
          once = _options.once;
      var eventListeners = capture ? _captureEventListeners : _eventListeners;
      this[eventListeners][type] = this[eventListeners][type] || [];
      this[eventListeners][type].push({
        listener: listener,
        once: once
      });
      return this;
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, listener, options) {
      if (typeof options === 'boolean') options = {
        capture: options
      };
      var capture = options.capture;
      var eventListeners = capture ? _captureEventListeners : _eventListeners;

      if (this[eventListeners][type]) {
        var listeners = this[eventListeners][type];

        if (listeners) {
          for (var i = 0; i < listeners.length; i++) {
            var _listener = listeners[i].listener;

            if (_listener === listener) {
              this[eventListeners][type].splice(i, 1);
              break;
            }
          }
        }
      }

      return this;
    }
  }, {
    key: "isPointCollision",
    value: function isPointCollision(x, y) {
      return false;
    }
  }, {
    key: "isVisible",
    value: function isVisible() {
      return false;
    }
  }, {
    key: "dispatchPointerEvent",
    value: function dispatchPointerEvent(event) {
      var x = event.x,
          y = event.y;

      if (this.isPointCollision(x, y)) {
        this.dispatchEvent(event);
        return true;
      }

      return false;
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      var _this = this;

      if (!(event instanceof _event.default)) {
        event = new _event.default(event);
      }

      event.target = this;
      var type = event.type;
      var elements = [this];
      var parent = this.parent;

      while (event.bubbles && parent) {
        elements.push(parent);
        parent = parent.parent;
      } // capture phase


      for (var i = elements.length - 1; i >= 0; i--) {
        var element = elements[i];
        var listeners = element[_captureEventListeners] && element[_captureEventListeners][type];

        if (listeners && listeners.length) {
          listeners.forEach(function (_ref2) {
            var listener = _ref2.listener,
                once = _ref2.once;
            listener.call(_this, event);
            if (once) elements.removeEventListener(listener);
          });
        }

        if (!event.bubbles && event.cancelBubble) break;
      } // bubbling


      if (!event.cancelBubble) {
        for (var _i = 0; _i < elements.length; _i++) {
          var _element = elements[_i];

          var _listeners = _element[_eventListeners] && _element[_eventListeners][type];

          if (_listeners && _listeners.length) {
            _listeners.forEach(function (_ref3) {
              var listener = _ref3.listener,
                  once = _ref3.once;
              listener.call(_this, event);
              if (once) elements.removeEventListener(listener);
            });
          }

          if (!event.bubbles || event.cancelBubble) break;
        }
      }
    }
  }, {
    key: "cloneNode",
    value: function cloneNode() {
      var cloned = new this.constructor();
      var attrs = this.attributes[changedAttrs];
      cloned.attr(attrs);
      return cloned;
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this.parent && this.parent.removeChild) {
        this.parent.removeChild(this);
        return true;
      }

      return false;
    }
  }, {
    key: "onPropertyChange",
    value: function onPropertyChange(key, newValue, oldValue) {
      if (key !== 'id' && key !== 'name' && key !== 'className') {
        this.forceUpdate();
      }
    }
  }, {
    key: "forceUpdate",
    value: function forceUpdate() {
      if (this.parent) this.parent.forceUpdate();
    }
  }, {
    key: "setAttribute",
    value: function setAttribute(key, value) {
      this.attributes[key] = value;
    }
  }, {
    key: "getAttribute",
    value: function getAttribute(key) {
      return this.attributes[key];
    }
  }, {
    key: "removeAttribute",
    value: function removeAttribute(key) {
      this.setAttribute(key, null);
    }
  }, {
    key: "attr",
    value: function attr() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args[0] === 'attrs') {
        if (args[1]) return this.attr(args[1]);
      }

      if (args.length > 1) {
        var key = args[0],
            value = args[1];

        if (typeof value === 'function') {
          value = value(this.attr(key));
        }

        this.setAttribute(key, value);
        return this;
      }

      if (typeof args[0] === 'string') {
        return this.getAttribute(args[0]);
      }

      Object.assign(this.attributes, args[0]);
      return this;
    }
  }, {
    key: "setResolution",
    value: function setResolution(_ref4) {
      var width = _ref4.width,
          height = _ref4.height;
      var _this$_resolution = this[_resolution],
          w = _this$_resolution.width,
          h = _this$_resolution.height;

      if (w !== width || h !== height) {
        this[_resolution] = {
          width: width,
          height: height
        };
        this.updateContours();
        this.forceUpdate();
        return true;
      }

      return false;
    }
  }, {
    key: "getResolution",
    value: function getResolution() {
      return _objectSpread({}, this[_resolution]);
    }
  }, {
    key: "updateContours",
    value: function updateContours() {// override
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
      if (parent.timeline) this.activateAnimations();
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      delete this.parent;
      delete this.zOrder;
      this.deactivateAnimations();
    }
  }, {
    key: "activateAnimations",
    value: function activateAnimations() {
      var layer = this.layer;

      if (layer) {
        var animations = this[_animations];
        animations.forEach(function (animation) {
          animation.baseTimeline = layer.timeline;
          animation.play();
          animation.finished.then(function () {
            animations.delete(animation);
          });
        });
        var children = this.children;

        if (children) {
          children.forEach(function (child) {
            child.activateAnimations();
          });
        }
      }
    }
  }, {
    key: "deactivateAnimations",
    value: function deactivateAnimations() {
      this[_animations].forEach(function (animation) {
        return animation.cancel();
      });

      var children = this.children;

      if (children) {
        children.forEach(function (child) {
          child.deactivateAnimations();
        });
      }
    }
  }, {
    key: "animate",
    value: function animate(frames, timing) {
      var _this2 = this;

      var animation = new _animation2.default(this, frames, timing);
      if (this.effects) animation.applyEffects(this.effects);

      if (this.layer) {
        animation.baseTimeline = this.layer.timeline;
        animation.play();
        animation.finished.then(function () {
          _this2[_animations].delete(animation);
        });
      }

      this[_animations].add(animation);

      return animation;
    }
  }, {
    key: "transition",
    value: function transition(sec) {
      var _ref7;

      var easing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'linear';

      var that = this,
          _animation = Symbol('animation');

      easing = easing || 'linear';
      var delay = 0;

      if ((0, _typeof2.default)(sec) === 'object') {
        delay = sec.delay || 0;
        sec = sec.duration;
      }

      return _ref7 = {}, (0, _defineProperty2.default)(_ref7, _animation, null), (0, _defineProperty2.default)(_ref7, "cancel", function cancel() {
        var preserveState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var animation = this[_animation];

        if (animation) {
          animation.cancel(preserveState);
        }
      }), (0, _defineProperty2.default)(_ref7, "end", function end() {
        var animation = this[_animation];

        if (animation && (animation.playState === 'running' || animation.playState === 'pending')) {
          animation.finish();
        }
      }), (0, _defineProperty2.default)(_ref7, "reverse", function reverse() {
        var animation = this[_animation];

        if (animation) {
          if (animation.playState === 'running' || animation.playState === 'pending') {
            animation.playbackRate = -animation.playbackRate;
          } else {
            var direction = animation.timing.direction;
            animation.timing.direction = direction === 'reverse' ? 'normal' : 'reverse';
            animation.play();
          }
        }

        return animation.finished;
      }), (0, _defineProperty2.default)(_ref7, "attr", function attr(prop, val) {
        this.end();

        if (typeof prop === 'string') {
          prop = (0, _defineProperty2.default)({}, prop, val);
        }

        Object.entries(prop).forEach(function (_ref5) {
          var _ref6 = (0, _slicedToArray2.default)(_ref5, 2),
              key = _ref6[0],
              value = _ref6[1];

          if (typeof value === 'function') {
            prop[key] = value(that.attr(key));
          }
        });
        this[_animation] = that.animate([prop], {
          duration: sec * 1000,
          delay: delay * 1000,
          fill: 'forwards',
          easing: easing
        });
        return this[_animation].finished;
      }), _ref7;
    }
  }, {
    key: "draw",
    value: function draw() {
      return [];
    }
  }, {
    key: "renderer",
    get: function get() {
      if (this.parent) return this.parent.renderer;
      return null;
    }
  }, {
    key: "layer",
    get: function get() {
      if (this.parent) return this.parent.layer;
      return null;
    }
  }, {
    key: "animations",
    get: function get() {
      return this[_animations];
    }
  }, {
    key: "id",
    get: function get() {
      return this.attributes.id;
    },
    set: function set(value) {
      this.attributes.id = value;
    }
  }, {
    key: "name",
    get: function get() {
      return this.attributes.name;
    },
    set: function set(value) {
      this.attributes.name = value;
    }
  }, {
    key: "className",
    get: function get() {
      return this.attributes.className;
    },
    set: function set(value) {
      this.attributes.className = value;
    }
  }, {
    key: "zIndex",
    get: function get() {
      return this.attributes.zIndex;
    },
    set: function set(value) {
      this.attributes.zIndex = value;
    }
  }, {
    key: "renderMatrix",
    get: function get() {
      var m = this.transformMatrix;
      var _this$attributes = this.attributes,
          x = _this$attributes.x,
          y = _this$attributes.y;
      m[4] += x;
      m[5] += y;
      var parent = this.parent;

      while (parent && parent.renderMatrix) {
        m = _glMatrix.mat2d.multiply(Array.of(0, 0, 0, 0, 0, 0), parent.renderMatrix, m);
        parent = parent.parent;
      }

      return m;
    }
  }, {
    key: "ancestors",
    get: function get() {
      var parent = this.parent;
      var ret = [];

      while (parent) {
        ret.push(parent);
        parent = parent.parent;
      }

      return ret;
    }
  }]);
  return Node;
}();

exports.default = Node;
(0, _defineProperty2.default)(Node, "Attr", _node.default);

_document.default.registerNode(Node, 'node');