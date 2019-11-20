"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _core = require("@mesh.js/core");

var _node = _interopRequireDefault(require("./node"));

var _layer = _interopRequireDefault(require("./layer"));

var _layerWorker = _interopRequireDefault(require("./layer-worker"));

var _group = _interopRequireDefault(require("./group"));

var _pointerEvents = _interopRequireDefault(require("../event/pointer-events"));

var _event = _interopRequireDefault(require("../event/event"));

var _texture_loader = require("../utils/texture_loader");

var _document = _interopRequireDefault(require("../document"));

require("gl-matrix").glMatrix.setMatrixArrayType(Array);

var _enteredTargets = Symbol('enteredTargets');

function delegateEvents(scene) {
  var events = ['mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchend', 'touchmove', 'touchcancel', 'click', 'dblclick'];
  var container = scene.container;
  var _scene$options = scene.options,
      left = _scene$options.left,
      top = _scene$options.top;
  container.addEventListener('mouseleave', function (event) {
    var enteredTargets = scene[_enteredTargets];

    if (enteredTargets.size) {
      var leaveEvent = new _event.default('mouseleave');
      leaveEvent.setOriginalEvent(event);
      (0, _toConsumableArray2.default)(enteredTargets).forEach(function (target) {
        target.dispatchEvent(leaveEvent);
      });

      scene[_enteredTargets].clear();
    }
  }, {
    passive: true
  });
  events.forEach(function (eventType) {
    container.addEventListener(eventType, function (event) {
      var layers = scene.orderedChildren;
      var pointerEvents = (0, _pointerEvents.default)(event, {
        offsetLeft: left,
        offsetTop: top
      });
      pointerEvents.forEach(function (evt) {
        // evt.scene = scene;
        for (var i = 0; i < layers.length; i++) {
          var layer = layers[i];

          if (layer.options.handleEvent !== false) {
            var ret = layer.dispatchPointerEvent(evt);
            if (ret && evt.target !== layer) break;
          }
        }

        if (evt.type === 'mousemove') {
          var target = evt.target;
          var enteredTargets = scene[_enteredTargets];
          var enterSet;

          if (target) {
            var ancestors = target.ancestors || [];
            enterSet = new Set([target].concat((0, _toConsumableArray2.default)(ancestors)));
          } else {
            enterSet = new Set();
          }

          var entries = Object.entries(event);

          if (!enteredTargets.has(target)) {
            if (target) {
              var enterEvent = new _event.default('mouseenter');
              enterEvent.setOriginalEvent(event);
              entries.forEach(function (_ref) {
                var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
                    key = _ref2[0],
                    value = _ref2[1];

                enterEvent[key] = value;
              });
              enteredTargets.add(target);
              target.dispatchEvent(enterEvent);
              var _ancestors = target.ancestors;

              if (_ancestors) {
                _ancestors.forEach(function (ancestor) {
                  if (ancestor instanceof _node.default && !enteredTargets.has(ancestor)) {
                    enteredTargets.add(ancestor);
                    ancestor.dispatchEvent(enterEvent);
                  }
                });
              }
            }
          }

          var leaveEvent = new _event.default('mouseleave');
          leaveEvent.setOriginalEvent(event);
          entries.forEach(function (_ref3) {
            var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
                key = _ref4[0],
                value = _ref4[1];

            leaveEvent[key] = value;
          });
          (0, _toConsumableArray2.default)(enteredTargets).forEach(function (target) {
            if (!enterSet.has(target)) {
              enteredTargets.delete(target);
              target.dispatchEvent(leaveEvent);
            }
          });
        }
      });
    }, {
      passive: true
    });
  });
}

function setViewport(options, canvas) {
  if (canvas.style) {
    var width = options.width,
        height = options.height,
        mode = options.mode,
        container = options.container;
    var clientWidth = container.clientWidth,
        clientHeight = container.clientHeight;
    width = width || clientWidth;
    height = height || clientHeight;

    if (mode === 'static') {
      canvas.style.width = "".concat(width, "px");
      canvas.style.height = "".concat(height, "px");
      canvas.style.top = '50%';
      canvas.style.left = '50%';
      canvas.style.transform = 'translate(-50%, -50%)';
      canvas.style.webkitTransform = 'translate(-50%, -50%)';
    } else {
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = "".concat(clientWidth, "px");
      canvas.style.height = "".concat(clientHeight, "px");
      canvas.style.transform = '';
      canvas.style.webkitTransform = '';
    }
  }
}

