describe('Wheel.App', function() {
  var app;
  beforeEach(function() {
    spyOn(Wheel.Utils.ConnectionChecker.prototype, 'on');
    app = Wheel.App.build();
  });

  describe('initialize()', function() {
    describe('creates an eventManager', function() {
      beforeEach(function() {
        Wheel.App.singleton = null;
      });

      it('that is touch when Modernizr says so', function() {
        Modernizr.touch = true;
        app = Wheel.App.build();
        expect(app.eventManager).toBeA(Wheel.TouchManager);
      });

      it('that is mouse otherwise', function() {
        Modernizr.touch = false;
        app = Wheel.App.build();
        expect(app.eventManager).toBeA(Wheel.MouseManager);
      });
    });

    it('creates a Templates object', function() {
      expect(app.templates).toBeA(Wheel.Templates);
    });
  });

  describe('#manageRequests', function() {
    beforeEach(function() {
      app.manageRequests();
    });

    it('creates a ConnectionChecker', function() {
      expect(app.connectionChecker).toBeA(Wheel.Utils.ConnectionChecker);
    });

    it('creates a RequestQueue', function() {
      expect(app.requestQueue).toBeA(Wheel.Utils.RequestQueue);
    });

    describe('listening for related events', function() {
      beforeEach(function() {
        spyOn(app, 'connected');
      });

      it('calls on', function() {
        expect(Wheel.Utils.ConnectionChecker.prototype.on).toHaveBeenCalled();
      });

      it('binds to online', function() {
        expect(Wheel.Utils.ConnectionChecker.prototype.on.argsForCall[0][0]).toBe('offline');
        var callback = Wheel.Utils.ConnectionChecker.prototype.on.argsForCall[0][1];
        callback();
        expect(app.connected).toHaveBeenCalledWith(false);
      });

      it('binds to online', function() {
        expect(Wheel.Utils.ConnectionChecker.prototype.on.argsForCall[1][0]).toBe('online');
        var callback = Wheel.Utils.ConnectionChecker.prototype.on.argsForCall[1][1];
        callback();
        expect(app.connected).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('connected()', function() {
    it('returns _connected', function() {
      app.manageRequests();
      app._connected = true;
      expect(app.connected()).toBe(true);
    });

    it('does not change the value of _connected', function() {
      app._connected = true;
      app.connected();
      expect(app._connected).toBe(true);
    });
  });

  describe('connected(flag), setting', function() {
    beforeEach(function() {
      app.manageRequests();
      spyOn(app, 'trigger');
    });

    describe('an event is triggered when', function() {
      it('there is no state about being connected', function() {
        app._connected = undefined;
        app.connected(true);
        expect(app.trigger).toHaveBeenCalledWith('online');
      });

      it('there is no state change, but app is offline', function() {
        app._connected = false;
        app.connected(false);
        expect(app.trigger).toHaveBeenCalledWith('offline-beacon');
      });

      it('the state changes from true to false', function() {
        app._connected = true;
        app.connected(false);
        expect(app.trigger).toHaveBeenCalledWith('offline');
      });

      it('the state changes from false to true', function() {
        app._connected = false;
        app.connected(true);
        expect(app.trigger).toHaveBeenCalledWith('online');
      });
    });

    describe('no event is triggered', function() {
      it('when set from true to true', function() {
        app._connected = true;
        app.connected(true);
        expect(app.trigger).not.toHaveBeenCalled();
      });

      it('when set from true to true', function() {
        app._connected = true;
        app.connected(true);
        expect(app.trigger).not.toHaveBeenCalled();
      });
    });

    it('saves the _connected property to whatever is passed in', function() {
      app._connected = true;
      app.connected(false);
      expect(app._connected).toBe(false);
    });
  });

  describe('checkConnection()', function() {
    beforeEach(function() {
      app.manageRequests();
      spyOn(app, 'connected');
      window.navigator = {};
    });

    describe('when navigator.onLine is defined', function() {
      it('and is false', function() {
        window.navigator.onLine = false;
        app.checkConnection();
        expect(app.connected).toHaveBeenCalledWith(false);
      });

      it('and is true, it asks the connection checker anyways', function() {
        window.navigator.onLine = true;
        spyOn(app.connectionChecker, 'test');
        app.checkConnection();
        expect(app.connectionChecker.test).toHaveBeenCalled();
      });
    });

    describe('when navigator.onLine is not defined', function() {
      it('asks he connection checker', function() {
        spyOn(app.connectionChecker, 'test');
        app.checkConnection();
        expect(app.connectionChecker.test).toHaveBeenCalled();
      });
    });
  });

  describe('class namespaces', function() {
    it('has a View hash', function() {
      expect(Wheel.App.Views).toEqual({});
    });

    it('has a Model hash', function() {
      expect(Wheel.App.Models).toEqual({});
    });
  });
});
