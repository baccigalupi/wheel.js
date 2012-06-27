describe('Wheel.MouseManager', function() {
  var manager;
  beforeEach(function() {
    manager = new Wheel.MouseManager();
  });

  afterEach(function() {
    manager.$.remove();
  });

  describe('ancestry', function() {
    it('is a EventManager', function() {
      expect(manager instanceof Wheel.EventManager).toBe(true);
    });
  });

  describe('listening', function() {
    beforeEach(function() {
      // reset the manager
      manager._clearTimeout();
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

  describe('drag events', function() {
    describe('when dragstart in triggered on an element', function() {
      var $target, spy, dragmove, dragend;
      beforeEach(function() {
        $target = $('<div/>');
        $('body').append($target);
        dragmove = jasmine.createSpy();
        dragend = jasmine.createSpy();
        $target.on('dragmove', dragmove);
        $target.on('dragend', dragend);
        $target.trigger('dragstart');
      });

      it('listens on mousemove and triggers dragmove with correct page data', function() {
        $target.trigger($.Event('mousemove', {pageX: 150, pageY: 275}));
        expect(dragmove).toHaveBeenCalled();
      });

      it('stops listening for mousemove on mouseup', function() {
        $target.trigger('mouseup');
        $target.trigger('mousemove');
        expect(dragmove).not.toHaveBeenCalled();
      });

      it('triggers dragend on mouseup', function() {
        $target.trigger('mouseup');
        expect(dragend).toHaveBeenCalled();
      });
    });
  });
});
