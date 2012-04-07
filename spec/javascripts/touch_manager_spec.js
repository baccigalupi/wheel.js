describe('Wheel.TouchManager', function() {
  var manager = new Wheel.TouchManager(),
      div, events, touches, moves,
      startEvent, moveEvent, endEvent,
      spy, args;

  beforeEach(function() {
    // reset the manager
    manager.clearTimeout();
    manager.touch = {};

    touches = [{
      pageX: 100,
      pageY: 200,
    }];

    events = {
      taphold:  jasmine.createSpy('taphold'),
      tap:        jasmine.createSpy('tap'),
      doubletap:  jasmine.createSpy('doubletap'),
      swipe:      jasmine.createSpy('swipe'),
      swipeleft:  jasmine.createSpy('swipeleft'),
      swiperight: jasmine.createSpy('swiperight'),
      swipeup:    jasmine.createSpy('swipeup'),
      swipedown:  jasmine.createSpy('swipedown')
    };

    div = $('<div class="touch_tester"/>');
    div
      .bind('taphold',  function(e) {events.taphold(e)})
      .bind('tap',        function(e) {events.tap(e)})
      .bind('doubletap',  function(e) {events.doubletap(e)})
      .bind('swipe',      function(e) {events.swipe(e)})
      .bind('swipeleft',  function(e) {events.swipeleft(e)})
      .bind('swiperight', function(e) {events.swiperight(e)})
      .bind('swipeup',    function(e) {events.swipeup(e)})
      .bind('swipedown',  function(e) {events.swipedown(e)});

    $(document.body).append(div);
  });

  describe('taphold', function() {
    beforeEach(function() {
      startEvent = $.Event('touchstart', {
        touches: touches
      });
    });

    describe('detection happens when', function() {
      it('the touch is not moved after 750 ms', function() {
        div.trigger(startEvent);
        waits(manager.HOLD_DELAY);

        runs(function() {
          expect(events.taphold).toHaveBeenCalled();
          args = spyArgs(events.taphold);
          expect(args.type).toBe('taphold');
          expect(args.pageX).toBe(100);
          expect(args.pageY).toBe(200);
        });
      });

      it('touch moves in x by a small amount', function() {
        div.trigger(startEvent);

        touches[0].pageX = 105
        moveEvent = $.Event('touchmove', {
          touches: touches
        });
        div.trigger(moveEvent);

        waits(manager.HOLD_DELAY);

        runs(function() {
          expect(events.taphold).toHaveBeenCalled();
          args = spyArgs(events.taphold);
          expect(args.type).toBe('taphold');
          expect(args.pageX).toBe(105);
          expect(args.pageY).toBe(200);
        });
      });

      it('touch moves in y by a small amount', function() {
        div.trigger(startEvent);

        touches[0].pageY = 205;
        moveEvent = $.Event('touchmove', {
          touches: touches
        });
        div.trigger(moveEvent);

        waits(manager.HOLD_DELAY);

        runs(function() {
          expect(events.taphold).toHaveBeenCalled();
          args = spyArgs(events.taphold);
          expect(args.type).toBe('taphold');
          expect(args.pageX).toBe(100);
          expect(args.pageY).toBe(205);
        });
      });
    });

    describe('when a taphold is triggered', function() {
      beforeEach(function() {
        div.trigger(startEvent);
        waits(manager.HOLD_DELAY + 50);
      });

      it('does not trigger a tap', function() {
        runs(function() {
          expect(events.tap).not.toHaveBeenCalled();
        });
      });

      it('does not trigger a swipe', function() {
        runs(function() {
          expect(events.swipe).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('tap', function() {
    describe('detection', function() {
      it("triggers after a delay with a rapid touchstart, touchend", function() {
        startEvent = $.Event('touchstart', {touches: touches});
        endEvent = $.Event('touchend', {touches: touches});

        div.trigger(startEvent);
        div.trigger(endEvent);

        waits(manager.DOUBLE_DELAY);

        runs(function() {
          expect(events.tap).toHaveBeenCalled();
          args = spyArgs(events.tap);
          expect(args.type).toBe('tap');
          expect(args.pageX).toBe(100);
          expect(args.pageY).toBe(200);
        });
      });

      it("triggers after a delay less than taphold", function() {
        startEvent = $.Event('touchstart', {touches: touches});
        endEvent = $.Event('touchend', {touches: touches});

        div.trigger(startEvent);
        waits(manager.HOLD_DELAY - 50);
        runs(function() {
          div.trigger(endEvent);
        });

        waits(manager.DOUBLE_DELAY);
        runs(function() {
          expect(events.tap).toHaveBeenCalled();
          args = spyArgs(events.tap);
          expect(args.type).toBe('tap');
          expect(args.pageX).toBe(100);
          expect(args.pageY).toBe(200);
        });
      });
    });
  });

  describe('swipe', function() {
    beforeEach(function() {
      startEvent = $.Event('touchstart', {touches: touches});
    });

    it('dectects swipes after a distance has been moved, without a touchend', function() {
      div.trigger(startEvent);

      touches[0].pageX = touches[0].pageX + manager.SWIPE_TOLERANCE + 1
      moveEvent = $.Event('touchmove', {touches: touches});
      div.trigger(moveEvent);

      expect(events.swipe).toHaveBeenCalled();
      args = spyArgs(events.swipe);
      expect(args.type).toBe('swipe');
      expect(args.pageX).toBe(201);
      expect(args.pageY).toBe(200);
    });

    it('triggers swiperight', function() {
      div.trigger(startEvent);

      touches[0].pageX = 300
      moveEvent = $.Event('touchmove', {touches: touches});
      div.trigger(moveEvent);

      expect(events.swiperight).toHaveBeenCalled();
      args = spyArgs(events.swiperight);
      expect(args.type).toBe('swiperight');
      expect(args.pageX).toBe(300);
      expect(args.pageY).toBe(200);
    });

    it('triggers swipeleft', function() {
      div.trigger(startEvent);

      touches[0].pageX = -200
      moveEvent = $.Event('touchmove', {touches: touches});
      div.trigger(moveEvent);

      expect(events.swipeleft).toHaveBeenCalled();
      args = spyArgs(events.swipeleft);
      expect(args.type).toBe('swipeleft');
      expect(args.pageX).toBe(-200);
      expect(args.pageY).toBe(200);
    });

    it('triggers swipeup', function() {
      div.trigger(startEvent);

      touches[0].pageY = 0
      moveEvent = $.Event('touchmove', {touches: touches});
      div.trigger(moveEvent);

      expect(events.swipeup).toHaveBeenCalled();
      args = spyArgs(events.swipeup);
      expect(args.type).toBe('swipeup');
      expect(args.pageX).toBe(100);
      expect(args.pageY).toBe(0);
    });

    it('triggers swipedown', function() {
      div.trigger(startEvent);

      touches[0].pageY = 500
      moveEvent = $.Event('touchmove', {touches: touches});
      div.trigger(moveEvent);

      expect(events.swipedown).toHaveBeenCalled();
      args = spyArgs(events.swipedown);
      expect(args.type).toBe('swipedown');
      expect(args.pageX).toBe(100);
      expect(args.pageY).toBe(500);
    });

    it('tap will not be triggered', function() {
      div.trigger(startEvent);
      touches[0].pageY = 500
      moveEvent = $.Event('touchmove', {touches: touches});
      div.trigger(moveEvent);

      expect(events.tap).not.toHaveBeenCalled();
    });
  });

  describe('doubletap', function() {
    beforeEach(function() {
      startEvent = $.Event('touchstart', {touches: touches});
      endEvent = $.Event('touchend', {touches: touches});
    });

    it('is correctly detected with an appropriate delay', function() {
      div.trigger(startEvent);
      div.trigger(endEvent);
      waits(50);
 
      runs(function() {
        div.trigger(startEvent);
        div.trigger(endEvent);

        expect(events.doubletap).toHaveBeenCalled();
        args = spyArgs(events.doubletap);
        expect(args.type).toBe('doubletap');
        expect(args.pageX).toBe(100);
        expect(args.pageY).toBe(200);
      });
    });

    it('will not trigger a tap', function() {
      div.trigger(startEvent);
      div.trigger(endEvent);
      waits(50);

      runs(function() {
        div.trigger(startEvent);
        div.trigger(endEvent);

        expect(events.tap).not.toHaveBeenCalled();
      });
    });
  });

  describe('customizations', function() {
    describe('getting a responsive tap', function() {
      beforeEach(function() {
        startEvent = $.Event('touchstart', {touches: touches});
        endEvent = $.Event('touchend', {touches: touches});

        manager.RESPONSIVE_TAP = true;
      });

      afterEach(function() {
        manager.RESPONSIVE_TAP = false; // returning it to its non-custom state
      });

      it('triggers the tap as soon as the touch ends', function() {
        div.trigger(startEvent);
        div.trigger(endEvent);
        expect(events.tap).toHaveBeenCalled();
      });

      it('may also trigger a double tap', function() {
        div.trigger(startEvent);
        div.trigger(endEvent);
        waits(50);
        runs(function() {
          div.trigger(startEvent);
          div.trigger(endEvent);
          expect(events.doubletap).toHaveBeenCalled();
        });
      });

      it('when triggering a double tap, the first tap will be triggered too', function() {
        div.trigger(startEvent);
        div.trigger(endEvent);
        waits(50);
        runs(function() {
          div.trigger(startEvent);
          div.trigger(endEvent);
          expect(events.tap).toHaveBeenCalled();
          expect(events.doubletap).toHaveBeenCalled();
        });
      });
    });

    describe('scroll prevention on scrolling', function() {
      it('provides a method for overriding to prevent scrolling on swipe', function() {
        manager._preventScroll = function() { return true; };

        startEvent = $.Event('touchstart', {touches: touches});
        div.trigger(startEvent);

        touches[0].pageY = 500
        moveEvent = $.Event('touchmove', { touches: touches });
        spyOn(moveEvent, 'preventDefault');
        div.trigger(moveEvent);

        expect(events.swipe).toHaveBeenCalled();
        expect(moveEvent.preventDefault).toHaveBeenCalled();
      });
    });
  });
});
