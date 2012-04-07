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
    this._super && this._super();

    var json = this.data() || {},
        type = this.httpMethod;
    if ( type.match(/delete|put/i) && !json._method ) {
      json._method = type;
      type = 'post';
    }

    $.ajax({
      url: this.url,
      context: this,
      data: json,
      type: type,
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
    this.initializeDom(dom, opts);
    this.init();
    this.listen();
  },

  initializeDom: function(dom, opts) {
    if ( dom && (dom.addClass || dom instanceof HTMLElement || dom.toString() === dom ) ) {
      this.optionize(opts);
      this.$ = this.wrapDom(dom);
    } else {
      this.optionize(dom);
      this.$ = this.render()
    }
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
Wheel.Application = Wheel.Class.subclass({
  initialize: function() {
    var appName = this._class.name;
    if ( window[app] ) {
      return;
    } else {
      this.init();
      window[app] = this;
    }
  },

  init: function() {
    // make objects and run methods on those objects
    // needed for your app
  }
}, {
  name: 'WheelApp'
});

/*
 * Make your app go by just making a new instance:
 *
 * $(document).ready(function() {
 *  new WheelApp();
 * });
 *
 */

Wheel.TouchManagerr = Wheel.View.subclass({
  // view delegation ... extract into a subclass ??
  initializeDom: function(viewInstance, opts) {
    this.optionize(opts);
    this.base = viewInstance;
    this.$ = this.base.$;
    this._class.listen(); //
  }
}, {
  listen: function() {
    if (this.isListening()) { return; }
    this.$body = $('body');
    //
    // call methods for listening
    // single finger gestures only:
    // swipe, taphold, tap, doubletap
    //
    this._isListening = true;
  },

  isListening: function() {
    return this._isListening || (this.superclass.isListening && this.superclass.isListening());
  },

  listenOnBody: function() {
    var self = this;
    this.touch = {};

    this.$body.bind('touchstart', function(e) {
      e = e.originalEvent || e;
      var now = Date.now(),
          delta = now - (self.touch.last || now);
      // clear existing timeout because there is a new touch start event
      self.touchTimeout && clearTimeout(self.touchTimeout);

      // set up the touch object
      self.touch.target = self._targetNode(e.touches[0].target);
      self.touch.x1 = e.touches[0].pageX;
      self.touch.y1 = e.touches[0].pageY;
      self.touch.last = now;

      if (delta > 0 && delta <= self.DOUBLE_DELAY) {
        self.touch.isDoubleTap = true;
        return; // don't bother listening for a taphold
      }

      // wait to see if this is a taphold event
      self.touchTimout = setTimeout(function(e) {
        self._testForTouchHold(e);
      }, self.HOLD_DELAY);
    });
  },

  _targetNode: function(node) {
    // if it is text, return parent, otherwise the node
    return 'tagName' in node ? node : node.parentNode;
  },

  _direction: function(x1,x2, y1,y2) {
    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
    if (xDelta >= yDelta) {
      return (x1 - x2 > 0 ? 'Left' : 'Right');
    } else {
      return (y1 - y2 > 0 ? 'Up' : 'Down');
    }
  },

  _testForTouchHold: function(e) {
    var self = this;
    if ((this.touch.last && (Date.now() - this.touch.last >= this.HOLD_DELAY)) //&&
        /* (touches are within tolerante) */ ) {
      var newEvent = $.Event('taphold', {
        pageX: e.pageX,
        pageY: e.pageY,
        stopPropogation: function() { e.originalEvent.stopPropogation() },
        preventDefault: function() { e.originalEvent.preventDefault() }
      });
      $(touch.target).trigger();
      this.touch = {};
    }
  },

  HOLD_DELAY: 750,
  DOUBLE_DELAY: 250,
  HOLD_TOLERANCE: 10
});

//(function($){
  //var touch = {}, touchTimeout;

  //function parentIfText(node){
    //return 'tagName' in node ? node : node.parentNode;
  //}

  //function swipeDirection(x1, x2, y1, y2){
    //var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
    //if (xDelta >= yDelta) {
      //return (x1 - x2 > 0 ? 'Left' : 'Right');
    //} else {
      //return (y1 - y2 > 0 ? 'Up' : 'Down');
    //}
  //}

  // stil touching after delay, movement within tolerance (10px)
  //var longTapDelay = 750;
  //function longTap(){
    //if (touch.last && (Date.now() - touch.last >= longTapDelay)) {
      //$(touch.target).trigger('longTap');
      //touch = {};
    //}
  //}

  //$(document).ready(function(){
    //$(document.body).bind('touchstart', function(e){
      //var now = Date.now(), delta = now - (touch.last || now);
      //touch.target = parentIfText(e.touches[0].target);
      //touchTimeout && clearTimeout(touchTimeout);
      //touch.x1 = e.touches[0].pageX;
      //touch.y1 = e.touches[0].pageY;
      //if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
      //touch.last = now;
      //setTimeout(longTap, longTapDelay);
    //}).bind('touchmove', function(e){
      //touch.x2 = e.touches[0].pageX;
      //touch.y2 = e.touches[0].pageY;
    //}).bind('touchend', function(e){
      //if (touch.isDoubleTap) {
        //$(touch.target).trigger('doubleTap');
        //touch = {};
      //} else if (touch.x2 > 0 || touch.y2 > 0) {
        //(Math.abs(touch.x1 - touch.x2) > 30 || Math.abs(touch.y1 - touch.y2) > 30)  &&
          //$(touch.target).trigger('swipe') &&
          //$(touch.target).trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
        //touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0;
      //} else if ('last' in touch) {
        //touchTimeout = setTimeout(function(){
          //touchTimeout = null;
          //$(touch.target).trigger('tap')
          //touch = {};
        //}, 250);
      //}
    //}).bind('touchcancel', function(){ touch = {} });
  //});

  //['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'longTap'].forEach(function(m){
    //$.fn[m] = function(callback){ return this.bind(m, callback) }
  //});
//})(Zepto);


/* Default ios gestures
 * http://developer.apple.com/library/ios/#DOCUMENTATION/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html
 *
 * ONE FINGER EVENTS
 * 1) Single finger 'swipe' or 'panning': 'onscroll'
 * 2) Touch hold: default information bubble with no event fired
 * 3) Double tap: default zoom, no events
 * 4) Tap: fires 'click' event
 *
 * TWO FINGER EVENTS
 * 1) Pinch: default pinch zoom, with no event
 * 2) Two Finder 'swipe'/'pan': 'onscroll'
 *
 * Gesture events happen with multi-touch gestures, but are not supported by all browsers
 * event has
 *  - rotation
 *  - scale
 */
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
    this.send();
  },

  // stub methods, should be overwritten by subclasses
  data: function() { return {}; },
  onSuccess: function () {},
  onCompletion: function () {},
  onError: function () {}
});

Wheel.Widgeteria.AjaxLink.mixin(Wheel.Mixins.Ajax);
Wheel.Widgeteria.Form = Wheel.View.subclass({
  init: function() {
    this.url = this.url || this.$.attr('action');
    this.httpMethod = this.httpMethod || this.$.attr('method') || 'post';
  },

  listen: function() {
    var self = this;
    this.$.bind('submit', function(e) {
      e.preventDefault();
      self.onSubmit(e);
    });
  },

  onSubmit: function(e) {
    // override this in subclasses
  },

  data: function() {
    var arr = this.$.serializeArray(),
        hash = {},
        current;
    $.each(arr, function(i, obj) {
      value = hash[obj.name];
      if ( hash[obj.name] ) {
        hash[obj.name] = (hash[obj.name].push && hash[obj.name].push(obj.value)) || [ hash[obj.name], obj.value ];
      } else {
        hash[obj.name] = obj.value;
      }
    });
    return hash;
  }
}, {
  cssSelector: 'form'
});
