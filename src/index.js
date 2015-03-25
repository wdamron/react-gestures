
import React from 'react';

const __handleSwipeGesture__ = Symbol('handleSwipeGesture');
const __handleTapGesture__ = Symbol('handleTapGesture');
const __emitEvent__ = Symbol('emitEvent');

class Gestures extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: null,
      y: null,
      swiping: false,
      start: 0
    };
  }

  resetState() {
    this.setState({x: null, y: null, swiping: false, start: 0 });
  }

  [__emitEvent__](name, e) {
    if (this.props[name]) {
      this.props[name](e);
    }
  }

  getGestureDetails(e) {
    let { clientX, clientY } = e.changedTouches[0];
    let deltaX = this.state.x - clientX;
    let deltaY = this.state.y - clientY;
    let absX = Math.abs(deltaX);
    let absY = Math.abs(deltaY);
    let duration = Date.now() - this.state.start;
    let velocity = Math.sqrt(absX * absX + absY * absY) / duration;
    let done = e.type === 'touchend';
    e.gesture = { deltaX, deltaY, absX, absY, velocity, duration, done };
    return e;
  }

  handleTouchStart(e) {
    this[__emitEvent__]('onTouchStart', e);

    this.setState({
      start: Date.now(),
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      swiping: false
    });
  }

  handleTouchMove(e) {
    let ge = this.getGestureDetails(e);
    this[__emitEvent__]('onTouchMove', ge);

    if (ge.gesture.absX > this.props.swipeThreshold && ge.gesture.absY > this.props.swipeThreshold) {
      this[__handleSwipeGesture__](ge);
      return;
    }
  }

  handleTouchCancel(e) {
    this[__emitEvent__]('onTouchCancel', e);
    this.resetState();
  }

  handleTouchEnd(e) {
    let ge = this.getGestureDetails(e);
    this[__emitEvent__]('onTouchEnd', ge);

    if (this.state.swiping) {
      this[__handleSwipeGesture__](ge);
      return this.resetState();
    }
    if (ge.gesture.duration > 0 ) {
      this[__handleTapGesture__]('onTap', ge);
    }
    this.resetState();
  }

  [__handleTapGesture__](ge) {
    ge.type = 'tap';
    this[__emitEvent__]('onTap', ge);
  }

  [__handleSwipeGesture__](ge) {
    let { deltaX, absX, deltaY, absY } = ge.gesture;
    let direction = (absX > absY)
      ? deltaX < 0 ? 'Right' : 'Left'
      : deltaY < 0 ? 'Up' : 'Down';

      this.setState({ swiping: true });

      ge.gesture.isFlick = ge.gesture.velocity > this.props.flickThreshold;
      ge.type = `swipe${direction.toLowerCase()}`;
      this[__emitEvent__](`onSwipe${direction}`, ge);
      ge.preventDefault();
  }

  render() {
    return React.cloneElement(React.Children.only(this.props.children), {
      onTouchStart: this.handleTouchStart.bind(this),
      onTouchMove: this.handleTouchMove.bind(this),
      onTouchCancel: this.handleTouchCancel.bind(this),
      onTouchEnd: this.handleTouchEnd.bind(this)
    });
  }
}

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
  swipeThreshold: 10
};

export default Gestures;

