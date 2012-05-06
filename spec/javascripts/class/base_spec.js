describe('Wheel.Base', function() {
  it('is a Wheel._Class Function', function() {
    expect(typeof Wheel.Base).toBe('function');
    expect((new Wheel.Base()) instanceof Wheel._Class).toBe(true);
  });

  describe('initialize', function() {
    it('calls init', function() {
      spyOn(Wheel.Base.prototype, 'init');
      new Wheel.Base();
      expect(Wheel.Base.prototype.init).toHaveBeenCalled();
    });

    it('gets a wheel unique id', function() {
      Wheel.Base._uid = 42;
      var base = new Wheel.Base();
      expect(base._uid).toBe(43);
    });

    it('sets instance variable from what is passed in', function() {
      var base = new Wheel.Base({foo: 'bar'});
      expect(base.foo).toBe('bar');
    });
  });

  describe('class methods', function() {
    it('.create() is a helper to avoid failing to use the "new" keyword', function() {
      spyOn(Wheel.Base.prototype, 'initialize');
      var base = Wheel.Base.create({my: 'opts'});
      expect(Wheel.Base.prototype.initialize).toHaveBeenCalledWith({my: 'opts'});
      expect(base instanceof Wheel.Base).toBe(true);
    });

    describe('.uid()', function() {
      beforeEach(function() {
        Wheel.Base._uid = 42
      });

      it('returns the number after _uid', function() {
        expect(Wheel.Base.uid()).toBe(43);
      });

      it('increments the _uid', function() {
        Wheel.Base.uid();
        expect(Wheel.Base._uid).toBe(43);
      });
    });
  });
});
