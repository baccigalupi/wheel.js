Wheel.Base.subclass('Wheel.Class.Singleton', {
  initialize: function(opts) {
    if (!this._class.singleton) {
      this._class.singleton = this;
      this._super(opts);
    }
  }
}, {
  build: function() {
    if (this.singleton) {
      return this.singleton;
    } else {
      return this._super.apply(this, arguments);
    }
  }
});
