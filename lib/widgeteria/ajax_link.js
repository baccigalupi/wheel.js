jlisten.widgets.AjaxLink = jlisten.widgets.Link.subclass({
  init: function() {
    this._super();
    this.httpMethod = this.httpMethod || 'get';
    this.dataType = this.dataType || 'json';
  },

  onClick: function () {
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
    this.onError(JSON.parse(xhr.responseText));
  },

  // methods to be overwritten by subclasses
  data: function() { return {}; },
  onSuccess: function () {},
  onCompletion: function () {},
  onError: function () {}
});
