;(function() {
  var remove = $.fn.remove;
  $.fn.detach = remove;

  $.fn.remove = function() {
    remove.apply(this, arguments);
    $.fn.off.apply(this);
    return this;
  };
})();
