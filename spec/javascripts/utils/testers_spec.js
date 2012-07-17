describe('Wheel type testers', function() {
  describe('Wheel.isFunction', function() {
    it('should be true if it is a function', function() {
      expect(Wheel.isFunction(function() {})).toBe(true);
    });

    it('should be false if it is something else', function() {
      expect(Wheel.isFunction({})).toBe(false);
    });
  });

  describe('Wheel.isString', function() {
    it('should be true if it is a string', function() {
      expect(Wheel.isString('string')).toBe(true);
    });

    it('should be false if it is something else', function() {
      expect(Wheel.isString(2)).toBe(false);
    });
  });

  describe('Wheel.isNumber', function() {
    it('should be true if it is a string', function() {
      expect(Wheel.isNumber(3)).toBe(true);
    });

    it('should be false if it is something else', function() {
      expect(Wheel.isNumber('3')).toBe(false);
    });
  });

  describe('Wheel.isNull', function() {
    it('should be true if it is a string', function() {
      expect(Wheel.isNull(null)).toBe(true);
    });

    it('should be false if it is something else', function() {
      expect(Wheel.isNull(undefined)).toBe(false);
    });
  });

  describe('Wheel.isUndefined', function() {
    it('should be true if it is a string', function() {
      expect(Wheel.isUndefined(undefined)).toBe(true);
    });

    it('should be false if it is something else', function() {
      expect(Wheel.isUndefined(null)).toBe(false);
    });
  });

  describe('Wheel.isElement', function() {
    it('should be true if it is a DOM element', function() {
      expect(Wheel.isElement($('div')[0])).toBe(true);
    });

    it('should be false if it is something else', function() {
      expect(Wheel.isElement($('div').first())).toBe(false);
    });
  });

  describe('Wheel.is$', function() {
    it('should be true if it is a jQuery/Zepto object', function() {
      expect(Wheel.is$($('div'))).toBe(true);
    });

    it('should be false for dom', function() {
      expect(Wheel.is$($('div')[0])).toBe(false);
    });
  });

  describe('Wheel.isObject', function() {
    it('should be true if it is an object', function() {
      expect(Wheel.isObject({})).toBe(true);
    });

    it('should be false if it is a function', function() {
      expect(Wheel.isObject(function(){})).toBe(false);
    });

    it('should be false if it is an array', function() {
      expect(Wheel.isObject([])).toBe(false);
    });

    it('should be fales if it is a $', function() {
      expect(Wheel.isObject($('div'))).toBe(false);
    });
  });
});
