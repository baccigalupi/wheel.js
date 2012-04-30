describe("Wheel.Mixins.Ajax", function () {
  var Sender, sender;

  beforeEach(function() {
    Sender = Wheel.View.subclass({
      init: function () {
        this.url = 'http://csenderity.com';
      },
      send: function () { this.bar = 'foo'; },
      data: function() { return {}; },
      onSuccess: function () {},
      onCompletion: function () {},
      onError: function () {}
    },{
      template: function() {
        return "<a class='click' href='http://csenderity.com'>Csender</a>"
      }
    });
    Sender.mixin(Wheel.Mixins.Ajax);

    sender = new Sender();
  });

  describe("init", function (){
    it('calls _super', function () {
      expect(sender.url).toBe('http://csenderity.com');
    });

    describe("httpMethod", function () {
      it("defaults to 'get'", function () {
        expect(sender.httpMethod).toBe('get');
      });

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
      it("defaults to json", function () {
        expect(sender.dataType).toBe('json');
      });

      it("can be customized", function () {
        sender = new Sender({dataType: 'xml'});
        expect(sender.dataType).toBe('xml');
      });
    });
  });

  describe("send", function () {
    var args, spy, data;
    var sendWith = function(httpMethod) {
      sender.httpMethod = httpMethod;
      sender.send();
      args = spy.argsForCall[0][0];
    };

    beforeEach(function() {
      sender.httpMethod = 'get';
      sender.dataType = 'xml';
      data = {foo: 'bar'};
      sender.data = function() {return data};
      spy = spyOn($, 'ajax');
    });

    describe('basic ajax attributes', function() {
      beforeEach(function() {
        sendWith('get');
      });

      it("calls _super", function () {
        expect(sender.bar).toBe('foo');
      });

      it("calls $.ajax", function () {
        expect($.ajax).toHaveBeenCalled();
      });

      it("uses the right url", function() {
        expect(args.url).toBe('http://csenderity.com');
      });

      it("user the dataType", function () {
        expect(args.dataType).toBe('xml');
      });
    });

    describe('ajax http type, and data', function() {
      describe("standard http methods", function () {
        it("sends data returned from the data() method", function () {
          sendWith('get');
          expect(args.data).toBe(data);
        });

        it("uses get if the httpMethod is get", function() {
          sendWith('get');
          expect(args.type).toBe('get');
        });

        it("uses post if the httpMethod is post", function() {
          sendWith('post');
          expect(args.type).toBe('post');
        });
      });

      describe("non standard http methods", function () {
        it("uses post", function() {
          sendWith('delete');
          expect(args.type).toBe('post');
        });

        it("adds a _method key/value to the data", function() {
          sendWith('delete');
          expect(args.data['_method']).toBe('delete');
        });

        it('does not overwrite existing _method data elements', function() {
          sender.data = function() { return {'_method': 'put'} };
          sendWith('delete');
          expect(args.data['_method']).toBe('put');
        });
      });
    });

    describe('with arguments', function() {
      it('arguments overwrite options sent', function() {
        sender.send({
          type: 'HEAD',
          async: false
        });

        args = spy.argsForCall[0][0];
        expect(args.type).toBe('HEAD');
        expect(args.async).toBe(false);
      });

      it('will convert an httpMethod argument', function() {
        sender.send({
          httpMethod: 'HEAD',
          async: false
        });

        args = spy.argsForCall[0][0];
        expect(args.type).toBe('HEAD');
        expect(args.async).toBe(false);
      });

      it('will convert data arguments', function() {
        sender.send({
          data: {foo: 'bar'}
        });

        args = spy.argsForCall[0][0];
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

  describe('processError', function () {
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

