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

    it('calls listen', function() {
      spyOn(Wheel.Base.prototype, 'listen');
      var base = new Wheel.Base();
      expect(Wheel.Base.prototype.listen).toHaveBeenCalled();
    });
  });

  describe('class methods', function() {
    it('.build() is a helper to avoid failing to use the "new" keyword', function() {
      spyOn(Wheel.Base.prototype, 'initialize');
      var base = Wheel.Base.build({my: 'opts'});
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

    describe('adding behavior to the subclass method', function() {
      beforeEach(function() {
        Wheel.Base._subclass('BaseIt', {
          volume: 'high',
        }, {
          classy: true
        });

        BaseIt._subclass('BaseUp', {
          volume: function() {
            return this._super + 'er';
          }
        }, {
          classy: function() {
            return this._super && "I am classy";
          }
        });
      });

      it('Wheel.Base._subclass should work the same as Wheel.Base.subclass', function() {
        var baseUp = BaseUp.build();
        expect(baseUp instanceof BaseUp).toBe(true);
        expect(baseUp instanceof BaseIt).toBe(true);
        expect(baseUp instanceof Wheel.Base).toBe(true);

        expect(baseUp.volume()).toBe('higher');
        expect(BaseUp.classy()).toBe("I am classy");
      });

      it('.subclass can be overwritten to include ._subclass', function() {
        BaseUp.subclass('DownLow', {}, {
          subclass: function(name, iprops, cprops) {
            var klass = this._subclass(name, iprops, cprops);
            klass.foo = 'bar';
            return klass;
          }
        });

        DownLow.subclass('UberLow', {tone: 'uber base'}, {classy: function() {
          return this._super() + '. You know it!';
        }});

        var uberLow = UberLow.build();

        expect(uberLow instanceof UberLow).toBe(true);
        expect(uberLow instanceof DownLow).toBe(true);
        expect(uberLow instanceof BaseUp).toBe(true);
        expect(uberLow instanceof BaseIt).toBe(true);
        expect(uberLow instanceof Wheel.Base).toBe(true);

        expect(uberLow.tone).toBe('uber base');
        expect(uberLow.volume()).toBe('higher');
        expect(UberLow.classy()).toBe("I am classy. You know it!");
        expect(UberLow.foo).toBe("bar");
      });
    });
  });
});
