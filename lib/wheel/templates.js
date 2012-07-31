Wheel.Class.Singleton.subclass('Wheel.Templates', {
  optionize: function(opts) {
    this.append(opts);
  },

  gather: function() {
    var self = this;
    $('script.template').each(function(index, template) {
      var $template = $(template);
      self._makePath($template.attr('name'), $template.html());
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
      this._makePath(key, templates[key]);
    }
  },

  _makePath: function(key, value) {
    var name, i;
    var names = key.split('.');
    var length = names.length;
    var path = this;
    for (i = 0; i < length; i++) {
      name = names[i];
      path[name] = path[name] || {};
      if ( i === length - 1) {
        path[name] = value;
      }
      path = path[name];
    }
  }
});
