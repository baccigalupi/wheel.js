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
      touchhold:  jasmine.createSpy('touchhold'),
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
      .bind('touchhold',  function(e) {events.touchhold(e)})
      .bind('tap',        function(e) {events.tap(e)})
      .bind('doubletap',  function(e) {events.doubletap(e)})
      .bind('swipe',      function(e) {events.swipe(e)})
      .bind('swipeleft',  function(e) {events.swipeleft(e)})
      .bind('swiperight', function(e) {events.swiperight(e)})
      .bind('swipeup',    function(e) {events.swipeup(e)})
      .bind('swipedown',  function(e) {events.swipedown(e)});

    $(document.body).append(div);
  });

  describe('touchhold', function() {
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
          expect(events.touchhold).toHaveBeenCalled();
          args = spyArgs(events.touchhold);
          expect(args.type).toBe('touchhold');
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
          expect(events.touchhold).toHaveBeenCalled();
          args = spyArgs(events.touchhold);
          expect(args.type).toBe('touchhold');
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
          expect(events.touchhold).toHaveBeenCalled();
          args = spyArgs(events.touchhold);
          expect(args.type).toBe('touchhold');
          expect(args.pageX).toBe(100);
          expect(args.pageY).toBe(205);
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

      it("triggers after a delay less than touchhold", function() {
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
  });
});
