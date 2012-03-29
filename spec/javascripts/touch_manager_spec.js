describe('Wheel.TouchManager', function() {
  describe('view delegation on initialization', function() {
    var view, manager;

    beforeEach(function() {
      view = new Wheel.Widgeteria.Form("<form/>");
      manager = new Wheel.TouchManager(view);
    });

    it('stores a view object as its base', function() {
      expect(manager.base).toBe(view);
    });

    it("delegates its own wrapped dom to the base dom", function () {
      expect(manager.$).toBe(view.$);
    });
  });

  describe('class level listening', function() {
    describe('ensuring listeners are only added once', function() {
      it('keeps track of whether listener have been added to body', function (){
        Wheel.TouchManager._isListening = false;
        expect(Wheel.TouchManager.isListening()).toBeFalsy();
        Wheel.TouchManager.listen();
        expect(Wheel.TouchManager.isListening()).toBe(true);
      });

      it('keeps track of whether superclasses have already listened on body', function() {
        Wheel.TouchManager._isListening = false;
        var TouchLight = Wheel.TouchManager.subclass();
        Wheel.TouchManager._isListening = true;
        expect(TouchLight._isListening).toBeFalsy();
        expect(TouchLight.isListening()).toBe(true);
      });
    });

    describe('listening on body', function () {
    });
  });
});
