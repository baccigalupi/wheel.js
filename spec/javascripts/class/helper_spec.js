describe('Wheel.Class(), helper function', function() {
  describe('with an id argument', function() {
    beforeEach(function() {
      Wheel.Class('Work', {
        init: function() {
          this.ergs = Math.floor(Math.random() * 100);
        },

        do: function(amount) {
          if ( this.ergs > amount ) {
            console.log('You don\'t have enough ergs!');
          } else {
            this.ergs -= amount
          }
        }
      }, {
        unit: 'erg'
      });
    });

    afterEach(function() {
      window.Work = undefined;
    });

    it('creates a class on window with that name', function() {
      expect(typeof Work).toBe('function');
    });

    it('stores the id on the class', function() {
      expect(Work.id).toBe('Work');
    });

    it('has class properties', function() {
      expect(Work.unit).toBe('erg');
    });

    it('stores the proper prototype', function() {
      expect(typeof Work.prototype.init).toBe('function');
      expect(typeof Work.prototype.do).toBe('function');
    });

    it('indicates its inheritance structure', function() {
      var work = new Work();
      expect(work instanceof Work).toBe(true);
      expect(work instanceof Wheel._Class).toBe(true);
    });

    describe('with more complex id structurs', function() {
      it('assigns it to the right place', function() {
        window['Things'] = {};
        Wheel.Class('Things.Better', {
          betterThan: function(other) {
            return true;
          }
        });
        expect(Things.Better).not.toBe(undefined);
        window['Things'] = undefined; // setting it back
      });

      it('will throw an error if the base does not exist', function() {
        var error;
        try {
          Wheel.Class('Things.Better', {
            betterThan: function(other) {
              return true;
            }
          });
        } catch(e) {
          error = e;
        }
        expect(error).not.toBe(undefined);
      });
    });
  });

  describe('without an id argument', function() {
    var OtherWork;
    beforeEach(function() {
      OtherWork = Wheel.Class({
        init: function() {
          this.ergs = Math.floor(Math.random() * 100);
        },

        do: function(amount) {
          if ( this.ergs > amount ) {
            console.log('You don\'t have enough ergs!');
          } else {
            this.ergs -= amount
          }
        }
      }, {
        unit: 'erg'
      });
    });

    it('has class properties', function() {
      expect(OtherWork.unit).toBe('erg');
    });

    it('stores the proper prototype', function() {
      expect(typeof OtherWork.prototype.init).toBe('function');
      expect(typeof OtherWork.prototype.do).toBe('function');
    });

    it('indicates its inheritance structure', function() {
      var work = new OtherWork();
      expect(work instanceof OtherWork).toBe(true);
      expect(work instanceof Wheel._Class).toBe(true);
    });
  });
});
