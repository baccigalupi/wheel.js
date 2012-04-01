Wheel.BodyListener = Wheel.View.subclass({
  initializeDom: function() {
    this.$ = $(document.body);
  },

  listen: function() {
    self.touch = {};
    this.listenForTouchStart();
    this.listenForTouchMove();
    this.listenForTouchEnd();
  },

  listenForTouchStart: function() {
    var self = this;
    this.$.bind('touchstart', function(e) {
      e = e.originalEvent || e;
      self.target = $(e.target);

      var now = Date.now(),
          delta = now - (self.touch.last || now);

      // clear existing timeout because there is a new touch start event
      // timeouts are set for 'touchhold' and for 'tap'
      self.touchTimeout && clearTimeout(self.touchTimeout);

      // set up the touch object
      self.touch.x1 = e.touches[0].pageX;
      self.touch.y1 = e.touches[0].pageY;
      self.touch.last = now;

      // what about checking for distance from original tap
      if (delta > 0 && delta <= self._class.DOUBLE_DELAY) {
        self.touch.isDoubleTap = true;
        return; // don't bother listening for a touchhold
      }

      // wait to see if this is a touchhold event
      self.touchTimout = setTimeout(function(e) {
        self._testForTouchHold(e);
      }, self._class.HOLD_DELAY);
    });
  },

  listenForTouchMove: function() {
    var self = this;
    this.$.bind('touchmove', function(e) {
      e = e.originalEvent || e;
      touch.x2 = e.touches[0].pageX;
      touch.y2 = e.touches[0].pageY;

      // if we have moved a certain distance, call it a swipe
      var eventOpts = {
            originalEvent: e,
            pageX: touch.x2,
            pageY: touch.y2
          };
      if (Math.abs(touch.x1 - touch.x2) >= this._class.SWIPE_TOLERANCE ||
          Math.abs(touch.y1 - touch.y2) > this._class.SWIPE_TOLERANCE) {
        self.target.trigger($.Event('swipe', eventOpts));
        self.target.trigger($.Event("swipe" + self._direction(touch.x1, touch.x2, touch.y1, touch.y2), eventOpts));
        touch.isSwipe = true;
      }
    });
  },

  listenForTouchEnd: function () {
    var self = this,
        eventOpts = {
          originalEvent: e,
          pageY: e.pageY,
          pageX: e.pageX
        };
    this.$.bind('touchend', function(e) {
      e = e.originalEvent || e;
      if (self.touch.isDoubleTap) {
        self.target.trigger($.Event('doubleTap', eventOpts));
        self.touch = {};
      } else if (touch.isSwipe) {
        self.touch = {};
      } else if (touch.last) {
        self.touchTimeout = setTimeout(function(){
          touchTimeout = null;
          self.target.trigger($.Event('tap', eventOpts));
          self.touch = {};
        }, self._class.DOUBLE_DELAY);
      }
    });
  },

  _targetNode: function(node) {
    // if it is text, return parent, otherwise the node
    return 'tagName' in node ? node : node.parentNode;
  },

  _direction: function(x1,x2, y1,y2) {
    var xDelta = Math.abs(x1 - x2),
        yDelta = Math.abs(y1 - y2);
    if (xDelta >= yDelta) {
      return (x1 - x2 > 0 ? 'Left' : 'Right');
    } else {
      return (y1 - y2 > 0 ? 'Up' : 'Down');
    }
  },

  _testForTouchHold: function(e) {
    if ((this.touch.last && (Date.now() - this.touch.last >= this._class.HOLD_DELAY)) &&
        (Math.abs(this.touch.x1 - this.touch.x2) >= this._class.HOLD_TOLERANCE) &&
        (Math.abs(this.touch.y1 - this.touch.y2) >= this._class.HOLD_TOLERANCE) ) {
      this.target.trigger($.Event('touchhold', {
        originalEvent: e,
        pageX: e.pageX,
        pageY: e.pageY,
      }));
      this.touch = {};
    }
  }
}, {
  HOLD_DELAY: 750,
  DOUBLE_DELAY: 250,
  HOLD_TOLERANCE: 10,
  SWIPE_TOLERANCE: 100,
  preventYScroll: false,
  preventXScroll: false
});

/* Default ios gestures
 * http://developer.apple.com/library/ios/#DOCUMENTATION/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html
 *
 * ONE FINGER EVENTS
 * 1) Single finger 'swipe' or 'panning': 'onscroll'
 * 2) Touch hold: default information bubble with no event fired
 * 3) Double tap: default zoom, no events
 * 4) Tap: fires 'click' event
 *
 * TWO FINGER EVENTS
 * 1) Pinch: default pinch zoom, with no event
 * 2) Two Finder 'swipe'/'pan': 'onscroll'
 *
 * Gesture events happen with multi-touch gestures, but are not supported by all browsers
 * event has
 *  - rotation
 *  - scale
 */


