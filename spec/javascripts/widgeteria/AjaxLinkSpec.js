describe("jlisten.widgets.AjaxLink", function () {
  var Linker, link;

  beforeEach(function() {
    Linker = jlisten.widgets.AjaxLink.subclass({},{
      template: function() {
        return "<a class='click'>Clink</a>"
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
  });

  describe("onClick", function () {
    it("");
  });
});
