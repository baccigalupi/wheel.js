describe('Wheel.Utils.ConnectionChecker', function() {
  var connectionChecker, app;
  beforeEach(function() {
    app = {
      setConnected:  jasmine.createSpy()
    };
    connectionChecker = new Wheel.Utils.ConnectionChecker({app: app});
    spyOn($, 'ajax');
  });

  it('is initialized with an app', function() {
    expect(connectionChecker.app).toBe(app);
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
    it('calls app.online()', function() {
      connectionChecker.onSuccess('response');
      expect(app.setConnected).toHaveBeenCalledWith(true);
    });
  });

  describe('onFailure(response)', function() {
    it('calls app.offline()', function() {
      connectionChecker.onError('response');
      expect(app.setConnected).toHaveBeenCalledWith(false);
    });
  });
});
