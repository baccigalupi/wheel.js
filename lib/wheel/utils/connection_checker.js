// Even though this one is a fill for navigator.online, that
// property only checks to make sure that there is a connection.
// If the connection is not sending/receiving requests, the flag
// will be incorrect. This is a good backup to test real connectivity.
Wheel.Utils.ConnectionChecker = Wheel.Class({
  test: function() {
    $.ajax({
      async: false,
      url: this.url,
      context: this,
      type: 'head',
      dataType: 'json',
      success: this.onSuccess,
      error: this.processError
    });
  },

  onSuccess: function(response) {
    this.app.setConnected(true);
  },

  onError: function(response) {
    this.app.setConnected(false);
  },
});

Wheel.Utils.ConnectionChecker
  .mixin(Wheel.Mixins.Events);
