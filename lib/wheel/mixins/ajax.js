Wheel.Mixins.Ajax = {
  send: function (overrides) {
    var data = this.data() || {},
        type = (overrides && overrides.httpMethod) || this.httpMethod || 'get';
    if ( type.match(/delete|put/i) && !data._method ) {
      data._method = type;
      type = 'post';
    }

    var opts = {
      url: this.url,
      context: this,
      data: data,
      type: type,
      dataType: this.dataType || 'json',
      success: this.onSuccess,
      error: this.processError,
      complete: this.onCompletion
    };
    overrides && $.extend(opts, overrides);
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
  data: function() { return {} },
  onCompletion: function(response) {},
  onSuccess:    function(response) {console.log('in the mixin')},
  onError:      function(response) {}
};
