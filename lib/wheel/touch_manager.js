Wheel.TouchManager = Wheel.View.subclass({
  // view delegation ... extract into a subclass ??
  initializeDom: function(viewInstance, opts) {
    this.optionize(opts);
    this.base = viewInstance;
    this.$ = this.base.$;
    this._class.listen(); //
  }
}, {
  listen: function() {
    if (this.isListening()) { return; }
    this.$body = $('body');
    //
    // call methods for listening
    // single finger gestures only:
    // swipe, touchhold, tap, doubletap
    //
    this._isListening = true;
  },

  isListening: function() {
    return this._isListening || (this.superclass.isListening && this.superclass.isListening());
  },

  listenOnBody: function() {
    var self = this;
    this.touch = {};

    this.$body.bind('touchstart', function(e) {
      e = e.originalEvent || e;
      var now = Date.now(),
          delta = now - (self.touch.last || now);
      // clear existing timeout because there is a new touch start event
      self.touchTimeout && clearTimeout(self.touchTimeout);

      // set up the touch object
      self.touch.target = self._targetNode(e.touches[0].target);
      self.touch.x1 = e.touches[0].pageX;
      self.touch.y1 = e.touches[0].pageY;
      self.touch.last = now;

      if (delta > 0 && delta <= self.DOUBLE_DELAY) {
        self.touch.isDoubleTap = true;
        return; // don't bother listening for a touchhold
      }

      // wait to see if this is a touchhold event
      self.touchTimout = setTimeout(function(e) {
        self._testForTouchHold(e);
      }, self.HOLD_DELAY);
    });
  },

  _targetNode: function(node) {
    // if it is text, return parent, otherwise the node
    return 'tagName' in node ? node : node.parentNode;
  },

  _direction: function(x1,x2, y1,y2) {
    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
    if (xDelta >= yDelta) {
      return (x1 - x2 > 0 ? 'Left' : 'Right');
    } else {
      return (y1 - y2 > 0 ? 'Up' : 'Down');
    }
  },

  _testForTouchHold: function(e) {
    var self = this;
    if ((this.touch.last && (Date.now() - this.touch.last >= this.HOLD_DELAY)) //&&
        /* (touches are within tolerante) */ ) {
      var newEvent = $.Event('touchhold', {
        pageX: e.pageX,
        pageY: e.pageY,
        stopPropogation: function() { e.originalEvent.stopPropogation() },
        preventDefault: function() { e.originalEvent.preventDefault() }
      });
      $(touch.target).trigger();
      this.touch = {};
    }
  },

  HOLD_DELAY: 750,
  DOUBLE_DELAY: 250,
  HOLD_TOLERANCE: 10
});

//(function($){
  //var touch = {}, touchTimeout;

  //function parentIfText(node){
    //return 'tagName' in node ? node : node.parentNode;
  //}

  //function swipeDirection(x1, x2, y1, y2){
    //var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
    //if (xDelta >= yDelta) {
      //return (x1 - x2 > 0 ? 'Left' : 'Right');
    //} else {
      //return (y1 - y2 > 0 ? 'Up' : 'Down');
    //}
  //}

  // stil touching after delay, movement within tolerance (10px)
  //var longTapDelay = 750;
  //function longTap(){
    //if (touch.last && (Date.now() - touch.last >= longTapDelay)) {
      //$(touch.target).trigger('longTap');
      //touch = {};
    //}
  //}

  //$(document).ready(function(){
    //$(document.body).bind('touchstart', function(e){
      //var now = Date.now(), delta = now - (touch.last || now);
      //touch.target = parentIfText(e.touches[0].target);
      //touchTimeout && clearTimeout(touchTimeout);
      //touch.x1 = e.touches[0].pageX;
      //touch.y1 = e.touches[0].pageY;
      //if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
      //touch.last = now;
      //setTimeout(longTap, longTapDelay);
    //}).bind('touchmove', function(e){
      //touch.x2 = e.touches[0].pageX;
      //touch.y2 = e.touches[0].pageY;
    //}).bind('touchend', function(e){
      //if (touch.isDoubleTap) {
        //$(touch.target).trigger('doubleTap');
        //touch = {};
      //} else if (touch.x2 > 0 || touch.y2 > 0) {
        //(Math.abs(touch.x1 - touch.x2) > 30 || Math.abs(touch.y1 - touch.y2) > 30)  &&
          //$(touch.target).trigger('swipe') &&
          //$(touch.target).trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
        //touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0;
      //} else if ('last' in touch) {
        //touchTimeout = setTimeout(function(){
          //touchTimeout = null;
          //$(touch.target).trigger('tap')
          //touch = {};
        //}, 250);
      //}
    //}).bind('touchcancel', function(){ touch = {} });
  //});

  //['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'longTap'].forEach(function(m){
    //$.fn[m] = function(callback){ return this.bind(m, callback) }
  //});
//})(Zepto);


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
