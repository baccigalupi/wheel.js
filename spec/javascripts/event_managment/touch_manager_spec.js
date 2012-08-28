describe('Wheel.TouchManager', function() {
  var manager,
      div, events, touches, moves,
      startEvent, moveEvent, endEvent,
      spy, args;

  beforeEach(function() {
    manager = new Wheel.TouchManager();

    touches = [{
      pageX: 100,
      pageY: 200
    }];

    events = {
      tapstart:   jasmine.createSpy('tapstart'),
      taphold:    jasmine.createSpy('taphold'),
      tap:        jasmine.createSpy('tap'),
      tapmove:    jasmine.createSpy('tapmove'),
      tapend:     jasmine.createSpy('tapend'),
      doubletap:  jasmine.createSpy('doubletap'),
      swipe:      jasmine.createSpy('swipe'),
      swipeleft:  jasmine.createSpy('swipeleft'),
      swiperight: jasmine.createSpy('swiperight'),
      swipeup:    jasmine.createSpy('swipeup'),
      swipedown:  jasmine.createSpy('swipedown'),
      pinch:      jasmine.createSpy('pinch'),
      zoom:       jasmine.createSpy('zoom'),
      tapend:     jasmine.createSpy('tapend')
    };

    div = $('<div class="touch_tester"/>');
    div
      .bind('tapstart',   function(e) {events.tapstart(e)})
      .bind('taphold',    function(e) {events.taphold(e)})
      .bind('tapmove',    function(e) {events.tapmove(e)})
      .bind('tapend',     function(e) {events.tapend(e)})
      .bind('tap',        function(e) {events.tap(e)})
      .bind('doubletap',  function(e) {events.doubletap(e)})
      .bind('swipe',      function(e) {events.swipe(e)})
      .bind('swipeleft',  function(e) {events.swipeleft(e)})
      .bind('swiperight', function(e) {events.swiperight(e)})
      .bind('swipeup',    function(e) {events.swipeup(e)})
      .bind('swipedown',  function(e) {events.swipedown(e)})
      .bind('pinch',      function(e) {events.pinch(e)})
      .bind('zoom',       function(e) {events.zoom(e)})
      .bind('tapend',     function(e) {events.tapend(e)});

    $(document.body).append(div);
  });

  afterEach(function() {
    manager.$.remove();
    div.remove();
  });

  describe('virtualized/normalized events', function() {
    it('"tapstart" will be triggered on touchstart', function() {
      div.trigger('touchstart');
      expect(events.tapstart).toHaveBeenCalled();
    });

     it('"tapend" will be triggered on touchend', function() {
      div.trigger('touchend');
      expect(events.tapend).toHaveBeenCalled();
    });
  });

  describe('taphold', function() {
    beforeEach(function() {
      startEvent = $.Event('touchstart', {
        touches: touches
      });
    });

    describe('"ctrl" key with long taps', function() {
      it('will not trigger a touchhold if the start event includes the "ctrl" key', function() {
        startEvent.ctrlKey = true;
        div.trigger(startEvent);

        waits(manager.HOLD_DELAY + 10);

        runs(function() {
          expect(events.taphold).not.toHaveBeenCalled();
        });
      });
    });

    describe('detection happens when', function() {
      it('the touch is not moved after 750 ms', function() {
        div.trigger(startEvent);
        waits(manager.HOLD_DELAY);

        runs(function() {
          expect(events.taphold).toHaveBeenCalled();
          args = events.taphold.mostRecentCall.args[0];
          expect(args.type).toBe('taphold');
          expect(args.pageX).toBe(100);
          expect(args.pageY).toBe(200);
        });
      });

      it('touch moves in x by a small amount', function() {
        div.trigger(startEvent);

        touches[0].pageX = 105;
        moveEvent = $.Event('touchmove', {
          touches: touches
        });
        div.trigger(moveEvent);

        waits(manager.HOLD_DELAY);

        runs(function() {
          expect(events.taphold).toHaveBeenCalled();
          args = events.taphold.mostRecentCall.args[0];
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
          args = events.taphold.mostRecentCall.args[0];
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
    it('defaults to being responsive', function() {
      expect(manager.RESPONSIVE_TAP).toBe(true);
    });

    describe('detection', function() {
      // TODO: the tests are leaky, and when repsonsive is after unresponsive
      // the tolerance test fails
      describe('responsive', function() {
        beforeEach(function() {
          manager.RESPONSIVE_TAP = true;
        });

        it('triggers twice consecutively', function() {
          startEvent = $.Event('touchstart', {touches: touches});
          endEvent =   $.Event('touchend',   {changedTouches: touches});

          div.trigger(startEvent);
          div.trigger(endEvent);

          expect(events.tap).toHaveBeenCalled();

          events.tap.reset();
          waits(manager.DOUBLE_DELAY);
          runs(function() {
            div.trigger(startEvent);
            div.trigger(endEvent);

            expect(events.tap).toHaveBeenCalled();
          });
        });

        it('does not trigger if the distance moved is outside the tap tolerance', function() {
          startEvent = $.Event('touchstart', {touches: touches});
          div.trigger(startEvent);
          touches[0].pageX = touches[0].pageX + manager.TAP_TOLERANCE + 1;
          endEvent = $.Event('touchend', {changedTouches: touches});
          events.tap.reset();
          div.trigger(endEvent);

          expect(events.tap).not.toHaveBeenCalled();
        });
      });

      describe('unresponsively', function() {
        beforeEach(function() {
          manager.RESPONSIVE_TAP = false;
          events.tap.reset();
        });

        it("triggers after a delay with a rapid touchstart, touchend", function() {
          startEvent = $.Event('touchstart', {touches: touches});
          endEvent = $.Event('touchend', {changedTouches: touches});

          div.trigger(startEvent);
          div.trigger(endEvent);

          waits(manager.DOUBLE_DELAY);

          runs(function() {
            expect(events.tap).toHaveBeenCalled();
            args = spyArgs(events.tap)[0];
            expect(args.type).toBe('tap');
            expect(args.pageX).toBe(100);
            expect(args.pageY).toBe(200);
          });
        });

        it("triggers after a delay less than taphold", function() {
          startEvent = $.Event('touchstart', {touches: touches});
          endEvent = $.Event('touchend', {changedTouches: touches});

          div.trigger(startEvent);
          waits(manager.HOLD_DELAY - 50);
          runs(function() {
            div.trigger(endEvent);
          });

          waits(manager.DOUBLE_DELAY);
          runs(function() {
            expect(events.tap).toHaveBeenCalled();
            args = spyArgs(events.tap)[0];
            expect(args.type).toBe('tap');
            expect(args.pageX).toBe(100);
            expect(args.pageY).toBe(200);
          });
        });
      });
    });
  });

  describe('swipe', function() {
    beforeEach(function() {
      startEvent = $.Event('touchstart', {touches: touches});
    });

    it('detects swipes after a distance has been moved, without a touchend', function() {
      div.trigger(startEvent);

      touches[0].pageX = touches[0].pageX + manager.SWIPE_TOLERANCE + 1;
      moveEvent = $.Event('touchmove', {touches: touches});
      div.trigger(moveEvent);

      expect(events.swipe).toHaveBeenCalled();
      args = spyArgs(events.swipe)[0];
      expect(args.type).toBe('swipe');
      expect(args.pageX).toBe(touches[0].pageX);
      expect(args.pageY).toBe(touches[0].pageY);
    });

    it('swipe events include velocity etc', function() {
      div.trigger(startEvent);

      waits(100);
      runs(function() {
        touches[0].pageX = touches[0].pageX + manager.SWIPE_TOLERANCE + 1;
        moveEvent = $.Event('touchmove', {touches: touches});
        div.trigger(moveEvent);

        var event = events.swipe.mostRecentCall.args[0];
        expect(event.velocity).not.toBe(undefined);
        expect(event.deltaX).not.toBe(undefined);
        expect(event.deltaY).not.toBe(undefined);
        expect(event.deltaTime).not.toBe(undefined);
        expect(event.distance).not.toBe(undefined);
        expect(event.angle).not.toBe(undefined);
      });
    });

    it('triggers swiperight', function() {
      div.trigger(startEvent);

      touches[0].pageX = 300;
      moveEvent = $.Event('touchmove', {touches: touches});
      div.trigger(moveEvent);

      expect(events.swiperight).toHaveBeenCalled();
      args = spyArgs(events.swiperight)[0];
      expect(args.type).toBe('swiperight');
      expect(args.pageX).toBe(300);
      expect(args.pageY).toBe(200);
    });

    it('triggers swipeleft', function() {
      div.trigger(startEvent);
      var pageX = touches[0].pageX - manager.SWIPE_TOLERANCE - 1;

      touches[0].pageX = pageX;
      moveEvent = $.Event('touchmove', {touches: touches});
      div.trigger(moveEvent);

      expect(events.swipeleft).toHaveBeenCalled();
      args = spyArgs(events.swipeleft)[0];
      expect(args.type).toBe('swipeleft');
      expect(args.pageX).toBe(pageX);
      expect(args.pageY).toBe(200);
    });

    it('triggers swipeup', function() {
      div.trigger(startEvent);

      touches[0].pageY = 0;
      moveEvent = $.Event('touchmove', {touches: touches});
      div.trigger(moveEvent);

      expect(events.swipeup).toHaveBeenCalled();
      args = spyArgs(events.swipeup)[0];
      expect(args.type).toBe('swipeup');
      expect(args.pageX).toBe(100);
      expect(args.pageY).toBe(0);
    });

    it('triggers swipedown', function() {
      div.trigger(startEvent);

      touches[0].pageY = 500;
      moveEvent = $.Event('touchmove', {touches: touches});
      div.trigger(moveEvent);

      expect(events.swipedown).toHaveBeenCalled();
      args = spyArgs(events.swipedown)[0];
      expect(args.type).toBe('swipedown');
      expect(args.pageX).toBe(100);
      expect(args.pageY).toBe(500);
    });

    it('tap will not be triggered', function() {
      div.trigger(startEvent);
      touches[0].pageY = 500;
      moveEvent = $.Event('touchmove', {touches: touches});
      div.trigger(moveEvent);

      expect(events.tap).not.toHaveBeenCalled();
    });
  });

  describe('doubletap', function() {
    beforeEach(function() {
      startEvent = $.Event('touchstart', {touches: touches});
      endEvent = $.Event('touchend', {changedTouches: touches});
    });

    it('is correctly detected with an appropriate delay', function() {
      div.trigger(startEvent);
      div.trigger(endEvent);
      waits(50);

      runs(function() {
        div.trigger(startEvent);
        div.trigger(endEvent);

        expect(events.doubletap).toHaveBeenCalled();
        args = spyArgs(events.doubletap)[0];
        expect(args.type).toBe('doubletap');
        expect(args.pageX).toBe(100);
        expect(args.pageY).toBe(200);
      });
    });

    it('will not trigger a tap', function() {
      manager.RESPONSIVE_TAP = false;
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

  describe('multi-touch gestures', function() {
    var multiTouches, zoom, swipe;
    beforeEach(function() {
      manager.RESPONSIVE_TAP = true;
      multiTouches = [{
        pageX: 100,
        pageY: 200
      }, {
        pageX: 225,
        pageY: 305
      }];

      swipe = {
        start: [{
          pageX: 50,
          pageY: 50
        }, {
          pageX: 150,
          pageY: 40
        }],
        move: [{
          pageX: 60,
          pageY: 400
        }, {
          pageX: 140,
          pageY: 275
        }]
      };
    });

    it('will be in multi-touch mode if there are more than one touches at touch down', function() {
      startEvent = $.Event('touchstart', {touches: multiTouches});
      div.trigger(startEvent);
      expect(manager.multi).toEqual({x1: 225, y1: 305});
    });

    it('will be in multi-touch mode if there are more than one touches at touch move', function() {
      startEvent = $.Event('touchstart', {touches: touches});
      moveEvent = $.Event('touchmove', {touches: multiTouches});

      div.trigger(startEvent);
      div.trigger(moveEvent);

      expect(manager.multi).toEqual({x1: 225, y1: 305});
    });

    describe('pinch', function() {
      var pinch;
      beforeEach(function() {
        pinch = {
          start: [{
            pageX: 10,
            pageY: 300
          }, {
            pageX: 200,
            pageY: 10
          }],
          move: [{
            pageX: 10,
            pageY: 300
          }, {
            pageX: 100,
            pageY: 100
          }]
        };
      });

      describe('when distance is less than tolerance', function() {
        beforeEach(function() {
          startEvent = $.Event('touchstart', {touches: multiTouches});
          div.trigger(startEvent);
          multiTouches[1] = {
            pageX: 235,
            pageY: 305
          };
          moveEvent = $.Event('touchmove', {touches: multiTouches});
          div.trigger(moveEvent);
          endEvent = $.Event('touchend', {changedTouches: multiTouches});
        });

        it('does not trigger a pinch', function() {
          expect(events.pinch).not.toHaveBeenCalled();
        });

        it('does not trigger a tap', function() {
          div.trigger(endEvent);
          expect(events.tap).not.toHaveBeenCalled();
        });
      });

      describe('when distance is within tolerance', function() {
        beforeEach(function() {
          startEvent = $.Event('touchstart', {touches: pinch.start});
          div.trigger(startEvent);
          moveEvent = $.Event('touchmove', {touches: pinch.move});
          div.trigger(moveEvent);
          endEvent = $.Event('touchend', {changedTouches: pinch.move});
        });

        describe('helper methods', function() {
          describe('#_multiDistance', function() {
            it('calculates the original distance correctly', function() {
              expect(Math.floor(manager._multiDistance(1))).toBe(346);
            });

            it('calculates the final distance correctly', function() {
              expect(Math.floor(manager._multiDistance(2))).toBe(219);
            });
          });
        });

        it('does trigger a pinch', function() {
          expect(events.pinch).toHaveBeenCalled();
        });

        it('does not trigger a tap', function() {
          div.trigger(endEvent);
          expect(events.tap).not.toHaveBeenCalled();
        });

        it('does not trigger a swipe', function() {
          expect(events.swipe).not.toHaveBeenCalled();
        });
      });

      describe('when more scolling is happening that pinching', function() {
         beforeEach(function() {
          startEvent = $.Event('touchstart', {touches: swipe.start});
          div.trigger(startEvent);
          moveEvent = $.Event('touchmove', {touches: swipe.move});
          div.trigger(moveEvent);
        });

        it('does not trigger pinch', function() {
          expect(events.pinch).not.toHaveBeenCalled();
        });

        it('triggers a swipe', function() {
          expect(events.swipe).toHaveBeenCalled();
        });
      });
    });

    describe('zoom', function() {
      var zoom;
      beforeEach(function() {
        zoom = {
          start: [{
            pageX: 50,
            pageY: 100
          }, {
            pageX: 200,
            pageY: 30
          }],
          move: [{
            pageX: 50,
            pageY: 100
          }, {
            pageX: 250,
            pageY: 10
          }]
        };
      });

      describe('gesture within tolerance', function() {
        beforeEach(function() {
          startEvent = $.Event('touchstart', {touches: zoom.start});
          div.trigger(startEvent);
          moveEvent = $.Event('touchmove', {touches: zoom.move});
          div.trigger(moveEvent);
          endEvent = $.Event('touchend', {changedTouches: zoom.move});
        });

        it('triggers a zoom', function() {
          expect(events.zoom).toHaveBeenCalled();
        });

        it('does not trigger a swipe', function() {
          expect(events.swipe).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('pull events', function() {
    describe('when pullinit in triggered on an element', function() {
      var pullmove, pullend;
      beforeEach(function() {
        pullmove = jasmine.createSpy();
        pullend = jasmine.createSpy();
        div.on('pullmove', pullmove);
        div.on('pullend', pullend);

        div.trigger($.Event('touchstart', {touches: touches}));
        div.trigger($.Event('pullinit', {touches: touches}));
      });

      it('listens on touchmove and triggers pullmove', function() {
        div.trigger($.Event('touchmove', {touches: touches}));
        expect(pullmove).toHaveBeenCalled();
      });

      describe('pullmove events', function() {
        it('pass on the page data', function() {
          div.trigger($.Event('touchmove', {touches: [{pageX: 150, pageY: 275}]}));
          var event = pullmove.mostRecentCall.args[0];
          expect(event.pageX).toBe(150);
          expect(event.pageY).toBe(275);
        });

        it('has deltaX and deltaY', function() {
          div.trigger($.Event('touchmove', {touches: [{pageX: 150, pageY: 275}]}));
          var event = pullmove.mostRecentCall.args[0];
          expect(event.deltaX).toBe(50);
          expect(event.deltaY).toBe(75);
        });

        it('has deltaTime', function() {
          waits(100);
          runs(function() {
            div.trigger($.Event('touchmove', {touches: [{pageX: 150, pageY: 275}]}));
            var event = pullmove.mostRecentCall.args[0];
            expect(event.deltaTime).toBeGreaterThan(100);
          });
        });

        it('has a total distance', function() {
          var distance = Math.sqrt(50*50 + 75*75);
          div.trigger($.Event('touchmove', {touches: [{pageX: 150, pageY: 275}]}));
          var event = pullmove.mostRecentCall.args[0];
          expect(event.distance).toBe(distance);
        });

        it('has velocity', function() {
          waits(100);
          runs(function() {
            var distance = Math.sqrt(50*50 + 75*75);
            div.trigger($.Event('touchmove', {touches: [{pageX: 150, pageY: 275}]}));
            var event = pullmove.mostRecentCall.args[0];
            expect(event.velocity).toBeCloseTo(distance/100, 0.1);
          });
        });

        it('has angular direction', function() {
          var angle = Math.atan2(75,50);
          div.trigger($.Event('touchmove', {touches: [{pageX: 150, pageY: 275}]}));
          var event = pullmove.mostRecentCall.args[0];
          expect(event.angle).toBe(angle);
        });
      });

      it('triggers pullend on touchend', function() {
        div.trigger($.Event('touchend', {changedTouches: touches}));
        expect(pullend).toHaveBeenCalled();
      });
    });

    describe('other events are not triggered', function() {
      beforeEach(function() {
        div.on('touchstart', function(e) {
          div.trigger($.Event('pullinit', {touches: e.touches}));
        });
        startEvent = $.Event('touchstart', {touches: touches});
        div.trigger(startEvent);
      });

      it('swipe', function() {
        touches[0].pageX = touches[0].pageX + manager.SWIPE_TOLERANCE + 1;
        moveEvent = $.Event('touchmove', {touches: touches});
        div.trigger(moveEvent);

        expect(events.swipe).not.toHaveBeenCalled();
      });
    });
  });

  describe('customizations', function() {
    describe('scroll prevention on scrolling', function() {
      it('provides a method for overriding to prevent scrolling on swipe', function() {
        manager.preventScroll = function() { return true; };

        startEvent = $.Event('touchstart', {touches: touches});
        div.trigger(startEvent);

        touches[0].pageY = 500;
        moveEvent = $.Event('touchmove', { touches: touches });
        spyOn(moveEvent, 'preventDefault');
        div.trigger(moveEvent);

        expect(events.swipe).toHaveBeenCalled();
        expect(moveEvent.preventDefault).toHaveBeenCalled();
      });
    });
  });
});
