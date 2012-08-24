Wheel.Class('Wheel.Utils.TimedQueue', {
  init: function() {
    this.steps = [];
  },

  add: function(step, wait) {
    this.steps.push({
      step: step,
      wait: wait >= 0 ? wait : this.defaultWait
    });
  },

  wait: function(wait) {
    this.add(this._stub, wait);
  },

  run: function() {
    var wait = 0;
    $.each(this.steps, function(i, item) {
      wait += item.wait;
      setTimeout(item.step, wait);
    });
    this.steps = [];
  },

  _stub: function() {},

  defaultWait: 500
});
