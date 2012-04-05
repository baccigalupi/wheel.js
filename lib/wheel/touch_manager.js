Wheel.TouchManager = Wheel.View.subclass({
  initializeDom: function(opts) {
    this.optionize(opts);
    this.$ = $(document);
  },

  listen: function() {
    var self = this;
    this.touch = {};

    this.$.bind('touchstart', function(e) {
      self.onTouchstart(e);
    }).bind('touchmove', function(e) {
      console.log('touchmove happened on document');
      self.onTouchmove(e);
    }).bind('touchend', function(e) {
      console.log('touchend happened on document');
      self.onTouchend(e);
    });
  },

  clearTimeout: function() {
    this.touchTimeout && clearTimeout(this.touchTimeout);
  },

  onTouchstart: function(e) {
    e = e.originalEvent || e;
    this.target = $(e.target);

    var now = Date.now(),
        delta = now - (this.touch.last || now);

    // clear existing timeout because there is a new touch start event
    // timeouts are set for 'touchhold' and for 'tap'
    this.clearTimeout();

    // set up the touch object
    this.touch.x1 = e.touches[0].pageX;
    this.touch.y1 = e.touches[0].pageY;
    this.touch.last = now;

    // what about checking for distance from original tap
    if (delta > 0 && delta <= this.DOUBLE_DELAY) {
      console.log('touch is double tap');
      this.touch.isDoubleTap = true;
      return; // don't bother listening for a touchhold
    }

    var self = this;
    // wait to see if this is a touchhold event
    this.touchTimout = setTimeout(function() {
      self.testTouchhold(e);
    }, this.HOLD_DELAY);
  },

  onTouchmove: function(e) {
    e = e.originalEvent || e;
    this.touch.x2 = e.touches[0].pageX;
    this.touch.y2 = e.touches[0].pageY;

    // if we have moved a certain distance, call it a swipe
    var eventOpts = {
          originalEvent: e,
          pageX: this.touch.x2,
          pageY: this.touch.y2
        };
    if (Math.abs(this.touch.x1 - this.touch.x2) >= this.SWIPE_TOLERANCE ||
        Math.abs(this.touch.y1 - this.touch.y2) > this.SWIPE_TOLERANCE) {
      this.target.trigger($.Event('swipe', eventOpts));
      this.target.trigger($.Event("swipe" +
         this._direction(this.touch.x1, this.touch.x2, this.touch.y1, this.touch.y2), eventOpts));
      this.touch.isSwipe = true;
    }
  },

  onTouchend: function(e) {
    var eventOpts = {
      originalEvent: e,
      pageY: e.pageY,
      pageX: e.pageX
    };

    e = e.originalEvent || e;
    if (this.touch.isDoubleTap) {
      this.target.trigger($.Event('doubleTap', eventOpts));
      console.log('is doubleTab');
      this.touch = {};
    } else if (this.touch.isSwipe || this.touch.isHold ) {
      console.log('is swipe or hold, clearing the touch');
      this.touch = {};
    } else if (this.touch.last) {
      if(this.delayForTap) {
        var self = this;
        this.touchTimeout = setTimeout(function(){
          touchTimeout = null;
          self.target.trigger($.Event('tap', eventOpts));
          self.touch = {};
        }, this.DOUBLE_DELAY);
      } else {
        this.touch.isTap = true;
        this.target.trigger($.Event('tap', eventOpts));
      }
    }
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

  testTouchhold: function(e) {
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
        pageX: x2,
        pageY: y2,
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


