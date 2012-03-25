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
Wheel.Mixins.Ajax = {
  init: function() {
    this._super();
    this.httpMethod = this.httpMethod || 'get';
    this.dataType = this.dataType || 'json';
  },

  send: function () {
    if(this._super) { this._super(); }
    $.ajax({
      url: this.url,
      context: this,
      data: this.data(),
      type: this.httpMethod,
      dataType: this.dataType,
      success: this.onSuccess,
      error: this.processError,
      complete: this.onCompletion
    });
  },

  processError: function (xhr) {
    try {
      this.onError(JSON.parse(xhr.responseText));
    } catch(e) {
      this.onError({status: xhr.statusCode(), message: xhr.responseText});
    }
  }

  /* mixin expects these methods to be implemented in
   * the recepient class
   *
        data: function() { return {}; },
        onSuccess: function () {},
        onCompletion: function () {},
        onError: function () {}
   */
};
Wheel.Mixins.Optionize = {
  optionize: function(opts) {
    var opt;
    for( opt in opts ) {
      this[opt] = opts[opt];
    }
  }
};
Wheel.View = Wheel.Class.subclass({
  initialize: function(dom, opts) {
    if ( dom && (dom.addClass || dom instanceof HTMLElement || dom.toString() === dom) ) {
      this.optionize(opts);
      this.$ = this.wrapDom(dom);
    } else {
      this.optionize(dom);
      this.$ = this.render()
    }

    this.init();
    this.listen();
  },

  wrapDom: function(dom) {
    return $(dom);
  },

  render: function() {
    var rendered = Mustache.render(this._class.template(), this.viewModel());
    return $(rendered);
  },

  viewModel: function() {
    var view;
    if ( this.model != undefined ) {
      view = this.model
    } else {
      view = this;
    }
    return view;
  },

  init: function() {
    // placeholder for setting initial state
  },

  listen: function() {
    // placeholder for setting up event listeners on this dom
  }
},{
  // only applicable for finding things in an established dom
  gather: function(dom, opts) {
    if (!this.cssSelector) {
      throw "Define a cssSelector on the class to use the 'gather' class method";
    }
    var set = [],
        klass = this;
    opts = opts || {};
    dom = (dom instanceof $) ? dom : $(dom);

    if (dom.is(this.cssSelector)) {
      set.push(new klass(dom, opts));
    } else {
      $.each(dom.find(this.cssSelector), function(index, item) {
        set.push(new klass(item, opts));
      });
    }

    return set;
  },

  assemble: function(collection) {
    var set = [];
        klass = this;
    $.each(collection, function(index, item){
      set.push(new klass(item));
    });

    return set;
  }
});

Wheel.View.mixin(Wheel.Mixins.Optionize);
Wheel.Widgeteria.Link = Wheel.View.subclass({
  init: function() {
    this.url = this.$.attr('href');
    this.propagate = (this.propagate == undefined) ? true : this.propagate;
    if ( this.disabled == undefined && this.$.attr('disabled') ) {
      this.disabled = true;
    }
  },

  listen: function() {
    var self = this;
    this.$.bind('click', function(e) {
      e.preventDefault();
      if ( !self.propagate ) {
        // todo: figure out if bubbling needs to be halted in this case
        e.stopPropagation();
      }
      if (! self.disabled ) {
        self.onClick(e);
      }
    });
  },

  onClick: function(e) {/* overwrite me */}
}, {
  cssSelector: 'a'
});
Wheel.Widgeteria.AjaxLink = Wheel.Widgeteria.Link.subclass({
  onClick: function(e) {
    this._super(e);
    this.send();
  },

  // stub methods, should be overwritten by subclasses
  data: function() { return {}; },
  onSuccess: function () {},
  onCompletion: function () {},
  onError: function () {}
});

Wheel.Widgeteria.AjaxLink.mixin(Wheel.Mixins.Ajax);
