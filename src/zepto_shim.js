(function() {
  var remove = $.fn.remove;
  $.fn.detatch = remove;

  $.fn.remove = function() {
    remove.apply(this, arguments);
    $.fn.off.apply(this);
    return this;
  };
})();
