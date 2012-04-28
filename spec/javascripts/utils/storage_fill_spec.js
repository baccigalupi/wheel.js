describe('Wheel.Utils.CookieStorage', function() {
  var storage;
  beforeEach(function() {
    spyOn($, 'cookie');
    storage = new Wheel.Utils.CookieStorage('localStorage');
  });

  describe('initialization', function() {
    it('has a zero length', function() {
      expect(storage.length).toBe(0);
    });

    it('has an empty data object', function() {
      expect(storage.data).toEqual({});
    });

    it('has an empty keys array', function() {
      expect(storage.keys).toEqual([]);
    });

    it('calls deserialize', function() {
      spyOn(Wheel.Utils.CookieStorage.prototype, 'deserialize');
      storage = new Wheel.Utils.CookieStorage('localStorage');
      expect(Wheel.Utils.CookieStorage.prototype.deserialize).toHaveBeenCalled();
    });
  });

  describe('setItem(key, value)', function() {
    it('increments the length', function() {
      storage.setItem('foo', 'bar');
      expect(storage.length).toBe(1);
      storage.setItem('baz', 'zardoz');
      expect(storage.length).toBe(2);
    });

    it('adds the key and value to data', function() {
      storage.setItem('foo', 'bar');
      expect(storage.data.foo).toBe('bar');
      storage.setItem('baz', 'zardoz');
      expect(storage.data.baz).toBe('zardoz');
    });

    it('adds to the keys', function() {
      storage.setItem('foo', 'bar');
      expect(storage.keys[0]).toBe('foo');
      storage.setItem('baz', 'zardoz');
      expect(storage.keys[1]).toBe('baz');
    });

    it('serializes', function() {
      spyOn(storage, 'serialize');
      storage.setItem('foo', 'bar');
      expect(storage.serialize).toHaveBeenCalled();
    });
  });


  describe('key()', function() {
    it('returns the key for a given index', function() {
      storage.setItem('foo', 'bar');
      storage.setItem('baz', 'zardoz');
      expect(storage.key(0)).toBe('foo');
      expect(storage.key(1)).toBe('baz');
    });
  });

  describe('clear()', function() {
    beforeEach(function() {
      storage.setItem('foo', 'bar');
      storage.setItem('baz', 'zardoz');
      spyOn(storage, 'serialize');
      storage.clear();
    });

    it('empties the data', function() {
      expect(storage.data).toEqual({});
    });

    it('changes the length to 0', function() {
      expect(storage.length).toBe(0);
    });

    it('serializes', function() {
      expect(storage.serialize).toHaveBeenCalled();
    });
  });

  describe('getItem(key)', function() {
    it('retrieves data correctly by key', function() {
      storage.setItem('foo', 'bar');
      storage.setItem('baz', 'zardoz');
      expect(storage.getItem('foo')).toBe('bar');
      expect(storage.getItem('baz')).toBe('zardoz');
    });
  });

  describe('removeItem(key)', function() {
    beforeEach(function() {
      storage.setItem('foo', 'bar');
      storage.setItem('baz', 'zardoz');
      spyOn(storage, 'serialize');
      storage.removeItem('foo');
    });

    it('decrements the length if key is found', function() {
      expect(storage.length).toBe(1);
    });

    it('removes the key from the local data', function() {
      expect(storage.data.foo).toBe(undefined);
    });

    it('serializes', function() {
      expect(storage.serialize).toHaveBeenCalled();
    });
  });

  describe('serialize', function() {
    it('saves the right cookie', function() {
      storage.setItem('foo', 'bar');
      expect($.cookie).toHaveBeenCalled();
      var args = $.cookie.mostRecentCall.args;
      expect(args[0]).toBe('localStorage');
      expect(args[1]).toBe(JSON.stringify({foo: 'bar'}));
      expect(args[2]).toEqual({expires: 365});
    });
  });

  describe('deserialize', function() {
    var data;
    beforeEach(function() {
      data = {foo: 'bar', baz: 'zardoz'};
      $.cookie.andReturn(JSON.stringify(data));

      storage.deserialize();
    });

    it('rebuilds data from the correct cookie', function() {
      expect(storage.data).toEqual(data);
    });

    it('rebuilds the keys correctly', function() {
      expect(storage.keys).toEqual(['foo', 'baz']);
    });

    it('sets the length correctly', function() {
      expect(storage.length).toBe(2);
    });
  });
});
