describe('Wheel.Utils.ConnectionChecker', function() {
  var connectionChecker, app;

  beforeEach(function() {
    Wheel.Utils.ConnectionChecker.singleton = undefined;
    connectionChecker = Wheel.Utils.ConnectionChecker.build();
    spyOn(connectionChecker, 'trigger');
    spyOn($, 'ajax');
  });

  afterEach(function() {
    connectionChecker.interval && clearInterval(connectionChecker.interval);
  });

  it('is a singleton', function() {
    expect(Wheel.Utils.ConnectionChecker.singleton).toBe(connectionChecker);
  });

  describe('test()', function() {
    it('makes a synced head request to /', function() {
      connectionChecker.test();
      expect($.ajax).toHaveBeenCalled();

      var args = $.ajax.argsForCall[0][0];
      expect(args.async).toBe(false);
      expect(args.type).toBe('head');
    });
  });

  describe('onSuccess(response)', function() {
    it('triggers a "online" event on itself', function() {
      connectionChecker.onSuccess('response');
      expect(connectionChecker.trigger).toHaveBeenCalledWith('online');
    });
  });

  describe('onError(response)', function() {
    beforeEach(function() {
      spyOn(connectionChecker, 'isPolling').andReturn(false);
      spyOn(Wheel.Utils.ConnectionChecker.prototype, 'startPoll');
    });

    it('triggers a "offline" event on itself', function() {
      connectionChecker.onError('response');
      expect(connectionChecker.trigger).toHaveBeenCalledWith('offline');
    });

    it('calls "startPoll"', function() {
      connectionChecker.onError('response');
      expect(connectionChecker.startPoll).toHaveBeenCalled();
    });

    it('will not call "startPoll" if it is already polling', function() {
      connectionChecker.isPolling.andReturn(true);
      connectionChecker.onError();
      expect(connectionChecker.startPoll).not.toHaveBeenCalled();
    });
  });

  describe('polling', function() {
    describe('isPolling()', function() {
      it('returns true if an interval has been set', function() {
        connectionChecker.interval = 1234;
        expect(connectionChecker.isPolling()).toBe(true);
      });

      it('returns false if an interval has not been set', function() {
        expect(connectionChecker.isPolling()).toBe(false);
      });
    });

    describe('stopPoll()', function() {
      it('clears the interval', function() {
        var clearer = clearInterval;
        spyOn(window, 'clearInterval');
        var interval = setInterval(function() {
          // nothing doing
        }, 1000);

        connectionChecker.interval = interval;
        connectionChecker.stopPoll();
        expect(window.clearInterval).toHaveBeenCalledWith(interval);

        clearer(interval);
      });

      it('sets the delay back to 10 seconds', function() {
        connectionChecker.intervalDelay = 2*60*1000;
        connectionChecker.stopPoll();
        expect(connectionChecker.intervalDelay).toBe(10*1000);
      });

      it('sets the pollCount back to 0', function() {
        connectionChecker.pollCount = 10;
        connectionChecker.stopPoll();
        expect(connectionChecker.pollCount).toBe(0);
      });

      it('calls onSuccess', function() {
        spyOn(connectionChecker, 'onSuccess');
        connectionChecker.stopPoll();
        expect(connectionChecker.onSuccess).toHaveBeenCalled();
      });

      it('clears the interval instance variablem', function() {
        spyOn(window, 'clearInterval');
        connectionChecker.interval = 'foo';
        connectionChecker.stopPoll();
        expect(connectionChecker.interval).toBe(undefined);
      });
    });

    describe('continuePoll()', function() {
      it('it increments the pollCount', function() {
        connectionChecker.pollCount = 2;
        connectionChecker.continuePoll();
        expect(connectionChecker.pollCount).toBe(3);
      });

      describe('when pollCount reaches/exceeds 10', function() {
        beforeEach(function() {
          connectionChecker.interval = 'foo';
          connectionChecker.pollCount = 10;

          spyOn(window, 'clearInterval');
          spyOn(window, 'setInterval');
        });

        it('clears the old interval', function() {
          connectionChecker.continuePoll();
          expect(window.clearInterval).toHaveBeenCalledWith('foo');
          expect(connectionChecker.interval).toBe(undefined);
        });

        it('increases the interval delay', function() {
          connectionChecker.continuePoll();
          expect(connectionChecker.intervalDelay).toBe(20*1000); // doubled
        });

        it('sets a new interval, with increased time', function() {
          connectionChecker.continuePoll();
          expect(window.setInterval).toHaveBeenCalled();
        });

        it('resets the pollCount', function() {
          connectionChecker.continuePoll();
          expect(connectionChecker.pollCount).toBe(0);
        });
      });

      describe('when pollCount reaches/exceeds 10, and the intervalDelay is already big', function() {
        beforeEach(function() {
          connectionChecker.pollCount = 10;
          connectionChecker.intervalDelay = Wheel.Utils.ConnectionChecker.intervalDelayLimit;
        });

        it('does not set a new interval', function() {
          spyOn(window, 'setInterval');
          connectionChecker.continuePoll();
          expect(window.setInterval).not.toHaveBeenCalled();
        });

        it('increments the pollCount', function() {
          connectionChecker.continuePoll();
          expect(connectionChecker.pollCount).toBe(11);
        })
      });
    });
  });
});
