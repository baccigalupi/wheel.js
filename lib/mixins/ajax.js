Wheel.Mixins.Ajax = {
  init: function() {
    this._super();
    this.httpMethod = this.httpMethod || 'get';
    this.dataType = this.dataType || 'json';
  },

  send: function () {
    if(this._super) { this._super(); }
    $.ajax({
      url: this.url,
      context: this,
      data: this.data(),
      type: this.httpMethod,
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
  }

  /* mixin expects these methods to be implemented in
   * the recepient class
   *
        data: function() { return {}; },
        onSuccess: function () {},
        onCompletion: function () {},
        onError: function () {}
   */
};
