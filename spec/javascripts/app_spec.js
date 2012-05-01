describe('Wheel.App', function() {
  var app;
  beforeEach(function() {
    window.app = undefined;
    app = new Wheel.App();
  });

  it('mixes in Events', function() {
    expect(Wheel.App.prototype.on).toBe(Wheel.Mixins.Events.on);
  });

  describe('initialize()', function() {
    describe('singleton-ness', function() {
      it('will store the new instance to window', function() {
        expect(window.app).toBe(app);
      });

      it('will not call init if there is already an app on window', function() {
        spyOn(Wheel.App.prototype, 'init');
        new Wheel.App();
        expect(Wheel.App.prototype.init).not.toHaveBeenCalled();
      });
    });

    it('checks connection', function() {
      spyOn(Wheel.App.prototype, 'checkConnection');
      window.app = undefined;
      new Wheel.App();
      expect(Wheel.App.prototype.checkConnection).toHaveBeenCalled();
    });

    it('creates a ConnectionChecker', function() {
      window.app = undefined;
      spyOn(Wheel.Utils.ConnectionChecker.prototype, 'init');
      new Wheel.App();
      expect(Wheel.Utils.ConnectionChecker.prototype.init).toHaveBeenCalled();
    });
  });

  describe('connected()', function() {
    it('returns _connected', function() {
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
      spyOn(app, 'trigger');
    });

    describe('an event is triggered when', function() {
      it('there is no state about being connected', function() {
        app._connected = undefined;
        app.connected(true);
        expect(app.trigger).toHaveBeenCalledWith('online');
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
    describe('when navigator.online', function() {
      beforeEach(function() {
        spyOn(app, 'connected');
        window.navigator = {};
      });

      it('is false', function() {
        window.navigator.onLine = false;
        app.checkConnection();
        expect(app.connected).toHaveBeenCalledWith(false);
      });

      it('is true', function() {
        window.navigator.onLine = true;
        app.checkConnection();
        expect(app.connected).toHaveBeenCalledWith(true);
      });

      it('not defined', function() {
        spyOn(app.connectionChecker, 'test');
        app.checkConnection();
        expect(app.connectionChecker.test).toHaveBeenCalled();
      });
    });
  });
});
