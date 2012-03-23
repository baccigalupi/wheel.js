jlisten.widgets.AjaxLink = jlisten.widgets.Link.subclass({
  init: function() {
    this.httpMethod = this.httpMethod || 'get';
  }
});
