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

  describe('drag events', function() {
    describe('when dragstart in triggered on an element', function() {
      var $target;
      beforeEach(function() {
        $target = $('<div/>');
        spyOn($target, 'trigger');
        spyOn($target, 'on');
        $target.trigger('dragstart');
      });

      it('listens on body for mousemove', function() {
        expect($target.on).toHaveBeenCalled();
        expect($target.on.mostRecentCall.args[0]).toBe('mousemove');
      });

      describe('mousemove events', function() {
        var moveEvent;
        beforeEach(function() {
          moveEvent = {pageX: 100, pageY: 200};
          $target.on.mostRecentCall.args[1](moveEvent);
        });

        it('triggers dragmove on the original target', function() {
          expect($target.trigger).toHaveBeenCalled();
          expect($target.trigger.mostRecentCall.args[0]).toBe('dragmove');
          expect($target.trigger.mostRecentCall.args[1].pageX).toBe(100);
          expect($target.trigger.mostRecentCall.args[1].pageY).toBe(200);
        });
      });

      xdescribe('mouseup', function() {
        it('triggers dragend on the original target', function() {
          
        });

        it('unbinds mousemove', function() {
          
        });
      });
    });
  });
});

