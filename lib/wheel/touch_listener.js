Wheel.TouchListener = Wheel.View.subclass({
  initializeDom: function(opts) {
    this.optionize(opts);
    this.$ = $(document.body);
  },

  listen: function() {
    console.log('listening in the BodyListener');
    this.touch = {};
    this.listenForTouchStart();
    this.listenForTouchMove();
    this.listenForTouchEnd();
  },

  clearTimeout: function() {
    this.touchTimeout && clearTimeout(this.touchTimeout);
  },

  listenForTouchStart: function() {
    var self = this;
    this.$.bind('touchstart', function(e) {
      console.log('touch start');
      e = e.originalEvent || e;
      self.target = $(e.target);

      var now = Date.now(),
          delta = now - (self.touch.last || now);

      // clear existing timeout because there is a new touch start event
      // timeouts are set for 'touchhold' and for 'tap'
      self.clearTimeout();

      // set up the touch object
      self.touch.x1 = e.touches[0].pageX;
      self.touch.y1 = e.touches[0].pageY;
      self.touch.last = now;

      // what about checking for distance from original tap
      if (delta > 0 && delta <= self.DOUBLE_DELAY) {
        console.log('touch is double tap');
        self.touch.isDoubleTap = true;
        return; // don't bother listening for a touchhold
      }

      // wait to see if this is a touchhold event
      self.touchTimout = setTimeout(function() {
        self._testForTouchHold(e);
      }, self.HOLD_DELAY);
    });
  },

  listenForTouchMove: function() {
    var self = this;
    this.$.bind('touchmove', function(e) {
      e = e.originalEvent || e;
      self.touch.x2 = e.touches[0].pageX;
      self.touch.y2 = e.touches[0].pageY;

      // if we have moved a certain distance, call it a swipe
      var eventOpts = {
            originalEvent: e,
            pageX: self.touch.x2,
            pageY: self.touch.y2
          };
      if (Math.abs(self.touch.x1 - self.touch.x2) >= this.SWIPE_TOLERANCE ||
          Math.abs(self.touch.y1 - self.touch.y2) > this.SWIPE_TOLERANCE) {
        self.target.trigger($.Event('swipe', eventOpts));
        self.target.trigger($.Event("swipe" +
           self._direction(self.touch.x1, self.touch.x2, self.touch.y1, self.touch.y2), eventOpts));
        self.touch.isSwipe = true;
      }
    });
  },

  listenForTouchEnd: function () {
    var self = this;
    this.$.bind('touchend', function(e) {
      var eventOpts = {
        originalEvent: e,
        pageY: e.pageY,
        pageX: e.pageX
      };

      e = e.originalEvent || e;
      if (self.touch.isDoubleTap) {
        self.target.trigger($.Event('doubleTap', eventOpts));
        console.log('is doubleTab');
        self.touch = {};
      } else if (self.touch.isSwipe || self.touch.isHold ) {
        console.log('is swipe or hold, clearing the touch');
        self.touch = {};
      } else if (self.touch.last) {
        if(self.delayForTap) {
          self.touchTimeout = setTimeout(function(){
            touchTimeout = null;
            self.target.trigger($.Event('tap', eventOpts));
            self.touch = {};
          }, self.DOUBLE_DELAY);
        } else {
          self.touch.isTap = true;
          self.target.trigger($.Event('tap', eventOpts));
        }
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
    var x1 = this.touch.x1,
        y1 = this.touch.y1,
        x2 = this.touch.x2 || x1,
        y2 = this.touch.y2 || y1;

    if ((this.touch.last && (Date.now() - this.touch.last >= this.HOLD_DELAY)) &&
        (Math.abs(x1 - x2) <= this.HOLD_TOLERANCE) &&
        (Math.abs(y1 - y2) <= this.HOLD_TOLERANCE)) {
      this.touch.isHold = true;
      this.target.trigger($.Event('touchhold', {
        originalEvent: e,
        pageX: e.pageX,
        pageY: e.pageY,
      }));
    }
  },

  HOLD_DELAY: 750,
  DOUBLE_DELAY: 250,
  HOLD_TOLERANCE: 10,
  SWIPE_TOLERANCE: 100,
  preventYScroll: false,
  preventXScroll: false,
  delayForTap: true
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


