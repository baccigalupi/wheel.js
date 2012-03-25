Wheel.Widgeteria.Form = Wheel.View.subclass({
  init: function() {
    this.url = this.$.attr('action');
  },

  listen: function() {
    var self = this;
    this.$.bind('submit', function(e) {
      e.preventDefault();
      self.onSubmit(e);
    });
  },

  onSubmit: function(e) {
    // override this in subclasses
  },

  data: function() {
    var arr = this.$.serializeArray(),
        hash = {},
        current;
    $.each(arr, function(i, obj) {
      value = hash[obj.name];
      if ( hash[obj.name] ) {
        hash[obj.name] = (hash[obj.name].push && hash[obj.name].push(obj.value)) || [ hash[obj.name], obj.value ];
      } else {
        hash[obj.name] = obj.value;
      }
    });
    return hash;
  }
}, {
  cssSelector: 'form'
});
