Wheel.Mixins.Ajax = {
  send: function (overrides) {
    this._requestQueue = this._requestQueue || Wheel.Utils.RequestQueue.singleton;
    var data = this.data();

    var opts = {
      url: this.url,
      context: this,
      data: data,
      type: (overrides && overrides.httpMethod) || this.httpMethod,
      dataType: this.dataType || 'json',
      success: this.onSuccess,
      error: this.processError,
      complete: this.onCompletion
    };
    overrides && $.extend(opts, overrides);
    this._requestQueue.add(opts);
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
