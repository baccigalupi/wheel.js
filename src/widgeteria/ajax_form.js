Wheel.Widgeteria.Form.subclass('Wheel.Widgeteria.AjaxForm', {
  onSubmit: function(e) {
    this.send();
  }
});

Wheel.Widgeteria.AjaxForm.mixin(Wheel.Mixins.Ajax);
