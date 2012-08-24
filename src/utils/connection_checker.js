// Even though this is a technically a fill for navigator.online, that
// property only checks to make sure that there is a connection.
// If the connection is not sending/receiving requests, the flag
// will be incorrect. This is a good backup to test real connectivity.
Wheel.Class.Singleton.subclass('Wheel.Utils.ConnectionChecker', {
  init: function() {
    this.url = '/';
    this.intervalDelay = this._class.intervalDelay;
    this.pollCount = 0;
    this._super();
  },

  opts: {
    async: false,
    url: this.url,
    context: this,
    type: 'head',
    dataType: 'json'
  },

  test: function() {
    $.ajax($.extend(this.opts, {
      success: this.onSuccess,
      error: this.onError
    }));
  },

  clearInterval: function() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  },

  setInterval: function() {
    this.interval = setInterval(function() {
      $.ajax($.extend(this.opts, {
        success: self.stopPoll,
        error: self.continuePoll
      }));
    }, this.intervalDelay);
  },

  startPoll: function() {
    var self = this;
    this.pollCount = 1;
    this.setInterval();
  },

  isPolling: function() {
    return !!this.interval;
  },

  stopPoll: function() {
    this.clearInterval();
    this.intervalDelay = this._class.intervalDelay;
    this.pollCount = 0;
    this.onSuccess();
  },

  continuePoll: function() {
    this.pollCount ++;
    if (this.pollCount > 10 && this.intervalDelay < this._class.intervalDelayLimit) {
      this.clearInterval();
      this.intervalDelay *= 2;
      this.setInterval();
      this.pollCount = 0;
    }
  },

  onSuccess: function(response) {
    this.trigger('online');
  },

  onError: function(response) {
    this.trigger('offline');
    !this.isPolling() && this.startPoll();
  }
}, {
  intervalDelay: 10*1000,
  intervalDelayLimit: 2*60*1000,
  id: 'Wheel.Utils.ConnectionChecker'
});

Wheel.Utils.ConnectionChecker.mixin(Wheel.Mixins.Events);
