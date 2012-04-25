var App = Wheel.Application.subclass({
  init: function() {
    //this.touchManager = new Wheel.MouseManager();
    this.dragger = new Dragger();
  }
}, {
  identifier: 'app'
});


