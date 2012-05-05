Wheel.Widgeteria.AjaxForm = Wheel.Widgeteria.Form.subclass({
  onSubmit: function(e) {
    this.send();
  }
});

Wheel.Widgeteria.AjaxForm.mixin(Wheel.Mixins.Ajax);
