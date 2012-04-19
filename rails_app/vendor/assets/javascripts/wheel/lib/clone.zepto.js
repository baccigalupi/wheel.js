// this was added in v 1.0, should upgrade!
(function() {
  if ( $.clone ) { return; }

  $.fn.clone = function() {
    return $(this.map(function() {
      return this.cloneNode(true);
    }));
  }
}());
