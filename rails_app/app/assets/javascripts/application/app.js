var Application = Wheel.Application.subclass({
  init: function() {
    this.touchManager = new Wheel.BodyListener();
    this.tester = new Application.TouchTester();
  }
}, {
  identifier: 'App'
});


