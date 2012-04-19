Wheel.Widgeteria.AjaxForm = Wheel.Widgeteria.Form.subclass({
  onSubmit: function(e) {
    this.send();
  },

  // stub methods, should be overwritten by subclasses
  data: function() { return {}; },
  onSuccess: function () {},
  onCompletion: function () {},
  onError: function () {}
});

Wheel.Widgeteria.AjaxForm.mixin(Wheel.Mixins.Ajax);
