(function(){
  var initializing = false;

  Function.subclass = function(iProps, cProps) {
    var proto;

    initializing = true;
    proto = new this();
    initializing = false;

    // add existing class method from old class
    for( prop in this ) {
      var prop;
      if ( prop == 'prototype' ) { return; }
      Subclass[prop] = this[prop];
    }


    if ( iProps ) {
      // add passed in instance attributes to prototype
      for(var iProp in iProps) {
        if ( proto[iProp] && (typeof iProps[iProp] == 'function' ) &&
              /\b_super\b/.test(iProps[iProp]) ) {
          // there is already an attr with that name the superclass
          // and the method in question is looking for _super ...
          // so, add _super reference
          proto[iProp] = (function(name, func, _super) {
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
          })(iProp, iProps[iProp], proto[iProp]);
        } else {
          proto[iProp] = iProps[iProp];
        }
      }
    }

    if ( cProps ) {
      var cProp;
      // add passed in class attributes
      for(cProp in cProps) {
        // don't copy intrinsic properties
        if ( cProp.match(/prototype|arguments|__proto__/) ) { return; }

        if ( this[cProp] && (typeof cProps[cProp] == 'function' ) &&
             /\b_super\b/.test(cProps[cProp]) ) {
          Subclass[cProp] = (function(name, func, _super){
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
          })(cProp, cProps[cProp], this[cProp]);
        } else {
          Subclass[cProp] = cProps[cProp];
        }
      }
    }

    // high level constructor
    function Subclass() {
      if (!initializing && this.initialize) {
        this.initialize.apply(this, arguments);
      }
    }

    Subclass.prototype = proto;
    Subclass.superclass = this;
    Subclass.prototype.constructor = Subclass;
    return Subclass
  };

  // export the Class variable
  this.Class = Function.subclass();
})();

