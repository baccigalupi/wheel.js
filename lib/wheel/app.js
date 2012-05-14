Wheel.App = Wheel.Class({
  initialize: function() {
    if ( !window.app ) {
      window.app = this;
      this.init();
      this.listen();
      this.connectionChecker =  this.connectionChecker ||
         new Wheel.Utils.ConnectionChecker({app: this});
    }
  },

  init: function() {
    // override for specifics of the app
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
