/*
 * This was extracted from Zepto.js and modified to be more object oriented
 * and extendable to mouse events.
 *
 */
Wheel.EventManager = Wheel.View.subclass({
  initializeDom: function(opts) {
    this.optionize(opts);
    this.$ = $(document);
  },

  listen: function() {
    var self = this;
    this.$.on('dragstart', function(e) {
      self.onDragMove(e);
    });
  },

  onDragMove: function(e) {
    var $target = $(event.target);
    $target.on(self._class.dragMover, function(e) {
      var e = self.normalizeEv
      var dragMove = $.Event('dragmove', {});
      $target.trigger(dragMove)
    });
  },

  clearTimeout: function() {
    this.touchTimeout && clearTimeout(this.touchTimeout);
  },

  onStart: function(e) {
    e = this._normalizeEvent(e);
    var node = e.target
    this.target = $('tagName' in node ? node : node.parentNode);

    var now = Date.now(),
        delta = now - (this.touch.last || now);

    // clear existing timeout because there is a new touch start event
    // timeouts are set for 'taphold' and for 'tap'
    this.clearTimeout();

    // set up the touch object
    this.touch.x1 = e.pageX;
    this.touch.y1 = e.pageY;
    this.touch.last = now;

    // what about checking for distance from original tap
    if (delta > 0 && delta <= this.DOUBLE_DELAY) {
      this.touch.type = 'doubletap';
      this.triggerEvent(e);
      return; // don't bother listening for a taphold
    }

    var self = this;
    // wait to see if this is a taphold event
    this.touchTimout = setTimeout(function() {
      self._testTouchhold(e);
    }, this.HOLD_DELAY);
  },

  onMove: function(e) {
    e = this._unpackEvent(e);
    this._testSwipe(e);
  },

  onEnd: function(e) {
    e = this._unpackEvent(e);

    if ( this.touch.type && this.touch.type.match(/doubletap|taphold|swipe|pinch|zoom/) ) {
      // event triggered during other events, we only need to clear the touches
      this.touch = {};
    } else if (this.touch.last) {
      this._handleTap(e);
    }
  },

  triggerEvent: function(originalEvent, altType) {
    var x = 'x2' in this.touch ? this.touch.x2 : this.touch.x1;
    var y = 'y2' in this.touch ? this.touch.y2 : this.touch.y1;

    this.target.trigger($.Event(altType || this.touch.type, {
      originalEvent: originalEvent,
      pageX: x,
      pageY: y
    }));
  },

  _normalizeEvent: function(e) {
    return e;
  },

  _unpackEvent: function(e) {
    e = this._normalizeEvent(e);

    this.touch.x2 = e.pageX;
    this.touch.y2 = e.pageY;

    return e;
  },

  _handleTap: function(e) {
    if (this.RESPONSIVE_TAP) {
      this.triggerEvent(e, 'tap');
    } else {
      // wait to see if it is a tap, or if it is a double tap
      var self = this;
      this.touchTimeout = setTimeout(function(){
        self._waitForTap(e);
      }, this.DOUBLE_DELAY);
    }
  },

  _waitForTap: function(e) {
    // this only gets called if another startEvent
    // event doesn't clear the timeout
    this.touchTimeout = null;
    this.touch.type = 'tap';
    this.triggerEvent(e);
    this.touch = {};
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
      this.triggerEvent(e);
      this.triggerEvent(e, "swipe" + _direction);
    }
  },

  _testTouchhold: function(e) {
    var x1 = this.touch.x1,
        y1 = this.touch.y1,
        x2 = 'x2' in this.touch ? this.touch.x2 : x1,
        y2 = 'y2' in this.touch ? this.touch.y2 : y1;

    if ((this.touch.last && (Date.now() - this.touch.last >= this.HOLD_DELAY)) &&
        (Math.abs(x1 - x2) <= this.HOLD_TOLERANCE) &&
        (Math.abs(y1 - y2) <= this.HOLD_TOLERANCE)) {
      this.touch.type = 'taphold';
      this.triggerEvent(e);
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
  SWIPE_TOLERANCE: 100,
  RESPONSIVE_TAP: false,
  GESTURE_TOLERANCE: 20
});
