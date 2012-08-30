/*
 * Wheel.js - version 0.3.0
 * http://github.com/baccigalupi/wheel.js
 * Copyright (c) 2012 Kane Baccigalupi
 * Licensed MIT: http://github.com/baccigalupi/wheel.js/LICENSE.txt
 *
 * Included Libraries:
 * ================================================================
 * Modernizr 2.5.3 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-draganddrop-touch-cssclasses-teststyles-hasevent-prefixes-load
 *
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 *
 * Zepto v1.0rc1 - polyfill zepto event detect fx ajax form touch - zeptojs.com/license
 *
 * jQuery JavaScript Library v1.7.2
 *  http://jquery.com/ Copyright 2011, John Resig. Dual licensed under the MIT or GPL Version 2 licenses. http://jquery.org/license
 *  Includes Sizzle.js http://sizzlejs.com/ Copyright 2011, The Dojo Foundation. Released under the MIT, BSD, and GPL Licenses.
 *
 * Backbone.js 0.9.2 (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.MIT license.
 *
 * todo: add ember, jquery cookies plugin, remy's localStorage fill??
 *
 */
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
;/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */
var Mustache = (typeof module !== "undefined" && module.exports) || {};

(function (exports) {

  exports.name = "mustache.js";
  exports.version = "0.5.0-dev";
  exports.tags = ["{{", "}}"];
  exports.parse = parse;
  exports.compile = compile;
  exports.render = render;
  exports.clearCache = clearCache;

  // This is here for backwards compatibility with 0.4.x.
  exports.to_html = function (template, view, partials, send) {
    var result = render(template, view, partials);

    if (typeof send === "function") {
      send(result);
    } else {
      return result;
    }
  };

  var _toString = Object.prototype.toString;
  var _isArray = Array.isArray;
  var _forEach = Array.prototype.forEach;
  var _trim = String.prototype.trim;

  var isArray;
  if (_isArray) {
    isArray = _isArray;
  } else {
    isArray = function (obj) {
      return _toString.call(obj) === "[object Array]";
    };
  }

  var forEach;
  if (_forEach) {
    forEach = function (obj, callback, scope) {
      return _forEach.call(obj, callback, scope);
    };
  } else {
    forEach = function (obj, callback, scope) {
      for (var i = 0, len = obj.length; i < len; ++i) {
        callback.call(scope, obj[i], i, obj);
      }
    };
  }

  var spaceRe = /^\s*$/;

  function isWhitespace(string) {
    return spaceRe.test(string);
  }

  var trim;
  if (_trim) {
    trim = function (string) {
      return string == null ? "" : _trim.call(string);
    };
  } else {
    var trimLeft, trimRight;

    if (isWhitespace("\xA0")) {
      trimLeft = /^\s+/;
      trimRight = /\s+$/;
    } else {
      // IE doesn't match non-breaking spaces with \s, thanks jQuery.
      trimLeft = /^[\s\xA0]+/;
      trimRight = /[\s\xA0]+$/;
    }

    trim = function (string) {
      return string == null ? "" :
        String(string).replace(trimLeft, "").replace(trimRight, "");
    };
  }

  var escapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;'
  };

  function escapeHTML(string) {
    return String(string).replace(/&(?!\w+;)|[<>"']/g, function (s) {
      return escapeMap[s] || s;
    });
  }

  /**
   * Adds the `template`, `line`, and `file` properties to the given error
   * object and alters the message to provide more useful debugging information.
   */
  function debug(e, template, line, file) {
    file = file || "<template>";

    var lines = template.split("\n"),
        start = Math.max(line - 3, 0),
        end = Math.min(lines.length, line + 3),
        context = lines.slice(start, end);

    var c;
    for (var i = 0, len = context.length; i < len; ++i) {
      c = i + start + 1;
      context[i] = (c === line ? " >> " : "    ") + context[i];
    }

    e.template = template;
    e.line = line;
    e.file = file;
    e.message = [file + ":" + line, context.join("\n"), "", e.message].join("\n");

    return e;
  }

  /**
   * Looks up the value of the given `name` in the given context `stack`.
   */
  function lookup(name, stack, defaultValue) {
    if (name === ".") {
      return stack[stack.length - 1];
    }

    var names = name.split(".");
    var lastIndex = names.length - 1;
    var target = names[lastIndex];

    var value, context, i = stack.length, j, localStack;
    while (i) {
      localStack = stack.slice(0);
      context = stack[--i];

      j = 0;
      while (j < lastIndex) {
        context = context[names[j++]];

        if (context == null) {
          break;
        }

        localStack.push(context);
      }

      if (context && typeof context === "object" && target in context) {
        value = context[target];
        break;
      }
    }

    // If the value is a function, call it in the current context.
    if (typeof value === "function") {
      value = value.call(localStack[localStack.length - 1]);
    }

    if (value == null)  {
      return defaultValue;
    }

    return value;
  }

  function renderSection(name, stack, callback, inverted) {
    var buffer = "";
    var value =  lookup(name, stack);

    if (inverted) {
      // From the spec: inverted sections may render text once based on the
      // inverse value of the key. That is, they will be rendered if the key
      // doesn't exist, is false, or is an empty list.
      if (value == null || value === false || (isArray(value) && value.length === 0)) {
        buffer += callback();
      }
    } else if (isArray(value)) {
      forEach(value, function (value) {
        stack.push(value);
        buffer += callback();
        stack.pop();
      });
    } else if (typeof value === "object") {
      stack.push(value);
      buffer += callback();
      stack.pop();
    } else if (typeof value === "function") {
      var scope = stack[stack.length - 1];
      var scopedRender = function (template) {
        return render(template, scope);
      };
      buffer += value.call(scope, callback(), scopedRender) || "";
    } else if (value) {
      buffer += callback();
    }

    return buffer;
  }

  /**
   * Parses the given `template` and returns the source of a function that,
   * with the proper arguments, will render the template. Recognized options
   * include the following:
   *
   *   - file     The name of the file the template comes from (displayed in
   *              error messages)
   *   - tags     An array of open and close tags the `template` uses. Defaults
   *              to the value of Mustache.tags
   *   - debug    Set `true` to log the body of the generated function to the
   *              console
   *   - space    Set `true` to preserve whitespace from lines that otherwise
   *              contain only a {{tag}}. Defaults to `false`
   */
  function parse(template, options) {
    options = options || {};

    var tags = options.tags || exports.tags,
        openTag = tags[0],
        closeTag = tags[tags.length - 1];

    var code = [
      'var buffer = "";', // output buffer
      "\nvar line = 1;", // keep track of source line number
      "\ntry {",
      '\nbuffer += "'
    ];

    var spaces = [],      // indices of whitespace in code on the current line
        hasTag = false,   // is there a {{tag}} on the current line?
        nonSpace = false; // is there a non-space char on the current line?

    // Strips all space characters from the code array for the current line
    // if there was a {{tag}} on it and otherwise only spaces.
    var stripSpace = function () {
      if (hasTag && !nonSpace && !options.space) {
        while (spaces.length) {
          code.splice(spaces.pop(), 1);
        }
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    };

    var sectionStack = [], updateLine, nextOpenTag, nextCloseTag;

    var setTags = function (source) {
      tags = trim(source).split(/\s+/);
      nextOpenTag = tags[0];
      nextCloseTag = tags[tags.length - 1];
    };

    var includePartial = function (source) {
      code.push(
        '";',
        updateLine,
        '\nvar partial = partials["' + trim(source) + '"];',
        '\nif (partial) {',
        '\n  buffer += render(partial,stack[stack.length - 1],partials);',
        '\n}',
        '\nbuffer += "'
      );
    };

    var openSection = function (source, inverted) {
      var name = trim(source);

      if (name === "") {
        throw debug(new Error("Section name may not be empty"), template, line, options.file);
      }

      sectionStack.push({name: name, inverted: inverted});

      code.push(
        '";',
        updateLine,
        '\nvar name = "' + name + '";',
        '\nvar callback = (function () {',
        '\n  return function () {',
        '\n    var buffer = "";',
        '\nbuffer += "'
      );
    };

    var openInvertedSection = function (source) {
      openSection(source, true);
    };

    var closeSection = function (source) {
      var name = trim(source);
      var openName = sectionStack.length != 0 && sectionStack[sectionStack.length - 1].name;

      if (!openName || name != openName) {
        throw debug(new Error('Section named "' + name + '" was never opened'), template, line, options.file);
      }

      var section = sectionStack.pop();

      code.push(
        '";',
        '\n    return buffer;',
        '\n  };',
        '\n})();'
      );

      if (section.inverted) {
        code.push("\nbuffer += renderSection(name,stack,callback,true);");
      } else {
        code.push("\nbuffer += renderSection(name,stack,callback);");
      }

      code.push('\nbuffer += "');
    };

    var sendPlain = function (source) {
      code.push(
        '";',
        updateLine,
        '\nbuffer += lookup("' + trim(source) + '",stack,"");',
        '\nbuffer += "'
      );
    };

    var sendEscaped = function (source) {
      code.push(
        '";',
        updateLine,
        '\nbuffer += escapeHTML(lookup("' + trim(source) + '",stack,""));',
        '\nbuffer += "'
      );
    };

    var line = 1, c, callback;
    for (var i = 0, len = template.length; i < len; ++i) {
      if (template.slice(i, i + openTag.length) === openTag) {
        i += openTag.length;
        c = template.substr(i, 1);
        updateLine = '\nline = ' + line + ';';
        nextOpenTag = openTag;
        nextCloseTag = closeTag;
        hasTag = true;

        switch (c) {
        case "!": // comment
          i++;
          callback = null;
          break;
        case "=": // change open/close tags, e.g. {{=<% %>=}}
          i++;
          closeTag = "=" + closeTag;
          callback = setTags;
          break;
        case ">": // include partial
          i++;
          callback = includePartial;
          break;
        case "#": // start section
          i++;
          callback = openSection;
          break;
        case "^": // start inverted section
          i++;
          callback = openInvertedSection;
          break;
        case "/": // end section
          i++;
          callback = closeSection;
          break;
        case "{": // plain variable
          closeTag = "}" + closeTag;
          // fall through
        case "&": // plain variable
          i++;
          nonSpace = true;
          callback = sendPlain;
          break;
        default: // escaped variable
          nonSpace = true;
          callback = sendEscaped;
        }

        var end = template.indexOf(closeTag, i);

        if (end === -1) {
          throw debug(new Error('Tag "' + openTag + '" was not closed properly'), template, line, options.file);
        }

        var source = template.substring(i, end);

        if (callback) {
          callback(source);
        }

        // Maintain line count for \n in source.
        var n = 0;
        while (~(n = source.indexOf("\n", n))) {
          line++;
          n++;
        }

        i = end + closeTag.length - 1;
        openTag = nextOpenTag;
        closeTag = nextCloseTag;
      } else {
        c = template.substr(i, 1);

        switch (c) {
        case '"':
        case "\\":
          nonSpace = true;
          code.push("\\" + c);
          break;
        case "\r":
          // Ignore carriage returns.
          break;
        case "\n":
          spaces.push(code.length);
          code.push("\\n");
          stripSpace(); // Check for whitespace on the current line.
          line++;
          break;
        default:
          if (isWhitespace(c)) {
            spaces.push(code.length);
          } else {
            nonSpace = true;
          }

          code.push(c);
        }
      }
    }

    if (sectionStack.length != 0) {
      throw debug(new Error('Section "' + sectionStack[sectionStack.length - 1].name + '" was not closed properly'), template, line, options.file);
    }

    // Clean up any whitespace from a closing {{tag}} that was at the end
    // of the template without a trailing \n.
    stripSpace();

    code.push(
      '";',
      "\nreturn buffer;",
      "\n} catch (e) { throw {error: e, line: line}; }"
    );

    // Ignore `buffer += "";` statements.
    var body = code.join("").replace(/buffer \+= "";\n/g, "");

    if (options.debug) {
      if (typeof console != "undefined" && console.log) {
        console.log(body);
      } else if (typeof print === "function") {
        print(body);
      }
    }

    return body;
  }

  /**
   * Used by `compile` to generate a reusable function for the given `template`.
   */
  function _compile(template, options) {
    var args = "view,partials,stack,lookup,escapeHTML,renderSection,render";
    var body = parse(template, options);
    var fn = new Function(args, body);

    // This anonymous function wraps the generated function so we can do
    // argument coercion, setup some variables, and handle any errors
    // encountered while executing it.
    return function (view, partials) {
      partials = partials || {};

      var stack = [view]; // context stack

      try {
        return fn(view, partials, stack, lookup, escapeHTML, renderSection, render);
      } catch (e) {
        throw debug(e.error, template, e.line, options.file);
      }
    };
  }

  // Cache of pre-compiled templates.
  var _cache = {};

  /**
   * Clear the cache of compiled templates.
   */
  function clearCache() {
    _cache = {};
  }

  /**
   * Compiles the given `template` into a reusable function using the given
   * `options`. In addition to the options accepted by Mustache.parse,
   * recognized options include the following:
   *
   *   - cache    Set `false` to bypass any pre-compiled version of the given
   *              template. Otherwise, a given `template` string will be cached
   *              the first time it is parsed
   */
  function compile(template, options) {
    options = options || {};

    // Use a pre-compiled version from the cache if we have one.
    if (options.cache !== false) {
      if (!_cache[template]) {
        _cache[template] = _compile(template, options);
      }

      return _cache[template];
    }

    return _compile(template, options);
  }

  /**
   * High-level function that renders the given `template` using the given
   * `view` and `partials`. If you need to use any of the template options (see
   * `compile` above), you must compile in a separate step, and then call that
   * compiled function.
   */
  function render(template, view, partials) {
    return compile(template)(view, partials);
  }

})(Mustache);
var Wheel = {
  Mixins: {},
  Utils: {},
  Widgeteria: {}
};

