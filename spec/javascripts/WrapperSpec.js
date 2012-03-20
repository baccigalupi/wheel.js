describe("Wrapper", function () {
  var Wrap, wrap;

  beforeEach(function() {
    Wrap = jlisten.Wrapper.subclass();
  });

  describe("initialization", function () {
    beforeEach(function() {
      spyOn(jlisten.Wrapper.prototype, 'init');
      spyOn(jlisten.Wrapper.prototype, 'listen');
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

    it("calls init", function () {
      expect(jlisten.Wrapper.prototype.init).toHaveBeenCalled();
    });

    it("calls listen", function () {
      expect(jlisten.Wrapper.prototype.listen).toHaveBeenCalled();
    });
  });

  describe("gather", function() {
    var html;
    beforeEach(function () {
      html =
      "  <ul class='lister'>" +
      "    <li class='item'>one</li>" +
      "    <li class='seperator'></li>" +
      "    <li class='item'>two</li>" +
      "  </ul>";
    });

    describe("failure", function () {
      it("requires a selector", function () {
        var raises = false;
        try {
          Wrap.gather(html);
        } catch (e) {
          raises = true;
          expect(e).toBe("Define a cssSelector on the class to use the 'gather' class method");
        }
        expect(raises).toBe(true);

        //expect(Wrap.gather(html)).toThrow("Define a cssSelector on the class to use the 'gather' class method");
      });
    });

    describe('success', function () {
      var gathered;
      beforeEach(function() {
        Wrap.cssSelector = 'li.item';
      });

      describe('given a parent element', function () {
        beforeEach(function() {
          gathered = Wrap.gather(html);
        });

        it("finds the right number of elements", function () {
          expect(gathered.length).toBe(2);
        });

        it("creates the right kind of object", function () {
          expect(gathered[0] instanceof Wrap).toBe(true);
          expect(gathered[1] instanceof Wrap).toBe(true);
        });

        it("creates objects with the correct dom", function() {
          expect(gathered[0].$.is('li.item')).toBeTruthy();
          expect(gathered[1].$.is('li.item')).toBeTruthy();
          expect(gathered[0].$.text()).toBe('one');
          expect(gathered[1].$.text()).toBe('two');
        });
      });

    });

  });
});
