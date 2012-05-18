/* Modernizr 2.5.3 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-draganddrop-touch-cssclasses-teststyles-hasevent-prefixes-load
 */
;



window.Modernizr = (function( window, document, undefined ) {

    var version = '2.5.3',

    Modernizr = {},

    enableClasses = true,

    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem  ,


    toString = {}.toString,

    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, 


    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node,
          div = document.createElement('div'),
                body = document.body, 
                fakeBody = body ? body : document.createElement('body');

      if ( parseInt(nodes, 10) ) {
                      while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

                style = ['&#173;','<style>', rule, '</style>'].join('');
      div.id = mod;
          (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if(!body){
                fakeBody.style.background = "";
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
        !body ? fakeBody.parentNode.removeChild(fakeBody) : div.parentNode.removeChild(div);

      return !!ret;

    },



    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

            var isSupported = eventName in element;

        if ( !isSupported ) {
                if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

                    if ( !is(element[eventName], 'undefined') ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),


    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProperty;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProperty = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProperty = function (object, property) { 
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }


    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F;

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }


    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                            if (elem === false) return props[i];

                            if (is(item, 'function')){
                                return item.bind(elem || obj);
                }

                            return item;
            }
        }
        return false;
    }


    var testBundle = (function( styles, tests ) {
        var style = styles.join(''),
            len = tests.length;

        injectElementWithStyles(style, function( node, rule ) {
            var style = document.styleSheets[document.styleSheets.length - 1],
                                                    cssText = style ? (style.cssRules && style.cssRules[0] ? style.cssRules[0].cssText : style.cssText || '') : '',
                children = node.childNodes, hash = {};

            while ( len-- ) {
                hash[children[len].id] = children[len];
            }

                       Modernizr['touch'] = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch || (hash['touch'] && hash['touch'].offsetTop) === 9; 
                                }, len, tests);

    })([
                       ,['@media (',prefixes.join('touch-enabled),('),mod,')',
                                '{#touch{top:9px;position:absolute}}'].join('')           ],
      [
                       ,'touch'                ]);



    tests['touch'] = function() {
        return Modernizr['touch'];
    };



    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };
    for ( var feature in tests ) {
        if ( hasOwnProperty(tests, feature) ) {
                                    featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }
    setCss('');
    modElem = inputElem = null;


    Modernizr._version      = version;

    Modernizr._prefixes     = prefixes;


    Modernizr.hasEvent      = isEventSupported;    Modernizr.testStyles    = injectElementWithStyles;    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

                                                    (enableClasses ? ' js ' + classes.join(' ') : '');

    return Modernizr;

})(this, this.document);
/*yepnope1.5.3|WTFPL*/
(function(a,b,c){function d(a){return o.call(a)=="[object Function]"}function e(a){return typeof a=="string"}function f(){}function g(a){return!a||a=="loaded"||a=="complete"||a=="uninitialized"}function h(){var a=p.shift();q=1,a?a.t?m(function(){(a.t=="c"?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){a!="img"&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l={},o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};y[c]===1&&(r=1,y[c]=[],l=b.createElement(a)),a=="object"?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),a!="img"&&(r||y[c]===2?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i(b=="c"?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),p.length==1&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&o.call(a.opera)=="[object Opera]",l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return o.call(a)=="[object Array]"},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,i){var j=b(a),l=j.autoCallback;j.url.split(".").pop().split("?").shift(),j.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]||h),j.instead?j.instead(a,e,f,g,i):(y[j.url]?j.noexec=!0:y[j.url]=1,f.load(j.url,j.forceCSS||!j.forceJS&&"css"==j.url.split(".").pop().split("?").shift()?"c":c,j.noexec,j.attrs,j.timeout),(d(e)||d(l))&&f.load(function(){k(),e&&e(j.origUrl,i,g),l&&l(j.origUrl,i,g),y[j.url]=2})))}function i(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var j,l,m=this.yepnope.loader;if(e(a))g(a,0,m,0);else if(w(a))for(j=0;j<a.length;j++)l=a[j],e(l)?g(l,0,m,0):w(l)?B(l):Object(l)===l&&i(l,m);else Object(a)===a&&i(a,m)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,b.readyState==null&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}})(this,document);
Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0));};
;var Wheel = {
  Mixins: {},
  Utils: {},
  Widgeteria: {}
};
/*
 * Object Orientation inspired by John Resig's post on simple class inheritance
 * http://ejohn.org/blog/simple-javascript-inheritance/
 *
 */