!window.w && (window.w = Wheel);
Wheel.Utils.ObjectPath = {
  write: function(path, value, baseObject) {
    path = path.split('.');
    baseObject = baseObject || window;
    var length = path.length;
    var i;
    if (length > 1) {
      for (i = 0; i < length - 1; i++) {
        baseObject[path[i]] || (baseObject[path[i]] = {});
        baseObject = baseObject[path[i]];
      }
    }
    baseObject[path[length-1]] = value;
    return value;
  },

  read: function(path, baseObject) {
    path = path.split('.');
    baseObject = baseObject || window;
    var length = path.length;
    var i;
    for (i = 0; i < length; i++) {
      if (!baseObject[path[i]]) { return null; }
      baseObject = baseObject[path[i]];
    }
    return baseObject;
  }
};
/* And a little bit of Underscore ...
 * Licence:
 *  Underscore.js 1.3.3
    (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
    Underscore is freely distributable under the MIT license.
    Portions of Underscore are inspired or borrowed from Prototype,
    Oliver Steele's Functional, and John Resig's Micro-Templating.
    For all details and documentation:
    http://documentcloud.github.com/underscore
*/
(function(root) {
  if (root._) {
    Wheel.isFunction  = _.isFunction;
    Wheel.isString    = _.isString;
    Wheel.isNumber    = _.isNumber;
    Wheel.isNull      = _.isNull;
    Wheel.isUndefined = _.isUndefined;
    Wheel.isElement   = _.isElement;
    Wheel.isArray     = _.isArray;
    Wheel.isObject    = _.isObject;
  } else {
    Wheel.isFunction = function(obj) {
      return typeof obj === 'function' || toString.call(obj) == '[object Function]';
    };

    Wheel.isString = function(obj) {
      return toString.call(obj) == '[object String]';
    };

    Wheel.isNumber = function(obj) {
      return toString.call(obj) == '[object Number]';
    };

    Wheel.isNull = function(obj) {
      return obj === null;
    };

    Wheel.isUndefined = function(obj) {
      return obj === void 0;
    };

    Wheel.isElement = function(obj) {
      return !!(obj && obj.nodeType == 1);
    };

    Wheel.isArray = function(obj) {
      return toString.call(obj) == '[object Array]';
    };

    Wheel.isObject = function(obj) {
      return obj === Object(obj) && !Wheel.isFunction(obj) && !Wheel.isArray(obj);
    };
  }

  Wheel.is$ = function(obj) {
    return !!obj.addClass;
  };
})(window);
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

