var AssembledTask = Wheel.View.subclass({
  // store the stuff you will need to manage your view
  init: function() {
    this.url = this.$.attr('href');
    this.$checkbox = this.$.find('input');
  },

  // add event listeners to elements
  listen: function() {
    var self = this;
    this.$checkbox.on('click', function() {
      self.$.addClass('sending');
    });
  }

  // more logic for this view ...
}, {
  template: function() {
    return "<li class='task' href='/task/{{id}}'><input type='checkbox' name='complete'/><p>{{name}}</p></li>";
  }
});


var tasks = Task.assemble([{id: 42, name: 'dazzle'}, {id: 43, name: 'excite'}]);
var app = Wheel.View('#app');
app.append(tasks);
