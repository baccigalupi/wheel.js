describe("Class", function() {
  it("is a function", function() {
    expect(typeof Class).toBe('function');
  });
});

describe("Function, subclass", function() {
  var SubClass, subclass;
  beforeEach(function() {
    SubClass = Class.subclass({foo: 'bar'});
    subclass = new SubClass();
  });

  it("has a class method subclass", function () {
    expect(typeof Function.subclass).toBe('function');
  });

  it("has a reference to its super class", function () {
    expect(SubClass.superclass).toBe(Class);
  });

  it("adds the instance properties that are passed in", function () {
    expect(subclass.foo).toBe('bar');
  });

  it("maintains existing class properties", function () {
    expect(SubClass.subclass).toBe(Class.subclass);
  });
});
