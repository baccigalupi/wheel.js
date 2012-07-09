describe('Wheel.Mixins.Storage', function() {
  describe('as a mixin, it namespaces the key for class and instance', function() {
    var Classy, classy;
    beforeEach(function() {
      Classy = Wheel.Class();
      Classy.id = 'Classy';
      Classy.mixin(Wheel.Mixins.Storage);

      classy = new Classy();
      classy.id = 3;
      localStorage['Classy.3.foo'] = JSON.stringify('classy bar');
    });

    describe('key generation', function() {
      it('includes the class id when given', function() {
        expect(classy._storageKey('foo')).toMatch(/^Classy\./);
      });

      it('includes the instance id when given', function() {
        expect(classy._storageKey('foo')).toMatch(/\.3\./);
      });
    });

    it('getLocal', function() {
      expect(classy.getLocal('foo')).toBe('classy bar');
    });

    it('setLocal', function() {
      classy.setLocal('bar', 'baz');
      expect(localStorage['Classy.3.bar']).toBe('"baz"');
    });

    describe('localData', function() {
      it('with one argument it gets', function() {
        expect(classy.localData('foo')).toBe('classy bar');
      });

      it('with two arguments will set', function() {
        classy.localData('foo', 'local bar');
        expect(classy.localData('foo')).toBe('local bar');
      });
    });
  });
});
