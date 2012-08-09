/*
 * Object Orientation inspired by John Resig's post on simple class inheritance
 * http://ejohn.org/blog/simple-javascript-inheritance/
 *
 */
(function(){
  Function.prototype.bind = Function.prototype.bind || function(context) {
    var func = this;
    return function() {
      return func.apply(context, arguments);
    };
  };

  // taken from Ember.js!
  var wrap = function(func, superFunc) {
    function K() {}

    var newFunc = function() {
      var ret, sup = this._super;
      this._super = superFunc || K;
      ret = func.apply(this, arguments);
      this._super = sup;
      return ret;
    };

    newFunc.base = func;
    return newFunc;
  };

  var superExtend = function(base, props, mashing) {
    if (!props) { return base; }

    for(prop in props) {
      // don't copy intrinsic properties
      if ( prop.match(/prototype|__proto__|superclass/) ) { continue; }

      var bottom, top;
      if (mashing) {
        bottom = props[prop];
        top = base[prop];
      } else {
        bottom = base[prop];
        top = props[prop];
      }

      if ( bottom && top && (typeof top == 'function') ) {
        base[prop] = (function(func, _super){
          return wrap(func, _super);
        })(top, bottom);
      } else if (top || bottom) {
        base[prop] = top || bottom;
      }
    }
    return base;
  };

  Wheel._Class = function() {};

  Wheel._Class.mashin = function(props) {
    superExtend(this, props, true);
    return this;
  };

  Wheel._Class.mashover = function(props) {
    superExtend(this, props);
    return this;
  };

  Wheel._Class.mixin = function(props) {
    superExtend(this.prototype, props, true);
    return this;
  };

  Wheel._Class.mixover = function(props) {
    superExtend(this.prototype, props);
    return this;
  };


  var initializing = false;
  Wheel._Class.subclass = function() {
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
        }
      }
    }

    // add existing class method from old class
    for( prop in this ) {
      var prop;
      if ( prop == 'prototype' ) { continue; }
      Class[prop] = this[prop];
    }

    superExtend(Class, cProps);
    Class.superclass = this;
    Class._subclass = Wheel._Class.subclass;
    Class.prototype = superExtend(proto, iProps);
    Class.prototype.constructor = Class;
    Class.prototype.superclass = this.prototype;
    Class.prototype._class = Class.prototype.constructor; // more intuitive access ??

    if (id) {
      Class.id = id;
      eval(id + "= Class");
    }
    return Class;
  };
})();
