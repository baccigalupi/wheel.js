/*
 * This was extracted from Zepto.js and modified to be more object oriented
 * and extendable to mouse events.
 *
 */
Wheel.TouchManager = Wheel.EventManager.subclass({
  listen: function() {
    var self = this;
    this.touch = {};

    this.$
      .on('touchstart', function(e) {
        self.onStart(e);
      })
      .on('touchmove', function(e) {
        self.onMove(e);
      })
      .on('touchend', function(e) {
        self.onEnd(e);
      });
  },

  normalizeEvent: function(e) {
    e = e.originalEvent || e;
    e.pageX = e.touches[0].pageX;
    e.pageY = e.touches[0].pageY;
    return e;
  }
});

