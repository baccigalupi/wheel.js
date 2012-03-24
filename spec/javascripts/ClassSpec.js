describe("Class", function() {
  it("is a function", function() {
    expect(typeof Class).toBe('function');
  });
});

describe("Function", function() {
  var SubClass, subclass, Subby, subby;

  beforeEach(function() {
    SubClass = Class.subclass({
      foo: 'bar',
      zardoz: function() {this.hasMoxy = true}
    }, {
      classy: true,
      bar: function() { this.canHasSuper = true; }
    });
  });

  describe("subclassing", function () {
    beforeEach(function() {
      Subby = SubClass.subclass({
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
      }, {
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
        expect(typeof Function.subclass).toBe('function');
      });

      it("has a reference to its super class", function () {
        expect(SubClass.superclass).toBe(Class);
      });

      it("passes on the subclass method during inheritance", function () {
        expect(SubClass.subclass).toBe(Class.subclass);
      });
    });

    describe("identity", function () {
      it("is an instance of Function", function () {
        expect(subclass instanceof Function).toBe(true);
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

  describe('mashin', function() {
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

  describe('mixin', function() {
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
        A = Class.subclass({
          initialize: function() {
            this.it = 'a';
          }
        });
        B = Class.subclass({
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
