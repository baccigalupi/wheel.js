Wheel.Class.Singleton.subclass('Wheel.Templates', {
  optionize: function(opts) {
    this.append(opts);
  },

  gather: function() {
    var self = this;
    $('script.template').each(function(index, template) {
      var $template = $(template);
      Wheel.Utils.ObjectPath.write($template.attr('name'), $template.html(), self);
    });
  },

  retrieve: function(url) {
    var self = this;
    $.ajax({
      url: url || '/templates',
      success: function(response) {
        self.append(response);
      }
    });
  },

  append: function(templates) {
    var key;
    for (key in templates) {
      Wheel.Utils.ObjectPath.write(key, templates[key], this);
    }
  }
});