(function(){
  Function.prototype.bind = Function.prototype.bind || function(context) {
    var func = this 
    return function() {
      return func.apply(context, arguments)
    }
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
    if (!props) { return base }

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
    superExtend(this, props, true)
    return this;
  };

  Wheel._Class.mixin = function(props) {
    superExtend(this.prototype, props, true);
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

Wheel.Base = Wheel._Class.subclass({
  initialize: function(opts) {
    this._uid = this._class.uid();
    this.optionize(opts);
    this.init();
  },

  optionize: function(opts) {
    var opt;
    for( opt in opts ) {
      this[opt] = opts[opt];
    }
  },

  init: function() {
    // overloaded by subclasses
  }
}, {
  uid: function() {
    Wheel.Base._uid = Wheel.Base._uid || 0;
    return ++ Wheel.Base._uid;
  },

  create: function() {
    var klass = this;

    function creator(args) {
      return klass.apply(this, args);
    }
    creator.prototype = klass.prototype;

    return new creator(arguments);
  }
});

Wheel.Class = function(one, two, three) {
  return Wheel.Base.subclass(one, two, three);
};
// This was stolen from Backbone and modified slightly.
Wheel.Mixins.Events = {
  // Bind one or more space separated events, `events`, to a `callback`
  // function. Passing `"all"` will bind the callback to all events fired.
  on: function(events, callback, context) {

    var calls, event, node, tail, list;
    if (!callback) return this;
    events = events.split(' ');
    calls = this._callbacks || (this._callbacks = {});

    // Create an immutable callback list, allowing traversal during
    // modification.  The tail is an empty object that will always be used
    // as the next node.
    while (event = events.shift()) {
      list = calls[event];
      node = list ? list.tail : {};
      node.next = tail = {};
      node.context = context;
      node.callback = callback;
      calls[event] = {tail: tail, next: list ? list.next : node};
    }

    return this;
  },

  // Remove one or many callbacks. If `context` is null, removes all callbacks
  // with that function. If `callback` is null, removes all callbacks for the
  // event. If `events` is null, removes all bound callbacks for all events.
  off: function(events, callback, context) {
    var event, calls, node, tail, cb, ctx;

    // No events, or removing *all* events.
    if (!(calls = this._callbacks)) return this;
    if (!(events || callback || context)) {
      delete this._callbacks;
      return this;
    }

    // Loop through the listed events and contexts, splicing them out of the
    // linked list of callbacks if appropriate.
    events = events ? events.split(' ') : _.keys(calls);
    while (event = events.shift()) {
      node = calls[event];
      delete calls[event];
      if (!node || !(callback || context)) continue;
      // Create a new list, omitting the indicated callbacks.
      tail = node.tail;
      while ((node = node.next) !== tail) {
        cb = node.callback;
        ctx = node.context;
        if ((callback && cb !== callback) || (context && ctx !== context)) {
          this.on(event, cb, ctx);
        }
      }
    }

    return this;
  },

  // Trigger one or many events, firing all bound callbacks. Callbacks are
  // passed the same arguments as `trigger` is, apart from the event name
  // (unless you're listening on `"all"`, which will cause your callback to
  // receive the true name of the event as the first argument).
  trigger: function(events) {
    var event, node, calls, tail, args, all, rest, slice;
    if (!(calls = this._callbacks)) return this;
    slice = Array.prototype.slice;
    all = calls.all;
    events = events.split(' ');
    rest = slice.call(arguments, 1);

    // For each event, walk through the linked list of callbacks twice,
    // first to trigger the event, then to trigger any `"all"` callbacks.
    while (event = events.shift()) {
      if (node = calls[event]) {
        tail = node.tail;
        while ((node = node.next) !== tail) {
          node.callback.apply(node.context || this, rest);
        }
      }
      if (node = all) {
        tail = node.tail;
        args = [event].concat(rest);
        while ((node = node.next) !== tail) {
          node.callback.apply(node.context || this, args);
        }
      }
    }

    return this;
  }

};

Wheel.Mixins.Ajax = {
  send: function (overrides) {
    this._requestQueue = this._requestQueue || Wheel.Utils.RequestQueue.singleton;
    var data = this.data() || {};

    var opts = {
      url: this.url,
      context: this,
      data: data,
      type: (overrides && overrides.httpMethod) || this.httpMethod,
      dataType: this.dataType || 'json',
      success: this.onSuccess,
      error: this.processError,
      complete: this.onCompletion
    };
    overrides && $.extend(opts, overrides);
    this._requestQueue.send(opts);
  },

  processError: function (xhr) {
    try {
      this.onError(JSON.parse(xhr.responseText));
    } catch(e) {
      this.onError({status: xhr.statusCode(), message: xhr.responseText});
    }
  },

  // reimplement these in classes
  data: function() { return {} },
  onCompletion: function(response) {},
  onSuccess:    function(response) {},
  onError:      function(response) {}
};
Wheel.Class.Singleton = Wheel.Base.subclass({
  initialize: function(opts) {
    if (!this._class.singleton) {
      this._class.singleton = this;
      this._super(opts);
    }
  }
}, {
  create: function() {
    if (this.singleton) {
      return this.singleton;
    } else {
      return this._super.apply(this, arguments);
    }
  }
});
Wheel.Utils.Loader = {
  canZepto: function(agent) {
    agent = agent || navigator.userAgent;
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


// Even though this is a technically a fill for navigator.online, that
// property only checks to make sure that there is a connection.
// If the connection is not sending/receiving requests, the flag
// will be incorrect. This is a good backup to test real connectivity.
Wheel.Utils.ConnectionChecker = Wheel.Class.Singleton.subclass({
  init: function() {
    this.url = '/';
    this.intervalDelay = this._class.intervalDelay;
    this.pollCount = 0;
    this._super();
  },

  opts: {
    async: false,
    url: this.url,
    context: this,
    type: 'head',
    dataType: 'json'
  },

  test: function() {
    $.ajax($.extend(this.opts, {
      success: this.onSuccess,
      error: this.onError
    }));
  },

  clearInterval: function() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  },

  setInterval: function() {
    this.interval = setInterval(function() {
      $.ajax($.extend(this.opts, {
        success: self.stopPoll,
        failure: self.continuePoll
      }));
    }, this.intervalDelay);
  },

  startPoll: function() {
    var self = this;
    this.pollCount = 1;
    this.setInterval();
  },

  isPolling: function() {
    return !!this.interval;
  },

  stopPoll: function() {
    this.clearInterval();
    this.intervalDelay = this._class.intervalDelay;
    this.pollCount = 0;
    this.onSuccess();
  },

  continuePoll: function() {
    this.pollCount ++;
    if (this.pollCount > 10 && this.intervalDelay < this._class.intervalDelayLimit) {
      this.clearInterval();
      this.intervalDelay *= 2;
      this.setInterval();
      this.pollCount = 0;
    }
  },

  onSuccess: function(response) {
    this.app.connected(true);
  },

  onError: function(response) {
    this.app.connected(false);
    !this.isPolling() && this.startPoll();
  },
}, {
  intervalDelay: 10*1000,
  intervalDelayLimit: 2*60*1000
});

Wheel.Utils.ConnectionChecker.mixin(Wheel.Mixins.Events);
Wheel.Utils.RequestQueue = Wheel.Class.Singleton.subclass({
  init: function() {
    this._requestCount = 0;
    this._requests = [];
    this._contexts = {};
    this._state = 'online';
    this.app.on('offline', this.offline, this);
  },

  add: function(requestOpts) {
    this._requests.push(requestOpts);
    this.start();
  },

  _inContext: function(context) {
    return !!(context && context._uid && this._contexts[context._uid]);
  },

  start: function(index) {
    index = index || 0;
    var opts = this._requests[index];
    if (  opts && this._state == 'online' && this.app.connected() &&
          this._requestCount < this._class.connectionLimit() ) {
      var context =  opts.context && opts.context._uid;
      if ( !opts._inProgress && !this._inContext(opts.context) ) {
        this.send(opts);
        this._requests[index]._inProgress = true;
        context && (this._contexts[context] = true);
        this._requestCount ++;
      }
      this.start(index + 1);
    }
  },

  offline: function() {
    this._state = 'offline';
    this.app.on('online', this.restart, this);
  },

  restart: function() {
    this.app.off('online', this.restart);
    this._state = 'restarting';
    var self = this;
    setTimeout(function() {
      self._reset();
    }, 5000);
  },

  _reset: function() {
    if (this._state == 'restarting') {
      this.start();
      this._requestCount = 0;
      this._contexts = {};
      $.each(this._requests, function(i, request) {
        request._inProgress && (request._inProgress = false);
      });
    }
  },

  send: function(originalOpts) {
    var self = this;
    var opts = $.extend({}, originalOpts);
    opts.success = function(response) {
      self.onSuccess(response, originalOpts);
    };
    opts.complete = function(response) {
      self.onComplete(response, originalOpts);
    };
    opts.error = function(response) {
      self.onError(response, originalOpts);
    };

    var type = (opts.httpMethod || opts.type || 'get').toLowerCase();
    if (type == 'put' || type == 'delete') {
      opts.type = 'post';
      opts.data = opts.data || {};
      opts.data._method = type;
    }

    delete opts.context; // to avoid it calling the original context's success method

    $.ajax(opts);
  },

  onSuccess: function(response, opts) {
    this._clearRequest(opts);
    this._callback(response, opts, 'success');
  },

  onError: function(response, opts) {
    this.app.checkConnection(); // should be non asych
    if (this.app.connected()) {
      this._clearRequest(opts);
      this._callback(response, opts, 'error');
    }
  },

  onComplete: function(response, opts) {
    this._requestCount --;
    this._callback(response, opts, 'complete');
    this.start();
  },

  _clearRequest: function(opts) {
    if (opts.context && opts.context._uid) {
      delete this._contexts[opts.context._uid];
    }
    this._requests.splice(this._requests.indexOf[opts], 1);
  },

  _callback: function(response, opts, name) {
    if (opts[name]) {
      if (opts.context) {
        opts[name].apply(opts.context, [response]);
      } else {
        opts[name](response);
      }
    }
  }
}, {
  connectionLimit: function() {
    if (!this._connectionLimit) {
      this._connectionLimit = (Wheel.Utils.Loader.canZepto() ? 6 : 2);
    }
    return this._connectionLimit;
  }
});
Wheel.App = Wheel.Class.Singleton.subclass({
  init: function() {
    window.app = this;
    this.listen();
    this.connectionChecker = Wheel.Utils.ConnectionChecker.create({app: this});
  },

  listen: function() {
    // override for specifics of the app
  },

  checkConnection: function() {
    if ( ('onLine' in navigator) && (navigator.onLine == false)) {
      this.connected(false);
    } else {
      this.connectionChecker.test();
    }
  },

  connected: function(value) {
    if (value != undefined && this._connected != value) {
      var event = value ? 'online' : 'offline';
      this._connected = value;
      this.trigger(event);
    }
    return this._connected;
  }
}).mixin(Wheel.Mixins.Events);
