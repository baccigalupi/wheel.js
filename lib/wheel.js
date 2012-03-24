var Wheel = {
  Class: function() {},
  Mixins: {},
  Widgeteria: {}
};

(function(){
  var superExtend = function(base, props) {
    for(prop in props) {
      // don't copy intrinsic properties
      if ( prop.match(/prototype|arguments|__proto__/) ) { return; }

      if ( base[prop] && (typeof props[prop] == 'function' ) &&
           /\b_super\b/.test(props[prop]) ) {
        base[prop] = (function(name, func, _super){
          return function() {
            // store this in case we are calling through multiple methods
            // that use super, that way each is restored after super is used
            var exSuper = this._super;
            this._super = _super;
            var returned = func.apply(this, arguments);
            // and the restoration here!
            this._super = exSuper;
            return returned;
          };
        })(prop, props[prop], base[prop]);
      } else {
        base[prop] = props[prop];
      }
    }
    return base;
  };

  Wheel.Class.mashin = function(props) {
    var prop;
    superExtend(this, props)
    return this;
  };

  Wheel.Class.mixin = function(props) {
    var prop;
    superExtend(this.prototype, props);
    return this;
  };

  var initializing = false;
  Wheel.Class.subclass = function(iProps, cProps) {
    initializing = true;
    var proto = new this();
    initializing = false;

    // high level constructor
    function Class() {
      if (!initializing && this.initialize) {
        this.initialize.apply(this, arguments);
      }
    }

    // add existing class method from old class
    for( prop in this ) {
      var prop;
      if ( prop == 'prototype' ) { return; }
      Class[prop] = this[prop];
    }

    Class.mashin(cProps);
    Class.prototype = superExtend(proto, iProps);
    Class.superclass = this;
    Class.prototype.constructor = Class;
    Class.prototype._class = Class.prototype.constructor; // more intuitive access
    return Class
  };
})();
