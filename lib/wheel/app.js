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
