Wheel.Widgeteria.AjaxLink = Wheel.Widgeteria.Link.subclass({
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

Wheel.Widgeteria.AjaxLink.mixin(Wheel.Mixins.Ajax);
