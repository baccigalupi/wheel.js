Wheel.Templates = {
  gather: function() {
    var self = this;
    $('script.template').each(function(index, template) {
      var $template = $(template);
      var names = $template.attr('name').split('.');
      var name, i;
      var path = self;
      var length = names.length;
      for (i = 0; i < length; i++) {
        name = names[i];
        path[name] = path[name] || {};
        if ( i === length - 1) { path[name] = $template.html(); }
        path = self[name];
      }
    });
  }
};
