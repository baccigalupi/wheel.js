Wheel.Class('Wheel.App', {
  _preInit: function(opts) {
    this._super(opts);
    this.initApp();
    this._class.app = this;
    window.app = this;
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
  Models: {}
});
