jlisten.widgets.Link = jlisten.View.subclass({
  init: function() {
    this.url = this.$.attr('href');
    this.propagate = (this.propagate == undefined) ? true : this.propagate;
    if ( this.disabled == undefined && this.$.attr('disabled') ) {
      this.disabled = true;
    }
  },

  listen: function() {
    var self = this;
    this.$.bind('click', function(e) {
      e.preventDefault();
      if ( !self.propagate ) {
        e.stopPropagation();
      }
      if (! self.disabled ) {
        self.onClick(e);
      }
    });
  },

  onClick: function(e) {/* overwrite me */}
});
