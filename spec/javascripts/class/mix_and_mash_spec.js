describe('Wheel.Class, mix and mash behavior', function() {
  var Base, base,
      methods = {
        printBase: function(value) {
          return "<div class='base'>" + this._super(value) + "</div>";
        },

        print: function(value) {
          return "<p>" + value + "</p>";
        },

        valueBase: function(value) {
          this.val = value + ' 1';
        },

        value: function(value) {
          this.val = value + ' 2';
        },

        newMethod: function() {
          return 'new method';
        },

        newProp: 'new prop'
      };

  describe('mixin, instance level', function() {
    beforeEach(function() {
      Base = Wheel.Class({
        print: methods.printBase,
        value: methods.valueBase,
        basey: function() {
          this.base = 'I am base';
        }
      });
      Base.mixin(methods);

      base = new Base();
    });

    it('adds in new properties defined only in the mixin', function() {
      expect(base.newMethod()).toBe('new method');
      expect(base.newProp).toBe('new prop');
    });

    it('super refs in the base class with map to the mixed in methods', function() {
      expect(base.print('foo')).toBe("<div class='base'><p>foo</p></div>");
    });

    it('base class wins in cases where there is no _super defined', function() {
      base.value('foo');
      expect(base.val).toBe('foo 1');
    });

    it('maintains properties set on the class', function() {
      base.basey();
      expect(base.base).toBe('I am base');
    });
  });

  describe('mashin, class level', function() {
    beforeEach(function() {
      Base = Wheel.Class({}, {
        print: methods.printBase
      });
      Base.mashin(methods);
    });

    it('adds in new properties', function() {
      expect(Base.newProp).toBe('new prop');
    });

    it('adds in new methods', function() {
      expect(Base.newMethod()).toBe('new method');
    });

    it('super refs in the base class with map to the mixed in methods', function() {
      expect(Base.print('foo')).toBe("<div class='base'><p>foo</p></div>");
    });
  });
});
