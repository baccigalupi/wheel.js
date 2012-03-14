(function(){
  var initializing = false,
      hasSuper = /\b_super\b/;

  Function.subclass = function(instanceMethods, classMethods) {
    var proto, prop;

    // high level constructor
    function Subclass() {
      if (!initializing && this.initialize) {
        this.initialize.apply(this, arguments);
      }
    }

    initializing = true;
    proto = new this();
    initializing = false;

    // add passed in instance methods to prototype
    for(prop in instanceMethods) {
      proto[prop] = instanceMethods[prop];
    }

    // add existing class method from old class
    for( prop in this ) {
      if ( prop == 'prototype' ) { return; }
      Subclass[prop] = this[prop];
    }

    // add passed in class methods
    for(prop in classMethods) {
      if ( prop == 'prototype' ) { return; }
      Subclass[prop] = classMethods[prop];
    }

    Subclass.prototype = proto;
    Subclass.superclass = this;
    return Subclass
  };

  // export the Class variable
  this.Class = Function.subclass();
})();

