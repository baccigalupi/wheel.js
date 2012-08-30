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
        Wheel.Base._uid = 42;
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
          volume: 'high'
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

      it('subclassing will look up the chain to find an application', function() {
        var FooApp = Wheel.App.subclass('Foo');
        var FooClass = Wheel.Base.subclass('Foo.Bar');
        expect(FooClass.App).toBe(FooApp);
      });
    });

    describe('.attrAccessor(propName)', function() {
      var Task, task, owner;
      beforeEach(function() {
        Task = Wheel.Base.subclass('Task', {}, {
          properties: ['name', 'due_at', 'state']
        });

        task = Task.build({
          name: 'Do some meta',
          state: 0,
          due_at: null
        });

        owner = {name: "Kane"};

        Task.attrAccessor('owner');
      });

      it('creates a prototype function with that name', function() {
        expect(typeof Task.prototype.owner == 'function').toBe(true);
      });

      it('created function reads the underscore prefaced property', function() {
        task._owner = owner;
        expect(task.owner()).toBe(owner);
      });

      describe('when given an argument', function() {
        it('it writes to the underscore prefaced property', function() {
          task.owner(owner);
          expect(task._owner).toBe(owner);
        });

        it('returns the value', function() {
          expect(task.owner(owner)).toBe(owner);
        });

        describe('value has changed', function() {
          beforeEach(function() {
            spyOn(task, 'trigger');
            task.owner(owner);
          });

          it('triggers a "change" event', function() {
            expect(task.trigger).toHaveBeenCalled();
          });

          it('triggers an event related to the property changed', function() {
            expect(task.trigger).toHaveBeenCalled();
            expect(task.trigger.mostRecentCall.args[0]).toBe('change:owner');
          });
        });

        describe('value is the same', function() {
          it('does not trigger any events', function() {
            spyOn(task, 'trigger');
            task.owner(task._owner);
            expect(task.trigger).not.toHaveBeenCalled();
          });
        });
      });

      it('can handle multiple declarations in the same class', function() {
        Task.attrAccessor('tags');
        var tags = ['neato', 'jazzy'];
        task.tags(tags);
        task.owner(owner);
        expect(task.tags()).toBe(tags);
        expect(task.owner()).toBe(owner);
      });
    });
  });

  describe('properties', function() {
    var Task, task, opts;
    beforeEach(function() {
      Task = Wheel.Base.subclass('Task', {}, {
        properties: ['name', 'due_at', 'state']
      });

      opts = {
        name: 'Do some meta',
        state: 0,
        due_at: Date.now(),
        foo: 'just a non-property attribute'
      };

      task = Task.build(opts);
    });

    it('accesors are built at subclass time', function() {
      expect(typeof Task.prototype.name).toBe('function');
      expect(typeof Task.prototype.state).toBe('function');
      expect(typeof Task.prototype.due_at).toBe('function');
    });

    it('initialization correctly maps properties', function() {
      expect(task.name()).toBe(opts.name);
      expect(task.due_at()).toBe(opts.due_at);
      expect(task.state()).toBe(opts.state);
    });

    it('initialization sets normal instance attributes too', function() {
      expect(task.foo).toBe('just a non-property attribute');
    });

    describe('subclassing', function() {
      var SpecialTask;
      beforeEach(function() {
        SpecialTask = Task.subclass('SpecialTask', {}, {
          properties: ['specialness_rating']
        });
      });

      it('has accessors for the superclass', function() {
        expect(typeof Task.prototype.name).toBe('function');
        expect(typeof Task.prototype.state).toBe('function');
        expect(typeof Task.prototype.due_at).toBe('function');
      });

      it('has accessors for new properties', function() {
        expect(typeof SpecialTask.prototype.specialness_rating).toBe('function');
      });
    });
  });

  describe('publish and subscribe behavior', function() {
    var base;
    beforeEach(function() {
      base = Wheel.Base.build();
    });

    describe('finding a publisher', function() {
      it('defaults to the app in the object path', function() {
        var App, app, Sub, sub;
        App = Wheel.App.subclass('App');
        Sub = Wheel.Base.subclass('App.Base');
        app = App.build();
        sub = Sub.build();

        expect(function() {
          sub._findPublisher();
        }).not.toThrow();
        expect(sub._publisher).toBe(app);
      });

      it('can also use the Wheel.Publisher if it has been set', function() {
        Wheel.Publisher = Wheel.Base.build();
        expect(function() {
          base._findPublisher();
        }).not.toThrow();
      });

      it('throws an error if it cannot find one', function() {
        Wheel.Publisher = null;
        expect(function() {
          base._findPublisher();
        }).toThrow();
      });
    });

    describe('#publish', function() {
      describe('when there is a publisher', function() {
        beforeEach(function() {
          base._publisher = Wheel.Base.build();
        });

        it('calls trigger on the publisher', function() {
          var active;
          base._publisher.on('active', function() {
            active = true;
          });

          base.publish('active', {foo: 'bar'});
          expect(active).toBe(true);
        });

        it('passes the data', function() {
          var expectedData = {foo: 'bar'};

          var called;
          base._publisher.on('foo', function(data) {
            expect(data).toEqual(expectedData);
            called = true;
          });

          base.publish('foo', {foo: 'bar'});

          expect(called).toBe(true);
        });
      });
    });

    describe('#subscribe', function() {
      describe('when a publisher is available', function() {
        beforeEach(function() {
          base._publisher = Wheel.Base.build();
        });

        it('binds the callback to an event name', function() {
          var callback = jasmine.createSpy();
          base.subscribe('foo', callback);

          base.publish('foo', {});

          expect(callback).toHaveBeenCalled();
        });

        it('the callback will be bound to the base object', function() {
          var callback = function() {
            this.hasBeenCalled = true;
          };

          base.subscribe('foo', callback);
          base.publish('foo');
          expect(base.hasBeenCalled).toBe(true);
        });

        it('allows the callback to be bound to different object', function() {
          var other = Wheel.Base.build();
          var callback = function() {
            this.hasBeenCalled = true;
          };

          base.subscribe('foo', callback, other);
          base.publish('foo');
          expect(other.hasBeenCalled).toBe(true);
        });
      });
    });
  });
});
