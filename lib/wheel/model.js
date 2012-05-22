Wheel.Model = Wheel.Base.subclass({
  isNew: function() {
    return !!this.id;
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
  }
}, {
  //subclass: function(name, ivals, cvals) {
    //this._super(name, ivals, cvals);
    ////$.each(this.prototype.properties, function(i, prop) {
      ////this.prototype[prop] = this.prototype.attrAccessor(prop);
    ////}.bind(this));
  //}
});
