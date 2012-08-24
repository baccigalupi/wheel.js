Wheel.Utils.Storage = {
  set: function(key, value) {
    localStorage[key] = JSON.stringify(value);
    return this;
  },

  get: function(key) {
    var value = localStorage[key]
    return value && JSON.parse(value);
  }
}
