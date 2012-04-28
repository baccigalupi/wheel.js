Wheel.Utils.Storage = {
  set: function(key, value) {
    localStorage[key] = JSON.stringify(value);
    return this;
  },

  get: function(key) {
    return JSON.parse(localStorage[key]);
  }
}
