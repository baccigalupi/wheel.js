var GatherTask = Wheel.View.subclass({
  // store the stuff you will need to manage your view
  init: function() {
    this.url = this.$.attr('href');
    this.$checkbox = this.$.find('input');
  },

  listen: function() {
    var self = this;
    this.$checkbox.on('click', function() {
      self.$.addClass('sending');
      self.send(); // provided by the Ajax mixin
    });
  }

  // more logic for this view ...
}, {
  cssSelector: '.task'
});

GatherTask.mixin(Wheel.Mixins.Ajax);


var tasks = GatherTask.gather($(document.body));
