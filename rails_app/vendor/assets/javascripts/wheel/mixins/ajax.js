Wheel.Mixins.Ajax = {
  init: function() {
    this._super();
    this.httpMethod = this.httpMethod || 'get';
    this.dataType = this.dataType || 'json';
  },

  send: function () {
    this._super && this._super();

    var json = this.data() || {},
        type = this.httpMethod;
    if ( type.match(/delete|put/i) && !json._method ) {
      json._method = type;
      type = 'post';
    }

    $.ajax({
      url: this.url,
      context: this,
      data: json,
      type: type,
      dataType: this.dataType,
      success: this.onSuccess,
      error: this.processError,
      complete: this.onCompletion
    });
  },

  processError: function (xhr) {
    try {
      this.onError(JSON.parse(xhr.responseText));
    } catch(e) {
      this.onError({status: xhr.statusCode(), message: xhr.responseText});
    }
  },

  data: function() { return {} },
  onCompletion: function() {},
  onSuccess: function() {},
  onError: function() {}

  /* mixin expects these methods to be implemented in
   * the recepient class
   *
        data: function() { return {}; },
        onSuccess: function () {},
        onCompletion: function () {},
        onError: function () {}
   */
};
