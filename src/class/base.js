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
  },

  publish: function(eventType, eventData) {
    this._publisher || this._findPublisher();
    this._publisher.trigger(eventType, eventData);
  },

  subscribe: function(eventName, callback, context) {
    this._publisher || this._findPublisher();
    this._publisher.on(eventName, callback, context || this);
  },

  _findPublisher: function() {
    this._publisher = (this._class.App && this._class.App.app) || Wheel.Publisher;
    if (!this._publisher) {
      throw "Cannot find app or Wheel.Publisher. Please namespace your classes under an application class or assign a Wheel.Publisher";
    }
  }
}, {
  uid: function() {
    Wheel.Base._uid = Wheel.Base._uid || 0;
    return ++ Wheel.Base._uid;
  },

  build: function() {
    var klass = this;

    function Class(args) {
      return klass.apply(this, args);
    }
    Class.prototype = klass.prototype;

    return new Class(arguments);
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
        if ( typeof klass.prototype[prop] !== 'function' ) {
          klass.attrAccessor(prop);
        }
      });
    }
    if (Wheel.isString(name)) {
      var path = name.split('.');
      var length = path.length;
      var i, base = window;
      for (i = 0; i < length-1; i++) {
        base = window[path[i]];
        if (base && base._typeof === 'Wheel.App') {
          klass.App = base;
          break;
        }
      }
    }
    return klass;
  }
});

Wheel.Base.mixin(Wheel.Mixins.Events);

if (Wheel.Mixins['ManagedAjax']) {
  Wheel.Base.mixin(Wheel.Mixins.ManagedAjax);
} else {
  Wheel.Base.mixin(Wheel.Mixins.Ajax);
}

Wheel.Class = function(x, y, z) {
  return Wheel.Base.subclass(x, y, z);
};
