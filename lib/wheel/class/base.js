Wheel._Class.subclass('Wheel.Base', {
  initialize: function(opts) {
    this._uid = this._class.uid();
    this.optionize(opts);
    this.init();
  },

  optionize: function(opts) {
    var opt;
    for( opt in opts ) {
      this[opt] = opts[opt];
    }
  },

  init: function() {
    // overloaded by subclasses
  }
}, {
  uid: function() {
    Wheel.Base._uid = Wheel.Base._uid || 0;
    return ++ Wheel.Base._uid;
  },

  build: function() {
    var klass = this;

    function creator(args) {
      return klass.apply(this, args);
    }
    creator.prototype = klass.prototype;

    return new creator(arguments);
  }
});

Wheel.Base.mixin(Wheel.Mixins.Events);

Wheel.Class = function(one, two, three) {
  return Wheel.Base.subclass(one, two, three);
};
