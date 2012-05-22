Wheel.Model = Wheel.Base.subclass({
  initialize: function(opts) {
    this._buildProperties();
    this._super(opts);
  },
  // state -------------
  isNew: function() {
    return !!this.id;
  },

  isChanged: function() {
    return !!this._dirty;
  },

  _attrAccessor: function(prop) {
    var self = this;
    var propId = '_'+prop;
    this._class.prototype[prop] = function(value){
      if (value !== undefined) {
        if (self[propId] != value) {
          self.trigger('change');
          self.trigger('change:'+prop);
          self._dirty = true;
        }
        self[propId] = value;
      }
      return self[propId];
    };
  },

  _buildProperties: function() {
    var self = this;
    $.each(this.properties, function(i, prop) {
      self._attrAccessor(prop);
    });
    this._class._hasProperties = true;
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
  }
}, {
});
