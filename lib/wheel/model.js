Wheel.Model = Wheel.Base.subclass({

  isNew: function() {
    return !!this.id;
  },

  attrAccessor: function(prop) {
    this._class.prototype[prop] = function(){};
  }
}, {
  //subclass: function(name, ivals, cvals) {
    //this._super(name, ivals, cvals);
    ////$.each(this.prototype.properties, function(i, prop) {
      ////this.prototype[prop] = this.prototype.attrAccessor(prop);
    ////}.bind(this));
  //}
});
