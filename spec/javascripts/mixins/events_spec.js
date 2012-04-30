describe('Wheel.Mixins.Events', function() {
  var Model, model;
  var View, view;

  beforeEach(function() {
    Model = Wheel.Class().mixin(Wheel.Mixins.Events);
    View = Wheel.View.subclass({
      respondToChange: jasmine.createSpy()
    });
    model = new Model();
    view = new View('<div/>');
  });

  describe('on', function() {
    it('will call the function when triggered', function() {
      model.on('change', view.respondToChange, view);
      model.trigger('change');
      expect(view.respondToChange).toHaveBeenCalled();
    });
  });

  describe('off', function() {
    it('will prevent events from being triggered', function() {
      model.on('change', view.respondToChange, view);
      model.off('change', view.respondToChange);
      model.trigger('change');
      expect(view.respondToChange).not.toHaveBeenCalled();
    });
  });
});
