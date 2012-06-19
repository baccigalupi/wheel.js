describe('Wheel.MouseManager', function() {
  var manager = new Wheel.MouseManager();

  // TODO: figure out how to trigger MouseEvents with
  // given specified pageX and pageY. Then switch to
  // shared examples. Current specs test differences in
  // classes after inheritance, and I would like something
  // more integration-y.

  describe('ancestry', function() {
    it('is a EventManager', function() {
      expect(manager instanceof Wheel.EventManager).toBe(true);
    });
  });

  describe('listening', function() {
    beforeEach(function() {
      // reset the manager
      manager.clearTimeout();
      manager.touch = {};
    });

    describe('before mousedown', function() {
      it('does not listen for mousemove', function() {
        spyOn(manager, 'onMove');
        $(document.body).trigger($.Event('mousemove'));
        expect(manager.onMove).not.toHaveBeenCalled();
      });
    });

    describe('after mousedown', function() {
      it('listens for mousemove', function() {
        $(document.body).trigger($.Event('mousedown'));

        spyOn(manager, 'onMove');
        $(document.body).trigger($.Event('mousemove'));
        expect(manager.onMove).toHaveBeenCalled();
      });
    });

    describe('after mouseup', function() {
      it('stops listening for mousemove', function() {
        $(document.body).trigger($.Event('mousedown'));
        $(document.body).trigger($.Event('mouseup'));

        spyOn(manager, 'onMove');
        $(document.body).trigger($.Event('mousemove'));
        expect(manager.onMove).not.toHaveBeenCalled();
      });
    });
  });
});

