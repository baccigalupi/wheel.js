Wheel.View.subclass('Wheel.Widgeteria.Link', {
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
        // todo: figure out if bubbling needs to be halted in this case
        e.stopPropagation();
      }
      if (! self.disabled ) {
        self.onClick(e);
      }
    });
  },

  onClick: function(e) {/* overwrite me */}
}, {
  selector: 'a'
});
