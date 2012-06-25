Wheel.MouseManager = Wheel.EventManager.subclass({
  listen: function() {
    this._super();
    var self = this;
    this.touch = {};

    var onMove = function(e) {
      self.onMove(e);
    };

    // only listen for touchmove when a mousedown event
    // has occurred
    this.$.on('mousedown', function(e) {
      self.onStart(e);
      self.$.on('mousemove', onMove);
    });

    this.$.on('mouseup', function(e) {
      self.onEnd(e);
      self.$.off('mousemove', onMove);
    });
  }
}, {
  dragMover: 'mousemove',
  dragEnder: 'mouseup'
});


