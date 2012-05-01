Wheel.App = Wheel.Class({
  initialize: function() {
    if ( !window.app ) {
      window.app = this;
      this.checkConnection();
      this.init();
      this.listen();
    }
  },

  init: function() {
    // override for specifics of the app
  },

  listen: function() {
    // override for specifics of the app
  },

  checkConnection: function() {
    this.connectionChecker ||
      (this.connectionChecker = new Wheel.Utils.ConnectionChecker({app: this}));
    if ( navigator.onLine != undefined ) {
      this.connected(navigator.onLine);
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
