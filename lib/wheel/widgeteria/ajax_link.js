Wheel.Widgeteria.Link.subclass('Wheel.Widgeteria.AjaxLink', {
  onClick: function(e) {
    this.send();
  }
});

Wheel.Widgeteria.AjaxLink.mixin(Wheel.Mixins.Ajax);
