"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createComputedClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var prop = props[i]; prop.configurable = true; if (prop.value) prop.writable = true; Object.defineProperty(target, prop.key, prop); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var React = _interopRequire(require("react"));

var __handleSwipeGesture__ = Symbol("handleSwipeGesture");
var __handleTapGesture__ = Symbol("handleTapGesture");
var __emitEvent__ = Symbol("emitEvent");

var Gestures = (function (_React$Component) {
  function Gestures(props) {
    _classCallCheck(this, Gestures);

    _get(Object.getPrototypeOf(Gestures.prototype), "constructor", this).call(this, props);

    this.state = {
      x: null,
      y: null,
      swiping: false,
      start: 0
    };
  }

  _inherits(Gestures, _React$Component);

  _createComputedClass(Gestures, [{
    key: "resetState",
    value: function resetState() {
      this.setState({ x: null, y: null, swiping: false, start: 0 });
    }
  }, {
    key: __emitEvent__,
    value: function (name, e) {
      if (this.props[name]) {
        this.props[name](e);
      }
    }
  }, {
    key: "getGestureDetails",
    value: function getGestureDetails(e) {
      var _e$changedTouches$0 = e.changedTouches[0];
      var clientX = _e$changedTouches$0.clientX;
      var clientY = _e$changedTouches$0.clientY;

      var deltaX = this.state.x - clientX;
      var deltaY = this.state.y - clientY;
      var absX = Math.abs(deltaX);
      var absY = Math.abs(deltaY);
      var duration = Date.now() - this.state.start;
      var velocity = Math.sqrt(absX * absX + absY * absY) / duration;
      var done = e.type === "touchend";
      e.gesture = { deltaX: deltaX, deltaY: deltaY, absX: absX, absY: absY, velocity: velocity, duration: duration, done: done };
      return e;
    }
  }, {
    key: "handleTouchStart",
    value: function handleTouchStart(e) {
      [__emitEvent__]("onTouchStart", e);

      this.setState({
        start: Date.now(),
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        swiping: false
      });
    }
  }, {
    key: "handleTouchMove",
    value: function handleTouchMove(e) {
      var ge = this.getGestureDetails(e);
      [__emitEvent__]("onTouchMove", ge);

      if (ge.gesture.absX > this.props.swipeThreshold && ge.gesture.absY > this.props.swipeThreshold) {
        this[__handleSwipeGesture__](ge);
        return;
      }
    }
  }, {
    key: "handleTouchCancel",
    value: function handleTouchCancel(e) {
      this[__emitEvent__]("onTouchCancel", e);
      this.resetState();
    }
  }, {
    key: "handleTouchEnd",
    value: function handleTouchEnd(e) {
      var ge = this.getGestureDetails(e);
      [__emitEvent__]("onTouchEnd", ge);

      if (this.state.swiping) {
        this[__handleSwipeGesture__](ge);
        return this.resetState();
      }
      if (ge.gesture.duration > 0) {
        this[__handleTapGesture__]("onTap", ge);
      }
      this.resetState();
    }
  }, {
    key: __handleTapGesture__,
    value: function (ge) {
      ge.type = "tap";
      this[__emitEvent__]("onTap", ge);
    }
  }, {
    key: __handleSwipeGesture__,
    value: function (ge) {
      var _ge$gesture = ge.gesture;
      var deltaX = _ge$gesture.deltaX;
      var absX = _ge$gesture.absX;
      var deltaY = _ge$gesture.deltaY;
      var absY = _ge$gesture.absY;

      var direction = absX > absY ? deltaX < 0 ? "Right" : "Left" : deltaY < 0 ? "Up" : "Down";

      this.setState({ swiping: true });

      ge.gesture.isFlick = ge.gesture.velocity > this.props.flickThreshold;
      ge.type = "swipe" + direction.toLowerCase();
      this[__emitEvent__]("onSwipe" + direction, ge);
      ge.preventDefault();
    }
  }, {
    key: "render",
    value: function render() {
      return React.cloneElement(React.Children.only(this.props.children), {
        onTouchStart: this.handleTouchStart.bind(this),
        onTouchMove: this.handleTouchMove.bind(this),
        onTouchCancel: this.handleTouchCancel.bind(this),
        onTouchEnd: this.handleTouchEnd.bind(this)
      });
    }
  }]);

  return Gestures;
})(React.Component);

Gestures.propTypes = {
  onSwipeUp: React.PropTypes.func,
  onSwipeDown: React.PropTypes.func,
  onSwipeLeft: React.PropTypes.func,
  onSwipeRight: React.PropTypes.func,
  flickThreshold: React.PropTypes.number,
  swipeThreshold: React.PropTypes.number
};

Gestures.defaultProps = {
  flickThreshold: 0.6,
  delta: 10
};

module.exports = Gestures;