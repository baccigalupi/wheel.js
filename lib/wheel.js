var Wheel = {
  Class: function() {},
  Mixins: {},
  Widgeteria: {},
  canZepto: function() {
    var agent = navigator.useragent;
    var is = false;

    if ( /AppleWebKit/i.test(agent) ) {
      if ( /Silk\/(\d+)/i.test(agent) ) { // amazon silk
        is = parseInt(agent.match(/Silk\/(\d+)/i)[1]) >= 1;
      } else if (/mobile|android/i.test(agent) ) { // general mobile
        is = parseInt(agent.match(/version\/(\d+)/i)[1]) >= 4;
      } else if ( /webos\/(\d+)\.(\d+)\.(\d+)/i.test(agent) ) { // palm
        is = this._versionTest(agent.match(/webos\/(\d+)\.(\d+)\.(\d+)/i), [1,4,5]);
      } else if ( /RIM Tablet OS (\d+)\.(\d+)\.(\d+)/i.test(agent) ) { // blackberry tablet
        is = this._versionTest(agent.match(/RIM Tablet OS (\d+)\.(\d+)\.(\d+)/i), [1,0,7]);
      } else { // desktop webkit browsers
        is = (
          ( agent.match(/Chrome\/(\d+)/) && parseInt(agent.match(/Chrome\/(\d+)/)[1]) >= 5 ) ||
          /Version\/5.*Safari/.test(agent)
        );
      }
    } else {
      is = (
        ( agent.match(/Firefox\/(\d+)/) && parseInt(agent.match(/Firefox\/(\d+)/)[1]) >= 4 ) ||
        ( agent.match(/(Opera).*Version\/(\d+)/i) && parseInt(agent.match(/Version\/(\d+)/i)[1]) >= 10 )
      )
    }

    return !!is;
  },

  _versionTest: function (matches, required) {
    matches[1] = parseInt(matches[1]);
    matches[2] = parseInt(matches[2]);
    matches[3] = parseInt(matches[3]);
    return matches[1] >= required[0] && 
      ( matches[2] > required[1] || (matches[2] == required[1] && matches[3]>= required[2]) ) ;
  }
};


/*
 * Object Orientation inspired by John Resig's post on simple class inheritance
 * http://ejohn.org/blog/simple-javascript-inheritance/
 *
 */
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
