describe("Wheel.Mixins.Ajax", function () {
  var Sender, sender;

  beforeEach(function() {
    spyOn($, 'ajax');

    Sender = Wheel.View.subclass({
      init: function () {
        this.url = 'http://csenderity.com';
      },
      send: function (overrides) {
        this.bar = 'foo';
        this._super(overrides);
      },
      data: function() { return {}; },
      onSuccess: function(response) { this.response = response; },
      onCompletion: function(response) { this.response = response },
      onError: function(response) { this.response = response }
    },{
      template: function() {
        return "<a class='click' href='http://csenderity.com'>Csender</a>"
      }
    });
    Sender.mixin(Wheel.Mixins.Ajax);

    sender = new Sender();
  });

  describe("send", function () {
    describe('setting defaults', function() {
      beforeEach(function() {
        sender.send();
      });

      describe("httpMethod", function () {
        it("can be customized with initialization values", function () {
          sender = new Sender({httpMethod: 'put'});
          expect(sender.httpMethod).toBe('put');
        });

        it("can be set on the subclass", function () {
          Sender.prototype.httpMethod = 'delete';
          sender = new Sender();

          expect(sender.httpMethod).toBe('delete');
        });
      });

      describe("dataType", function () {
        it("can be customized", function () {
          sender = new Sender({dataType: 'xml'});
          expect(sender.dataType).toBe('xml');
        });
      });
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



