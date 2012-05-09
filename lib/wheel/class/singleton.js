Wheel.Class.Singleton = Wheel.Base.subclass({
  initialize: function(opts) {
    if (!this._class.singleton) {
      this._class.singleton = this;
      this._super(opts);
    }
  }
}, {
  create: function() {
    if (this.singleton) {
      return this.singleton;
    } else {
      return this._super.apply(this, arguments);
    }
  }
});
