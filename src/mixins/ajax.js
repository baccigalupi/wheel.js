Wheel.Mixins.Ajax = {
  send: function (overrides) {
    overrides = overrides || {};
    var data = overrides.data || this.data();

    var opts = {
      url:      overrides.url || this.url,
      data:     data,
      type:     overrides.httpMethod || this.httpMethod,
      dataType: this.dataType || 'json',
      success:  overrides.success || this.onSuccess,
      error:    this.processError,
      complete: overrides.complete || this.onCompletion
    };
    overrides && $.extend(opts, overrides);
    this._send(opts);
  },

  _send: function(opts) {
    opts.success =  opts.success.bind(this);
    opts.complete = opts.complete.bind(this);
    opts.error =    opts.error.bind(this);
    $.ajax(opts);
  },

  processError: function (xhr) {
    try {
      this.onError(JSON.parse(xhr.responseText));
    } catch(e) {
      this.onError({status: xhr.statusCode(), message: xhr.responseText});
    }
  },

  // reimplement these in classes
  data: function() { return {}; },
  onCompletion: function(response) {},
  onSuccess:    function(response) {},
  onError:      function(response) {}
};
