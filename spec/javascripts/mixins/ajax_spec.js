describe("Wheel.Mixins.Ajax", function () {
  var Sender, sender;

  beforeEach(function() {
    Wheel.Utils.RequestQueue.singleton = {
      add: jasmine.createSpy()
    };

    Sender = Wheel.View.subclass({
      init: function () {
        this.url = 'http://csenderity.com';
      },
      send: function (overrides) { this.bar = 'foo'; this._super(overrides); },
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

  describe("init", function (){
    it('runs', function () {
      expect(sender.url).toBe('http://csenderity.com');
    });
  });

  describe("send", function () {
    beforeEach(function() {
      sender._requestQueue = Wheel.Utils.RequestQueue.singleton; // the spy
    });

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
        args = sender._requestQueue.add.argsForCall[0][0];
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
          expect(sender._requestQueue.add).toHaveBeenCalled();
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

          args = sender._requestQueue.add.argsForCall[0][0];
          expect(args.type).toBe('HEAD');
          expect(args.async).toBe(false);
        });

        it('will convert an httpMethod argument', function() {
          sender.send({
            httpMethod: 'HEAD',
            async: false
          });

          args = sender._requestQueue.add.argsForCall[0][0];
          expect(args.type).toBe('HEAD');
          expect(args.async).toBe(false);
        });

        it('will convert data arguments', function() {
          sender.send({
            data: {foo: 'bar'}
          });

          args = sender._requestQueue.add.argsForCall[0][0];
          expect(args.data).toEqual({foo: 'bar'});
        });
      });

      describe('response handling', function() {
        beforeEach(function() {
          sendWith('get');
        });

        it("uses the object as context", function () {
          expect(args.context).toBe(sender);
        });

        it("registers a success handler", function () {
          expect(args.success).toBe(sender.onSuccess)
        });

        it("registers an error handler", function () {
          expect(args.error).toBe(sender.processError);
        });

        it("registers a complete handler", function () {
          expect(args.complete).toBe(sender.onCompletion);
        });
      });
    });
  });

  describe('mixin call the class defined callbacks', function() {
    it('onSuccess(response)', function() {
      sender.onSuccess({status: 'all good'});
      expect(sender.response).toEqual({status: 'all good'});
    });

    it('onCompletion(response)', function() {
      sender.onCompletion({status: 'done!'});
      expect(sender.response).toEqual({status: 'done!'});
    });

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

