Wheel.Widgeteria.AjaxLink = Wheel.Widgeteria.Link.subclass({
  onClick: function(e) {
    this.send();
  }
});

Wheel.Widgeteria.AjaxLink.mixin(Wheel.Mixins.Ajax);
