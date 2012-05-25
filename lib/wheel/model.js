Wheel.Model = Wheel.Base.subclass({
  initialize: function(opts) {
    this._buildProperties();
    this._super(opts);
  },

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
  },

  _buildProperties: function() {
    if (!('_hasProperties' in this._class)) {
      var self = this;
      $.each(this.properties, function(i, prop) {
        self._class.attrAccessor(prop);
      });
      this._class._hasProperties = true;
    }
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
  }
});
