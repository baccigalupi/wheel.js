Wheel.MouseManager = Wheel.TouchManager.subclass({
  listen: function() {
    var self = this;
    this.touch = {};

    var onMove = function(e) {
      self.onMove(e);
    };

    // only listen for touchmove when a mousedown event
    // has occurred
    this.$.bind('mousedown', function(e) {
      self.onStart(e);
      self.$.bind('mousemove', onMove);
    });

    this.$.bind('mouseup', function(e) {
      self.onEnd(e);
      self.$.unbind('mousemove', onMove);
    });
  },

  // Mouse events already have a pageX and pageY
  normalizeEvent: function(e) {
    return e;
  }
});


