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

  it("has the right class heirarchy", function() {
    expect(link instanceof jlisten.widgets.Link).toBe(true);
    expect(link instanceof jlisten.widgets.AjaxLink).toBe(true);
  });

  it("mixes in Ajax", function () {
    expect(link.send).toBe(jlisten.mixins.Ajax.send);
  })

  describe("onClick", function () {
    var args, spy, data;
    beforeEach(function() {
      spy = spyOn(link, 'send');
      link.onClick();
    });

    it("calls Ajax.send", function () {
      expect(link.send).toHaveBeenCalled();
    });
  });
});
