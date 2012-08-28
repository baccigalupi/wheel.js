Wheel.View.subclass('Wheel.EventManager', {
  initializeDom: function(opts) {
    this.optionize(opts);
    this.$ = $(document);
  },

  listen: function() {
    var self = this;
    this.$.on('pullinit', function(e) {
      self.onPullInit(e);
    });
  },

  onPullInit: function(e) {
    e.preventDefault();
    this._setTarget(e);
    this.touch.type = 'pull';
    e = this._unpackEvent(e);
		this._triggerEvent(e, 'pullstart');
  },

  onStart: function(e) {
    this.touch.ctrl = e.ctrlKey;
    e = this._normalizeEvent(e);
    this._setTarget(e);

    // this is the normalized start event
    this._triggerEvent(e, 'tapstart');

    // clear existing timeout because there is a new touch start event
    // timeouts are set for 'taphold' and/or for 'tap'
    this._clearTimeout();

    // set up the touch object
    this.touch.x1 = e.pageX;
    this.touch.y1 = e.pageY;
    this.touch.time = Date.now();

    if (!this._testDoubleTap() && !this.touch.ctrl) {
      // wait to see if this is a taphold event
      var self = this;
      this.touchTimout = setTimeout(function() {
        self._testTouchhold(e);
      }, this.HOLD_DELAY);
    }
  },

  onMove: function(e) {
    this._handlePullMove(e);
    if (this.touch.type) { return; }
    e = this._unpackEvent(e);
    this._testSwipe(e);
  },

  onEnd: function(e) {
    e = this._unpackEvent(e);
    this._triggerEvent(e, 'tapend');
    this._handlePullEnd(e);
    if (this.touch.type || this.touch.ctrl) {
      this._resetTouch();
    } else {
      this._handleTap(e);
    }
  },

  _triggerEvent: function(originalEvent, altType, eventOpts) {
    if (!this.target) { return; }
    eventOpts = eventOpts || {};
    eventOpts.pageX = 'x2' in this.touch ? this.touch.x2 : this.touch.x1;
    eventOpts.pageY = 'y2' in this.touch ? this.touch.y2 : this.touch.y1;
    eventOpts.originalEvent = originalEvent;

    this.target.trigger($.Event(altType || this.touch.type, eventOpts));
  },

  _setTarget: function(e) {
    var node = e.target;
    this.target = $('tagName' in node ? node : node.parentNode);
  },

  _clearTimeout: function() {
    this.touchTimeout && clearTimeout(this.touchTimeout);
  },

  _resetTouch: function() {
    this.lastTouch = this.touch;
    this.lastTouch.target = this.target;
    this.target = null;
    this.touch = {};
  },

  _normalizeEvent: function(e) {
    return e;
  },

  _unpackEvent: function(e) {
    e = this._normalizeEvent(e);

    if (e.type !== 'touchend') {
      this.touch.x2 = e.pageX >= 0 ? e.pageX : this.touch.x1;
      this.touch.y2 = e.pageY >= 0 ? e.pageY : this.touch.y1;
    }

    return e;
  },

  _handleTap: function(e) {
    if (this.RESPONSIVE_TAP) {
      this._onTap(e);
    } else {
      // wait to see if it is a tap, or if it is a double tap
      var self = this;
      this.touchTimeout = setTimeout(function(){
        self._onTap(e);
      }, this.DOUBLE_DELAY);
    }
  },

  _handlePullMove: function(e) {
    if (this.touch.type && this.touch.type === 'pull') {
      e.preventDefault();
      e = this._unpackEvent(e);
      this._triggerEvent(e, 'pullmove', this._eventDetails());
    }
  },

  _eventDetails: function() {
    var deltaX = this.touch.x2 - this.touch.x1;
    var deltaY = this.touch.y2 - this.touch.y1;
    var deltaTime = Date.now() - this.touch.time;
    var distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    return {
      deltaX: deltaX,
      deltaY: deltaY,
      deltaTime: deltaTime,
      distance: distance,
      velocity: distance/deltaTime,
      angle: Math.atan2(deltaY,deltaX)
    };
  },

  _handlePullEnd: function(e) {
    if (this.touch.type && this.touch.type === 'pull') {
      e = this._unpackEvent(e);
      this._triggerEvent(e, 'pullend');
    }
  },

  _onTap: function(e) {
    this.touchTimeout = null;
    if ( this.target && e.target === this.target[0] &&
          this.TAP_TOLERANCE >= Math.abs(this.touch.x1 - this.touch.x2) &&
          this.TAP_TOLERANCE >= Math.abs(this.touch.y1 - this.touch.y2) ) {
      this.touch.type = 'tap';
      this._triggerEvent(e);
    }
    this._resetTouch();
  },

  _testDoubleTap: function(e) {
    // what about checking for distance from original tap
    var delta = this.lastTouch && this.lastTouch.time ? this.touch.time - this.lastTouch.time : 0;
    if (delta > 0 && delta <= this.DOUBLE_DELAY) {
      this.touch.type = 'doubletap';
      this._triggerEvent(e);
      return true;
    }
  },

  _testSwipe: function(e) {
    // if we have moved a certain distance, call it a swipe
    if (Math.abs(this.touch.x1 - this.touch.x2) >= this.SWIPE_TOLERANCE ||
        Math.abs(this.touch.y1 - this.touch.y2) >= this.SWIPE_TOLERANCE) {
      this.touch.type = 'swipe';
      var _direction = this._direction(this.touch.x1, this.touch.x2, this.touch.y1, this.touch.y2);
      if ( this.preventScroll(_direction) ) {
        e.preventDefault();
      }
      this._triggerEvent(e, "swipe", this._eventDetails());
      this._triggerEvent(e, "swipe" + _direction);
    }
  },

  _testTouchhold: function(e) {
    if (this.touch.type) { return; }
    var x1 = this.touch.x1,
        y1 = this.touch.y1;
        x2 = ('x2' in this.touch) ? this.touch.x2 : x1;
        y2 = ('y2' in this.touch) ? this.touch.y2 : y1;

    if ((this.touch.time && (Date.now() - this.touch.time >= this.HOLD_DELAY)) &&
        (Math.abs(x1 - x2) <= this.HOLD_TOLERANCE) &&
        (Math.abs(y1 - y2) <= this.HOLD_TOLERANCE)) {
      this.touch.type = 'taphold';
      this._triggerEvent(e);
    }
  },

  _direction: function(x1,x2, y1,y2) {
    var xDelta = Math.abs(x1 - x2),
        yDelta = Math.abs(y1 - y2);
    if (xDelta >= yDelta) {
      return (x1 - x2 > 0 ? 'left' : 'right');
    } else {
      return (y1 - y2 > 0 ? 'up' : 'down');
    }
  },

  // customizations
  preventScroll: function() { return false; },
  HOLD_DELAY: 750,
  DOUBLE_DELAY: 250,
  HOLD_TOLERANCE: 10,
  SWIPE_TOLERANCE: 60,
  TAP_TOLERANCE: 10,
  RESPONSIVE_TAP: true,
  GESTURE_TOLERANCE: 20
});
