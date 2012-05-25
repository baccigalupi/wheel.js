describe('Wheel.App', function() {
  var app;
  beforeEach(function() {
    window.app = undefined;
    Wheel.App.singleton = undefined;
    app = new Wheel.App();
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

    it('creates a ConnectionChecker', function() {
      expect(app.connectionChecker instanceof Wheel.Utils.ConnectionChecker).toBe(true);
    });

    it('creates a RequestQueue', function() {
      expect(app.requestQueue instanceof Wheel.Utils.RequestQueue).toBe(true);
    });

    describe('creates an eventManager', function() {
      it('that is touch when Modernizr says so', function() {
        spyOn(Modernizr, 'touch').andReturn(true);
        expect(app.eventManager instanceof Wheel.TouchManager).toBe(true);
      });

      it('that is mouse otherwise', function() {
        spyOn(Modernizr, 'touch').andReturn(false);
        expect(app.eventManager instanceof Wheel.MouseManager).toBe(true);
      });
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
    beforeEach(function() {
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
      expect(Wheel.App.View).toEqual({});
    });

    it('has a Model hash', function() {
      expect(Wheel.App.Model).toEqual({});
    });
  });
});
