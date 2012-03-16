beforeEach(function() {
});

function fail() {
  expect(true).toBe(false);
};

function pend() {
  expect("pending test").toBe(false);
}

if (typeof sharedExamples == 'undefined' ) {
  sharedExamples = {};
}

function itShouldBehaveLike() {
  var exampleName      = _.first(arguments),
      exampleArguments = _.select(_.rest(arguments), function(arg) { return !_.isFunction(arg); }),
      innerBlock       = _.detect(arguments, function(arg) { return _.isFunction(arg); }),
      exampleGroup     = sharedExamples[exampleName];

  if(exampleGroup) {
    return describe(exampleName, function() {
      exampleGroup.apply(this, exampleArguments);
      if(innerBlock) { innerBlock(); }
    });
  } else {
    return it("cannot find shared behavior: '" + exampleName + "'", function() {
      expect(false).toEqual(true);
    });
  }
};