var Scene =
/*#__PURE__*/
function (_Group) {
  (0, _inherits2.default)(Scene, _Group);

  /**
    width
    height
    mode: 'static', 'scale', 'stickyWidth', 'stickyHeight', 'stickyTop', 'stickyBottom', 'stickyLeft', 'stickyRight'
   */
  function Scene() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Scene);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Scene).call(this));
    _this.container = options.container;

    if (_this.container.style) {
      if (!_this.container.style.overflow) {
        _this.container.style.overflow = 'hidden';
      }

      if (!_this.container.style.position) {
        _this.container.style.position = 'relative';
      }
    }

    _this.options = options;
    options.displayRatio = options.displayRatio || 1.0;
    options.mode = options.mode || 'scale';
    options.left = 0;
    options.top = 0;
    options.autoResize = options.autoResize || true;

    if (options.autoResize) {
      if (global.addEventListener) {
        var that = (0, _assertThisInitialized2.default)(_this);
        global.addEventListener('resize', function listener() {
          if (typeof document !== 'undefined' && document.contains(that.container)) {
            that.resize();
          } else {
            global.removeEventListener('resize', listener);
          }
        });
      }
    }

    _this[_enteredTargets] = new Set();

    _this.setResolution(options);

    delegateEvents((0, _assertThisInitialized2.default)(_this));
    return _this;
  }
  /* override */


  (0, _createClass2.default)(Scene, [{
    key: "setResolution",
    value: function setResolution() {
      var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          width = _ref5.width,
          height = _ref5.height;

      var container = this.container;
      var clientWidth = container.clientWidth,
          clientHeight = container.clientHeight;

      if (width == null || height == null) {
        width = width == null ? clientWidth : width;
        height = height == null ? clientHeight : height;
      }

      var _this$options = this.options,
          mode = _this$options.mode,
          displayRatio = _this$options.displayRatio;
      width *= displayRatio;
      height *= displayRatio;

      if (mode === 'stickyHeight' || mode === 'stickyLeft' || mode === 'stickyRight') {
        var w = width;
        width = clientWidth * height / clientHeight;
        this.options.left = 0;
        if (mode === 'stickyHeight') this.options.left = 0.5 * (width - w);
        if (mode === 'stickyRight') this.options.left = width - w;
      } else if (mode === 'stickyWidth' || mode === 'stickyTop' || mode === 'stickyBottom') {
        var h = height;
        height = clientHeight * width / clientWidth;
        this.options.top = 0;
        if (mode === 'stickyWidth') this.options.top = 0.5 * (height - h);
        if (mode === 'stickyBottom') this.options.top = height - h;
      } else {
        this.options.left = 0;
        this.options.top = 0;
      }

      (0, _get2.default)((0, _getPrototypeOf2.default)(Scene.prototype), "setResolution", this).call(this, {
        width: width,
        height: height
      });
    }
  }, {
    key: "resize",
    value: function resize() {
      var options = this.options;
      this.children.forEach(function (layer) {
        setViewport(options, layer.canvas);
      });
      this.setResolution(options);
    }
  }, {
    key: "preload",
    value: function () {
      var _preload = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        var _this2 = this;

        var _len,
            resources,
            _key,
            ret,
            tasks,
            i,
            res,
            task,
            id,
            src,
            _args = arguments;

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                for (_len = _args.length, resources = new Array(_len), _key = 0; _key < _len; _key++) {
                  resources[_key] = _args[_key];
                }

                ret = [], tasks = [];

                for (i = 0; i < resources.length; i++) {
                  res = resources[i];
                  task = void 0;

                  if (typeof res === 'string') {
                    task = (0, _texture_loader.loadTexture)(res);
                  } else if (Array.isArray(res)) {
                    task = _texture_loader.loadFrames.apply(void 0, (0, _toConsumableArray2.default)(res));
                  } else {
                    id = res.id, src = res.src;
                    task = (0, _texture_loader.loadTexture)(src, id);
                  }
                  /* istanbul ignore if  */


                  if (!(task instanceof Promise)) {
                    task = Promise.resolve(task);
                  }

                  tasks.push(task.then(function (r) {
                    ret.push(r);
                    var preloadEvent = new _event.default({
                      type: 'preload',
                      detail: {
                        current: r,
                        loaded: ret,
                        resources: resources
                      }
                    });

                    _this2.dispatchEvent(preloadEvent);
                  }));
                }

                _context.next = 5;
                return Promise.all(tasks);

              case 5:
                return _context.abrupt("return", ret);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function preload() {
        return _preload.apply(this, arguments);
      }

      return preload;
    }()
    /* override */

  }, {
    key: "appendChild",
    value: function appendChild(layer) {
      var ret = (0, _get2.default)((0, _getPrototypeOf2.default)(Scene.prototype), "appendChild", this).call(this, layer);
      var canvas = layer.canvas;
      this.container.appendChild(canvas);
      setViewport(this.options, canvas);
      layer.setResolution(this.getResolution());
      return ret;
    }
    /* override */

  }, {
    key: "insertBefore",
    value: function insertBefore(layer, ref) {
      var ret = (0, _get2.default)((0, _getPrototypeOf2.default)(Scene.prototype), "insertBefore", this).call(this, layer, ref);
      var canvas = layer.canvas;
      this.container.appendChild(canvas);
      setViewport(this.options, canvas);
      layer.setResolution(this.getResolution());
      return ret;
    }
    /* override */

  }, {
    key: "replaceChild",
    value: function replaceChild(layer, ref) {
      var ret = (0, _get2.default)((0, _getPrototypeOf2.default)(Scene.prototype), "replaceChild", this).call(this, layer, ref);
      var canvas = layer.canvas;
      this.container.appendChild(canvas);
      setViewport(this.options, canvas);
      layer.setResolution(this.getResolution());
      return ret;
    }
    /* override */

  }, {
    key: "removeChild",
    value: function removeChild(layer) {
      var ret = (0, _get2.default)((0, _getPrototypeOf2.default)(Scene.prototype), "removeChild", this).call(this, layer);
      var canvas = layer.canvas;
      canvas.remove();
      return ret;
    }
  }, {
    key: "layer",
    value: function layer() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      options = Object.assign({}, this.options, options);
      options.id = id;
      var layers = this.orderedChildren;

      for (var i = 0; i < layers.length; i++) {
        if (layers[i].id === id) return layers[i];
      } // const {width, height} = this.getResolution();
      // const canvas = createCanvas(width, height, {offscreen: false});
      // if(canvas.style) canvas.style.position = 'absolute';
      // if(canvas.dataset) canvas.dataset.layerId = id;
      // this.container.appendChild(canvas);
      // options.canvas = canvas;


      var worker = options.worker;
      var layer;

      if (worker) {
        layer = new _layerWorker.default(options);
      } else {
        layer = new _layer.default(options); // layer.id = id;
      }

      this.appendChild(layer);
      return layer;
    }
  }, {
    key: "snapshot",
    value: function snapshot() {
      var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref6$offscreen = _ref6.offscreen,
          offscreen = _ref6$offscreen === void 0 ? false : _ref6$offscreen;

      var _canvas = offscreen ? 'snapshotOffScreenCanvas' : 'snapshotCanvas';

      var _this$getResolution = this.getResolution(),
          width = _this$getResolution.width,
          height = _this$getResolution.height;

      this[_canvas] = this[_canvas] || (0, _core.createCanvas)(width, height, {
        offscreen: offscreen
      });

      var context = this[_canvas].getContext('2d');

      var layers = this.orderedChildren;
      context.clearRect(0, 0, width, height);

      for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        layer.render();
        var canvas = layer.canvas;

        if (canvas) {
          context.drawImage(canvas, 0, 0, width, height);
        }
      }

      return this[_canvas];
    }
  }]);
  return Scene;
}(_group.default);

exports.default = Scene;

_document.default.registerNode(Scene, 'scene');