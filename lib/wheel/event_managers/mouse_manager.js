Wheel.EventManager.subclass('Wheel.MouseManager', {
  listen: function() {
    this._super();
    var self = this;
    this.touch = {};

    function onMove(e) {
      self.onMove(e);
    }

    function onEnd(e) {
      self.onEnd(e);
      self.$.off(self.moveEvent, onMove);
    }

    // only listen for touchmove when a mousedown event
    // has occurred
    this.$.on(this.startEvent, function(e) {
      self.onStart(e);
      self.$.on(self.moveEvent, onMove);
    });

    this.$.on(this.endEvent, onEnd);
  },

  startEvent: 'mousedown',
  moveEvent:  'mousemove',
  endEvent:   'mouseup'
});
