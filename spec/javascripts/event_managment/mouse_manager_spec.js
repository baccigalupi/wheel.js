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

  describe('pull events', function() {
    describe('when pullinit in triggered on an element', function() {
      var pullmove, pullend;
      beforeEach(function() {
        pullmove = jasmine.createSpy('pullmove');
        pullend = jasmine.createSpy('pullend');
        div.on('pullmove', pullmove);
        div.on('pullend', pullend);
        div.trigger($.Event('mousedown', {pageX: 100, pageY: 205}));
        div.trigger($.Event('pullinit', {pageX: 100, pageY: 205}));
      });

      it('listens on mousemove and triggers pullmove with correct page data', function() {
        div.trigger($.Event('mousemove', {pageX: 150, pageY: 275}));
        expect(pullmove).toHaveBeenCalled();
      });

      it('triggers pullend on mouseup', function() {
        div.trigger('mouseup');
        expect(pullend).toHaveBeenCalled();
      });
    });
  });
});
