beforeEach(function() {
});

function fail() {
  expect(true).toBe(false);
};

function pend() {
  expect("pending test").toBe(false);
}

var mockTouchEvent = function(opts) {
  opts = opts || {};
  return {
    timestamp: opts.timestamp || Date.now(),
    type: opts.type || 'touchstart',
    originalEvent: {
      clientX: opts.clientX || 300,
      clientY: opts.clientY || 100,
      pageX: opts.pageX || 300,
      pageY: opts.pageX || 100,
      screenX: opts.screenX || 300,
      screenY: opts.screenY || 100
    }
  };
};

