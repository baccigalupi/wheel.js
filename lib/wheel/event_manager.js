/*
 * This was extracted from Zepto.js and modified to be more object oriented
 * and customizable
 */
Wheel.EventManager = Wheel.View.subclass({
  init: function() {
    this.touch = ('ontouchstart' in window) ||
      window.DocumentTouch && document instanceof DocumentTouch;
    this.setEventTypes();
  },

  setEventTypes: function() {
    if ( this.touch ) {
      this.startEvent = 'touchstart';
      this.moveEvent  = 'touchmove';
      this.endEvent   = 'touchend';
    } else {
      this.startEvent = 'mousedown';
      this.moveEvent =  'mousemove';
      this.endEvent =   'mouseup';
    }
  },

  initializeDom: function(opts) {
    this.optionize(opts);
    this.$ = $(document);
  },

  listen: function() {
    var self = this;
    this.touch = {};

    this.$.bind(this.startEvent, function(e) {
      self.onStart(e);
    }).bind(this.moveEvent, function(e) {
      self.onMove(e);
    }).bind(this.endEvent, function(e) {
      self.onEnd(e);
    });
  },

  clearTimeout: function() {
    this.touchTimeout && clearTimeout(this.touchTimeout);
  },

  onStart: function(e) {
    e = e.originalEvent || e;
    var node = e.target
    this.target = $('tagName' in node ? node : node.parentNode);

    var now = Date.now(),
        delta = now - (this.touch.last || now);

    // clear existing timeout because there is a new touch start event
    // timeouts are set for 'taphold' and for 'tap'
    this.clearTimeout();

    // set up the touch object
    this.touch.x1 = e.touches[0].pageX;
    this.touch.y1 = e.touches[0].pageY;
    this.touch.last = now;

    // what about checking for distance from original tap
    if (delta > 0 && delta <= this.DOUBLE_DELAY) {
      this.touch.type = 'doubletap';
      return; // don't bother listening for a taphold
    }

    var self = this;
    // wait to see if this is a taphold event
    this.touchTimout = setTimeout(function() {
      self.testTouchhold(e);
    }, this.HOLD_DELAY);
  },

  onMove: function(e) {
    e = e.originalEvent || e;
    this.touch.x2 = e.touches[0].pageX;
    this.touch.y2 = e.touches[0].pageY;

    // if we have moved a certain distance, call it a swipe
    if (Math.abs(this.touch.x1 - this.touch.x2) <= this.SWIPE_TOLERANCE ||
        Math.abs(this.touch.y1 - this.touch.y2) <= this.SWIPE_TOLERANCE) {
      this.touch.type = 'swipe';
      var direction = this.direction(this.touch.x1, this.touch.x2, this.touch.y1, this.touch.y2);
      if ( this._preventScroll() ) {
        e.preventDefault();
      }
      this.triggerTouch(e);
      this.triggerTouch(e, "swipe" + direction);
    }
  },

  _preventScroll: function() {
    return false;
  },

  onEnd: function(e) {
    e = e.originalEvent || e;
    this.touch.x2 = e.touches[0].pageX;
    this.touch.y2 = e.touches[0].pageY;

    if (this.touch.type == 'doubletap') {
      this.triggerTouch(e)
      this.touch = {};
    } else if (this.touch.type == 'swipe' || this.touch.type == 'taphold' ) {
      // events have already been triggered, so we just need to clear the touch
      this.touch = {};
    } else if (this.touch.last) {
      if( this.RESPONSIVE_TAP ) {
        this.triggerTouch(e, 'tap');
      } else {
        // wait to see if it is a tap, or if it is a double tap
        var self = this;
        this.touchTimeout = setTimeout(function(){
          self.waitForTap(e);
        }, this.DOUBLE_DELAY);
      }
    }
  },

  waitForTap: function(e) {
    // this only gets called if another startEvent
    // event doesn't clear the timeout
    this.touchTimeout = null;
    this.touch.type = 'tap';
    this.triggerTouch(e);
    this.touch = {};
  },

  testTouchhold: function(e) {
    var x1 = this.touch.x1,
        y1 = this.touch.y1,
        x2 = 'x2' in this.touch ? this.touch.x2 : x1,
        y2 = 'y2' in this.touch ? this.touch.y2 : y1;

    if ((this.touch.last && (Date.now() - this.touch.last >= this.HOLD_DELAY)) &&
        (Math.abs(x1 - x2) <= this.HOLD_TOLERANCE) &&
        (Math.abs(y1 - y2) <= this.HOLD_TOLERANCE)) {
      this.touch.type = 'taphold';
      this.triggerTouch(e);
    }
  },


  triggerTouch: function(originalEvent, altType) {
    var x = 'x2' in this.touch ? this.touch.x2 : this.touch.x1;
    var y = 'y2' in this.touch ? this.touch.y2 : this.touch.y1;

    this.target.trigger($.Event(altType || this.touch.type, {
      originalEvent: originalEvent,
      pageX: x,
      pageY: y
    }));
  },

  direction: function(x1,x2, y1,y2) {
    var xDelta = Math.abs(x1 - x2),
        yDelta = Math.abs(y1 - y2);
    if (xDelta >= yDelta) {
      return (x1 - x2 > 0 ? 'left' : 'right');
    } else {
      return (y1 - y2 > 0 ? 'up' : 'down');
    }
  },

  // easy customizations
  HOLD_DELAY: 750,
  DOUBLE_DELAY: 250,
  HOLD_TOLERANCE: 10,
  SWIPE_TOLERANCE: 100,
  RESPONSIVE_TAP: false
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


