Wheel.EventManager.subclass('Wheel.TouchManager', {
  listen: function() {
    this._super();
    var self = this;
    this.touch = {};

    this.$
      .on(this.startEvent, function(e) {
        self.onStart(e);
      })
      .on(this.moveEvent, function(e) {
        self.onMove(e);
      })
      .on(this.endEvent, function(e) {
        self.onEnd(e);
      });
  },

  onStart: function(e) {
    e = this._unpackEvent(e);
    this._super(e);
  },

  onMove: function(e) {
    this._handleDragMove(e);
    if (this.touch.type) { return; }
    e = this._unpackEvent(e);
    this.multi && this._detectGesture(e);
    this._testSwipe(e);
  },

  onEnd: function(e) {
    this._super(e);
    this.multi = undefined;
  },

  _multiDistance: function(index) {
    return Math.sqrt(
      Math.pow(this.touch['x' + index] - this.multi['x' + index], 2) +
      Math.pow(this.touch['y' + index] - this.multi['y' + index], 2)
    );
  },

  _detectGesture: function(e) {
    var origDist = this._multiDistance(1);
    var newDist =  this._multiDistance(2);
    var deltaDist = Math.abs(origDist - newDist);
    var xDeltaSwipe = Math.abs(
      (this.touch.x1 - this.touch.x2) -
      (this.multi.x1 - this.multi.x2)
    );
    var yDeltaSwipe = Math.abs(
      (this.touch.y1 - this.touch.y2) -
      (this.multi.y1 - this.multi.y2)
    );

    if ( deltaDist >= this.GESTURE_TOLERANCE &&
         deltaDist >= xDeltaSwipe &&
         deltaDist >= yDeltaSwipe ) {
      this.touch.type = origDist > newDist ? 'pinch' : 'zoom';
      this._triggerEvent(e);
    }
  },

  _normalizeEvent: function(e) {
    if (e.normalized) { return e; }

    e = e.originalEvent || e;

    if (e.touches && e.touches[0]) {
      e.pageX = e.touches[0].pageX;
      e.pageY = e.touches[0].pageY;
    } else if (e.changedTouches && e.changedTouches[0]) { 
      // touchend has no touches ... the fuckers
      e.pageX = e.changedTouches[0].pageX;
      e.pageY = e.changedTouches[0].pageY;
      this.touch.x2 = e.changedTouches[0].pageX;
      this.touch.y2 = e.changedTouches[0].pageY;
    } else {
      // what is this strange beast??
      // console.log('e', e);
    }
    e.normalized = true;
    return e;
  },

  _unpackEvent: function(e) {
    e = this._super(e);

    if (e.touches && e.touches.length > 1) {
      if (this.multi) {
        this.multi.x2 = e.touches[1].pageX;
        this.multi.y2 = e.touches[1].pageY;
      } else {
        this.multi = {
          x1: e.touches[1].pageX,
          y1: e.touches[1].pageY
        };
      }
    }
    return e;
  },

  _handleTap: function(e) {
    if (this.multi) { return; }
    this._super(e);
  },

  startEvent: 'touchstart',
  moveEvent:  'touchmove',
  endEvent:   'touchend'
}, {
  id: 'Wheel.TouchManager'
});

