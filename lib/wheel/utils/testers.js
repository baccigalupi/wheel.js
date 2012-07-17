// underscore introspection fill
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
      return !Wheel.isFunction(obj) && obj === Object(obj);
    };
  }
})(window);
