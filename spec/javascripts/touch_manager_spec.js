describe('Wheel.TouchManager', function() {
  var manager = new Wheel.TouchManager(),
      div, events;

  beforeEach(function() {
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
    var startEvent, moveEvent, endEvent,
        spy, args;

    beforeEach(function() {
      startEvent = $.Event('touchstart', {
        touches: [{
          pageX: 100,
          pageY: 200,
        }]
      });
    });

    it('should be detected if the touch is not moved after 750 ms', function() {
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

  });
});
