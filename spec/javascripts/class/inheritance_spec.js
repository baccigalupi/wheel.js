describe('Wheel.Class, inheritance', function() {
  var methods = {
    base: function(value) {
      return '`' + value + '`';
    },

    child: function(value) {
      return "<div class='wrapper'>" + this._super(value) + "</div>";
    },

    grandchild: function(value) {
      return "<div class='jacket'>" + this._super(value) + "</div>";
    }
  };

  describe('instance methods chain through the ancestors', function() {
    var repeater, wrapper, jacket;
    beforeEach(function() {
      Wheel.Class('Repeater', {
        print: methods.base
      });

      Repeater.subclass('Wrapper', {
        print: methods.child
      });

      Wrapper.subclass('Jacket', {
        print: methods.grandchild
      });

      repeater = new Repeater();
      wrapper = new Wrapper();
      jacket = new Jacket();
    });

    it('base class has the right instance method', function() {
      expect(repeater.print('foo')).toBe('`foo`');
    });

    it('children get the correct _super method in context', function() {
      expect(wrapper.print('foo')).toBe("<div class='wrapper'>`foo`</div>");
    });

    it('grandchildren go all the way up the chain', function() {
      expect(jacket.print('foo')).toBe("<div class='jacket'><div class='wrapper'>`foo`</div></div>");
    });
  });

  describe('class methods chain through the ancestors', function() {
    var repeater, wrapper, jacket;
    beforeEach(function() {
      Wheel.Class('Repeater', {},{
        print: methods.base
      });

      Repeater.subclass('Wrapper', {},{
        print: methods.child
      });

      Wrapper.subclass('Jacket', {}, {
        print: methods.grandchild
      });
    });

    it('base class has the right instance method', function() {
      expect(Repeater.print('foo')).toBe('`foo`');
    });

    it('children get the correct _super method in context', function() {
      expect(Wrapper.print('foo')).toBe("<div class='wrapper'>`foo`</div>");
    });

    it('grandchildren go all the way up the chain', function() {
      expect(Jacket.print('foo')).toBe("<div class='jacket'><div class='wrapper'>`foo`</div></div>");
    });
  });
});
