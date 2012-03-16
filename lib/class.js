(function(){
  var initializing = false;

  Function.mashin = function(props) {
    var prop;
    // add passed in class attributes
    for(prop in props) {
      // don't copy intrinsic properties
      if ( prop.match(/prototype|arguments|__proto__/) ) { return; }

      if ( this[prop] && (typeof props[prop] == 'function' ) &&
           /\b_super\b/.test(props[prop]) ) {
        this[prop] = (function(name, func, _super){
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
        })(prop, props[prop], this[prop]);
      } else {
        this[prop] = props[prop];
      }
    }
  };

  Function.mixin = function(props, proto) {
    proto = proto || this.prototype;
    // add passed in instance attributes to prototype
    for(var prop in props) {
      if ( proto[prop] && (typeof props[prop] == 'function' ) &&
            /\b_super\b/.test(props[prop]) ) {
        // there is already an attr with that name the superclass
        // and the method in question is looking for _super ...
        // so, add _super reference
        proto[prop] = (function(name, func, _super) {
          return function() {
            // store this in case we are calling through multiple methods
            // that use super, that way each is restored after super is used
            var exSuper = this._super;
            this._super = _super;
            var returned = func.apply(this, arguments);
            // and the restoration here!
            this._super = exSuper;
            return returned;
          }
        })(prop, props[prop], proto[prop]);
      } else {
        proto[prop] = props[prop];
      }
    }
    return proto;
  };

  Function.subclass = function(iProps, cProps) {
    var proto;

    initializing = true;
    proto = new this();
    initializing = false;

    // high level constructor
    function Subclass() {
      if (!initializing && this.initialize) {
        this.initialize.apply(this, arguments);
      }
    }

    // add existing class method from old class
    for( prop in this ) {
      var prop;
      if ( prop == 'prototype' ) { return; }
      Subclass[prop] = this[prop];
    }

    Subclass.mashin(cProps);
    Subclass.prototype = Subclass.mixin(iProps, proto);
    Subclass.superclass = this;
    Subclass.prototype.constructor = Subclass;
    return Subclass
  };

  // export the Class variable
  this.Class = Function.subclass();
})();

