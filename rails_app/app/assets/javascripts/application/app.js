var Application = Wheel.Application.subclass({
  init: function() {
    this.touchManager = new Wheel.TouchManager({delayForTap: false});
    this.tester = new Application.TouchTester();
  }
}, {
  identifier: 'App'
});


