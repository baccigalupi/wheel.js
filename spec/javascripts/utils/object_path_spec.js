describe('Wheel.Utils.ObjectPath', function() {
  describe('#write', function() {
    it('builds the full path with object literals, if none are found in window', function() {
      expect(window.Foo).toBe(undefined);
      Wheel.Utils.ObjectPath.write('Foo.Bar.Zardoz', 3);
      expect(window.Foo).toEqual({Bar: {Zardoz: 3}});
    });

    it('does not overwrite existing objects', function() {
      var func = function () {};
      window.Bar = func;
      Wheel.Utils.ObjectPath.write('Bar.Foo.Zardoz', 42);
      expect(window.Bar).toBe(func);
      expect(window.Bar.Foo).toEqual({Zardoz: 42});
    });

    it('works when the path is not an object path', function() {
      Wheel.Utils.ObjectPath.write('Wazup', 42);
      expect(window.Wazup).toBe(42);
    });

    it('return the full path', function() {
      expect(Wheel.Utils.ObjectPath.write('Kiss.My.App', 13)).toBe(Kiss.My.App);
    });
  });

  describe('#read', function() {
    it('will get the value at a path', function() {
      Wheel.Utils.ObjectPath.write('Kiss.My.App', 13);
      expect(Wheel.Utils.ObjectPath.read('Kiss.My.App')).toBe(13);
    });

    it('will return null if the path does not exist', function() {
      expect(Wheel.Utils.ObjectPath.read('Funk.The.Dunk')).toBe(null);
    });
  });
});
