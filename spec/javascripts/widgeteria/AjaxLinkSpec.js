describe("jlisten.widgets.AjaxLink", function () {
  var Linker, link;

  beforeEach(function() {
    Linker = jlisten.widgets.AjaxLink.subclass({},{
      template: function() {
        return "<a class='click' href='http://clinkity.com'>Clink</a>"
      }
    });
    link = new Linker();
  });

  describe("init", function (){
    it("has the right class heirarchy", function() {
      expect(link instanceof jlisten.widgets.Link).toBe(true);
      expect(link instanceof jlisten.widgets.AjaxLink).toBe(true);
    });

    describe("httpMethod", function () {
      it("defaults to 'get'", function () {
        expect(link.httpMethod).toBe('get');
      });

      it("can be customized with initialization values", function () {
        link = new Linker({httpMethod: 'put'});
        expect(link.httpMethod).toBe('put');
      });

      it("can be set on the subclass", function () {
        Linker.prototype.httpMethod = 'delete';
        link = new Linker();

        expect(link.httpMethod).toBe('delete');
      });
    });

    describe("dataType", function () {
      it("defaults to json", function () {
        expect(link.dataType).toBe('json');
      });

      it("can be customized", function () {
        link = new Linker({dataType: 'xml'});
        expect(link.dataType).toBe('xml');
      });
    });
  });

  describe("onClick", function () {
    var args, spy, data;
    beforeEach(function() {
      link.httpMethod = 'delete';
      link.dataType = 'xml';
      data = {foo: 'bar'};
      link.data = function() {return data};
      spy = spyOn($, 'ajax');
      link.onClick();
      args = spy.argsForCall[0][0];
    });

    it("calls $.ajax", function () {
      expect($.ajax).toHaveBeenCalled();
    });

    it("uses the right url", function() {
      expect(args.url).toBe('http://clinkity.com');
    });

    it("uses the httpMethod", function() {
      expect(args.type).toBe('delete');
    });

    it("user the dataType", function () {
      expect(args.dataType).toBe('xml');
    });

    it("sends data returned from the data() method", function () {
      expect(args.data).toBe(data);
    });

    it("uses the object as context", function () {
      expect(args.context).toBe(link);
    });

    it("registers a success handler", function () {
      expect(args.success).toBe(link.onSuccess)
    });

    it("registers an error handler", function () {
      expect(args.error).toBe(link.processError);
    });

    it("registers a complete handler", function () {
      expect(args.complete).toBe(link.onCompletion);
    });
  });

  describe('processError', function () {
    it("passes the error data on to the onError method", function () {
      spyOn(link, 'onError');
      var xhr = {responseText: JSON.stringify({status: 'foo'})};
      link.processError(xhr);
      expect(link.onError).toHaveBeenCalledWith({status: 'foo'});
    });
  });
});
