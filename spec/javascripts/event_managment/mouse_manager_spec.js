describe('Wheel.MouseManager', function() {
  var manager, div;
  beforeEach(function() {
    div = $('<div class="touch_tester"/>');
    $(document.body).append(div);
    manager = new Wheel.MouseManager();
  });

  afterEach(function() {
    manager.$.remove();
    div.remove();
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
      var dragmove, dragend;
      beforeEach(function() {
        dragmove = jasmine.createSpy('dragmove');
        dragend = jasmine.createSpy('dragend');
        div.on('dragmove', dragmove);
        div.on('dragend', dragend);
        div.trigger($.Event('mousedown', {pageX: 100, pageY: 205}));
        div.trigger($.Event('dragstart', {pageX: 100, pageY: 205}));
      });

      it('listens on mousemove and triggers dragmove with correct page data', function() {
        div.trigger($.Event('mousemove', {pageX: 150, pageY: 275}));
        expect(dragmove).toHaveBeenCalled();
      });

      it('triggers dragend on mouseup', function() {
        div.trigger('mouseup');
        expect(dragend).toHaveBeenCalled();
      });
    });
  });
});
