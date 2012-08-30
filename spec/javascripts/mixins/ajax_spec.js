describe("Wheel.Mixins.Ajax", function () {
  var Sender, sender;

  beforeEach(function() {
    spyOn($, 'ajax');

    // since the base class auto mixes in ManagedAjax,
    // because the mixin is available, tests are going
    // to the real Wheel._Class creator
    Sender = Wheel._Class.subclass({
      url: 'http://csenderity.com',
      send: function (overrides) {
        this.bar = 'foo';
        this._super(overrides);
      },
      data: function() { return {}; },
      onSuccess: function(response)    { this.response = response },
      onCompletion: function(response) { this.response = response },
      onError: function(response)      { this.response = response }
    });
    Sender.mixin(Wheel.Mixins.Ajax);

    sender = new Sender();
  });

  describe("requests", function() {
    var args, data;
    var sendWith = function(httpMethod) {
      sender.httpMethod = httpMethod;
      sender.send();
      args = $.ajax.mostRecentCall.args[0];
    };

    beforeEach(function() {
      sender.httpMethod = 'get';
      sender.dataType = 'xml';
      data = {foo: 'bar'};
      sender.data = function() {return data};
    });

    describe('basic ajax attributes', function() {
      beforeEach(function() {
        sendWith('get');
      });

      it("calls _super", function () {
        expect(sender.bar).toBe('foo');
      });

      it("calls the request queue's send method", function () {
        expect($.ajax).toHaveBeenCalled();
      });

      it("uses the right url", function() {
        expect(args.url).toBe('http://csenderity.com');
      });

      it("user the dataType", function () {
        expect(args.dataType).toBe('xml');
      });
    });

    describe('with arguments', function() {
      it('arguments overwrite options sent', function() {
        sender.send({
          type: 'HEAD',
          async: false
        });

        args = $.ajax.mostRecentCall.args[0];
        expect(args.type).toBe('HEAD');
        expect(args.async).toBe(false);
      });

      it('will convert an httpMethod argument', function() {
        sender.send({
          httpMethod: 'HEAD',
          async: false
        });

        args = $.ajax.mostRecentCall.args[0];
        expect(args.type).toBe('HEAD');
        expect(args.async).toBe(false);
      });

      it('will convert data arguments', function() {
        sender.send({
          data: {foo: 'bar'}
        });

        args = $.ajax.mostRecentCall.args[0];
        expect(args.data).toEqual({foo: 'bar'});
      });
    });

    describe('response handling', function() {
      beforeEach(function() {
        sendWith('get');
      });

      it("binds the success handler", function () {
        args.success('success response');
        expect(sender.response).toBe('success response');
      });

      it("registers an error handler", function () {
        args.error({
          responseText: '"error response"',
          statusCode: function() { return 404; }
        });
        expect(sender.response).toBe('error response');
      });

      it("registers a complete handler", function () {
        args.complete('complete response');
        expect(sender.response).toBe('complete response');
      });
    });
  });

  describe('mixin call the class defined callbacks', function() {
    describe('processError(xhr)', function () {
      beforeEach(function () {
        spyOn(sender, 'onError');
      });

      it("passes the parsed error data on to the onError method", function () {
        var xhr = {responseText: JSON.stringify({status: 'foo'})};
        sender.processError(xhr);
        expect(sender.onError).toHaveBeenCalledWith({status: 'foo'});
      });

      it("passes on other json when that fails", function () {
        var xhr = {
          responseText: "]<span> not json at all {",
          statusCode: function(){ return 500; }
        };
        sender.processError(xhr);
        expect(sender.onError).toHaveBeenCalledWith({status: 500, message: "]<span> not json at all {"});
      });
    });
  });
});



