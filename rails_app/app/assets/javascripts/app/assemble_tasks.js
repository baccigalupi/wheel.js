var AssembleTask = Wheel.View.subclass({
  init: function() {
    // store the stuff you will need to manage your view
    this.url = this.$.attr('href');
    this.$checkbox = this.$.find('input');
  },

  listen: function() {
    // add event listeners to elements
    var self = this;
    this.$checkbox.on('click', function() {
      self.$.addClass('sending');
      self.send(); // from the Ajax mixin
    });
  },

  // the 'send' method will call these during ajaxy stuff
  onCompletion: function() {
    console.log('completed');
    this.$.removeClass('sending');
  },

  onSuccess: function() {
    console.log('finished');
    this.$.addClass('finished');
  },

  onError: function() {
    console.log('error');
    this.$.addClass('error');
  }
}, {
  template: function() {
    return "<li class='task' href='/task/{{id}}'><input type='checkbox' name='complete'/><p>{{name}}</p></li>";
  }
});

AssembleTask.mixin(Wheel.Mixins.Ajax);

