Wheel.Model = Wheel.Base.subclass({
  optionize: function(opts) {
    var normalOpts = {};
    var opt;
    for( opt in opts ) {
      if ( typeof this._class.prototype[opt] == 'function' ) {
        this['_'+opt] = opts[opt];
      } else {
        normalOpts[opt] = opts[opt];
      }
    }
    this._super(normalOpts);
  },

  // state -------------------------------------
  isNew: function() {
    return !!this.id;
  },

  isChanged: function() {
    return !!this._dirty;
  }
}, {
  attrAccessor: function(prop) {
    var propId = '_'+prop;
    this.prototype[prop] = function(value){
      if (value !== undefined) {
        if (self[propId] != value) {
          this.trigger('change');
          this.trigger('change:'+prop);
          this._dirty = true;
        }
        this[propId] = value;
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