/*
 * Object Orientation inspired by John Resig's post on simple class inheritance
 * http://ejohn.org/blog/simple-javascript-inheritance/
 *
 */

// The foundation of Wheel.js is a
(function(){
  Function.prototype.bind = Function.prototype.bind || function(context) {
    var func = this;
    return function() {
      return func.apply(context, arguments);
    };
  };

  /* taken from Ember.js! */
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
      Wheel.Utils.ObjectPath.write(id, Class);
    }
    return Class;
  };
})();
Wheel._Class.subclass('Wheel.Base', {
  initialize: function(opts) {
    this._preInit(opts);
    this.init();
    this._postInit();
  },

  _preInit: function(opts) {
    this._uid = this._class.uid();
    this.optionize(opts);
  },

  _postInit: function() {
    this.listen();
  },

  optionize: function(opts) {
    var normalOpts = {};
    var opt;
    for( opt in opts ) {
      if ( typeof this._class.prototype[opt] == 'function' ) {
        // is a property
        this['_'+opt] = opts[opt];
      } else {
        this[opt] = opts[opt];
      }
    }
  },

  init: function() {
    // overloaded by subclasses
  },

  listen: function() {
    // yup, this too
  },

  publish: function(eventType, eventData) {
    this._publisher || this._findPublisher();
    this._publisher.trigger(eventType, eventData);
  },

  subscribe: function(eventName, callback, context) {
    this._publisher || this._findPublisher();
    this._publisher.on(eventName, callback, context || this);
  },

  _findPublisher: function() {
    this._publisher = (this._class.App && this._class.App.app) || Wheel.Publisher;
    if (!this._publisher) {
      throw "Cannot find app or Wheel.Publisher. Please namespace your classes under an application class or assign a Wheel.Publisher";
    }
  }
}, {
  uid: function() {
    Wheel.Base._uid = Wheel.Base._uid || 0;
    return ++ Wheel.Base._uid;
  },

  build: function() {
    var klass = this;

    function Class(args) {
      return klass.apply(this, args);
    }
    Class.prototype = klass.prototype;

    return new Class(arguments);
  },

  attrAccessor: function(prop) {
    var propId = '_'+prop;
    this.prototype[prop] = function(value){
      if (value !== undefined) {
        this[propId] = value;
        if (self[propId] != value) {
          this.trigger('change');
          this.trigger('change:'+prop);
        }
      }
      return this[propId];
    };
  },

  subclass: function(name, iprops, cprops) {
    var klass = this._subclass(name, iprops, cprops);
    if (klass.properties && klass.properties.length) {
      $.each(klass.properties, function(i, prop) {
        if ( typeof klass.prototype[prop] !== 'function' ) {
          klass.attrAccessor(prop);
        }
      });
    }
    if (Wheel.isString(name)) {
      var path = name.split('.');
      var length = path.length;
      var i, base = window;
      for (i = 0; i < length-1; i++) {
        base = window[path[i]];
        if (base && base._typeof === 'Wheel.App') {
          klass.App = base;
          break;
        }
      }
    }
    return klass;
  }
});

