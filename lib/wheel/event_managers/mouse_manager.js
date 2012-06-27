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
    this.$.on(this.startEvent, function(e) {
      self.onStart(e);
      self.$.on(self.moveEvent, onMove);
    });

    // TODO: on end stuff should be removed to for memory managment
    this.$.on(this.endEvent, function(e) {
      self.onEnd(e);
      self.$.off(self.moveEvent, onMove);
    });
  },

  startEvent: 'mousedown',
  moveEvent:  'mousemove',
  endEvent:   'mouseup'
});
