describe('Wheel.App', function() {
  var app;
  beforeEach(function() {
    spyOn(Wheel.Utils.ConnectionChecker.prototype, 'on');
    app = Wheel.App.build();
  });

  describe('initialize()', function() {
    describe('creates an eventManager', function() {
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

    describe('templates', function() {
      it('creates a Templates object', function() {
        expect(app.templates).toBeA(Wheel.Templates);
      });

      it('gathers templates from the DOM', function() {
        spyOn(Wheel.Templates.prototype, 'gather');
        app = Wheel.App.build();
        expect(Wheel.Templates.prototype.gather).toHaveBeenCalled();
      });
    });

    describe('storing the app someplace accessible', function() {
      beforeEach(function() {
        app = Wheel.App.build();
      });

      it('also stores it on the App class', function() {
        expect(Wheel.App.app).toBeA(Wheel.App);
        expect(Wheel.App.app).toBe(app);
      });
    });

    it('recognizes itself as a publisher', function() {
      expect(function() {app.publish('foo')}).not.toThrow();
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

  describe('auto loading', function() {
    var apps;
    beforeEach(function() {
      apps = [
        Wheel.App.subclass('App'),
        Wheel.App.subclass('Sidebar')
      ];
    });

    it('subclassing stores a list of applications', function() {
      expect(Wheel.App.children).toEqual(apps);
    });

    it('#start calls build on each of the apps', function() {
      spyOn(apps[0], 'build');
      spyOn(apps[1], 'build');

      Wheel.App.start();

      expect(apps[0].build).toHaveBeenCalled();
      expect(apps[1].build).toHaveBeenCalled();
    });
  });
});
