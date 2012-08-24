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
