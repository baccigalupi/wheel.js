Wheel._Class.subclass('Wheel.Base', {
  initialize: function(opts) {
    this._preInit(opts);
    this.init();
    this._postInit();
  },

  _preInit: function(opts) {
    this._uid = this._class.uid();
    this.optionize(opts);
  },

  _postInit: function() {
    this.listen();
  },

  optionize: function(opts) {
    var normalOpts = {};
    var opt;
    for( opt in opts ) {
      if ( typeof this._class.prototype[opt] == 'function' ) {
        // is a property
        this['_'+opt] = opts[opt];
      } else {
        this[opt] = opts[opt];
      }
    }
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
  },

  attrAccessor: function(prop) {
    var propId = '_'+prop;
    this.prototype[prop] = function(value){
      if (value !== undefined) {
        this[propId] = value;
        if (self[propId] != value) {
          this.trigger('change');
          this.trigger('change:'+prop);
        }
      }
      return this[propId];
    };
  },

  subclass: function(name, iprops, cprops) {
    var klass = this._subclass(name, iprops, cprops);
    if (klass.properties && klass.properties.length) {
      $.each(klass.properties, function(i, prop) {
        if ( typeof klass.prototype[prop] != 'function' ) {
          klass.attrAccessor(prop);
        }
      });
    }
    return klass;
  }
});

Wheel.Base.mixin(Wheel.Mixins.Events);

Wheel.Class = function(x, y, z) {
  return Wheel.Base.subclass(x, y, z);
};
