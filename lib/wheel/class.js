/*
 * Object Orientation inspired by John Resig's post on simple class inheritance
 * http://ejohn.org/blog/simple-javascript-inheritance/
 *
 */
(function(){
  var superExtend = function(base, props, mashing) {
    for(prop in props) {
      // don't copy intrinsic properties
      if ( prop.match(/prototype|arguments|__proto__|superclass/) ) { return; }

      var bottom, top;
      if (mashing) {
        bottom = props[prop];
        top = base[prop];
      } else {
        bottom = base[prop];
        top = props[prop];
      }

      if ( bottom && top && (typeof top == 'function') && /\b_super\b/.test(top) ) {
        base[prop] = (function(name, func, _super){
          return function() {
            var exSuper = this._super;
            this._super = _super;
            var returned = func.apply(this, arguments);
            this._super = exSuper;
            return returned;
          };
        })(prop, top, bottom);
      } else {
        base[prop] = props[prop];
      }
    }
    return base;
  };

  Wheel.ClassBuilder = function() {};

  Wheel.ClassBuilder.mashin = function(props) {
    superExtend(this, props, true)
    return this;
  };

  Wheel.ClassBuilder.mixin = function(props) {
    superExtend(this.prototype, props, true);
    return this;
  };

  var initializing = false;
  Wheel.ClassBuilder.subclass = function() {
    var id, proto, iProps, cProps;
    if (typeof arguments[0] == 'string') {
      id = arguments[0];
      iProps = arguments[1];
      cProps = arguments[2];
    } else {
      iProps = arguments[0];
      cProps = arguments[1];
    }

    initializing = true;
    proto = new this();
    initializing = false;

    // high level constructor
    function Class() {
      if (!initializing) {
        if (this.initialize) {
          this.initialize.apply(this, arguments);
        } else if (this.init) {
          this.init.apply(this, arguments);
        }
      }
    }

    // add existing class method from old class
    for( prop in this ) {
      var prop;
      if ( prop == 'prototype' ) { return; }
      Class[prop] = this[prop];
    }

    superExtend(Class, cProps);
    Class.prototype = superExtend(proto, iProps);
    Class.superclass = this;
    Class.prototype.constructor = Class;
    Class.prototype.superclass = this.prototype;
    Class.prototype._class = Class.prototype.constructor; // more intuitive access

    if (id) {
      Class.id = id;
      eval(id + "= Class");
    }
    return Class
  };
})();

Wheel.Class = function(one, two, three) {
  return Wheel.ClassBuilder.subclass(one, two, three);
};
