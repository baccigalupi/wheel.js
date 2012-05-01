Wheel.Mixins.Ajax = {
  init: function() {
    this._super && this._super();
    this.httpMethod = this.httpMethod || 'get';
    this.dataType = this.dataType || 'json';
  },

  send: function (overrides) {
    this._super && this._super();

    var data = this.data() || {},
        type = (overrides && overrides.httpMethod) || this.httpMethod;
    if ( type.match(/delete|put/i) && !data._method ) {
      data._method = type;
      type = 'post';
    }

    var opts = {
      url: this.url,
      context: this,
      data: data,
      type: type,
      dataType: this.dataType,
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
  data: function() { return (this._super && this._super()) || {} },
  onCompletion: function(response) {this._super && this._super(response)},
  onSuccess:    function(response) {this._super && this._super(response)},
  onError:      function(response) {this._super && this._super(response)}
};