Wheel.Base.mixin(Wheel.Mixins.Events);

if (Wheel.Mixins['ManagedAjax']) {
  Wheel.Base.mixin(Wheel.Mixins.ManagedAjax);
} else {
  Wheel.Base.mixin(Wheel.Mixins.Ajax);
}

Wheel.Class = function(x, y, z) {
  return Wheel.Base.subclass(x, y, z);
};
Wheel.Base.subclass('Wheel.Class.Singleton', {
  initialize: function(opts) {
    if (!this._class.singleton) {
      this._class.singleton = this;
      this._super(opts);
    }
  }
}, {
  build: function() {
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


Wheel.Class('Wheel.App', {
  _preInit: function(opts) {
    this._super(opts);
    this.initApp();
    this._class.app = this;
    this._class.App = this._class;
  },

  initApp: function() {
    this.eventManager = Modernizr.touch ? Wheel.TouchManager.build() : Wheel.MouseManager.build();
    this.templates = Wheel.Templates.build();
    this.templates.gather(); // no harm, no foul
  },

  manageRequests: function() {
    this.connectionChecker = Wheel.Utils.ConnectionChecker.build();
    this.requestQueue = Wheel.Utils.RequestQueue.build({app: this});

    this.connectionChecker.on('offline', function() {
      this.connected(false);
    }.bind(this));

    this.connectionChecker.on('online', function() {
      this.connected(true);
    }.bind(this));
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
    if (value === false) {
      this.trigger('offline-beacon');
    }
    return this._connected;
  }
}, {
  Views: {},
  Models: {},
  _typeof: 'Wheel.App',

  subclass: function(name, iprops, cprops) {
    this.children = this.children || [];
    var klass = this._super(name, iprops, cprops);
    this.children.push(klass);
    return klass;
  },

  start: function() {
    this.children && $.each(this.children, function(i, klass) {
      klass.build();
    });
  }
});
Wheel.Class.Singleton.subclass('Wheel.Templates', {
  optionize: function(opts) {
    this.append(opts);
  },

  gather: function() {
    var self = this;
    $('script.template').each(function(index, template) {
      var $template = $(template);
      Wheel.Utils.ObjectPath.write($template.attr('name'), $template.html(), self);
    });
  },

  retrieve: function(url) {
    var self = this;
    $.ajax({
      url: url || '/templates',
      success: function(response) {
        self.append(response);
      }
    });
  },

  append: function(templates) {
    var key;
    for (key in templates) {
      Wheel.Utils.ObjectPath.write(key, templates[key], this);
    }
  }
});
Wheel.Class('Wheel.View', {
  initialize: function(dom, opts) {
    this.initializeDom(dom, opts);
    this.init();
    this._postInit();
  },

  initializeDom: function(dom, opts) {
    if ( dom && (dom.addClass || dom instanceof HTMLElement || Wheel.isString(dom) ) ) {
      this._preInit(opts);
      this.$ = this.wrapDom(dom);
    } else {
      this._preInit(dom);
      this.$ = this.renderDefault();
    }
  },

  wrapDom: function(dom) {
    return $(dom);
  },

  renderDefault: function() {
    var rendered = this.renderTemplate();
    this.parent && this.appendToParent(rendered);
    return rendered;
  },

  renderTemplate: function(keyOrData, data) {
    var key;
    if ( Wheel.isString(keyOrData) ) {
      key = keyOrData;
    } else {
      data = keyOrData;
    }
    return $(Mustache.render(this._class.template(key), data || this.viewModel()));
  },

  appendToParent: function(rendered) {
    this.parent.append ? this.parent.append(rendered) : $(this.parent).append(rendered);
  },

  viewModel: function() {
    var view;
    if ( this.model ) {
      view = this.model;
    } else {
      view = this;
    }
    return view;
  },


  // delegates to the dom manager
  _delegate: function(method, obj) {
    if ($.isArray(obj)) {
      var self = this;
      $.each(obj, function(index, o) {
        self._delegateOne(method, o);
      });
    } else {
      this._delegateOne(method, obj);
    }
  },

  _delegateOne: function(method, obj) {
    this.$[method](obj.$ || obj);
  },

  append: function(obj) {
    this._delegate('append', obj);
  },

  prepend: function(obj) {
    this._delegate('prepend', obj);
  },

  find: function(obj) {
    this._delegateOne(obj);
  }
},{
  templateRepository: function() {
    if (!this._templateRepository) {
      this._templateRepository = this._getTemplateRepository();
    }
    return this._templateRepository;
  },

  _getTemplateRepository: function() {
    return this.App && this.App.app && this.App.app.templates;
  },

  templates: function() {
    if (!this._templates && this !== Wheel.View) {
      this._templates = Wheel.Utils.ObjectPath.read(this.id, this.templateRepository());
      var superTemplates = this.superclass.templates && this.superclass.templates();
      if (superTemplates && this._templates) {
        var key;
        for(key in superTemplates) {
          if (!this._templates[key]) { this._templates[key] = superTemplates[key]; }
        }
      }
    }
    return this._templates;
  },

  defaultTemplate: 'default',

  template: function(key) {
    var templates = this.templates();
    if (!templates) {
      throw "No templates found for View: " + this.id;
    }
    var template;
    if (Wheel.isString(templates)) {
      template = templates;
    } else {
      template = key ? templates[key] : templates[this.defaultTemplate];
    }
    return template;
  },

  // only applicable for finding things in an established dom
  gather: function(dom, opts) {
    if (!this.selector) {
      throw "Define a selector on the class to use the 'gather' class method";
    }
    var set = [],
        klass = this;
    if (Wheel.isObject(dom) && !Wheel.isElement(dom)) {
      opts = dom;
      dom = $(document.body);
    } else {
      opts = opts || {};
      dom = Wheel.is$(dom) ? dom : $(dom);
    }

    if (dom.is(this.selector)) {
      set.push(new klass(dom, opts));
    } else {
      $.each(dom.find(this.selector), function(index, item) {
        set.push(new klass(item, opts));
      });
    }

    return set;
  },

  assemble: function(models, opts) {
    var views = [];
    opts = opts || {};
    $.each(models, function(i, model) {
      opts.model = model;
      views.push(this.build(opts));
    }.bind(this));
    return views;
  }
});
Wheel.View.subclass('Wheel.EventManager', {
  initializeDom: function(opts) {
    this.optionize(opts);
    this.$ = $(document);
  },

  listen: function() {
    var self = this;
    this.$.on('pullinit', function(e) {
      self.onPullInit(e);
    });
  },

  onPullInit: function(e) {
    e.preventDefault();
    this._setTarget(e);
    this.touch.type = 'pull';
    e = this._unpackEvent(e);
		this._triggerEvent(e, 'pullstart');
  },

  onStart: function(e) {
    this.touch.ctrl = e.ctrlKey;
    e = this._normalizeEvent(e);
    this._setTarget(e);

    // this is the normalized start event
    this._triggerEvent(e, 'tapstart');

    // clear existing timeout because there is a new touch start event
    // timeouts are set for 'taphold' and/or for 'tap'
    this._clearTimeout();

    // set up the touch object
    this.touch.x1 = e.pageX;
    this.touch.y1 = e.pageY;
    this.touch.time = Date.now();

    if (!this._testDoubleTap() && !this.touch.ctrl) {
      // wait to see if this is a taphold event
      var self = this;
      this.touchTimout = setTimeout(function() {
        self._testTouchhold(e);
      }, this.HOLD_DELAY);
    }
  },

  onMove: function(e) {
    this._handlePullMove(e);
    if (this.touch.type) { return; }
    e = this._unpackEvent(e);
    this._testSwipe(e);
  },

  onEnd: function(e) {
    e = this._unpackEvent(e);
    this._triggerEvent(e, 'tapend');
    this._handlePullEnd(e);
    if (this.touch.type || this.touch.ctrl) {
      this._resetTouch();
    } else {
      this._handleTap(e);
    }
  },

  _triggerEvent: function(originalEvent, altType, eventOpts) {
    if (!this.target) { return; }
    eventOpts = eventOpts || {};
    eventOpts.pageX = 'x2' in this.touch ? this.touch.x2 : this.touch.x1;
    eventOpts.pageY = 'y2' in this.touch ? this.touch.y2 : this.touch.y1;
    eventOpts.originalEvent = originalEvent;

    this.target.trigger($.Event(altType || this.touch.type, eventOpts));
  },

  _setTarget: function(e) {
    var node = e.target;
    this.target = $('tagName' in node ? node : node.parentNode);
  },

  _clearTimeout: function() {
    this.touchTimeout && clearTimeout(this.touchTimeout);
  },

  _resetTouch: function() {
    this.lastTouch = this.touch;
    this.lastTouch.target = this.target;
    this.target = null;
    this.touch = {};
  },

  _normalizeEvent: function(e) {
    return e;
  },

  _unpackEvent: function(e) {
    e = this._normalizeEvent(e);

    if (e.type !== 'touchend') {
      this.touch.x2 = e.pageX >= 0 ? e.pageX : this.touch.x1;
      this.touch.y2 = e.pageY >= 0 ? e.pageY : this.touch.y1;
    }

    return e;
  },

  _handleTap: function(e) {
    if (this.RESPONSIVE_TAP) {
      this._onTap(e);
    } else {
      // wait to see if it is a tap, or if it is a double tap
      var self = this;
      this.touchTimeout = setTimeout(function(){
        self._onTap(e);
      }, this.DOUBLE_DELAY);
    }
  },

  _handlePullMove: function(e) {
    if (this.touch.type && this.touch.type === 'pull') {
      e.preventDefault();
      e = this._unpackEvent(e);
      this._triggerEvent(e, 'pullmove', this._eventDetails());
    }
  },

  _eventDetails: function() {
    var deltaX = this.touch.x2 - this.touch.x1;
    var deltaY = this.touch.y2 - this.touch.y1;
    var deltaTime = Date.now() - this.touch.time;
    var distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
    return {
      deltaX: deltaX,
      deltaY: deltaY,
      deltaTime: deltaTime,
      distance: distance,
      velocity: distance/deltaTime,
      angle: Math.atan2(deltaY,deltaX)
    };
  },

  _handlePullEnd: function(e) {
    if (this.touch.type && this.touch.type === 'pull') {
      e = this._unpackEvent(e);
      this._triggerEvent(e, 'pullend');
    }
  },

  _onTap: function(e) {
    this.touchTimeout = null;
    if ( this.target && e.target === this.target[0] &&
          this.TAP_TOLERANCE >= Math.abs(this.touch.x1 - this.touch.x2) &&
          this.TAP_TOLERANCE >= Math.abs(this.touch.y1 - this.touch.y2) ) {
      this.touch.type = 'tap';
      this._triggerEvent(e);
    }
    this._resetTouch();
  },

  _testDoubleTap: function(e) {
    // what about checking for distance from original tap
    var delta = this.lastTouch && this.lastTouch.time ? this.touch.time - this.lastTouch.time : 0;
    if (delta > 0 && delta <= this.DOUBLE_DELAY) {
      this.touch.type = 'doubletap';
      this._triggerEvent(e);
      return true;
    }
  },

  _testSwipe: function(e) {
    // if we have moved a certain distance, call it a swipe
    if (Math.abs(this.touch.x1 - this.touch.x2) >= this.SWIPE_TOLERANCE ||
        Math.abs(this.touch.y1 - this.touch.y2) >= this.SWIPE_TOLERANCE) {
      this.touch.type = 'swipe';
      var _direction = this._direction(this.touch.x1, this.touch.x2, this.touch.y1, this.touch.y2);
      if ( this.preventScroll(_direction) ) {
        e.preventDefault();
      }
      this._triggerEvent(e, "swipe", this._eventDetails());
      this._triggerEvent(e, "swipe" + _direction);
    }
  },

  _testTouchhold: function(e) {
    if (this.touch.type) { return; }
    var x1 = this.touch.x1,
        y1 = this.touch.y1;
        x2 = ('x2' in this.touch) ? this.touch.x2 : x1;
        y2 = ('y2' in this.touch) ? this.touch.y2 : y1;

    if ((this.touch.time && (Date.now() - this.touch.time >= this.HOLD_DELAY)) &&
        (Math.abs(x1 - x2) <= this.HOLD_TOLERANCE) &&
        (Math.abs(y1 - y2) <= this.HOLD_TOLERANCE)) {
      this.touch.type = 'taphold';
      this._triggerEvent(e);
    }
  },

  _direction: function(x1,x2, y1,y2) {
    var xDelta = Math.abs(x1 - x2),
        yDelta = Math.abs(y1 - y2);
    if (xDelta >= yDelta) {
      return (x1 - x2 > 0 ? 'left' : 'right');
    } else {
      return (y1 - y2 > 0 ? 'up' : 'down');
    }
  },

  // customizations
  preventScroll: function() { return false; },
  HOLD_DELAY: 750,
  DOUBLE_DELAY: 250,
  HOLD_TOLERANCE: 10,
  SWIPE_TOLERANCE: 60,
  TAP_TOLERANCE: 10,
  RESPONSIVE_TAP: true,
  GESTURE_TOLERANCE: 20
});
Wheel.EventManager.subclass('Wheel.TouchManager', {
  listen: function() {
    this._super();
    var self = this;
    this.touch = {};

    this.$
      .on(this.startEvent, function(e) {
        self.onStart(e);
      })
      .on(this.moveEvent, function(e) {
        self.onMove(e);
      })
      .on(this.endEvent, function(e) {
        self.onEnd(e);
      });
  },

  onStart: function(e) {
    e = this._unpackEvent(e);
    this._super(e);
  },

  onMove: function(e) {
    this._handlePullMove(e);
    if (this.touch.type) { return; }
    e = this._unpackEvent(e);
    this.multi && this._detectGesture(e);
    this._testSwipe(e);
  },

  onEnd: function(e) {
    this._super(e);
    this.multi = undefined;
  },

  _multiDistance: function(index) {
    return Math.sqrt(
      Math.pow(this.touch['x' + index] - this.multi['x' + index], 2) +
      Math.pow(this.touch['y' + index] - this.multi['y' + index], 2)
    );
  },

  _detectGesture: function(e) {
    var origDist = this._multiDistance(1);
    var newDist =  this._multiDistance(2);
    var deltaDist = Math.abs(origDist - newDist);
    var xDeltaSwipe = Math.abs(
      (this.touch.x1 - this.touch.x2) -
      (this.multi.x1 - this.multi.x2)
    );
    var yDeltaSwipe = Math.abs(
      (this.touch.y1 - this.touch.y2) -
      (this.multi.y1 - this.multi.y2)
    );

    if ( deltaDist >= this.GESTURE_TOLERANCE &&
         deltaDist >= xDeltaSwipe &&
         deltaDist >= yDeltaSwipe ) {
      this.touch.type = origDist > newDist ? 'pinch' : 'zoom';
      this._triggerEvent(e);
    }
  },

  _normalizeEvent: function(e) {
    if (e.normalized) { return e; }

    e = e.originalEvent || e;

    if (e.touches && e.touches[0]) {
      e.pageX = e.touches[0].pageX;
      e.pageY = e.touches[0].pageY;
    } else if (e.changedTouches && e.changedTouches[0]) { 
      // touchend has no touches ... the fuckers
      e.pageX = e.changedTouches[0].pageX;
      e.pageY = e.changedTouches[0].pageY;
      this.touch.x2 = e.changedTouches[0].pageX;
      this.touch.y2 = e.changedTouches[0].pageY;
    } else {
      // what is this strange beast??
      // console.log('e', e);
    }
    e.normalized = true;
    return e;
  },

  _unpackEvent: function(e) {
    e = this._super(e);

    if (e.touches && e.touches.length > 1) {
      if (this.multi) {
        this.multi.x2 = e.touches[1].pageX;
        this.multi.y2 = e.touches[1].pageY;
      } else {
        this.multi = {
          x1: e.touches[1].pageX,
          y1: e.touches[1].pageY
        };
      }
    }
    return e;
  },

  _handleTap: function(e) {
    if (this.multi) { return; }
    this._super(e);
  },

  startEvent: 'touchstart',
  moveEvent:  'touchmove',
  endEvent:   'touchend'
}, {
  id: 'Wheel.TouchManager'
});

Wheel.EventManager.subclass('Wheel.MouseManager', {
  listen: function() {
    this._super();
    var self = this;
    this.touch = {};

    function onMove(e) {
      self.onMove(e);
    }

    function onEnd(e) {
      self.onEnd(e);
      self.$.off(self.moveEvent, onMove);
    }

    // only listen for touchmove when a mousedown event
    // has occurred
    this.$.on(this.startEvent, function(e) {
      self.onStart(e);
      self.$.on(self.moveEvent, onMove);
    });

    this.$.on(this.endEvent, onEnd);
  },

  startEvent: 'mousedown',
  moveEvent:  'mousemove',
  endEvent:   'mouseup'
});

/*
 * Currently, all js files are expected to be available via the application's root url.
 * Also, the file where your app is packaged is expected to be /app.js at your domain.
 *
 * Override these locations according to your file setup.
 */
Modernizr.load({
  test: Wheel.Utils.Loader.canZepto(),
  yep:  'wheel_modern.js',
  nope: 'wheel_legacy.js',
  both: 'app.js',
  complete: function() {
    Wheel.App.start(); // yup, this will build any subclasses of Wheel.App
  }
});
