beforeEach(function() {
});

function fail() {
  expect(true).toBe(false);
};

function pend() {
  expect("pending test").toBe(false);
}
