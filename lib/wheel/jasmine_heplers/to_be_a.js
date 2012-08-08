beforeEach(function() {
  this.addMatchers({
    toBeA: function(expected) {
      this.message = function() {
        var actual = (this.actual && this.actual.constructor && this.actual.constructor.id);
        actual = actual ? 'instance of ' + actual : this.actual;
        return 'Expected ' + actual + ' to be an instance of ' + expected.id;
      };
      return (this.actual instanceof expected);
    }
  });
});
