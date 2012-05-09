describe('Wheel.Class.Singleton', function() {
  var instance;
  beforeEach(function() {
    Wheel.Class.Singleton.subclass('Singularity', {
      init: function() {
        this.timestamp = new Date();
      }
    });

    instance = Singularity.create();
  });

  it('stores itself on the class', function() {
    expect(Singularity.singleton).toBe(instance);
  });

  describe('when an instance already exists', function() {
    it('will not change the class level singleton', function() {
      new Singularity();
      expect(Singularity.singleton).toBe(instance);
    });

    it('will not call init', function() {
      spyOn(Singularity.prototype, 'init');
      expect(Singularity.prototype.init).not.toHaveBeenCalled();
    });

    it('helper method .create will return the original instance', function() {
      expect(Singularity.create()).toBe(instance);
    });
  });
});
