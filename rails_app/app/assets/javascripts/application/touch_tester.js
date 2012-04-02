Application.TouchTester = Wheel.View.subclass({
  init: function() {
    $(document.body).append(this.$);
  },

  listen: function() {
    var self = this;
    this.$.bind('touchhold', function(e) {
      self.$.append("<p>touchhold - "+ new Date() +"; pageX: "+e.pageX+"; pageY: "+e.pageY+"</p>");
    });
  }
}, {
  template: function() {
    return "<div class='touch_tester'/>"
  }
});
