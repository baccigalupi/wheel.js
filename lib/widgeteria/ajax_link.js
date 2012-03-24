jlisten.widgets.AjaxLink = jlisten.widgets.Link.subclass({
  onClick: function(e) {
    this._super(e);
    this.send();
  },

  // stub methods, should be overwritten by subclasses
  data: function() { return {}; },
  onSuccess: function () {},
  onCompletion: function () {},
  onError: function () {}
});

jlisten.widgets.AjaxLink.mixin(jlisten.mixins.Ajax);
