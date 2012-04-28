describe('Wheel.Utils.Storage', function() {
  describe('set(key, value)', function() {
    it('sets a string in localStorage', function() {
      Wheel.Utils.Storage.set('foo', 'bar');
      expect(localStorage['foo']).toBe('"bar"');
    });

    it('sets a number in localStorage', function() {
      Wheel.Utils.Storage.set('foo2', 2);
      expect(localStorage['foo2']).toBe('2');
    });

    it('serializes an object in localStorage', function() {
      Wheel.Utils.Storage.set('foo3', {foo: 'bar'});
      expect(localStorage['foo3']).toBe(JSON.stringify({foo: 'bar'}));
    });

    it('returns itself', function() {
      expect(Wheel.Utils.Storage.set('foot', 'barf')).toBe(Wheel.Utils.Storage);
    });
  });

  describe('get(key)', function() {
    beforeEach(function() {
      Wheel.Utils.Storage.set('foo', 'bar');
      Wheel.Utils.Storage.set('foo2', 2);
      Wheel.Utils.Storage.set('foo3', {foo: 'bar'});
    });

    it('return a string correctly', function() {
      expect(Wheel.Utils.Storage.get('foo')).toBe('bar');
    });

    it('returns a number', function() {
      expect(Wheel.Utils.Storage.get('foo2')).toBe(2);
    });

    it('returns an object', function() {
      expect(Wheel.Utils.Storage.get('foo3')).toEqual({foo: 'bar'});
    });
  });
});
