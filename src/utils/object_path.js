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
