Wheel.MouseManager = Wheel.TouchManager.subclass({
  init: function() {
    this.startEvent = 'mousedown';
    this.moveEvent =  'mousemove';
    this.endEvent =   'mouseup';
  },

  // Mouse events already have a pageX and pageY
  normalizeEvent: function() {},

  // Only respond to mousemove if there is already a touch
  // in play.
  ignoreMove: function(e) {
    return ('x1' in this.touch) ? false : true;
  }
});


