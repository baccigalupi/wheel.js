xdescribe("Wheel.Class", function() {
  var SubClass, subclass, Subby, subby;

  it("is a function", function() {
    expect(typeof Wheel.Class).toBe('function');
  });

  beforeEach(function() {
    console.log('_______')
    console.log('making SubClass');
    SubClass = Wheel.Class({
      foo: 'bar',
      zardoz: function() {
        // console.log('in SubClass')
        this._super();
        this.hasMoxy = true;
      }
    }, {
      id: 'SubClass',
      classy: true,
      bar: function() {
        this.canHasSuper = true;
        // this._super && this._super();
      }
    });
  });

  describe("subclassing", function () {
    beforeEach(function() {
      console.log('_______ making Subby');
      Subby = SubClass.subclass({
        bof: 'bof',
        foo: function() {
          if ( this._super ) {
            return 'Let there be foo';
          }
        },
        zardoz: function() {
          // console.log('in the Subby')
          this._super && this._super();
          if(this.hasMoxy) {
            return "Zardoz has moxy!";
          }
        },
      }, {
        id: 'Subby',
        baz: 'baz',
        classy: function() {
          if ( this._super ) {
            return 'I am classy';
          }
        },
        bar: function() {
          this._super();
          if ( this.canHasSuper ) {
            return 'I can has Super';
          }
        }
      });

      subclass = new SubClass();
      subby = new Subby();
    });

    describe('convenience and propigation attributes', function() {
      it("has a class method subclass", function () {
        expect(typeof SubClass.subclass).toBe('function');
      });

      it("has a reference to its super class", function () {
        expect(SubClass.superclass).toBe(Wheel.ClassBuilder);
      });

      it("passes on the subclass method during inheritance", function () {
        expect(SubClass.subclass).toBe(Wheel.ClassBuilder.subclass);
      });

      it('instances have the superclass reference to the parent class prototype', function() {
        expect(subby.superclass).toBe(SubClass.prototype);
      });
    });

    describe("identity", function () {
      it("is an instance of Wheel.Class", function () {
        expect(subclass instanceof Wheel.ClassBuilder).toBe(true);
      });

      it("is an instance of its class", function () {
        expect(subby instanceof SubClass).toBe(true);
      });

      it("is an instance of its superclass", function () {
        expect(subby instanceof Subby).toBe(true);
      });
    });

    describe('class inheritance', function() {
      it('gains new class attributes', function () {
        expect(Subby.baz).toBe('baz');
      });

      it('maintains a reference to old class variables', function () {
        expect(Subby.classy()).toBe('I am classy');
      });

      it('maintains a reference to old class methods', function () {
        expect(Subby.bar()).toBe('I can has Super');
      });
    });

    describe("instance attributes", function () {
      it('gains new instance attributes', function () {
        expect(subby.bof).toBe('bof');
      });

      it('maintains a reference to old instance variables', function () {
        expect(subby.foo()).toBe('Let there be foo');
      });

      it('maintains a reference to old instance methods', function () {
        expect(subby.zardoz()).toBe('Zardoz has moxy!');
      });
    });
  });

  xdescribe('mashin', function() {
    beforeEach(function() {
      Subby = SubClass.subclass();
      Subby.mashin({
        baz: 'baz',
        classy: function() {
          if ( this._super ) {
            return 'I am classy';
          }
        },
        bar: function() {
          this._super();
          if ( this.canHasSuper ) {
            return 'I can has Super';
          }
        }
      });
    });

    it('gains new class attributes', function () {
      expect(Subby.baz).toBe('baz');
    });

    it('maintains a reference to old class variables', function () {
      expect(Subby.classy()).toBe('I am classy');
    });

    it('maintains a reference to old class methods', function () {
      expect(Subby.bar()).toBe('I can has Super');
    });
  });

  xdescribe('mixin', function() {
    beforeEach(function() {
      Subby = SubClass.subclass({});
      Subby.mixin({
        bof: 'bof',
        foo: function() {
          if ( this._super ) {
            return 'Let there be foo';
          }
        },
        zardoz: function() {
          this._super();
          if(this.hasMoxy) {
            return "Zardoz has moxy!";
          }
        },
      });

      subby = new Subby();
    });

    it('gains new instance attributes', function () {
      expect(subby.bof).toBe('bof');
    });

    it('maintains a reference to old instance variables', function () {
      expect(subby.foo()).toBe('Let there be foo');
    });

    it('maintains a reference to old instance methods', function () {
      expect(subby.zardoz()).toBe('Zardoz has moxy!');
    });

    describe('mixing something into multiple classes', function () {
      var A, B, mix, a, b;
      beforeEach(function() {
        A = Wheel.Class({
          initialize: function() {
            this.it = 'a';
          }
        });
        B = Wheel.Class({
          initialize: function() {
            this.it = 'b';
          }
        });

        mix = {
          initialize: function () {
            this._super();
            this.it = this.it + ' mix';
          }
        };

        A.mixin(mix);
        B.mixin(mix);

        a = new A();
        b = new B();
      });

      it("everything should maintain its superness", function () {
        expect(a.it).toBe('a mix');
        expect(b.it).toBe('b mix');
      })
    });
  });
});
