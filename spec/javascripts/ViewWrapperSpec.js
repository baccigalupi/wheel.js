describe("ViewWrapper", function () {
  var Wrap, wrap;

  beforeEach(function() {
    Wrap = jlisten.ViewWrapper.subclass();
  });

  describe("initialization", function () {
    beforeEach(function() {
      wrap = new Wrap('<div class="wrap" id="wrapper"></div>', {
        thingy: true,
        that: function() {return 'that';}
      });
    });

    it("wraps a reference to the dom", function () {
      expect(wrap.$.hasClass('wrap')).toBe(true);
    });

    it("stores options passed in as instance attributes", function() {
      expect(wrap.thingy).toBe(true);
      expect(wrap.that()).toBe('that');
    });
  });
});
