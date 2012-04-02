Application.TouchTester = Wheel.View.subclass({
  init: function() {
    $(document.body).append(this.$);
  },

  listen: function() {
    var self = this;
    this.$.bind('touchhold', function(e) {
      self.logEvent('touchhold', e);
    });
    this.$.bind('tap', function(e) {
      self.logEvent('tap', e);
    });
  },

  logEvent: function(type, e) {
     this.$.append(
      "<p>"+type+" - "+
      new Date() +
      "; pageX: " +
      e.pageX +
      "; pageY: " +
      e.pageY +
      "; originalEvent" +
      e +
      "</p>"
    );
  }
}, {
  template: function() {
    return "<div class='touch_tester'/>"
  }
});
