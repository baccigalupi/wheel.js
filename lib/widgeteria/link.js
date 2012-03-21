jlisten.widgets.Link = jlisten.View.subclass({
  init: function() {
    this.url = this.$.attr('href');
    this.propogate = this.propogate == undefined ? true : this.propogate;
  },

  listen: function() {
    var self = this;
    this.$.bind('click', function(e) {
      self.onClick(e);
    });
  },

  onClick: function(e) {}  
});
