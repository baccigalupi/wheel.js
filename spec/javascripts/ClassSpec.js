describe("Class", function() {
  it("is a function", function() {
    expect(typeof Class).toBe('function');
  });
});

describe("Function, subclassing", function() {
  var SubClass, subclass;
  beforeEach(function() {
    SubClass = Class.subclass({
      foo: 'bar',
      zardoz: function() {this.hasMoxy = true}
    }, {
      classy: true,
      bar: function() { this.canHasSuper = true; }
    });
    subclass = new SubClass();
  });

  describe('class properties', function () {
    it("has a class method subclass", function () {
      expect(typeof Function.subclass).toBe('function');
    });

    it("has a reference to its super class", function () {
      expect(SubClass.superclass).toBe(Class);
    });

    it("maintains existing class properties/methods", function () {
      expect(SubClass.subclass).toBe(Class.subclass);
    });

    it("adds new properties/methods", function () {
      expect(SubClass.classy).toBe(true);
    });

    it("can reference superclass methods", function () {
      var Subby = SubClass.subclass({
        zardoz: function() {
          this._super();
          if( this.hasMoxy ) {
            return "Zardoz has moxy!"
          }
        }
      });
      var subby = new Subby();
      expect(subby.zardoz()).toBe("Zardoz has moxy!");
    });

    it("can reference superclass properties", function () {
      var Subby = SubClass.subclass({
        foo: function(str) {
          return this._super + str;
        }
      });
      var subby = new Subby();
      expect(subby.foo(' too')).toBe('bar too');
    });
  });

  describe('instance properties', function () {
    it("adds the instance properties that are passed in", function () {
      expect(subclass.foo).toBe('bar');
    });

    it("maintains existing properties", function () {
      var Sub2 = SubClass.subclass({baz: 'zardoz'});
      var sub2 = new Sub2();
      expect(sub2.foo).toBe('bar');
    });

    it('can reference superclass methods', function () {
      var Subby = SubClass.subclass(undefined, {classy: function () { return !(this._super) }});
      expect(Subby.classy()).toBe(false);
    });

    it('can reference superclass properties', function () {
      var Subby = SubClass.subclass(undefined, {
        bar: function () {
          this._super();
          if (this.canHasSuper) {
            return 'I can has Super';
          }
        }
      });
      expect(Subby.bar()).toBe("I can has Super");
    });
  });
});
