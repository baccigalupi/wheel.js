Wheel._Class.subclass('Wheel.Base', {
  initialize: function(opts) {
    this._preInit(opts);
    this.init();
    this._postInit();
  },

  optionize: function(opts) {
    var opt;
    for( opt in opts ) {
      this[opt] = opts[opt];
    }
  },

  _preInit: function(opts) {
    this._uid = this._class.uid();
    this.optionize(opts);
  },

  _postInit: function() {
    this.listen();
  },

  init: function() {
    // overloaded by subclasses
  },

  listen: function() {
    // yup, this too
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
