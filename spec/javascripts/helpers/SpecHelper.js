beforeEach(function() {
  // beA matcher
});

function fail() {
  expect(true).toBe(false);
};

function pend() {
  expect("pending test").toBe(false);
}

function spyArgs(spy) {
  return spy.argsForCall[0][0];
}
