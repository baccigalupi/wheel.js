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

  onStart: function(e) {
    e = this._unpackEvent(e);
    this._super(e);
  },

  onMove: function(e) {
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

    console.log(xDeltaSwipe, yDeltaSwipe, deltaDist);

    if ( deltaDist >= this.GESTURE_TOLERANCE &&
         deltaDist >= xDeltaSwipe &&
         deltaDist >= yDeltaSwipe ) {
      this.touch.type = origDist > newDist ? 'pinch' : 'zoom';
      this.triggerEvent(e);
    }
  },

  _normalizeEvent: function(e) {
    e = e.originalEvent || e;
    e.pageX = e.touches[0].pageX;
    e.pageY = e.touches[0].pageY;
    return e;
  },

  _unpackEvent: function(e) {
    e = this._super(e);

    if (e.touches.length > 1) {
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
});

