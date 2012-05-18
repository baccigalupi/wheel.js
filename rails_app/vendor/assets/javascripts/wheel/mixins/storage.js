// Not sure about the naming of the methods,
// will see what is needed when the request queue and models come about
Wheel.Mixins.Storage = {
  _storageKey: function(key) {
    var prekey = [];
    this._class && this._class.id && (prekey.push(this._class.id + '.'));
    this.id && (prekey.push(this.id + '.'));
    return prekey.join('') + key;
  },

  getLocal: function(key) {
    return Wheel.Utils.Storage.get(this._storageKey(key));
  },

  setLocal: function(key, value) {
    return Wheel.Utils.Storage.set(this._storageKey(key), value);
  },

  localData: function(key, value) {
    return value ? this.setLocal(key, value) : this.getLocal(key);
  }
};
